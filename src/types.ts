import { ApexOptions } from 'apexcharts';
import { ChartCardExternalConfig, ChartCardSeriesExternalConfig, GroupByFunc } from './types-config';

export interface ChartCardConfig extends ChartCardExternalConfig {
  series: ChartCardSeriesConfig[];
  hours_to_show: number;
  cache: boolean;
  useCompress: boolean;
  apex_config?: ApexOptions;
}

export interface ChartCardSeriesConfig extends ChartCardSeriesExternalConfig {
  index: number;
  group_by: {
    duration: string;
    func: GroupByFunc;
  };
}

export interface EntityEntryCache {
  hours_to_show: number;
  last_fetched: Date;
  data: EntityCachePoints;
}

export type EntityCachePoints = Array<[number, number | null] | undefined>;

export type HassHistory = Array<[HassHistoryEntry] | undefined>;

export interface HassHistoryEntry {
  last_updated: string;
  state: string;
  last_changed: string;
}

export interface HistoryBucket {
  timestamp: number;
  data: EntityCachePoints;
}

export type HistoryBuckets = Array<HistoryBucket>;
