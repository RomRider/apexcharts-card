export interface ChartCardExternalConfig {
  type: 'custom:apexcharts-card';
  chart_type?: 'scatter';
  update_interval?: string;
  series: ChartCardSeriesExternalConfig[];
  graph_span?: string;
  span?: ChartCardSpanExtConfig;
  y_axis_precision?: number;
  show?: {
    loading?: boolean;
  };
  cache?: boolean;
  stacked?: boolean;
  layout?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apex_config?: any;
  header?: ChartCardHeaderExternalConfig;
  // Support to define style (card-mod or picture-entity)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
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
  invert?: boolean;
  data_generator?: string;
  float_precision?: number;
  offset?: string;
  show?: {
    as_duration?: ChartCardPrettyTime;
    legend_value?: boolean;
  };
  group_by?: {
    duration?: string;
    func?: GroupByFunc;
    fill?: GroupByFill;
  };
}

export type ChartCardPrettyTime = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export type GroupByFill = 'null' | 'last' | 'zero';

export type GroupByFunc = 'raw' | 'avg' | 'min' | 'max' | 'last' | 'first' | 'sum' | 'median' | 'delta';

export interface ChartCardHeaderExternalConfig {
  show?: boolean;
  floating?: boolean;
  title?: string;
  show_states?: boolean;
  colorize_states?: boolean;
}
