import { HaFormSchema, SEL_FALSE, SEL_TRUE, SEL_UNDEFINED } from '../types';

export const GENERAL_TOP_SCHEMA: HaFormSchema[] = [
  {
    name: 'graph_span',
    selector: { text: {} },
  },
];

// Layout select, rendered side-by-side with the `stacked` bool-grid switch.
export const LAYOUT_SCHEMA: HaFormSchema[] = [
  {
    name: 'layout',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: '', label: 'Default' },
          { value: 'minimal', label: 'Minimal' },
        ],
      },
    },
  },
];

export const GENERAL_BOTTOM_SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'update_interval', selector: { text: {} } },
      { name: 'update_delay', selector: { text: {} } },
    ],
  },
  {
    name: 'hours_12',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: SEL_UNDEFINED, label: 'Auto' },
          { value: SEL_TRUE, label: 'Yes' },
          { value: SEL_FALSE, label: 'No' },
        ],
      },
    },
  },
  {
    name: 'span',
    type: 'expandable',
    title: 'Time Span',
    schema: [
      {
        name: 'start',
        helper:
          'Anchor the graph to the start of the chosen period. e.g. "Day" makes the graph start at 00:00 today; "Hour" starts at the top of the current hour. Combine with X Axis Span to control how much is shown.',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: '(none)' },
              { value: 'minute', label: 'Minute' },
              { value: 'hour', label: 'Hour' },
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
              { value: 'isoWeek', label: 'ISO Week' },
            ],
          },
        },
      },
      {
        name: 'end',
        helper:
          'Anchor the graph to the end of the chosen period. e.g. "Day" ends at midnight tonight. Only one of Start or End may be set.',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: '(none)' },
              { value: 'minute', label: 'Minute' },
              { value: 'hour', label: 'Hour' },
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
              { value: 'isoWeek', label: 'ISO Week' },
            ],
          },
        },
      },
      {
        name: 'offset',
        helper:
          'Shift the anchored time window. Must start with + or -. e.g. "-1d" shows yesterday when Start is Day; "+6h" shifts the window forward by 6 hours.',
        selector: { text: {} },
      },
    ],
  },
];
