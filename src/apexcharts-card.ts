import { LitElement, html, customElement, property, TemplateResult, CSSResult, PropertyValues } from 'lit-element';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { ChartCardConfig, EntityCachePoints, EntityEntryCache } from './types';
import { getLovelace, HomeAssistant } from 'custom-card-helpers';
import localForage from 'localforage';
import * as pjson from '../package.json';
import {
  computeColors,
  computeName,
  computeUom,
  decompress,
  getPercentFromValue,
  log,
  mergeDeep,
  offsetData,
  prettyPrintTime,
  validateInterval,
  validateOffset,
} from './utils';
import ApexCharts from 'apexcharts';
import { styles } from './styles';
import { HassEntity } from 'home-assistant-js-websocket';
import { getLayoutConfig } from './apex-layouts';
import GraphEntry from './graphEntry';
import { createCheckers } from 'ts-interface-checker';
import { ChartCardExternalConfig, ChartCardSeriesExternalConfig } from './types-config';
import exportedTypeSuite from './types-config-ti';
import {
  DEFAULT_FLOAT_PRECISION,
  DEFAULT_SHOW_LEGEND_VALUE,
  DEFAULT_UPDATE_DELAY,
  moment,
  NO_VALUE,
  TIMESERIES_TYPES,
} from './const';
import {
  DEFAULT_COLORS,
  DEFAULT_DURATION,
  DEFAULT_FUNC,
  DEFAULT_GROUP_BY_FILL,
  DEFAULT_GRAPH_SPAN,
  DEFAULT_SERIE_TYPE,
  HOUR_24,
} from './const';
import parse from 'parse-duration';

