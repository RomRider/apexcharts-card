import { ApexOptions } from 'apexcharts';

export interface ChartCardConfig extends ChartCardExternalConfig {
  series: ChartCardSeriesConfig[];
  hours_to_show: number;
  cache: boolean;
  useCompress: boolean;
}

export interface ChartCardExternalConfig {
  type: 'custom:apexcharts-card';
  series: ChartCardSeriesExternalConfig[];
  hours_to_show?: number;
  cache?: boolean;
  stacked?: boolean;
  layout?: string;
  apex_config?: ApexOptions;
}

export interface ChartCardSeriesExternalConfig {
  entity: string;
  name?: string;
  type: 'line' | 'bar' | 'area';
  curve?: 'smooth' | 'straight' | 'stepline';
  extend_to_end?: boolean;
}

export interface ChartCardSeriesConfig extends ChartCardSeriesExternalConfig {
  index: number;
}

export interface EntityEntryCache {
  hours_to_show: number;
  last_fetched: Date;
  data: [number, number][];
}

export interface HassHistory {
  [index: number]: {
    last_updated: string;
    state: string;
    last_changed: string;
  }[];
}
