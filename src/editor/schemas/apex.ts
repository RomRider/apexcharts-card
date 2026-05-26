import { HaFormSchema } from '../types';

// ── Grid ──
export const GRID_SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'position',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: 'Default' },
              { value: 'front', label: 'Front' },
              { value: 'back', label: 'Back' },
            ],
          },
        },
      },
      { name: 'borderColor', selector: { text: {} } },
    ],
  },
];

export const GRID_BOOL_FIELDS = [
  { name: 'show', label: 'Show Grid', helper: 'Toggle the chart grid lines.' },
  { name: 'xaxis_lines_show', label: 'X-Axis Lines', helper: 'Show vertical gridlines for the x-axis.' },
  { name: 'yaxis_lines_show', label: 'Y-Axis Lines', helper: 'Show horizontal gridlines for the y-axis.' },
] as const;

// ── Legend ──
export const LEGEND_SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'position',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: 'Default' },
              { value: 'top', label: 'Top' },
              { value: 'right', label: 'Right' },
              { value: 'bottom', label: 'Bottom' },
              { value: 'left', label: 'Left' },
            ],
          },
        },
      },
      {
        name: 'horizontalAlign',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: 'Default' },
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
            ],
          },
        },
      },
    ],
  },
];

// ── Tooltip ──
export const TOOLTIP_SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'theme',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: 'Default' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ],
          },
        },
      },
      {
        name: 'x_format',
        helper: 'Date format on the tooltip header, e.g. "dd MMM HH:mm"',
        selector: { text: {} },
      },
    ],
  },
];

// ── Toolbar ──
// chart.toolbar.show, chart.toolbar.tools.{zoom,pan,download,reset,zoomin,zoomout}
export const TOOLBAR_BOOL_FIELDS = [
  { name: 'show', label: 'Show Toolbar', helper: 'Toggle the toolbar in the top-right of the chart.' },
  { name: 'tool_zoom', label: 'Zoom', helper: 'Box-zoom selection tool.' },
  { name: 'tool_pan', label: 'Pan', helper: 'Click and drag to pan the chart.' },
  { name: 'tool_download', label: 'Download', helper: 'Download as SVG/PNG/CSV.' },
  { name: 'tool_reset', label: 'Reset', helper: 'Reset zoom/pan to default.' },
] as const;

// ── Markers ──
export const MARKERS_SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'size',
        helper: 'Radius of the dot drawn at each data point (0 = no markers).',
        selector: { number: { min: 0, max: 20, step: 1, mode: 'box' } },
      },
      {
        name: 'shape',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: 'Default' },
              { value: 'circle', label: 'Circle' },
              { value: 'square', label: 'Square' },
            ],
          },
        },
      },
    ],
  },
  {
    name: 'strokeWidth',
    helper: 'Width of the ring around each marker dot.',
    selector: { number: { min: 0, max: 10, step: 1, mode: 'box' } },
  },
];

// ── Chart background / foreground ──
export const CHART_COLORS_SCHEMA: HaFormSchema[] = [
  {
    name: 'background',
    helper: 'Chart background color (CSS color, var, or named).',
    selector: { text: {} },
  },
  {
    name: 'foreColor',
    helper: 'Global text color for axis labels, legend, etc.',
    selector: { text: {} },
  },
];
