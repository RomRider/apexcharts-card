import { ChartCardExternalConfig } from '../types-config';
import { HaFormSchema, SEL_FALSE, SEL_TRUE, SEL_UNDEFINED } from './types';

// ── Multi-type select conversion ──
// Selects can only hold strings. For fields whose runtime type is a union of
// boolean | string | undefined, encode booleans/undefined with sentinels so the
// round-trip preserves type.

export type SelectMixed = boolean | string | number | undefined | null;

export function toSelectValue(value: SelectMixed): string {
  if (value === true) return SEL_TRUE;
  if (value === false) return SEL_FALSE;
  if (value === undefined || value === null) return SEL_UNDEFINED;
  return String(value);
}

export function fromSelectValue(str: string | undefined): boolean | string | undefined {
  if (str === undefined || str === SEL_UNDEFINED || str === '') return undefined;
  if (str === SEL_TRUE) return true;
  if (str === SEL_FALSE) return false;
  return str;
}

// ── stroke_dash conversion ──

export function parseStrokeDash(val: string | undefined): number | number[] | undefined {
  if (val === undefined || val === null) return undefined;
  const trimmed = String(val).trim();
  if (trimmed === '') return undefined;
  if (trimmed.includes(',')) {
    const arr = trimmed
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n));
    return arr.length > 0 ? arr : undefined;
  }
  const n = Number(trimmed);
  return isNaN(n) ? undefined : n;
}

