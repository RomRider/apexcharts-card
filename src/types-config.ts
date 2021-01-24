export interface ChartCardExternalConfig {
  type: 'custom:apexcharts-card';
  series: ChartCardSeriesExternalConfig[];
  hours_to_show?: number;
  show?: {
    loading?: boolean;
  };
  cache?: boolean;
  stacked?: boolean;
  layout?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apex_config?: any;
  header?: ChartCardHeaderExternalConfig;
}

export interface ChartCardSeriesExternalConfig {
  entity: string;
  name?: string;
  type?: 'line' | 'bar' | 'area';
  curve?: 'smooth' | 'straight' | 'stepline';
  extend_to_end?: boolean;
  unit?: string;
  group_by?: {
    duration?: string;
    func?: GroupByFunc;
  };
}

export type GroupByFunc = 'raw' | 'avg';

export interface ChartCardHeaderExternalConfig {
  show?: boolean;
  floating?: boolean;
}