/* eslint no-console: 0 */
console.info(
  `%c APEXCHARTS-CARD %c v${pjson.version} `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

localForage.config({
  name: 'apexchart-card',
  version: 1.0,
  storeName: 'entity_history_cache',
  description: 'ApexCharts-card uses caching for the entity history',
});

localForage
  .iterate((data, key) => {
    const value: EntityEntryCache = key.endsWith('-raw') ? data : decompress(data);
    if (value.card_version !== pjson.version) {
      localForage.removeItem(key);
    }
    const start = new Date();
    start.setTime(start.getTime() - value.span);
    if (new Date(value.last_fetched) < start) {
      localForage.removeItem(key);
    }
  })
  .catch((err) => {
    console.warn('Purging has errored: ', err);
  });

@customElement('apexcharts-card')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ChartsCard extends LitElement {
  private _hass?: HomeAssistant;

  private _apexChart?: ApexCharts;

  private _loaded = false;

  @property({ type: Boolean }) private _updating = false;

  private _graphs: (GraphEntry | undefined)[] | undefined;

  @property({ attribute: false }) private _config?: ChartCardConfig;

  private _entities: HassEntity[] = [];

  private _interval?: number;

  private _intervalTimeout?: NodeJS.Timeout;

  private _colors?: string[];

  private _graphSpan: number = HOUR_24;

  private _offset = 0;

  @property({ attribute: false }) private _lastState: (number | string | null)[] = [];

  private _dataLoaded = false;

  private _seriesOffset: number[] = [];

  private _updateDelay: number = DEFAULT_UPDATE_DELAY;

  @property({ type: Boolean }) private _warning = false;

  public connectedCallback() {
    super.connectedCallback();
    if (this._config && this._hass && !this._loaded) {
      this._initialLoad();
    } else if (this._config && this._hass && this._apexChart && !this._config.update_interval) {
      window.requestAnimationFrame(() => {
        this._updateOnInterval();
      });
    }
    if (this._config?.update_interval) {
      window.requestAnimationFrame(() => {
        this._updateOnInterval();
      });
      // Valid because setConfig has been done.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._intervalTimeout = setInterval(() => this._updateOnInterval(), this._interval!);
    }
  }

  disconnectedCallback() {
    if (this._intervalTimeout) {
      clearInterval(this._intervalTimeout);
    }
    this._updating = false;
    super.disconnectedCallback();
  }

  private _updateOnInterval(): void {
    if (!this._updating) {
      this._updating = true;
      this._updateData();
    }
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (this._config && this._hass && this.isConnected && !this._loaded) {
      this._initialLoad();
    }
  }

  private _firstDataLoad() {
    if (this._updating || this._dataLoaded || !this._apexChart || !this._config || !this._hass) return;
    this._dataLoaded = true;
    this._updating = true;
    this._updateData();
  }

  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._config || !this._graphs) return;

    this._graphs.map((graph) => {
      if (graph) graph.hass = hass;
    });

    let updated = false;
    this._config.series.forEach((serie, index) => {
      const entityState = (hass && hass.states[serie.entity]) || undefined;
      if (entityState && this._entities[index] !== entityState) {
        this._entities[index] = entityState;
        updated = true;
        if (this._graphs && this._graphs[index]) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this._graphs[index]!.hass = this._hass!;
        }
      }
    });
    if (this._config.series.some((_, index) => this._entities[index] === undefined)) {
      this._warning = true;
      return;
    } else if (this._warning) {
      this._warning = false;
    }
    if (updated) {
      this._entities = [...this._entities];
      if (!this._updating && !this._config.update_interval) {
        if (!this._dataLoaded) {
          this._firstDataLoad();
        } else {
          this._updating = true;
          // give time to HA's recorder component to write the data in the history
          setTimeout(() => {
            this._updateData();
          }, this._updateDelay);
        }
      }
    }
  }

  public setConfig(config: ChartCardExternalConfig) {
    const configDup = JSON.parse(JSON.stringify(config));
    if (configDup.entities) {
      configDup.series = configDup.entities;
      delete configDup.entities;
    }
    const { ChartCardExternalConfig } = createCheckers(exportedTypeSuite);
    ChartCardExternalConfig.strictCheck(configDup);
    if (configDup.update_interval) {
      this._interval = validateInterval(configDup.update_interval, 'update_interval');
    }
    if (configDup.graph_span) {
      this._graphSpan = validateInterval(configDup.graph_span, 'graph_span');
    }
    if (configDup.span?.offset) {
      this._offset = validateOffset(configDup.span.offset, 'span.offset');
    }
    if (configDup.span?.end && configDup.span?.start) {
      throw new Error(`span: Only one of 'start' or 'end' is allowed.`);
    }
    configDup.series.forEach((serie, index) => {
      if (serie.offset) {
        this._seriesOffset[index] = validateOffset(serie.offset, `series[${index}].offset`);
      }
    });
    if (configDup.update_delay) {
      this._updateDelay = validateInterval(configDup.update_delay, `update_delay`);
    }

    this._config = mergeDeep(
      {
        graph_span: DEFAULT_GRAPH_SPAN,
        cache: true,
        useCompress: false,
        show: { loading: true },
      },
      configDup,
    );

    if (this._config) {
      this._colors = [...DEFAULT_COLORS];
      this._graphs = this._config.series.map((serie, index) => {
        if (serie.color) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this._colors![index] = serie.color;
        }
        serie.extend_to_end = serie.extend_to_end !== undefined ? serie.extend_to_end : true;
        serie.type = this._config?.chart_type ? undefined : serie.type || DEFAULT_SERIE_TYPE;
        serie.unit = this._config?.chart_type === 'radialBar' ? '%' : serie.unit;
        if (!serie.group_by) {
          serie.group_by = { duration: DEFAULT_DURATION, func: DEFAULT_FUNC, fill: DEFAULT_GROUP_BY_FILL };
        } else {
          serie.group_by.duration = serie.group_by.duration || DEFAULT_DURATION;
          serie.group_by.func = serie.group_by.func || DEFAULT_FUNC;
          serie.group_by.fill = serie.group_by.fill || DEFAULT_GROUP_BY_FILL;
        }
        if (!serie.show) {
          serie.show = { legend_value: DEFAULT_SHOW_LEGEND_VALUE };
        } else {
          serie.show.legend_value =
            serie.show.legend_value === undefined ? DEFAULT_SHOW_LEGEND_VALUE : serie.show.legend_value;
        }
        validateInterval(serie.group_by.duration, `series[${index}].group_by.duration`);
        if (serie.entity) {
          const editMode = getLovelace()?.editMode;
          // disable caching for editor
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const caching = editMode === true ? false : this._config!.cache;
          const graphEntry = new GraphEntry(
            index,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._graphSpan!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            caching,
            serie,
            this._config?.span,
          );
          if (this._hass) graphEntry.hass = this._hass;
          return graphEntry;
        }
        return undefined;
      });
    }
    // Reset only happens in editor mode
    if (this._apexChart) {
      this._apexChart.destroy();
      this._apexChart = undefined;
      this._loaded = false;
      this._dataLoaded = false;
      this._updating = false;
    }
    if (this._config && this._hass && !this._loaded) {
      this._initialLoad();
    }
  }

  static get styles(): CSSResult {
    return styles;
  }

  protected render(): TemplateResult {
    if (!this._config || !this._hass) return html``;
    if (this._warning || this._config.series.some((_, index) => this._entities[index] === undefined)) {
      return this._renderWarnings();
    }

    const spinnerClass: ClassInfo = {
      'lds-ring': this._config.show?.loading && this._updating ? true : false,
    };
    const wrapperClasses: ClassInfo = {
      wrapper: true,
      'with-header': this._config.header?.show || true,
    };

    return html`
      <ha-card>
        <div id="spinner-wrapper">
          <div id="spinner" class=${classMap(spinnerClass)}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div class=${classMap(wrapperClasses)}>
          ${this._config.header?.show ? this._renderHeader() : html``}
          <div id="graph-wrapper">
            <div id="graph"></div>
          </div>
        </div>
      </ha-card>
    `;
  }

  private _renderWarnings(): TemplateResult {
    return html`
      <ha-card class="warning">
        <hui-warning>
          <div style="font-weight: bold;">apexcharts-card</div>
          ${this._config?.series.map((_, index) =>
            !this._entities[index]
              ? html` <div>Entity not available: ${this._config?.series[index].entity}</div> `
              : html``,
          )}
        </hui-warning>
      </ha-card>
    `;
  }

  private _renderHeader(): TemplateResult {
    const classes: ClassInfo = {
      floating: this._config?.header?.floating || false,
    };
    return html`
      <div id="header" class=${classMap(classes)}>
        ${this._config?.header?.title ? html`<div id="header__title">${this._config.header.title}</div>` : html``}
        ${this._config?.header?.show_states ? this._renderStates() : html``}
      </div>
    `;
  }

  private _renderStates(): TemplateResult {
    return html`
      <div id="header__states">
        ${this._config?.series.map((serie, index) => {
          return html`
            <div id="states__state">
              <div id="state__value">
                <span
                  id="state"
                  style="${this._config?.header?.colorize_states && this._colors && this._colors.length > 0
                    ? `color: ${this._colors[index % this._colors?.length]};`
                    : ''}"
                  >${this._lastState?.[index] === 0
                    ? 0
                    : (serie.show.as_duration
                        ? prettyPrintTime(this._lastState?.[index], serie.show.as_duration)
                        : this._lastState?.[index]) || NO_VALUE}</span
                >
                ${!serie.show.as_duration
                  ? html`<span id="uom">${computeUom(index, this._config, this._entities)}</span>`
                  : ''}
              </div>
              <div id="state__name">${computeName(index, this._config, this._entities)}</div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private async _initialLoad() {
    await this.updateComplete;

    if (!this._apexChart && this.shadowRoot && this._config && this.shadowRoot.querySelector('#graph')) {
      this._loaded = true;
      const graph = this.shadowRoot.querySelector('#graph');
      this._apexChart = new ApexCharts(graph, getLayoutConfig(this._config, this._hass));
      this._apexChart.render();
      this._firstDataLoad();
    }
  }

  private async _updateData() {
    if (!this._config || !this._apexChart || !this._graphs) return;

    const { start, end } = this._getSpanDates();
    const editMode = getLovelace()?.editMode;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const caching = editMode === true ? false : this._config!.cache;
    try {
      const promise = this._graphs.map((graph, index) => {
        if (graph) graph.cache = caching;
        return graph?._updateHistory(
          this._seriesOffset[index] ? new Date(start.getTime() + this._seriesOffset[index]) : start,
          this._seriesOffset[index] ? new Date(end.getTime() + this._seriesOffset[index]) : end,
        );
      });
      await Promise.all(promise);
      let graphData: unknown = {};
      if (TIMESERIES_TYPES.includes(this._config.chart_type)) {
        graphData = {
          series: this._graphs.map((graph, index) => {
            if (!graph || graph.history.length === 0) return { data: [] };
            this._lastState[index] = this._computeLastState(graph.history[graph.history.length - 1][1], index);
            let data: EntityCachePoints = [];
            if (this._config?.series[index].extend_to_end && this._config?.series[index].type !== 'column') {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              data = [...graph.history, ...([[end.getTime(), graph.history.slice(-1)[0]![1]]] as EntityCachePoints)];
            } else {
              data = graph.history;
            }
            data = offsetData(data, this._seriesOffset[index]);
            return this._config?.series[index].invert ? { data: this._invertData(data) } : { data };
          }),
          xaxis: {
            min: start.getTime(),
            max: this._findEndOfChart(end),
          },
          colors: computeColors(this._colors),
        };
      } else {
        // No timeline charts
        graphData = {
          series: this._graphs.map((graph, index) => {
            if (!graph || graph.history.length === 0) return;
            const lastState = graph.history[graph.history.length - 1][1];
            this._lastState[index] = this._computeLastState(lastState, index);
            if (lastState === null) {
              return;
            } else {
              if (this._config?.chart_type === 'radialBar') {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return getPercentFromValue(lastState, this._config.series[index].min, this._config.series[index].max);
              } else {
                return lastState;
              }
            }
          }),
          colors: computeColors(this._colors),
        };
      }
      this._lastState = [...this._lastState];
      this._apexChart?.updateOptions(
        graphData,
        false,
        TIMESERIES_TYPES.includes(this._config.chart_type) ? false : true,
      );
    } catch (err) {
      log(err);
    }
    this._updating = false;
  }

  private _computeLastState(value: number | null, index: number): string | number | null {
    if (value !== null && typeof value === 'number' && !Number.isInteger(value)) {
      const precision =
        this._config?.series[index].float_precision === undefined
          ? DEFAULT_FLOAT_PRECISION
          : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._config.series[index].float_precision!;
      return (value as number).toFixed(precision);
    }
    return value;
  }

  /*
    Makes the chart end at the last timestamp of the data when everything displayed is a
    column and group_by is enabled for every serie
  */
  private _findEndOfChart(end: Date): number {
    const localEnd = new Date(end);
    let offsetEnd: number | undefined = 0;
    const onlyBars = this._config?.series.reduce((acc, serie) => {
      return acc && serie.type === 'column' && serie.group_by.func !== 'raw';
    }, this._config?.series.length > 0);
    if (onlyBars) {
      offsetEnd = this._config?.series.reduce((acc, serie) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dur = parse(serie.group_by.duration)!;
        if (acc === -1 || dur < acc) {
          return dur;
        }
        return acc;
      }, -1);
    }
    return new Date(localEnd.getTime() - (offsetEnd ? offsetEnd : 0)).getTime();
  }

  private _invertData(data: EntityCachePoints): EntityCachePoints {
    return data.map((item) => {
      if (item[1] === null) return item;
      return [item[0], -item[1]];
    });
  }

  private _getSpanDates(): { start: Date; end: Date } {
    let end = new Date();
    let start = new Date(end.getTime() - this._graphSpan + 1);
    // Span
    if (this._config?.span?.start) {
      // Just Span
      const startM = moment().startOf(this._config.span.start);
      start = startM.toDate();
      end = new Date(start.getTime() + this._graphSpan);
    } else if (this._config?.span?.end) {
      const endM = moment().endOf(this._config.span.end);
      end = new Date(endM.toDate().getTime() + 1);
      start = new Date(end.getTime() - this._graphSpan + 1);
    }
    if (this._offset) {
      end.setTime(end.getTime() + this._offset);
      start.setTime(start.getTime() + this._offset);
    }
    return { start, end };
  }

  public getCardSize(): number {
    return 3;
  }

  static getStubConfig(hass: HomeAssistant, entities: string[], entitiesFallback: string[]) {
    const entityFilter = (stateObj: HassEntity): boolean => {
      return !isNaN(Number(stateObj.state));
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _arrayFilter = (array: any[], conditions: Array<(value: any) => boolean>, maxSize: number) => {
      if (!maxSize || maxSize > array.length) {
        maxSize = array.length;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredArray: any[] = [];

      for (let i = 0; i < array.length && filteredArray.length < maxSize; i++) {
        let meetsConditions = true;

        for (const condition of conditions) {
          if (!condition(array[i])) {
            meetsConditions = false;
            break;
          }
        }

        if (meetsConditions) {
          filteredArray.push(array[i]);
        }
      }

      return filteredArray;
    };
    const _findEntities = (
      hass: HomeAssistant,
      maxEntities: number,
      entities: string[],
      entitiesFallback: string[],
      includeDomains?: string[],
      entityFilter?: (stateObj: HassEntity) => boolean,
    ) => {
      const conditions: Array<(value: string) => boolean> = [];

      if (includeDomains?.length) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        conditions.push((eid) => includeDomains!.includes(eid.split('.')[0]));
      }

      if (entityFilter) {
        conditions.push((eid) => hass.states[eid] && entityFilter(hass.states[eid]));
      }

      const entityIds = _arrayFilter(entities, conditions, maxEntities);

      if (entityIds.length < maxEntities && entitiesFallback.length) {
        const fallbackEntityIds = _findEntities(
          hass,
          maxEntities - entityIds.length,
          entitiesFallback,
          [],
          includeDomains,
          entityFilter,
        );

        entityIds.push(...fallbackEntityIds);
      }

      return entityIds;
    };
    const includeDomains = ['sensor'];
    const maxEntities = 2;

    const foundEntities = _findEntities(hass, maxEntities, entities, entitiesFallback, includeDomains, entityFilter);
    const conf = {
      header: { show: true, title: 'ApexCharts-Card', show_states: true, colorize_states: true },
      series: [] as ChartCardSeriesExternalConfig[],
    };
    if (foundEntities[0]) {
      conf.series[0] = {
        entity: foundEntities[0],
        data_generator: `// REMOVE ME
const now = new Date();
const data = [];
for(let i = 0; i <= 24; i++) {
  data.push([now.getTime() - i * 1000 * 60 * 60, Math.floor((Math.random() * 10) + 1)])
}
return data.reverse();
`,
      };
    }
    if (foundEntities[1]) {
      conf.series[1] = {
        entity: foundEntities[1],
        type: 'column',
        data_generator: `// REMOVE ME
const now = new Date();
const data = [];
for(let i = 0; i <= 24; i++) {
  data.push([now.getTime() - i * 1000 * 60 * 60, Math.floor((Math.random() * 10) + 1)])
}
return data.reverse();
`,
      };
    }
    return conf;
  }
}

// Configure the preview in the Lovelace card picker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards = (window as any).customCards || [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards.push({
  type: 'apexcharts-card',
  name: 'ApexCharts Card',
  preview: true,
  description: 'A graph card based on ApexCharts',
});
