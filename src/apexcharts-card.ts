import 'array-flat-polyfill';
import { LitElement, html, customElement, property, TemplateResult, CSSResult, PropertyValues } from 'lit-element';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { ChartCardConfig, ChartCardSeriesConfig, EntityCachePoints, EntityEntryCache, HistoryPoint } from './types';
import { getLovelace, HomeAssistant } from 'custom-card-helpers';
import localForage from 'localforage';
import * as pjson from '../package.json';
import {
  computeColor,
  computeColors,
  computeName,
  computeTextColor,
  computeUom,
  decompress,
  getPercentFromValue,
  interpolateColor,
  log,
  mergeConfigTemplates,
  mergeDeep,
  mergeDeepConfig,
  offsetData,
  prettyPrintTime,
  truncateFloat,
  validateInterval,
  validateOffset,
} from './utils';
import ApexCharts from 'apexcharts';
import { styles } from './styles';
import { HassEntity } from 'home-assistant-js-websocket';
import { getLayoutConfig } from './apex-layouts';
import GraphEntry from './graphEntry';
import { createCheckers } from 'ts-interface-checker';
import { ChartCardColorThreshold, ChartCardExternalConfig, ChartCardSeriesExternalConfig } from './types-config';
import exportedTypeSuite from './types-config-ti';
import {
  DEFAULT_AREA_OPACITY,
  DEFAULT_FILL_RAW,
  DEFAULT_SHOW_IN_CHART,
  DEFAULT_SHOW_IN_HEADER,
  DEFAULT_SHOW_LEGEND_VALUE,
  DEFAULT_UPDATE_DELAY,
  moment,
  NO_VALUE,
  PLAIN_COLOR_TYPES,
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
import tinycolor from '@ctrl/tinycolor';

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

  private _colors: string[] = [];

  private _headerColors: string[] = [];

  private _graphSpan: number = HOUR_24;

  private _offset = 0;

  @property({ attribute: false }) private _headerState: (number | null)[] = [];

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
    this._updateData().then(() => {
      if (this._config?.experimental?.hidden_by_default) {
        this._config.series_in_graph.forEach((serie, index) => {
          if (serie.show.hidden_by_default) {
            const name = computeName(index, this._config?.series_in_graph, this._hass?.states);
            this._apexChart?.hideSeries(name);
          }
        });
      }
    });
  }

  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._config || !this._graphs) return;

    this._graphs.map((graph) => {
      if (graph) graph.hass = hass;
    });

    let updated = false;
    let rawHeaderStatesUpdated = false;
    this._config.series.forEach((serie, index) => {
      const entityState = (hass && hass.states[serie.entity]) || undefined;
      if (!entityState) {
        this._entities[index] = entityState;
      } else if (entityState && this._entities[index] !== entityState) {
        this._entities[index] = entityState;
        updated = true;
        if (this._graphs && this._graphs[index]) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this._graphs[index]!.hass = this._hass!;
        }
        if (serie.show.in_header === 'raw') {
          this._headerState[index] = serie.attribute ? entityState.attributes[serie.attribute] : entityState.state;
          rawHeaderStatesUpdated = true;
        }
      }
    });
    if (rawHeaderStatesUpdated) {
      this._headerState = [...this._headerState];
    }
    if (this._config.series.some((_, index) => this._entities[index] === undefined)) {
      this._warning = true;
      return;
    } else if (this._warning) {
      this._warning = false;
      this._reset();
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

  private _reset() {
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

  public setConfig(config: ChartCardExternalConfig) {
    let configDup: ChartCardExternalConfig = JSON.parse(JSON.stringify(config));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((configDup as any).entities) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      configDup.series = (configDup as any).entities;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (configDup as any).entities;
    }
    configDup = configDup as ChartCardExternalConfig;
    if (configDup.config_templates) {
      configDup.config_templates =
        configDup.config_templates && Array.isArray(configDup.config_templates)
          ? configDup.config_templates
          : [configDup.config_templates];
      configDup = mergeConfigTemplates(getLovelace(), configDup);
    }
    try {
      const { ChartCardExternalConfig } = createCheckers(exportedTypeSuite);
      if (!configDup.experimental?.disable_config_validation) {
        ChartCardExternalConfig.strictCheck(configDup);
      }
      if (configDup.all_series_config) {
        configDup.series.forEach((serie, index) => {
          const allDup = JSON.parse(JSON.stringify(configDup.all_series_config));
          configDup.series[index] = mergeDeepConfig(allDup, serie);
        });
      }
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

      const defColors = this._config?.color_list || DEFAULT_COLORS;
      if (this._config) {
        this._graphs = this._config.series.map((serie, index) => {
          serie.index = index;
          if (!this._headerColors[index]) {
            this._headerColors[index] = defColors[index % defColors.length];
          }
          if (serie.color) {
            this._headerColors[index] = serie.color;
          }
          serie.fill_raw = serie.fill_raw || DEFAULT_FILL_RAW;
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
            serie.show = {
              legend_value: DEFAULT_SHOW_LEGEND_VALUE,
              in_header: DEFAULT_SHOW_IN_HEADER,
              in_chart: DEFAULT_SHOW_IN_CHART,
            };
          } else {
            serie.show.legend_value =
              serie.show.legend_value === undefined ? DEFAULT_SHOW_LEGEND_VALUE : serie.show.legend_value;
            serie.show.in_chart = serie.show.in_chart === undefined ? DEFAULT_SHOW_IN_CHART : serie.show.in_chart;
            serie.show.in_header = serie.show.in_header === undefined ? DEFAULT_SHOW_IN_HEADER : serie.show.in_header;
          }
          validateInterval(serie.group_by.duration, `series[${index}].group_by.duration`);
          if (serie.color_threshold && serie.color_threshold.length > 0) {
            const sorted: ChartCardColorThreshold[] = JSON.parse(JSON.stringify(serie.color_threshold));
            sorted.sort((a, b) => (a.value < b.value ? -1 : 1));
            serie.color_threshold = sorted;
          }

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
        this._config.series_in_graph = [];
        this._config.series.forEach((serie, index) => {
          if (serie.show.in_chart) {
            this._colors.push(this._headerColors[index]);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._config!.series_in_graph.push(serie);
          }
        });
        this._headerColors = this._headerColors.slice(0, this._config?.series.length);
      }
    } catch (e) {
      throw new Error(`/// apexcharts-card version ${pjson.version} /// ${e.message}`);
    }
    // Full reset only happens in editor mode
    this._reset();
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
          if (serie.show.in_header) {
            return html`
              <div id="states__state">
                <div id="state__value">
                  <span id="state" style="${this._computeHeaderStateColor(serie, this._headerState?.[index])}"
                    >${this._headerState?.[index] === 0
                      ? 0
                      : serie.show.as_duration
                      ? prettyPrintTime(this._headerState?.[index], serie.show.as_duration)
                      : this._computeLastState(this._headerState?.[index], index) || NO_VALUE}</span
                  >
                  ${!serie.show.as_duration
                    ? html`<span id="uom">${computeUom(index, this._config?.series, this._entities)}</span>`
                    : ''}
                </div>
                <div id="state__name">${computeName(index, this._config?.series, this._entities)}</div>
              </div>
            `;
          } else {
            return html``;
          }
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let graphData: any = {};
      if (TIMESERIES_TYPES.includes(this._config.chart_type)) {
        graphData = {
          series: this._graphs.flatMap((graph, index) => {
            if (!graph) return [];
            if (this._config?.series[index].show.in_header !== 'raw') {
              if (graph.history.length === 0) {
                this._headerState[index] = null;
              } else {
                const lastState = graph.history[graph.history.length - 1][1];
                this._headerState[index] = lastState;
              }
            }
            if (!this._config?.series[index].show.in_chart) {
              return [];
            }
            if (graph.history.length === 0) return [{ data: [] }];
            let data: EntityCachePoints = [];
            if (this._config?.series[index].extend_to_end && this._config?.series[index].type !== 'column') {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              data = [...graph.history, ...([[end.getTime(), graph.history.slice(-1)[0]![1]]] as EntityCachePoints)];
            } else {
              data = graph.history;
            }
            data = offsetData(data, this._seriesOffset[index]);
            return [this._config?.series[index].invert ? { data: this._invertData(data) } : { data }];
          }),
          xaxis: {
            min: start.getTime(),
            max: this._findEndOfChart(end),
          },
          annotations: this._computeAnnotations(start, end),
        };
      } else {
        // No timeline charts
        graphData = {
          series: this._graphs.flatMap((graph, index) => {
            if (!graph) return [];
            let data = 0;
            if (graph.history.length === 0) {
              if (this._config?.series[index].show.in_header !== 'raw') {
                this._headerState[index] = null;
              }
              data = 0;
            } else {
              const lastState = graph.history[graph.history.length - 1][1];
              data = lastState === null ? 0 : lastState;
              if (this._config?.series[index].show.in_header !== 'raw') {
                this._headerState[index] = lastState;
              }
            }
            if (!this._config?.series[index].show.in_chart) {
              return [];
            }
            if (this._config?.chart_type === 'radialBar') {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return [getPercentFromValue(data, this._config.series[index].min, this._config.series[index].max)];
            } else {
              return [data];
            }
          }),
        };
      }
      graphData.colors = this._computeChartColors();
      if (this._config.experimental?.color_threshold && this._config.series.some((serie) => serie.color_threshold)) {
        graphData.markers = {
          colors: computeColors(
            this._config.series_in_graph.flatMap((serie, index) => {
              if (serie.type === 'column') return [];
              return [this._colors[index]];
            }),
          ),
        };
        // graphData.fill = { colors: graphData.colors };
        graphData.legend = { markers: { fillColors: computeColors(this._colors) } };
        graphData.tooltip = { marker: { fillColors: graphData.legend.markers.fillColors } };
        graphData.fill = {
          gradient: {
            type: 'vertical',
            colorStops: this._config.series_in_graph.map((serie, index) => {
              if (!serie.color_threshold || ![undefined, 'area', 'line'].includes(serie.type)) return [];
              const min = this._graphs?.[index]?.min;
              const max = this._graphs?.[index]?.max;
              if (min === undefined || max === undefined) return [];
              return (
                this._computeFillColorStops(serie, min, max, computeColor(this._colors[index]), serie.invert) || []
              );
            }),
          },
        };
      }
      // graphData.tooltip = { marker: { fillColors: ['#ff0000', '#00ff00'] } };
      this._headerState = [...this._headerState];
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

  private _computeAnnotations(start: Date, end: Date) {
    return {
      ...this._computeMinMaxPointsAnnotations(start, end),
      ...this._computeNowAnnotation(),
    };
  }

  private _computeMinMaxPointsAnnotations(start: Date, end: Date) {
    const sameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();
    return {
      points: this._config?.series_in_graph.flatMap((serie, index) => {
        if (serie.show.extremas) {
          const { min, max } = this._graphs?.[serie.index]?.minMaxWithTimestamp(start.getTime(), end.getTime()) || {
            min: [0, null],
            max: [0, null],
          };
          const bgColor = computeColor(this._colors[index]);
          const txtColor = computeTextColor(bgColor);
          if (!min[0] || !max[0]) return [];
          return [
            ...this._getPointAnnotationStyle(min, bgColor, txtColor, serie, index, serie.invert, sameDay),
            ...this._getPointAnnotationStyle(max, bgColor, txtColor, serie, index, serie.invert, sameDay),
          ];
        } else {
          return [];
        }
      }),
    };
  }

  private _getPointAnnotationStyle(
    value: HistoryPoint,
    bgColor: string,
    txtColor: string,
    serie: ChartCardSeriesConfig,
    index: number,
    invert = false,
    sameDay: boolean,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const points: any = [];
    points.push({
      x: value[0],
      y: invert && value[1] ? -value[1] : value[1],
      seriesIndex: index,
      marker: {
        strokeColor: bgColor,
        fillColor: 'var(--card-background-color)',
      },
      label: {
        text: truncateFloat(value[1], serie.float_precision)?.toString(),
        borderColor: 'var(--card-background-color)',
        borderWidth: 2,
        style: {
          background: bgColor,
          color: txtColor,
        },
      },
    });
    if (serie.show.extremas === 'time') {
      let bgColorTime = tinycolor(computeColor('var(--card-background-color)'));
      bgColorTime =
        bgColorTime.isValid && bgColorTime.getLuminance() > 0.5 ? bgColorTime.darken(20) : bgColorTime.lighten(20);
      const txtColorTime = computeTextColor(bgColorTime.toHexString());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: any = { timeStyle: 'medium' };
      if (!sameDay) {
        options.dateStyle = 'medium';
      }
      points.push({
        x: value[0],
        y: invert && value[1] ? -value[1] : value[1],
        seriesIndex: index,
        marker: {
          size: 0,
        },
        label: {
          text: `${Intl.DateTimeFormat(this._config?.locale || this._hass?.language || 'en', options).format(
            value[0],
          )}`,
          borderColor: 'var(--card-background-color)',
          offsetY: -22,
          borderWidth: 0,
          style: {
            background: bgColorTime.toHexString(),
            color: txtColorTime,
            fontSize: '8px',
            fontWeight: 200,
          },
        },
      });
    }
    return points;
  }

  private _computeNowAnnotation() {
    if (this._config?.now?.show) {
      const color = computeColor(this._config.now.color || 'var(--primary-color)');
      const textColor = computeTextColor(color);
      return {
        xaxis: [
          {
            x: new Date().getTime(),
            strokeDashArray: 3,
            label: {
              text: this._config.now.label,
              borderColor: color,
              style: {
                color: textColor,
                background: color,
              },
            },
            borderColor: color,
          },
        ],
      };
    }
    return {};
  }

  private _computeChartColors(): (string | (({ value }) => string))[] {
    const defaultColors: (string | (({ value }) => string))[] = computeColors(this._colors);
    this._config?.series_in_graph.forEach((serie, index) => {
      if (
        this._config?.experimental?.color_threshold &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (PLAIN_COLOR_TYPES.includes(this._config!.chart_type!) || serie.type === 'column') &&
        serie.color_threshold &&
        serie.color_threshold.length > 0
      ) {
        const colors = this._colors;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        defaultColors[index] = function ({ value }, sortedL = serie.color_threshold!, defColor = colors[index]) {
          let returnValue = sortedL[0].color || defColor;
          sortedL.forEach((color) => {
            if (value > color.value) returnValue = color.color || defColor;
          });
          return computeColor(returnValue);
        };
      }
    });
    return defaultColors.slice(0, this._config?.series_in_graph.length);
  }

  private _computeFillColorStops(
    serie: ChartCardSeriesConfig,
    min: number,
    max: number,
    defColor: string,
    invert = false,
  ): { offset: number; color: string; opacity?: number }[] | undefined {
    if (!serie.color_threshold) return undefined;
    const scale = max - min;

    const result = serie.color_threshold.flatMap((thres, index, arr) => {
      if (
        (thres.value > max && arr[index - 1] && arr[index - 1].value > max) ||
        (thres.value < min && arr[index + 1] && arr[index + 1].value < min)
      ) {
        return [];
      }
      let color: string | undefined = undefined;
      const defaultOp = serie.opacity !== undefined ? serie.opacity : serie.type === 'area' ? DEFAULT_AREA_OPACITY : 1;
      let opacity = thres.opacity === undefined ? defaultOp : thres.opacity;
      if (thres.value > max && arr[index - 1]) {
        const factor = (max - arr[index - 1].value) / (thres.value - arr[index - 1].value);
        color = interpolateColor(
          tinycolor(arr[index - 1].color || defColor).toHexString(),
          tinycolor(thres.color || defColor).toHexString(),
          factor,
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const prevOp = arr[index - 1].opacity === undefined ? defaultOp : arr[index - 1].opacity!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const curOp = thres.opacity === undefined ? defaultOp : thres.opacity!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (prevOp > curOp) {
          opacity = (prevOp - curOp) * (1 - factor) + curOp;
        } else {
          opacity = (curOp - prevOp) * factor + prevOp;
        }
        opacity = opacity < 0 ? -opacity : opacity;
      } else if (thres.value < min && arr[index + 1]) {
        const factor = (arr[index + 1].value - min) / (arr[index + 1].value - thres.value);
        color = interpolateColor(
          tinycolor(arr[index + 1].color || defColor).toHexString(),
          tinycolor(thres.color || defColor).toHexString(),
          factor,
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextOp = arr[index + 1].opacity === undefined ? defaultOp : arr[index + 1].opacity!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const curOp = thres.opacity === undefined ? defaultOp : thres.opacity!;
        if (nextOp > curOp) {
          opacity = (nextOp - curOp) * (1 - factor) + curOp;
        } else {
          opacity = (curOp - nextOp) * factor + nextOp;
        }
        opacity = opacity < 0 ? -opacity : opacity;
      }
      color = color || tinycolor(thres.color || defColor).toHexString();
      if ([undefined, 'line'].includes(serie.type)) color = tinycolor(color).setAlpha(opacity).toHex8String();
      return [
        {
          color: color || tinycolor(thres.color || defColor).toHexString(),
          offset:
            scale <= 0 ? 0 : invert ? 100 - (max - thres.value) * (100 / scale) : (max - thres.value) * (100 / scale),
          opacity,
        },
      ];
    });
    return invert ? result : result.reverse();
  }

  private _computeHeaderStateColor(serie: ChartCardSeriesConfig, value: number | null): string {
    let color = '';
    if (this._config?.header?.colorize_states) {
      if (
        this._config.experimental?.color_threshold &&
        serie.show.header_color_threshold &&
        serie.color_threshold &&
        serie.color_threshold.length > 0 &&
        value !== null
      ) {
        const index = serie.color_threshold.findIndex((thres) => {
          return thres.value > value;
        });
        if (index < 0) {
          color = computeColor(
            serie.color_threshold[serie.color_threshold.length - 1].color || this._headerColors[serie.index],
          );
        } else if (index === 0) {
          color = computeColor(serie.color_threshold[0].color || this._headerColors[serie.index]);
        } else {
          const prev = serie.color_threshold[index - 1];
          const next = serie.color_threshold[index];
          if (serie.type === 'column') {
            color = computeColor(prev.color || this._headerColors[serie.index]);
          } else {
            const factor = (value - prev.value) / (next.value - prev.value);
            color = interpolateColor(
              computeColor(prev.color || this._headerColors[serie.index]),
              computeColor(next.color || this._headerColors[serie.index]),
              factor,
            );
          }
        }
      } else {
        return this._headerColors && this._headerColors.length > 0 ? `color: ${this._headerColors[serie.index]};` : '';
      }
    }
    return color ? `color: ${color};` : '';
  }

  private _computeLastState(value: number | null, index: number): string | number | null {
    return truncateFloat(value, this._config?.series[index].float_precision);
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
