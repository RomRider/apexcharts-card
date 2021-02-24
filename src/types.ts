import { ApexOptions } from 'apexcharts';
import {
  ChartCardExternalConfig,
  ChartCardPrettyTime,
  ChartCardSeriesExternalConfig,
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
}

export interface ChartCardSeriesConfig extends ChartCardSeriesExternalConfig {
  index: number;
  group_by: {
    duration: string;
    func: GroupByFunc;
    fill: GroupByFill;
  };
  show: {
    as_duration?: ChartCardPrettyTime;
    legend_value: boolean;
    in_header: boolean | 'raw' | 'before_now' | 'after_now';
    header_color_threshold?: boolean;
    in_chart: boolean;
    datalabels?: boolean | 'total';
    hidden_by_default?: boolean;
    extremas?: boolean | 'time';
    in_brush?: boolean;
  };
}

export interface EntityEntryCache {
  span: number;
  card_version: string;
  last_fetched: Date;
  data: EntityCachePoints;
}

export type EntityCachePoints = Array<HistoryPoint>;

export type HistoryPoint = [number, number | null];

export type HassHistory = Array<[HassHistoryEntry] | undefined>;

export interface HassHistoryEntry {
  last_updated: string;
  state: string;
  last_changed: string;
  attributes?: never;
}

export interface HistoryBucket {
  timestamp: number;
  data: EntityCachePoints;
}

export type HistoryBuckets = Array<HistoryBucket>;
