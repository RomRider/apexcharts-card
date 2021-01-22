import { LitElement, html, customElement, property, TemplateResult, CSSResult, PropertyValues } from 'lit-element';
import { ChartCardConfig, ChartCardExternalConfig, EntityEntryCache } from './types';
import { HomeAssistant } from 'custom-card-helpers';
import localForage from 'localforage';
import * as pjson from '../package.json';
import { compress, decompress, getMilli, log } from './utils';
import ApexCharts from 'apexcharts';
import { styles } from './styles';
import { ONE_HOUR } from './const';
import { HassEntity } from 'home-assistant-js-websocket';

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
    const value: any = key.endsWith('-raw') ? data : decompress(data);
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

  private _stateChanged = false;

  private _updating = false;

  private _updateQueue: string[] = [];

  private _interval?: NodeJS.Timeout;

  private _history: (EntityEntryCache | undefined)[] = [];

  @property() private _config?: ChartCardConfig;

  private _entities: any[] = [];

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
      this._config!.series[index].index = index; // Required for filtered views
      const entityState = (hass && hass.states[serie.entity]) || undefined;
      if (entityState && this._entities[index] !== entityState) {
        this._entities[index] = entityState;
        queue.push(`${entityState.entity_id}-${index}`);
        updated = true;
      }
    });
    if (updated) {
      this._stateChanged = true;
      this._entities = [...this._entities];
      if (!this._updating) {
        // setTimeout(
        //   () => {
        this._updateQueue = [...queue, ...this._updateQueue];
        this._updateData();
        //   },
        //   this.initial ? 0 : 1000,
        // );
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
    this._loaded = true;

    await this.updateComplete;

    if (!this._apexChart) {
      const graph = this.shadowRoot!.querySelector('#graph');
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
          range: getMilli(this._config!.hours_to_show),
          labels: {
            datetimeUTC: false,
          },
        },
        stroke: {
          curve: 'smooth',
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

  private async _setCache(key: string, data: EntityEntryCache, compressed: boolean): Promise<any> {
    return compressed ? localForage.setItem(key, compress(data)) : localForage.setItem(`${key}-raw`, data);
  }

  private async _updateData() {
    this._updating = true;
    const config = this._config;

    // const end = this.getEndDate();
    const end = new Date();
    const start = new Date(end);
    start.setTime(start.getTime() - getMilli(config!.hours_to_show));

    try {
      const promise = this._entities.map((entity, i) => this._updateEntity(entity, i, start, end));
      await Promise.all(promise);
      const graphData = {
        series: this._history.map((history) => {
          return {
            data: history!.data,
          };
        }),
        subtitle: {
          text: this._entities[0].state,
        },
      };
      this._apexChart?.updateOptions(graphData, false, false);
    } catch (err) {
      log(err);
    }
    this._updating = false;
    // this._setNextUpdate();
  }

  private _setNextUpdate() {
    // if (!this._config?.update_interval) {
    // const interval = 1 / this.config.points_per_hour;
    const interval = 1 / 60;
    this._interval && clearInterval(this._interval);
    this._interval = setInterval(() => {
      if (!this._updating) this._updateData();
    }, interval * ONE_HOUR);
    // }
  }

  private async _updateEntity(entity: HassEntity, index: number, start: Date, end: Date): Promise<any> {
    if (!entity || !this._updateQueue.includes(`${entity.entity_id}-${index}`)) return;
    this._updateQueue = this._updateQueue.filter((entry) => entry !== `${entity.entity_id}-${index}`);

    let skipInitialState = false;

    let history = this._config?.cache ? await this._getCache(entity.entity_id, this._config?.useCompress) : undefined;
    // const history = undefined;
    if (history && history.hours_to_show === this._config?.hours_to_show) {
      // stateHistory = history.data;

      const currDataIndex = history.data.findIndex((item) => new Date(item[0]).getTime() > start.getTime());
      if (currDataIndex > 4) {
        // >4 so that the graph animates nicely
        history.data = history.data.slice(currDataIndex === 0 ? 0 : currDataIndex - 4);
        // skip initial state when fetching recent/not-cached data
        skipInitialState = true;
      } else if (currDataIndex === -1) {
        // there were no states which could be used in current graph so clearing
        history.data = [];
      }
    } else {
      history = undefined;
    }

    let newHistory = await this._fetchRecent(
      entity.entity_id,
      // if data in cache, get data from last data's time + 1ms
      history && history.data.length !== 0 ? new Date(history.data.slice(-1)[0][0] + 1) : start,
      end,
      skipInitialState,
    );
    if (newHistory[0] && newHistory[0].length > 0) {
      newHistory = newHistory[0].filter((item) => !Number.isNaN(parseFloat(item.state)));
      const newStateHistory: [number, number][] = newHistory.map((item) => [
        new Date(item.last_changed).getTime(),
        parseFloat(item.state),
      ]);
      if (history?.data) {
        history.hours_to_show = this._config!.hours_to_show;
        history.last_fetched = new Date();
        history.data.push(...newStateHistory);
      } else {
        history = {
          hours_to_show: this._config!.hours_to_show,
          last_fetched: new Date(),
          data: newStateHistory,
        };
      }

      if (this._config?.cache) {
        this._setCache(entity.entity_id, history, this._config.useCompress).catch((err) => {
          log(err);
          localForage.clear();
        });
      }
    }

    if (history?.data.length === 0) return undefined;
    this._history[index] = history;
  }

  private async _fetchRecent(entityId: string, start: Date, end: Date, skipInitialState: boolean): Promise<any> {
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
