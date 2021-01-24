import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardSeriesConfig, EntityCachePoints, EntityEntryCache, HassHistory, HistoryBuckets } from './types';
import { compress, decompress, log } from './utils';
import localForage from 'localforage';
import { HassEntity } from 'home-assistant-js-websocket';
import { DateRange } from 'moment-range';
import { DEFAULT_HOURS_TO_SHOW, moment } from './const';
import parse from 'parse-duration';

export default class GraphEntry {
  private _history?: EntityEntryCache;

  private _computedHistory?: EntityCachePoints;

  private _hass?: HomeAssistant;

  private _entityID: string;

  private _entityState?: HassEntity;

  private _updating = false;

  private _cache = true;

  private _hoursToShow: number;

  private _useCompress = false;

  private _index: number;

  private _config: ChartCardSeriesConfig;

  private _timeRange: DateRange;

  private _func: (item: EntityCachePoints) => number;

  private _realStart: Date;

  private _realEnd: Date;

  constructor(entity: string, index: number, hoursToShow: number, cache: boolean, config: ChartCardSeriesConfig) {
    const aggregateFuncMap = {
      avg: this._average,
    };
    this._index = index;
    this._cache = cache;
    this._entityID = entity;
    this._history = undefined;
    this._hoursToShow = hoursToShow;
    this._config = config;
    const now = new Date();
    const now2 = new Date(now);
    this._func = aggregateFuncMap[config.group_by.func];
    now2.setHours(now2.getHours() - DEFAULT_HOURS_TO_SHOW);
    this._timeRange = moment.range(now, now2);
    this._realEnd = new Date();
    this._realStart = new Date();
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this._entityState = this._hass.states[this._entityID];
  }

  get history(): EntityCachePoints {
    return this._computedHistory || this._history?.data || [];
  }

  get index(): number {
    return this._index;
  }

  get start(): Date {
    return this._realStart;
  }

  get end(): Date {
    return this._realEnd;
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
    this._realStart = start;
    this._realEnd = end;

    let startHistory = start;
    if (this._config.group_by.func !== 'raw') {
      const dur = parse(this._config.group_by.duration)!;
      const range = end.getTime() - start.getTime();
      const nbBuckets = Math.abs(range / dur) + (range % dur > 0 ? 1 : 0);
      startHistory = new Date(end.getTime() - nbBuckets * dur);
    }
    if (!this._entityState || this._updating) return false;
    this._updating = true;
    this._timeRange = moment.range(startHistory, end);

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
        : startHistory,
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
    if (this._config.group_by.func !== 'raw') {
      this._computedHistory = this._dataBucketer().map((bucket) => {
        return [bucket.timestamp, this._func(bucket.data)];
      });
    }
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

  private _dataBucketer(): HistoryBuckets {
    const groupBy = parse(this._config.group_by.duration);
    // groupBy is valid, it has been tester during init;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ranges = Array.from(this._timeRange.reverseBy('milliseconds', { step: groupBy! })).reverse();
    // const res: EntityCachePoints[] = [[]];
    const buckets: HistoryBuckets = [];
    ranges.forEach((range) => {
      buckets.push({ timestamp: range.valueOf(), data: [] });
    });
    this._history?.data.forEach((entry) => {
      buckets.forEach((bucket, index) => {
        if (bucket.timestamp > entry![0] && index > 0) {
          buckets[index - 1].data.push(entry);
        }
      });
    });
    return buckets;
  }

  private _average(items: EntityCachePoints): number | null {
    if (items.length === 0) return null;
    let lastIndex = 0;
    return (
      items.reduce((sum, entry, index) => {
        let val = 0;
        if (entry && entry[1] === null) {
          val = items[lastIndex]![1]!;
        } else {
          val = entry![1]!;
          lastIndex = index;
        }
        return sum + val;
      }, 0) / items.length
    );
  }
}
