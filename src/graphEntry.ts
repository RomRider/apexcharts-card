import { HomeAssistant } from 'custom-card-helpers';
import {
  ChartCardSeriesConfig,
  EntityCachePoints,
  EntityEntryCache,
  HassHistory,
  HassHistoryEntry,
  HistoryBuckets,
  HistoryPoint,
  Statistics,
  StatisticValue,
} from './types';
import { compress, decompress, log } from './utils';
import localForage from 'localforage';
import { HassEntity } from 'home-assistant-js-websocket';
import { DateRange } from 'moment-range';
import { DEFAULT_STATISTICS_PERIOD, DEFAULT_STATISTICS_TYPE, moment } from './const';
import parse from 'parse-duration';
import SparkMD5 from 'spark-md5';
import { ChartCardSpanExtConfig, StatisticsPeriod } from './types-config';
import * as pjson from '../package.json';

export default class GraphEntry {
  private _computedHistory?: EntityCachePoints;

  private _hass?: HomeAssistant;

  private _entityID: string;

  private _entityState?: HassEntity;

  private _updating = false;

  private _cache: boolean;

  // private _hoursToShow: number;

  private _graphSpan: number;

  private _useCompress = false;

  private _index: number;

  private _config: ChartCardSeriesConfig;

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
    this._cache = config.statistics ? false : cache;
    this._entityID = config.entity;
    this._graphSpan = graphSpan;
    this._config = config;
    this._func = aggregateFuncMap[config.group_by.func];
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
    this._cache = this._config.statistics ? false : cache;
  }

  get lastState(): number | null {
    return this.history.length > 0 ? this.history[this.history.length - 1][1] : null;
  }

  public nowValue(now: number, before: boolean): number | null {
    if (this.history.length === 0) return null;
    const index = this.history.findIndex((point, index, arr) => {
      if (!before && point[0] > now) return true;
      if (before && point[0] < now && arr[index + 1] && arr[index + 1][0] > now) return true;
      return false;
    });
    if (index === -1) return null;
    return this.history[index][1];
  }

  get min(): number | undefined {
    if (!this._computedHistory || this._computedHistory.length === 0) return undefined;
    return Math.min(...this._computedHistory.flatMap((item) => (item[1] === null ? [] : [item[1]])));
  }

  get max(): number | undefined {
    if (!this._computedHistory || this._computedHistory.length === 0) return undefined;
    return Math.max(...this._computedHistory.flatMap((item) => (item[1] === null ? [] : [item[1]])));
  }

  public minMaxWithTimestamp(start: number, end: number): { min: HistoryPoint; max: HistoryPoint } | undefined {
    if (!this._computedHistory || this._computedHistory.length === 0) return undefined;
    if (this._computedHistory.length === 1)
      return { min: [start, this._computedHistory[0][1]], max: [end, this._computedHistory[0][1]] };
    return this._computedHistory.reduce(
      (acc: { min: HistoryPoint; max: HistoryPoint }, point) => {
        if (point[1] === null) return acc;
        if (point[0] > end || point[0] < start) return acc;
        if (acc.max[1] === null || acc.max[1] < point[1]) acc.max = [...point];
        if (acc.min[1] === null || (point[1] !== null && acc.min[1] > point[1])) acc.min = [...point];
        return acc;
      },
      { min: [0, null], max: [0, null] },
    );
  }

  public minMaxWithTimestampForYAxis(start: number, end: number): { min: HistoryPoint; max: HistoryPoint } | undefined {
    if (!this._computedHistory || this._computedHistory.length === 0) return undefined;
    let lastTimestampBeforeStart = start;
    const lastHistoryIndexBeforeStart =
      this._computedHistory.findIndex((hist) => {
        return hist[0] >= start;
      }) - 1;
    if (lastHistoryIndexBeforeStart >= 0)
      lastTimestampBeforeStart = this._computedHistory[lastHistoryIndexBeforeStart][0];
    return this.minMaxWithTimestamp(lastTimestampBeforeStart, end);
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
      const nbBuckets = Math.floor(range / this._groupByDurationMs) + (range % this._groupByDurationMs > 0 ? 1 : 0);
      startHistory = new Date(end.getTime() - (nbBuckets + 1) * this._groupByDurationMs);
    }
    if (!this._entityState || this._updating) return false;
    this._updating = true;

    if (this._config.ignore_history) {
      let currentState: null | number | string = null;
      if (this._config.attribute) {
        currentState = this._entityState.attributes?.[this._config.attribute];
      } else {
        currentState = this._entityState.state;
      }
      if (this._config.transform) {
        currentState = this._applyTransform(currentState, this._entityState);
      }
      let stateParsed: number | null = parseFloat(currentState as string);
      stateParsed = !Number.isNaN(stateParsed) ? stateParsed : null;
      this._computedHistory = [[new Date(this._entityState.last_updated).getTime(), stateParsed]];
      this._updating = false;
      return true;
    }

    let history: EntityEntryCache | undefined = undefined;

    if (this._config.data_generator) {
      history = await this._generateData(start, end);
    } else {
      this._realStart = new Date(start);
      this._realEnd = new Date(end);

      let skipInitialState = false;

      history = this._cache ? await this._getCache(this._entityID, this._useCompress) : undefined;

      if (history && history.span === this._graphSpan) {
        const currDataIndex = history.data.findIndex(
          (item) => item && new Date(item[0]).getTime() > startHistory.getTime(),
        );
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
      const usableCache = !!(
        history &&
        history.data &&
        history.data.length !== 0 &&
        history.data[history.data.length - 1]
      );

      // if data in cache, get data from last data's time + 1ms
      const fetchStart = usableCache
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new Date(history!.data[history!.data.length - 1][0] + 1)
        : new Date(startHistory.getTime() + (this._config.group_by.func !== 'raw' ? 0 : -1));
      const fetchEnd = end;

      let newStateHistory: EntityCachePoints = [];
      let updateGraphHistory = false;

      if (this._config.statistics) {
        const newHistory = await this._fetchStatistics(fetchStart, fetchEnd, this._config.statistics.period);
        if (newHistory && newHistory.length > 0) {
          updateGraphHistory = true;
          let lastNonNull: number | null = null;
          if (history && history.data && history.data.length > 0) {
            lastNonNull = history.data[history.data.length - 1][1];
          }
          newStateHistory = newHistory.map((item) => {
            let stateParsed: number | null = null;
            [lastNonNull, stateParsed] = this._transformAndFill(
              item[this._config.statistics?.type || DEFAULT_STATISTICS_TYPE],
              item,
              lastNonNull,
            );

            let displayDate: Date | null = null;
            const startDate = new Date(item.start);
            if (!this._config.statistics?.align || this._config.statistics?.align === 'middle') {
              if (this._config.statistics?.period === '5minute') {
                displayDate = new Date(startDate.getTime() + 150000); // 2min30s
              } else if (!this._config.statistics?.period || this._config.statistics.period === 'hour') {
                displayDate = new Date(startDate.getTime() + 1800000); // 30min
              } else if (this._config.statistics.period === 'day') {
                displayDate = new Date(startDate.getTime() + 43200000); // 12h
              } else {
                displayDate = new Date(startDate.getTime() + 1296000000); // 15d
              }
            } else if (this._config.statistics.align === 'start') {
              displayDate = new Date(item.start);
            } else {
              displayDate = new Date(item.end);
            }

            return [displayDate.getTime(), !Number.isNaN(stateParsed) ? stateParsed : null];
          });
        }
      } else {
        const newHistory = await this._fetchRecent(
          fetchStart,
          fetchEnd,
          this._config.attribute || this._config.transform ? false : skipInitialState,
        );
        if (newHistory && newHistory[0] && newHistory[0].length > 0) {
          updateGraphHistory = true;
          /*
          hack because HA doesn't return anything if skipInitialState is false
          when retrieving for attributes so we retrieve it and we remove it.
          */
          if ((this._config.attribute || this._config.transform) && skipInitialState) {
            newHistory[0].shift();
          }
          let lastNonNull: number | null = null;
          if (history && history.data && history.data.length > 0) {
            lastNonNull = history.data[history.data.length - 1][1];
          }
          newStateHistory = newHistory[0].map((item) => {
            let currentState: unknown = null;
            if (this._config.attribute) {
              if (item.attributes && item.attributes[this._config.attribute] !== undefined) {
                currentState = item.attributes[this._config.attribute];
              }
            } else {
              currentState = item.state;
            }
            let stateParsed: number | null = null;
            [lastNonNull, stateParsed] = this._transformAndFill(currentState, item, lastNonNull);

            if (this._config.attribute) {
              return [new Date(item.last_updated).getTime(), !Number.isNaN(stateParsed) ? stateParsed : null];
            } else {
              return [new Date(item.last_changed).getTime(), !Number.isNaN(stateParsed) ? stateParsed : null];
            }
          });
        }
      }

      if (updateGraphHistory) {
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
          await this._setCache(this._entityID, history, this._useCompress).catch((err) => {
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
      const res: EntityCachePoints = this._dataBucketer(history, moment.range(startHistory, end)).map((bucket) => {
        return [bucket.timestamp, this._func(bucket.data)];
      });
      if ([undefined, 'line', 'area'].includes(this._config.type)) {
        while (res.length > 0 && res[0][1] === null) res.shift();
      }
      this._computedHistory = res;
    } else {
      this._computedHistory = history.data;
    }
    this._updating = false;
    return true;
  }

  private _transformAndFill(
    currentState: unknown,
    item: HassHistoryEntry | StatisticValue,
    lastNonNull: number | null,
  ): [number | null, number | null] {
    if (this._config.transform) {
      currentState = this._applyTransform(currentState, item);
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
    return [lastNonNull, stateParsed];
  }

  private _applyTransform(value: unknown, historyItem: HassHistoryEntry | StatisticValue): number | null {
    return new Function('x', 'hass', 'entity', `'use strict'; ${this._config.transform}`).call(
      this,
      value,
      this._hass,
      historyItem,
    );
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
    url += '&significant_changes_only=0';
    return this._hass?.callApi('GET', url);
  }

  private async _generateData(start: Date, end: Date): Promise<EntityEntryCache> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    let data;
    try {
      const datafn = new AsyncFunction(
        'entity',
        'start',
        'end',
        'hass',
        'moment',
        `'use strict'; ${this._config.data_generator}`,
      );
      data = await datafn(this._entityState, start, end, this._hass, moment);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
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

  private async _fetchStatistics(
    start: Date | undefined,
    end: Date | undefined,
    period: StatisticsPeriod = DEFAULT_STATISTICS_PERIOD,
  ): Promise<StatisticValue[] | undefined> {
    const statistics = await this._hass?.callWS<Statistics>({
      type: 'recorder/statistics_during_period',
      start_time: start?.toISOString(),
      end_time: end?.toISOString(),
      statistic_ids: [this._entityID],
      period,
    });
    if (statistics && this._entityID in statistics) {
      return statistics[this._entityID];
    }
    return undefined;
  }

  private _dataBucketer(history: EntityEntryCache, timeRange: DateRange): HistoryBuckets {
    const ranges = Array.from(timeRange.reverseBy('milliseconds', { step: this._groupByDurationMs })).reverse();
    // const res: EntityCachePoints[] = [[]];
    const buckets: HistoryBuckets = [];
    ranges.forEach((range, index) => {
      buckets[index] = { timestamp: range.valueOf(), data: [] };
    });
    history?.data.forEach((entry) => {
      buckets.some((bucket, index) => {
        if (bucket.timestamp > entry[0] && index > 0) {
          if (entry[0] >= buckets[index - 1].timestamp) {
            buckets[index - 1].data.push(entry);
            return true;
          }
        }
        return false;
      });
    });
    let lastNonNullBucketValue: number | null = null;
    const now = new Date().getTime();
    buckets.forEach((bucket, index) => {
      if (bucket.data.length === 0) {
        if (this._config.group_by.fill === 'last' && (bucket.timestamp <= now || this._config.data_generator)) {
          bucket.data[0] = [bucket.timestamp, lastNonNullBucketValue];
        } else if (this._config.group_by.fill === 'zero' && (bucket.timestamp <= now || this._config.data_generator)) {
          bucket.data[0] = [bucket.timestamp, 0];
        } else if (this._config.group_by.fill === 'null') {
          bucket.data[0] = [bucket.timestamp, null];
        }
      } else {
        lastNonNullBucketValue = bucket.data.slice(-1)[0][1];
      }
      if (this._config.group_by.start_with_last) {
        if (index > 0) {
          const prevBucketData = buckets[index - 1].data;
          bucket.data.unshift([bucket.timestamp, prevBucketData[prevBucketData.length - 1][1]]);
        } else {
          const firstIndexAfter = history.data.findIndex((entry) => {
            if (entry[0] > bucket.timestamp) return true;
            return false;
          });
          if (firstIndexAfter > 0) {
            bucket.data.unshift([bucket.timestamp, history.data[firstIndexAfter - 1][1]]);
          }
        }
      }
    });
    buckets.shift();
    buckets.pop();
    // Remove nulls at the end
    while (
      buckets.length > 0 &&
      (buckets[buckets.length - 1].data.length === 0 ||
        (buckets[buckets.length - 1].data.length === 1 && buckets[buckets.length - 1].data[0][1] === null))
    ) {
      buckets.pop();
    }
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
    if (itemsDup.length === 0) return null;
    if (itemsDup.length === 1) return itemsDup[0][1];
    const mid = Math.floor((itemsDup.length - 1) / 2);
    if (itemsDup.length % 2 === 1) return itemsDup[mid][1];
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
