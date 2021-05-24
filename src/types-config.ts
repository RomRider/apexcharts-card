export interface ChartCardExternalConfig {
  type: 'custom:apexcharts-card';
  config_templates?: string[] | string;
  color_list?: string[];
  locale?: string;
  experimental?: {
    color_threshold?: boolean;
    disable_config_validation?: boolean;
    hidden_by_default?: boolean;
    brush?: boolean;
  };
  hours_12?: boolean;
  chart_type?: ChartCardChartType;
  update_interval?: string;
  update_delay?: string;
  all_series_config?: ChartCardAllSeriesExternalConfig;
  series: ChartCardSeriesExternalConfig[];
  graph_span?: string;
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
  // Support to define style (card-mod/card-mod-v3.0 or picture-entity)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  card_mod?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  view_layout?: any;
  index?: number;
  view_index?: number;
  brush?: ChartCardBrushExtConfig;
  yaxis?: ChartCardYAxisExternal[];
}

export type ChartCardChartType = 'line' | 'scatter' | 'pie' | 'donut' | 'radialBar';

export interface ChartCardBrushExtConfig {
  selection_span?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apex_config?: any;
}

export interface ChartCardSpanExtConfig {
  start?: ChartCardStartEnd;
  end?: ChartCardStartEnd;
  offset?: string;
}

export type ChartCardStartEnd = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' | 'isoWeek';

export interface ChartCardAllSeriesExternalConfig {
  entity?: string;
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
  show?: ChartCardSeriesShowConfigExt;
  group_by?: {
    duration?: string;
    func?: GroupByFunc;
    fill?: GroupByFill;
    start_with_last?: boolean;
  };
  transform?: string;
  color_threshold?: ChartCardColorThreshold[];
  yaxis_id?: string;
}

export interface ChartCardSeriesShowConfigExt {
  as_duration?: ChartCardPrettyTime;
  legend_value?: boolean;
  in_header?: boolean | 'raw' | 'before_now' | 'after_now';
  name_in_header?: boolean;
  header_color_threshold?: boolean;
  in_chart?: boolean;
  datalabels?: boolean | 'total';
  hidden_by_default?: boolean;
  extremas?: boolean | 'time';
  in_brush?: boolean;
  offset_in_name?: boolean;
}

export interface ChartCardSeriesExternalConfig extends ChartCardAllSeriesExternalConfig {
  entity: string;
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
  standard_format?: boolean;
}

export interface ChartCardColorThreshold {
  value: number;
  color?: string;
  opacity?: number;
}

export interface ChartCardYAxisExternal {
  id: string;
  show?: boolean;
  opposite?: boolean;
  min?: 'auto' | number | string;
  max?: 'auto' | number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apex_config?: any;
}
