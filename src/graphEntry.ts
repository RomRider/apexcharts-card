import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardSeriesConfig, EntityCachePoints, EntityEntryCache, HassHistory, HistoryBuckets } from './types';
import { compress, decompress, log } from './utils';
import localForage from 'localforage';
import { HassEntity } from 'home-assistant-js-websocket';
import { DateRange } from 'moment-range';
import { HOUR_24, moment } from './const';
import parse from 'parse-duration';
import SparkMD5 from 'spark-md5';
import { ChartCardSpanExtConfig } from './types-config';
import * as pjson from '../package.json';

export default class GraphEntry {
  private _computedHistory?: EntityCachePoints;

  private _hass?: HomeAssistant;

  private _entityID: string;

  private _entityState?: HassEntity;

  private _updating = false;

  private _cache = true;

  // private _hoursToShow: number;

  private _graphSpan: number;

  private _useCompress = false;

  private _index: number;

  private _config: ChartCardSeriesConfig;

  private _timeRange: DateRange;

  private _func: (item: EntityCachePoints) => number;

  private _realStart: Date;

  private _realEnd: Date;

  private _groupByDurationMs: number;

  private _md5Config: string;

  constructor(
    index: number,
    graphSpan: number,
    cache: boolean,
    config: ChartCardSeriesConfig,
    span: ChartCardSpanExtConfig | undefined,
  ) {
    const aggregateFuncMap = {
      avg: this._average,
      max: this._maximum,
      min: this._minimum,
      first: this._first,
      last: this._last,
      sum: this._sum,
      median: this._median,
      delta: this._delta,
      diff: this._diff,
    };
    this._index = index;
    this._cache = cache;
    this._entityID = config.entity;
    this._graphSpan = graphSpan;
    this._config = config;
    const now = new Date();
    const now2 = new Date(now);
    this._func = aggregateFuncMap[config.group_by.func];
    now2.setTime(now2.getTime() - HOUR_24);
    this._timeRange = moment.range(now, now2);
    this._realEnd = new Date();
    this._realStart = new Date();
    // Valid because tested during init;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._groupByDurationMs = parse(this._config.group_by.duration)!;
    this._md5Config = SparkMD5.hash(`${this._graphSpan}${JSON.stringify(this._config)}${JSON.stringify(span)}`);
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this._entityState = this._hass.states[this._entityID];
  }

