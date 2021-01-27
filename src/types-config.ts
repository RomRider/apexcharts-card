export interface ChartCardExternalConfig {
  type: 'custom:apexcharts-card';
  update_interval?: string;
  series: ChartCardSeriesExternalConfig[];
  graph_span?: string;
  span?: ChartCardSpanExtConfig;
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

export interface ChartCardSpanExtConfig {
  start?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  end?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  offset?: string;
}
export interface ChartCardSeriesExternalConfig {
  entity: string;
  name?: string;
  type?: 'line' | 'column' | 'area';
  color?: string;
  curve?: 'smooth' | 'straight' | 'stepline';
  extend_to_end?: boolean;
  unit?: string;
  group_by?: {
    duration?: string;
    func?: GroupByFunc;
    fill?: GroupByFill;
  };
}

export type GroupByFill = 'null' | 'last' | 'zero';

export type GroupByFunc = 'raw' | 'avg' | 'min' | 'max' | 'last' | 'first' | 'sum' | 'median' | 'delta';

export interface ChartCardHeaderExternalConfig {
  show?: boolean;
  floating?: boolean;
  title?: string;
  show_states?: boolean;
  colorize_states?: boolean;
}
