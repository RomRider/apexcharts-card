import { ApexOptions } from 'apexcharts';
import {
  ChartCardExternalConfig,
  ChartCardSeriesExternalConfig,
  ChartCardSeriesShowConfigExt,
  ChartCardYAxisExternal,
  GroupByFill,
  GroupByFunc,
} from './types-config';

export interface ChartCardConfig extends ChartCardExternalConfig {
  series: ChartCardSeriesConfig[];
  series_in_graph: ChartCardSeriesConfig[];
  series_in_brush: ChartCardSeriesConfig[];
  graph_span: string;
  cache: boolean;
  useCompress: boolean;
  apex_config?: ApexOptions;
  yaxis?: ChartCardYAxis[];
}

export interface ChartCardSeriesConfig extends ChartCardSeriesExternalConfig {
  index: number;
  group_by: {
    duration: string;
    func: GroupByFunc;
    fill: GroupByFill;
    start_with_last?: boolean;
  };
  show: ChartCardSeriesShowConfig;
  ignore_history: boolean;
}

export interface ChartCardSeriesShowConfig extends ChartCardSeriesShowConfigExt {
  legend_value: boolean;
  in_header: boolean | 'raw' | 'before_now' | 'after_now';
  unit: boolean | 'before_value';
  name_in_header: boolean;
  null_in_header: boolean;
  zero_in_header: boolean;
  in_chart: boolean;
  offset_in_name: boolean;
}

export interface EntityEntryCache {
  span: number;
  card_version: string;
  last_fetched: Date;
  data: EntityCachePoints;
}

export type EntityCachePoints = Array<HistoryPoint>;

export type HistoryPoint = [number, number | null];

export interface Statistics {
  [statisticId: string]: StatisticValue[];
}

export interface StatisticValue {
  statistic_id: string;
  start: string;
  end: string;
  last_reset: string | null;
  max: number | null;
  mean: number | null;
  min: number | null;
  sum: number | null;
  state: number | null;
  change: number | null;
}

export type HassHistory = Array<[HassHistoryEntry] | undefined>;

export interface HassHistoryEntry {
  last_updated: string;
  state: string;
  last_changed: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: any;
}

export interface HistoryBucket {
  timestamp: number;
  data: EntityCachePoints;
}

export type HistoryBuckets = Array<HistoryBucket>;

export interface ChartCardYAxis extends ChartCardYAxisExternal {
  series_id?: number[];
  min_type?: minmax_type;
  max_type?: minmax_type;
}

export enum minmax_type {
  AUTO,
  FIXED,
  SOFT,
  ABSOLUTE,
}

export interface ActionHandlerOptions {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
  disabled?: boolean;
}

export interface ActionHandlerDetail {
  action: 'hold' | 'tap' | 'double_tap';
}