  get history(): EntityCachePoints {
    return this._computedHistory || [];
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

  set cache(cache: boolean) {
    this._cache = cache;
  }

  private async _getCache(key: string, compressed: boolean): Promise<EntityEntryCache | undefined> {
    const data: EntityEntryCache | undefined | null = await localForage.getItem(
      `${key}_${this._md5Config}${compressed ? '' : '-raw'}`,
    );
    return data ? (compressed ? decompress(data) : data) : undefined;
  }

  private async _setCache(
    key: string,
    data: EntityEntryCache,
    compressed: boolean,
  ): Promise<string | EntityEntryCache> {
    return compressed
      ? localForage.setItem(`${key}_${this._md5Config}`, compress(data))
      : localForage.setItem(`${key}_${this._md5Config}-raw`, data);
  }

  public async _updateHistory(start: Date, end: Date): Promise<boolean> {
    let startHistory = new Date(start);
    if (this._config.group_by.func !== 'raw') {
      const range = end.getTime() - start.getTime();
      const nbBuckets = Math.abs(range / this._groupByDurationMs) + (range % this._groupByDurationMs > 0 ? 1 : 0);
      startHistory = new Date(end.getTime() - nbBuckets * this._groupByDurationMs);
    }
    if (!this._entityState || this._updating) return false;
    this._updating = true;
    this._timeRange = moment.range(startHistory, end);
    let history: EntityEntryCache | undefined = undefined;

    if (this._config.data_generator) {
      history = this._generateData(start, end);
    } else {
      this._realStart = new Date(start);
      this._realEnd = new Date(end);

      let skipInitialState = false;

      history = this._cache ? await this._getCache(this._entityID, this._useCompress) : undefined;

      if (history && history.span === this._graphSpan) {
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
        this._config.attribute ? false : skipInitialState,
        this._config.attribute ? true : false,
      );
      if (newHistory && newHistory[0] && newHistory[0].length > 0) {
        /*
        hack because HA doesn't return anything if skipInitialState is false
        when retrieving for attributes so we retrieve it and we remove it.
        */
        if (this._config.attribute && skipInitialState) {
          newHistory[0].shift();
        }
        let lastNonNull: number | null = null;
        if (history && history.data && history.data.length > 0) {
          lastNonNull = history.data[history.data.length - 1][1];
        }
        const newStateHistory: EntityCachePoints = newHistory[0].map((item) => {
          let currentState: unknown = null;
          if (this._config.attribute) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (item.attributes && item.attributes![this._config.attribute]) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              currentState = item.attributes![this._config.attribute];
            }
          } else {
            currentState = item.state;
          }
          if (this._config.transform) {
            currentState = this._applyTransform(currentState);
          }
          let stateParsed: number | null = parseFloat(currentState as string);
          stateParsed = !Number.isNaN(stateParsed) ? stateParsed : null;
          if (stateParsed === null) {
            if (this._config.fill_raw === 'zero') {
              stateParsed = 0;
            } else if (this._config.fill_raw === 'last') {
              stateParsed = lastNonNull;
            }
          } else {
            lastNonNull = stateParsed;
          }

          if (this._config.attribute) {
            return [new Date(item.last_updated).getTime(), !Number.isNaN(stateParsed) ? stateParsed : null];
          } else {
            return [new Date(item.last_changed).getTime(), !Number.isNaN(stateParsed) ? stateParsed : null];
          }
        });
        if (history?.data.length) {
          history.span = this._graphSpan;
          history.last_fetched = new Date();
          history.card_version = pjson.version;
          if (history.data.length !== 0) {
            history.data.push(...newStateHistory);
          }
        } else {
          history = {
            span: this._graphSpan,
            card_version: pjson.version,
            last_fetched: new Date(),
            data: newStateHistory,
          };
        }

        if (this._cache) {
          this._setCache(this._entityID, history, this._useCompress).catch((err) => {
            log(err);
            localForage.clear();
          });
        }
      }
    }

