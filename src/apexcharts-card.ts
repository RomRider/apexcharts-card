import { LitElement, html, customElement, property, TemplateResult, CSSResult, PropertyValues } from 'lit-element';
import { ChartCardConfig, ChartCardExternalConfig, EntityEntryCache, HassHistory } from './types';
import { HomeAssistant } from 'custom-card-helpers';
import localForage from 'localforage';
import * as pjson from '../package.json';
import { compress, decompress, getMilli, log } from './utils';
import ApexCharts from 'apexcharts';
import { styles } from './styles';
import { HassEntity } from 'home-assistant-js-websocket';
import moment from 'moment';

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
    const start = new Date();
    start.setHours(start.getHours() - value.hours_to_show);
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

  private _apexChartConfig?: ApexChart = {};

  private _apexChart?: ApexCharts;

  private _loaded = false;

  private _updating = false;

  private _updateQueue: string[] = [];

  private _history: EntityEntryCache[] = [];

  @property() private _config?: ChartCardConfig;

  private _entities: HassEntity[] = [];

  public connectedCallback() {
    super.connectedCallback();
    if (this._config && this._hass && !this._loaded) {
      this._initialLoad();
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
    if (!this._config) return;

    let updated = false;
    const queue: string[] = [];
    this._config.series.forEach((serie, index) => {
      serie.index = index; // Required for filtered views
      const entityState = (hass && hass.states[serie.entity]) || undefined;
      if (entityState && this._entities[index] !== entityState) {
        this._entities[index] = entityState;
        queue.push(`${entityState.entity_id}-${index}`);
        updated = true;
      }
    });
    if (updated) {
      this._entities = [...this._entities];
      if (!this._updating) {
        this._updateQueue = [...queue, ...this._updateQueue];
        // give time to HA's recorder component to write the data in the history
        setTimeout(() => {
          this._updateData();
        }, 1000);
      } else {
        this._updateQueue = [...queue, ...this._updateQueue];
      }
    }
  }

  public setConfig(config: ChartCardExternalConfig) {
    this._config = {
      hours_to_show: 24,
      cache: true,
      useCompress: false,
      ...JSON.parse(JSON.stringify(config)),
    };
    this._config?.series.map((serie) => {
      serie.extend_to_end = serie.extend_to_end !== undefined ? serie.extend_to_end : true;
    });
  }

  static get styles(): CSSResult {
    return styles;
  }

  protected render(): TemplateResult {
    if (!this._config || !this._hass) return html``;

    return html`
      <ha-card>
        <div id="graph"></div>
      </ha-card>
    `;
  }

  private async _initialLoad() {
    await this.updateComplete;

    if (!this._apexChart && this.shadowRoot && this._config) {
      this._loaded = true;
      const graph = this.shadowRoot.querySelector('#graph');
      this._apexChart = new ApexCharts(graph, {
        chart: {
          stacked: this._config?.stacked,
          type: 'line',
          foreColor: 'var(--primary-text-color)',
          // animations: {
          //   enabled: true,
          //   easing: 'linear',
          //   dynamicAnimation: {
          //     speed: 1000,
          //   },
          // },
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        title: {
          text: this._config?.series[0].name || this._config?.series[0].entity,
          align: 'left',
          floating: false,
          // offsetX: 10,
          style: {
            fontSize: '20px',
            fontWeight: '500',
            fontFamily: 'var(--paper-font-body1_-_font-family)',
            // color:  '#263238'
          },
        },
        subtitle: {
          text: undefined,
          align: 'right',
          floating: true,
          offsetY: 0,
          margin: 0,
          style: {
            fontSize: '40px',
            fontWeight: '300',
            fontFamily: 'var(--paper-font-body1_-_font-family)',
            // color:  '#9699a2'
          },
        },
        series: this._config?.series.map((serie) => {
          return {
            name: serie.name || serie.entity,
            type: serie.type || 'line',
            data: [[]],
          };
        }),
        xaxis: {
          type: 'datetime',
          range: getMilli(this._config.hours_to_show),
          labels: {
            datetimeUTC: false,
          },
        },
        tooltip: {
          x: {
            formatter:
              this._config.hours_to_show < 24
                ? function (val) {
                    return moment(new Date(val)).format('HH:mm:ss');
                  }
                : function (val) {
                    return moment(new Date(val)).format('MMM Do, HH:mm:ss');
                  },
          },
        },
        stroke: {
          curve: this._config.series.map((serie) => {
            return serie.curve || 'smooth';
          }),
          lineCap: 'round',
        },
        noData: {
          text: 'Loading...',
        },
      });
      this._apexChart.render();
    }
  }

  private async _getCache(key: string, compressed: boolean): Promise<EntityEntryCache | undefined> {
    const data: EntityEntryCache | undefined | null = await localForage.getItem(key + (compressed ? '' : '-raw'));
    return data ? (compressed ? decompress(data) : data) : undefined;
  }

  private async _setCache(
    key: string,
    data: EntityEntryCache,
    compressed: boolean,
  ): Promise<string | EntityEntryCache> {
    return compressed ? localForage.setItem(key, compress(data)) : localForage.setItem(`${key}-raw`, data);
  }

  private async _updateData() {
    if (!this._config) return;
    this._updating = true;
    const config = this._config;

    // const end = this.getEndDate();
    const end = new Date();
    const start = new Date(end);
    start.setTime(start.getTime() - getMilli(config.hours_to_show));

    try {
      const promise = this._entities.map((entity, i) => this._updateEntity(entity, i, start));
      await Promise.all(promise);
      const graphData = {
        series: this._history.map((history, index) => {
          return {
            data: this._config?.series[index].extend_to_end
              ? [...history?.data, ...[[end.getTime(), history?.data.slice(-1)[0][1]]]]
              : history?.data,
          };
        }),
        subtitle: {
          text: this._entities[0].state,
        },
        xaxis: {
          // min: end.get
          max: end.getTime(),
        },
      };
      this._apexChart?.updateOptions(graphData, false, false);
    } catch (err) {
      log(err);
    }
    this._updating = false;
  }

  private async _updateEntity(entity: HassEntity, index: number, start: Date): Promise<EntityEntryCache | undefined> {
    if (!this._config || !entity || !this._updateQueue.includes(`${entity.entity_id}-${index}`)) return;
    this._updateQueue = this._updateQueue.filter((entry) => entry !== `${entity.entity_id}-${index}`);

    let skipInitialState = false;

    let history = this._config?.cache
      ? await this._getCache(`${entity.entity_id}_${this._config.hours_to_show}`, this._config?.useCompress)
      : undefined;
    // const history = undefined;
    if (history && history.hours_to_show === this._config?.hours_to_show) {
      // stateHistory = history.data;

      const currDataIndex = history.data.findIndex((item) => new Date(item[0]).getTime() > start.getTime());
      if (currDataIndex !== -1) {
        // skip initial state when fetching recent/not-cached data
        skipInitialState = true;
      }
      if (currDataIndex > 4) {
        // >4 so that the graph has some more history
        history.data = history.data.slice(currDataIndex === 0 ? 0 : currDataIndex - 4);
      } else if (currDataIndex === -1) {
        // there were no states which could be used in current graph so clearing
        history.data = [];
      }
    } else {
      history = undefined;
    }
    const newHistory = await this._fetchRecent(
      entity.entity_id,
      // if data in cache, get data from last data's time + 1ms
      history && history.data.length !== 0 ? new Date(history.data.slice(-1)[0][0] + 1) : start,
      undefined,
      skipInitialState,
    );
    if (newHistory && newHistory[0] && newHistory[0].length > 0) {
      const filteredNewHistory = newHistory[0].filter((item) => !Number.isNaN(parseFloat(item.state)));
      const newStateHistory: [number, number][] = filteredNewHistory.map((item) => [
        new Date(item.last_changed).getTime(),
        parseFloat(item.state),
      ]);
      if (history?.data) {
        history.hours_to_show = this._config.hours_to_show;
        history.last_fetched = new Date();
        history.data.push(...newStateHistory);
      } else {
        history = {
          hours_to_show: this._config.hours_to_show,
          last_fetched: new Date(),
          data: newStateHistory,
        };
      }

      if (this._config?.cache) {
        this._setCache(`${entity.entity_id}_${this._config.hours_to_show}`, history, this._config.useCompress).catch(
          (err) => {
            log(err);
            localForage.clear();
          },
        );
      }
    }

    if (!history || history.data.length === 0) return undefined;
    this._history[index] = history;
    return history;
  }

  private async _fetchRecent(
    entityId: string,
    start: Date | undefined,
    end: Date | undefined,
    skipInitialState: boolean,
  ): Promise<HassHistory | undefined> {
    let url = 'history/period';
    if (start) url += `/${start.toISOString()}`;
    url += `?filter_entity_id=${entityId}`;
    if (end) url += `&end_time=${end.toISOString()}`;
    if (skipInitialState) url += '&skip_initial_state';
    url += '&minimal_response';
    return this._hass?.callApi('GET', url);
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
