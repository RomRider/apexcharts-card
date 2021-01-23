import { HomeAssistant } from 'custom-card-helpers';
import { EntityCachePoints, EntityEntryCache, HassHistory } from './types';
import { compress, decompress, log } from './utils';
import localForage from 'localforage';
import { HassEntity } from 'home-assistant-js-websocket';

export default class GraphEntry {
  private _history: EntityEntryCache | undefined;

  private _hass?: HomeAssistant;

  private _entityID: string;

  private _entityState?: HassEntity;

  private _updating = false;

  private _cache = true;

  private _hoursToShow: number;

  private _useCompress = false;

  private _index: number;

  constructor(entity: string, index: number, hoursToShow = 24, cache: boolean) {
    this._index = index;
    this._cache = cache;
    this._entityID = entity;
    this._history = undefined;
    this._hoursToShow = hoursToShow;
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this._entityState = this._hass.states[this._entityID];
  }

  get history(): EntityCachePoints {
    return this._history?.data || [];
  }

  get index(): number {
    return this._index;
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

  public async _updateHistory(start: Date, end: Date): Promise<boolean> {
    if (!this._entityState || this._updating) return false;
    this._updating = true;

    let skipInitialState = false;

    let history = this._cache
      ? await this._getCache(`${this._entityID}_${this._hoursToShow}`, this._useCompress)
      : undefined;

    if (history && history.hours_to_show === this._hoursToShow) {
      const currDataIndex = history.data.findIndex((item) => item && new Date(item[0]).getTime() > start.getTime());
      if (currDataIndex !== -1) {
        // skip initial state when fetching recent/not-cached data
        skipInitialState = true;
      }
      if (currDataIndex > 4) {
        // >4 so that the graph has some more history
        history.data = history.data.slice(currDataIndex === 0 ? 0 : currDataIndex - 4);
      } else if (currDataIndex === -1) {
        // there was no state which could be used in current graph so clearing
        history.data = [];
      }
    } else {
      history = undefined;
    }
    const newHistory = await this._fetchRecent(
      // if data in cache, get data from last data's time + 1ms
      history && history.data && history.data.length !== 0 && history.data.slice(-1)[0]
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new Date(history.data.slice(-1)[0]![0] + 1)
        : start,
      end,
      skipInitialState,
    );
    if (newHistory && newHistory[0] && newHistory[0].length > 0) {
      const newStateHistory: EntityCachePoints = newHistory[0].map((item) => {
        const stateParsed = parseFloat(item.state);
        return [new Date(item.last_changed).getTime(), !Number.isNaN(stateParsed) ? stateParsed : null];
      });
      if (history?.data.length) {
        history.hours_to_show = this._hoursToShow;
        history.last_fetched = new Date();
        if (history.data.length !== 0) {
          history.data.push(...newStateHistory);
        }
      } else {
        history = {
          hours_to_show: this._hoursToShow,
          last_fetched: new Date(),
          data: newStateHistory,
        };
      }

      if (this._cache) {
        this._setCache(`${this._entityID}_${this._hoursToShow}`, history, this._useCompress).catch((err) => {
          log(err);
          localForage.clear();
        });
      }
    }

    if (!history || history.data.length === 0) return false;
    this._history = history;
    this._updating = false;
    return true;
  }

  private async _fetchRecent(
    start: Date | undefined,
    end: Date | undefined,
    skipInitialState: boolean,
  ): Promise<HassHistory | undefined> {
    let url = 'history/period';
    if (start) url += `/${start.toISOString()}`;
    url += `?filter_entity_id=${this._entityID}`;
    if (end) url += `&end_time=${end.toISOString()}`;
    if (skipInitialState) url += '&skip_initial_state';
    url += '&minimal_response';
    return this._hass?.callApi('GET', url);
  }
}
