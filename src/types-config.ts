export interface ChartCardExternalConfig {
  type: 'custom:apexcharts-card';
  experimental?: {
    color_threshold?: boolean;
    disable_config_validation?: boolean;
  };
  chart_type?: 'line' | 'scatter' | 'pie' | 'donut' | 'radialBar';
  update_interval?: string;
  update_delay?: string;
  series: ChartCardSeriesExternalConfig[];
  graph_span?: string;
  hours_12?: boolean;
  span?: ChartCardSpanExtConfig;
  y_axis_precision?: number;
  now?: {
    show?: boolean;
    color?: string;
    label?: string;
  };
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
  attribute?: string;
  name?: string;
  type?: 'line' | 'column' | 'area';
  color?: string;
  opacity?: number;
  curve?: 'smooth' | 'straight' | 'stepline';
  stroke_width?: number;
  extend_to_end?: boolean;
  unit?: string;
  invert?: boolean;
  data_generator?: string;
  float_precision?: number;
  min?: number;
  max?: number;
  offset?: string;
  fill_raw?: GroupByFill;
  show?: {
    as_duration?: ChartCardPrettyTime;
    legend_value?: boolean;
    in_header?: boolean;
    in_chart?: boolean;
    datalabels?: boolean;
  };
  group_by?: {
    duration?: string;
    func?: GroupByFunc;
    fill?: GroupByFill;
  };
  transform?: string;
  color_threshold?: ChartCardColorThreshold[];
}

export type ChartCardPrettyTime = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export type GroupByFill = 'null' | 'last' | 'zero';

export type GroupByFunc = 'raw' | 'avg' | 'min' | 'max' | 'last' | 'first' | 'sum' | 'median' | 'delta' | 'diff';

export interface ChartCardHeaderExternalConfig {
  show?: boolean;
  floating?: boolean;
  title?: string;
  show_states?: boolean;
  colorize_states?: boolean;
}

export interface ChartCardColorThreshold {
  value: number;
  color?: string;
  opacity?: number;
}
