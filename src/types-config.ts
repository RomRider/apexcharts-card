export interface ChartCardExternalConfig {
  type: 'custom:apexcharts-card';
  config_templates?: string[] | string;
  color_list?: string[];
  section_mode?: boolean;
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
  now?: {
    show?: boolean;
    color?: string;
    label?: string;
  };
  show?: {
    loading?: boolean;
    last_updated?: boolean;
    version?: boolean;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visibility?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grid_options?: any;
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

export type StatisticsPeriod = '5minute' | 'hour' | 'day' | 'week' | 'month';

export interface ChartCardAllSeriesExternalConfig {
  entity?: string;
  attribute?: string;
  name?: string;
  type?: 'line' | 'column' | 'area';
  stack_group?: string;
  color?: string;
  opacity?: number;
  curve?: 'smooth' | 'straight' | 'stepline' | 'monotoneCubic';
  stroke_width?: number;
  stroke_dash?: number | number[];
  extend_to?: false | 'end' | 'now';
  unit?: string;
  invert?: boolean;
  data_generator?: string;
  statistics?: {
    type?: 'mean' | 'max' | 'min' | 'sum' | 'state' | 'change';
    period?: StatisticsPeriod;
    align?: 'start' | 'end' | 'middle';
  };
  float_precision?: number;
  min?: number;
  max?: number;
  offset?: string;
  time_delta?: string;
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
  header_actions?: ActionsConfig;
}

export interface ActionsConfig {
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  entity?: string;
}

export interface ChartCardSeriesShowConfigExt {
  as_duration?: ChartCardPrettyTime;
  in_legend?: boolean;
  legend_value?: boolean;
  in_header?: boolean | 'raw' | 'before_now' | 'after_now';
  unit?: boolean | 'before_value';
  name_in_header?: boolean;
  null_in_header?: boolean;
  zero_in_header?: boolean;
  header_color_threshold?: boolean;
  in_chart?: boolean;
  datalabels?: boolean | 'total' | 'percent';
  hidden_by_default?: boolean;
  extremas?: boolean | 'time' | 'min' | 'max' | 'min+time' | 'max+time';
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
  disable_actions?: boolean;
  title_actions?: ActionsConfig;
}

export interface ChartCardColorThreshold {
  value: number;
  color?: string;
  opacity?: number;
}

export interface ChartCardYAxisExternal {
  id?: string;
  show?: boolean;
  opposite?: boolean;
  min?: 'auto' | number | string;
  max?: 'auto' | number | string;
  align_to?: number;
  decimals?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apex_config?: any;
}

export interface ToggleMenuActionConfig extends BaseActionConfig {
  action: 'toggle-menu';
  haptic?: HapticType;
}
export interface ToggleActionConfig extends BaseActionConfig {
  action: 'toggle';
  haptic?: HapticType;
}
export interface CallServiceActionConfig extends BaseActionConfig {
  action: 'call-service';
  service: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service_data?: any;
  haptic?: HapticType;
}
export interface NavigateActionConfig extends BaseActionConfig {
  action: 'navigate';
  navigation_path: string;
  haptic?: HapticType;
}
export interface UrlActionConfig extends BaseActionConfig {
  action: 'url';
  url_path: string;
  haptic?: HapticType;
}
export interface MoreInfoActionConfig extends BaseActionConfig {
  action: 'more-info';
  entity?: string;
  haptic?: HapticType;
}
export interface NoActionConfig extends BaseActionConfig {
  action: 'none';
  haptic?: HapticType;
}
export interface CustomActionConfig extends BaseActionConfig {
  action: 'fire-dom-event';
  haptic?: HapticType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  browser_mod?: any;
}
export interface BaseActionConfig {
  confirmation?: ConfirmationRestrictionConfig;
}

export interface ConfirmationRestrictionConfig {
  text?: string;
  exemptions?: RestrictionConfig[];
}

export interface RestrictionConfig {
  user: string;
}

export declare type HapticType = 'success' | 'warning' | 'failure' | 'light' | 'medium' | 'heavy' | 'selection';
export declare type ActionConfig =
  | ToggleActionConfig
  | CallServiceActionConfig
  | NavigateActionConfig
  | UrlActionConfig
  | MoreInfoActionConfig
  | NoActionConfig
  | CustomActionConfig
  | ToggleMenuActionConfig;
