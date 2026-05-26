import { HaFormSchema } from '../types';

export const EXPERIMENTAL_BOOL_FIELDS = [
  'color_threshold',
  'hidden_by_default',
  'brush',
  'disable_config_validation',
] as const;

export const BRUSH_SCHEMA: HaFormSchema[] = [
  { name: 'selection_span', selector: { text: {} } },
];

// Locale text input; section_mode rendered separately via bool-grid
export const BEHAVIOR_SCHEMA: HaFormSchema[] = [{ name: 'locale', selector: { text: {} } }];
