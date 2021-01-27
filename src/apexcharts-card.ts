import { LitElement, html, customElement, property, TemplateResult, CSSResult, PropertyValues } from 'lit-element';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { ChartCardConfig, EntityEntryCache } from './types';
import { HomeAssistant } from 'custom-card-helpers';
import localForage from 'localforage';
import * as pjson from '../package.json';
import {
  computeColors,
  computeName,
  computeUom,
  decompress,
  log,
  mergeDeep,
  validateInterval,
  validateOffset,
} from './utils';
import ApexCharts from 'apexcharts';
import { styles } from './styles';
import { HassEntity } from 'home-assistant-js-websocket';
import { getLayoutConfig } from './apex-layouts';
import GraphEntry from './graphEntry';
import { createCheckers } from 'ts-interface-checker';
import { ChartCardExternalConfig } from './types-config';
import exportedTypeSuite from './types-config-ti';
import { moment } from './const';
import {
  DEFAULT_COLORS,
  DEFAULT_DURATION,
  DEFAULT_FUNC,
  DEFAULT_GROUP_BY_FILL,
  DEFAULT_GRAPH_SPAN,
  DEFAULT_SERIE_TYPE,
  HOUR_24,
} from './const';

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

  public connectedCallback() {
    super.connectedCallback();
    if (this._config && this._hass && !this._loaded) {
      this._initialLoad();
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
      }
    });
    if (updated) {
      this._entities = [...this._entities];
      if (!this._updating && !this._config.update_interval) {
        this._updating = true;
        // give time to HA's recorder component to write the data in the history
        setTimeout(() => {
          this._updateData();
        }, 1500);
      }
    }
  }

  public setConfig(config: ChartCardExternalConfig) {
    const { ChartCardExternalConfig } = createCheckers(exportedTypeSuite);
    ChartCardExternalConfig.strictCheck(config);
    if (config.update_interval) {
      this._interval = validateInterval(config.update_interval, 'update_interval');
    }
    if (config.graph_span) {
      this._graphSpan = validateInterval(config.graph_span, 'graph_span');
    }
    if (config.span?.offset) {
      this._offset = validateOffset(config.span.offset, 'span.offset');
    }
    if (config.span?.end && config.span?.start) {
      throw new Error(`span: Only one of 'start' or 'end' is allowed.`);
    }

    this._config = mergeDeep(
      {
        graph_span: DEFAULT_GRAPH_SPAN,
        cache: true,
        useCompress: false,
        show: { loading: true },
      },
      JSON.parse(JSON.stringify(config)),
    );

    if (this._config) {
      this._colors = [...DEFAULT_COLORS];
      this._graphs = this._config.series.map((serie, index) => {
        if (serie.color) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this._colors![index] = serie.color;
        }
        serie.extend_to_end = serie.extend_to_end !== undefined ? serie.extend_to_end : true;
        serie.type = serie.type || DEFAULT_SERIE_TYPE;
        if (!serie.group_by) {
          serie.group_by = { duration: DEFAULT_DURATION, func: DEFAULT_FUNC, fill: DEFAULT_GROUP_BY_FILL };
        } else {
          serie.group_by.duration = serie.group_by.duration || DEFAULT_DURATION;
          serie.group_by.func = serie.group_by.func || DEFAULT_FUNC;
          serie.group_by.fill = serie.group_by.fill || DEFAULT_GROUP_BY_FILL;
        }
        validateInterval(serie.group_by.duration, `series[${index}].group_by.duration`);
        if (serie.entity) {
          return new GraphEntry(
            index,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._graphSpan!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._config!.cache,
            serie,
            this._config?.span,
          );
        }
        return undefined;
      });
    }
  }

  static get styles(): CSSResult {
    return styles;
  }

  protected render(): TemplateResult {
    if (!this._config || !this._hass) return html``;
    if (this._config.series.some((_, index) => this._entities[index] === undefined)) {
      return this.renderWarnings();
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

  renderWarnings() {
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
        ${this._config?.series.map((_, index) => {
          return html`
            <div id="states__state">
              <div id="state__value">
                <span
                  id="state"
                  style="${this._config?.header?.colorize_states && this._colors && this._colors.length > 0
                    ? `color: ${this._colors[index % this._colors?.length]};`
                    : ''}"
                  >${this._lastState?.[index] === 0 ? 0 : this._lastState?.[index] || 'N/A'}</span
                >
                <span id="uom">${computeUom(index, this._config, this._entities)}</span>
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
    }
  }

  private async _updateData() {
    if (!this._config || !this._graphs) return;

    const { start, end } = this._getSpanDates();
    try {
      const promise = this._graphs.map((graph) => graph?._updateHistory(start, end));
      await Promise.all(promise);
      const graphData = {
        series: this._graphs.map((graph) => {
          if (!graph || graph.history.length === 0) return { data: [] };
          const index = graph.index;
          if (graph.history.length > 0) {
            this._lastState[index] = graph.history[graph.history.length - 1][1];
            if (
              this._lastState[index] !== null &&
              typeof this._lastState[index] === 'number' &&
              !Number.isInteger(this._lastState[index])
            ) {
              this._lastState[index] = (this._lastState[index] as number).toFixed(1);
            }
          }
          let data: (number | null)[][] = [];
          if (this._config?.series[index].extend_to_end && this._config?.series[index].type !== 'column') {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            data = [...graph.history, ...[[end.getTime(), graph.history.slice(-1)[0]![1]]]];
          } else {
            data = graph.history;
          }
          return this._config?.series[index].invert ? { data: this._invertData(data) } : { data };
        }),
        xaxis: {
          min: start.getTime(),
          max: end.getTime(),
        },
        colors: computeColors(this._colors),
      };
      this._lastState = [...this._lastState];
      this._apexChart?.updateOptions(graphData, false, false);
    } catch (err) {
      log(err);
    }
    this._updating = false;
  }

  private _invertData(data: (number | null)[][]): (number | null)[][] {
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
}

// Configure the preview in the Lovelace card picker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards = (window as any).customCards || [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards.push({
  type: 'apexcharts-card',
  name: 'ApexCharts Card',
  preview: false,
  description: 'A graph card based on ApexCharts',
});
