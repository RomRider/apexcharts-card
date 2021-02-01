import Moment from 'moment';
import { extendMoment } from 'moment-range';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(Moment);
export const moment = extendMoment(Moment);
export const ONE_HOUR = 1000 * 3600;
export const HOUR_24 = ONE_HOUR * 24;

export const DEFAULT_GRAPH_SPAN = '24h';
export const DEFAULT_SERIE_TYPE = 'line';
export const DEFAULT_DURATION = '1h';
export const DEFAULT_FUNC = 'raw';
export const DEFAULT_GROUP_BY_FILL = 'last';
export const DEFAULT_SHOW_LEGEND_VALUE = true;
export const DEFAULT_SHOW_IN_HEADER = true;
export const DEFAULT_SHOW_IN_CHART = true;

export const DEFAULT_FLOAT_PRECISION = 1;

export const DEFAULT_COLORS = [
  'var(--accent-color)',
  '#3498db',
  '#e74c3c',
  '#9b59b6',
  '#f1c40f',
  '#2ecc71',
  '#1abc9c',
  '#34495e',
  '#e67e22',
  '#7f8c8d',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
];

export const NO_VALUE = 'N/A';
export const TIMESERIES_TYPES = ['line', 'scatter', undefined];

export const DEFAULT_MIN = 0;
export const DEFAULT_MAX = 100;

export const DEFAULT_UPDATE_DELAY = 1500;