export function serializeStrokeDash(val: number | number[] | undefined): string {
  if (val === undefined || val === null) return '';
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

// ── Label & helper text computation ──

const LABEL_MAP: Record<string, string> = {
  chart_type: 'Chart Type',
  graph_span: 'X Axis Span',
  stacked: 'Stacked',
  update_interval: 'Update Interval',
  update_delay: 'Update Delay',
  layout: 'Layout',
  section_mode: 'Section Mode',
  locale: 'Locale',
  hours_12: '12-Hour Format',
  entity: 'Entity',
  name: 'Name',
  type: 'Type',
  color: 'Color',
  opacity: 'Opacity',
  curve: 'Curve',
  stroke_width: 'Stroke Width',
  stroke_dash: 'Stroke Dash',
  extend_to: 'Extend To',
  invert: 'Invert',
  fill_raw: 'Fill Raw',
  transform: 'Transform',
  data_generator: 'Data Generator',
  float_precision: 'Float Precision',
  attribute: 'Attribute',
  unit: 'Unit',
  offset: 'Offset',
  time_delta: 'Time Delta',
  min: 'Min',
  max: 'Max',
  yaxis_id: 'Y-Axis ID',
  stack_group: 'Stack Group',
  duration: 'Duration',
  func: 'Function',
  fill: 'Fill',
  start_with_last: 'Start With Last',
  period: 'Period',
  align: 'Align',
  show: 'Show',
  title: 'Title',
  floating: 'Floating',
  show_states: 'Show States',
  colorize_states: 'Colorize States',
  standard_format: 'Standard Format',
  disable_actions: 'Disable Actions',
  label: 'Label',
  loading: 'Loading Spinner',
  last_updated: 'Last Updated',
  version: 'Show Version',
  id: 'Name',
  axis: 'Axis',
  opposite: 'Opposite',
  decimals: 'Decimals',
  align_to: 'Align To',
  cache: 'Enable Cache',
  selection_span: 'Selection Span',
  color_threshold: 'Color Threshold',
  disable_config_validation: 'Disable Config Validation',
  hidden_by_default: 'Hidden by Default',
  brush: 'Brush',
  in_header: 'In Header',
  in_legend: 'In Legend',
  legend_value: 'Legend Value',
  in_chart: 'In Chart',
  name_in_header: 'Name in Header',
  null_in_header: 'Null in Header',
  zero_in_header: 'Zero in Header',
  header_color_threshold: 'Header Color Threshold',
  as_duration: 'As Duration',
  extremas: 'Extremas',
  datalabels: 'Data Labels',
  in_brush: 'In Brush',
  offset_in_name: 'Offset in Name',
  start: 'Start',
  end: 'End',
  group_by: 'Group By',
  statistics: 'Statistics',
  value: 'Value',
  tap_action: 'Tap Action',
  hold_action: 'Hold Action',
  double_tap_action: 'Double Tap Action',
  action: 'Action',
  service: 'Service',
  service_data: 'Service Data',
  navigation_path: 'Navigation Path',
  url_path: 'URL',
  haptic: 'Haptic Feedback',
  confirmation: 'Confirmation',
  text: 'Text',
  experimental: 'Experimental',
  header: 'Header',
  now: 'Now Marker',
  appearance: 'Appearance',
  visibility: 'Visibility',
  data_processing: 'Data Processing',
  advanced: 'Advanced',
};

export function computeLabel(schema: HaFormSchema): string {
  return LABEL_MAP[schema.name] || schema.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const HELPER_MAP: Record<string, string> = {
  graph_span: 'How much time the x-axis covers (the visible time window). Examples: 1h, 12h, 7d, 30d. Defaults to 24h.',
  update_interval: 'e.g. 1min, 5min, 1h. Leave empty for state-based updates',
  update_delay: 'Default: 1500ms. Increase if last state not shown',
  locale: 'e.g. en, fr, de. Defaults to HA setting',
  offset: 'e.g. -1d, +6h',
  time_delta: 'e.g. -30min, +2h',
  duration: 'e.g. 1h, 30min, 1d',
  transform: 'JS expression. Use `x` for the value (e.g. `return x / 1000;`)',
  data_generator: 'JS function body. Available: entity, start, end, hass',
  stroke_dash: 'Number or comma-separated (e.g. 5,3,2)',
  selection_span: 'e.g. 6h. Default: 1/4 of graph_span',
  color: 'CSS color, var, or named color',
  attribute: 'Attribute name to use as value, if not the state',
  unit: 'Override unit of measurement',
  float_precision: 'Decimal places when displaying values',
  section_mode: 'Enable when used in HA sections view',
  id: 'Identifier referenced by series to bind to this axis (e.g. "left", "kwh").',
  axis: 'Which side of the chart this axis is drawn on.',
  align_to: 'Force Y-axis ticks to align to this value',
  selection_span_text: 'e.g. 6h. Default: 1/4 of graph_span',
};

export function computeHelper(schema: HaFormSchema): string {
  if (schema.helper) return schema.helper;
  return HELPER_MAP[schema.name] || '';
}

// ── Duration validation ──

const DURATION_RE =
  /^\d+(\.\d+)?\s*(ms|milliseconds?|s|sec|seconds?|m|min|minutes?|h|hours?|d|days?|w|weeks?)(\s*\d+(\.\d+)?\s*(ms|milliseconds?|s|sec|seconds?|m|min|minutes?|h|hours?|d|days?|w|weeks?))*$/i;

export function isValidDuration(val: string | undefined): boolean {
  if (!val || String(val).trim() === '') return true;
  return DURATION_RE.test(String(val).trim());
}

export function isValidOffset(val: string | undefined): boolean {
  if (!val || String(val).trim() === '') return true;
  const t = String(val).trim();
  if (!/^[+-]/.test(t)) return false;
  return isValidDuration(t.substring(1));
}

// Y-axis min/max accepts: number, "auto", "~5" (soft), "|5|" (absolute)
export function isValidYaxisLimit(val: string | undefined): boolean {
  if (val === undefined || val === null) return true;
  const t = String(val).trim();
  if (t === '' || t === 'auto') return true;
  if (/^~-?\d+(\.\d+)?$/.test(t)) return true;
  if (/^\|-?\d+(\.\d+)?\|$/.test(t)) return true;
  return !isNaN(Number(t));
}

// ── Default factories ──

export function newSeriesConfig(): { entity: string } {
  return { entity: '' };
}

export function newYAxisConfig(): { id: string; show: boolean } {
  return { id: '', show: true };
}

// ── Immutable updates ──

export function updateConfig(
  config: ChartCardExternalConfig,
  updates: Partial<ChartCardExternalConfig>,
): ChartCardExternalConfig {
  return { ...config, ...updates };
}

export function updateNestedConfig<K extends keyof ChartCardExternalConfig>(
  config: ChartCardExternalConfig,
  key: K,
  updates: Record<string, unknown>,
): ChartCardExternalConfig {
  const current = (config[key] as unknown as Record<string, unknown>) || {};
  return {
    ...config,
    [key]: { ...current, ...updates },
  };
}

// Strip keys whose value is undefined/empty-string — keeps the YAML output tidy.
export function pruneEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && v === '') continue;
    out[k] = v;
  }
  return out as Partial<T>;
}
