import Moment from 'moment';
import { extendMoment } from 'moment-range';

export const moment = extendMoment(Moment);
export const ONE_HOUR = 1000 * 3600;

export const DEFAULT_HOURS_TO_SHOW = 24;
export const DEFAULT_SERIE_TYPE = 'line';
export const DEFAULT_DURATION = '1h';
export const DEFAULT_FUNC = 'raw';