    if (!history || history.data.length === 0) {
      this._updating = false;
      this._computedHistory = undefined;
      return false;
    }
    if (this._config.group_by.func !== 'raw') {
      this._computedHistory = this._dataBucketer(history).map((bucket) => {
        return [bucket.timestamp, this._func(bucket.data)];
      });
    } else {
      this._computedHistory = history.data;
    }
    this._updating = false;
    return true;
  }

  private _applyTransform(value: unknown): number | null {
    return new Function('x', 'hass', `'use strict'; ${this._config.transform}`).call(this, value, this._hass);
  }

  private async _fetchRecent(
    start: Date | undefined,
    end: Date | undefined,
    skipInitialState: boolean,
    withAttributes = false,
  ): Promise<HassHistory | undefined> {
    let url = 'history/period';
    if (start) url += `/${start.toISOString()}`;
    url += `?filter_entity_id=${this._entityID}`;
    if (end) url += `&end_time=${end.toISOString()}`;
    if (skipInitialState) url += '&skip_initial_state';
    if (!withAttributes) url += '&minimal_response';
    if (withAttributes) url += '&significant_changes_only=0';
    return this._hass?.callApi('GET', url);
  }

  private _generateData(start: Date, end: Date): EntityEntryCache {
    let data;
    try {
      data = new Function(
        'entity',
        'start',
        'end',
        'hass',
        'moment',
        `'use strict'; ${this._config.data_generator}`,
      ).call(this, this._entityState, start, end, this._hass, moment);
    } catch (e) {
      const funcTrimmed =
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._config.data_generator!.length <= 100
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._config.data_generator!.trim()
          : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            `${this._config.data_generator!.trim().substring(0, 98)}...`;
      e.message = `${e.name}: ${e.message} in '${funcTrimmed}'`;
      e.name = 'Error';
      throw e;
    }
    return {
      span: 0,
      card_version: pjson.version,
      last_fetched: new Date(),
      data,
    };
  }

  private _dataBucketer(history: EntityEntryCache): HistoryBuckets {
    const ranges = Array.from(this._timeRange.reverseBy('milliseconds', { step: this._groupByDurationMs })).reverse();
    // const res: EntityCachePoints[] = [[]];
    let buckets: HistoryBuckets = [];
    ranges.forEach((range, index) => {
      buckets[index] = { timestamp: range.valueOf(), data: [] };
    });
    let lastNotNullValue: number | null = null;
    history?.data.forEach((entry) => {
      let properEntry = entry;
      // Fill null values
      if (properEntry[1] === null) {
        if (this._config.group_by.fill === 'last') {
          properEntry = [entry[0], lastNotNullValue];
        } else if (this._config.group_by.fill === 'zero') {
          properEntry = [entry[0], 0];
        }
      } else {
        lastNotNullValue = properEntry[1];
      }

      buckets.some((bucket, index) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (bucket.timestamp > properEntry![0] && index > 0) {
          buckets[index - 1].data.push(properEntry);
          return true;
        }
        return false;
      });
    });
    let lastNonNullBucketValue: number | null = null;
    const now = new Date().getTime();
    buckets.forEach((bucket) => {
      if (bucket.data.length === 0) {
        if (this._config.group_by.fill === 'last' && bucket.timestamp <= now) {
          bucket.data[0] = [bucket.timestamp, lastNonNullBucketValue];
        } else if (this._config.group_by.fill === 'zero' && bucket.timestamp <= now) {
          bucket.data[0] = [bucket.timestamp, 0];
        } else if (this._config.group_by.fill === 'null') {
          bucket.data[0] = [bucket.timestamp, null];
        }
      } else {
        lastNonNullBucketValue = bucket.data.slice(-1)[0][1];
      }
    });
    buckets.pop();
    // Could probably do better than double reverse...
    // This is to stip any value at the end which is empty or null
    // to make extend_to_end work with buckets
    if (
      (buckets.length > 0 && buckets[buckets.length - 1].data.length === 0) ||
      (buckets[buckets.length - 1].data.length > 0 &&
        buckets[buckets.length - 1].data[buckets[buckets.length - 1].data.length - 1][1] === null)
    )
      buckets = buckets
        .reverse()
        .flatMap((bucket) => {
          if (bucket.data[1] === null) return [];
          if (bucket.data.length === 0) return [];
          else return [bucket];
        })
        .reverse();
    return buckets;
  }

  private _sum(items: EntityCachePoints): number {
    if (items.length === 0) return 0;
    let lastIndex = 0;
    return items.reduce((sum, entry, index) => {
      let val = 0;
      if (entry && entry[1] === null) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        val = items[lastIndex][1]!;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        val = entry[1]!;
        lastIndex = index;
      }
      return sum + val;
    }, 0);
  }

  private _average(items: EntityCachePoints): number | null {
    const nonNull = this._filterNulls(items);
    if (nonNull.length === 0) return null;
    return this._sum(nonNull) / nonNull.length;
  }

  private _minimum(items: EntityCachePoints): number | null {
    let min: number | null = null;
    items.forEach((item) => {
      if (item[1] !== null)
        if (min === null) min = item[1];
        else min = Math.min(item[1], min);
    });
    return min;
  }

  private _maximum(items: EntityCachePoints): number | null {
    let max: number | null = null;
    items.forEach((item) => {
      if (item[1] !== null)
        if (max === null) max = item[1];
        else max = Math.max(item[1], max);
    });
    return max;
  }

  private _last(items: EntityCachePoints): number | null {
    if (items.length === 0) return null;
    return items.slice(-1)[0][1];
  }

  private _first(items: EntityCachePoints): number | null {
    if (items.length === 0) return null;
    return items[0][1];
  }

  private _median(items: EntityCachePoints) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const itemsDup = this._filterNulls([...items]).sort((a, b) => a[1]! - b[1]!);
    const mid = Math.floor((itemsDup.length - 1) / 2);
    if (itemsDup.length % 2 === 1) return itemsDup[mid];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (itemsDup[mid][1]! + itemsDup[mid + 1][1]!) / 2;
  }

  private _delta(items: EntityCachePoints): number | null {
    const max = this._maximum(items);
    const min = this._minimum(items);
    return max === null || min === null ? null : max - min;
  }

  private _diff(items: EntityCachePoints): number | null {
    const noNulls = this._filterNulls(items);
    const first = this._first(noNulls);
    const last = this._last(noNulls);
    if (first === null || last === null) {
      return null;
    }
    return last - first;
  }

  private _filterNulls(items: EntityCachePoints): EntityCachePoints {
    return items.filter((item) => item[1] !== null);
  }
}
