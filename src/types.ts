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
}

export interface ChartCardSeriesExternalConfig {
  entity: string;
  name?: string;
  type: 'line' | 'bar';
}

export interface ChartCardSeriesConfig extends ChartCardSeriesExternalConfig {
  index: number;
}

export interface EntityEntryCache {
  hours_to_show: number;
  last_fetched: Date;
  data: [number, number][];
}
