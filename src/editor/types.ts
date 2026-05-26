import { LitElement } from 'lit';
import { HomeAssistant } from 'custom-card-helpers';

// ── ha-form schema types ──

export interface HaFormSchema {
  name: string;
  required?: boolean;
  type?: 'grid' | 'expandable' | 'constant';
  flatten?: boolean;
  column_min_width?: string;
  title?: string;
  schema?: HaFormSchema[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector?: Record<string, any>;
  default?: unknown;
  helper?: string;
}

export interface EditorTab {
  label: string;
  icon: string;
}

export const EDITOR_TABS: EditorTab[] = [
  { label: 'General', icon: 'mdi:cog' },
  { label: 'Series', icon: 'mdi:chart-line' },
  { label: 'Display', icon: 'mdi:palette' },
  { label: 'Y-Axis', icon: 'mdi:axis-y-arrow' },
  { label: 'Advanced', icon: 'mdi:code-braces' },
];

// Sentinel values used to round-trip boolean/undefined through string selects
export const SEL_TRUE = '_true';
export const SEL_FALSE = '_false';
export const SEL_UNDEFINED = '_undefined';

// ── HA component type declarations ──

declare global {
  interface HTMLElementTagNameMap {
    'ha-form': LitElement & {
      hass?: HomeAssistant;
      data: Record<string, unknown>;
      schema: HaFormSchema[];
      computeLabel?: (schema: HaFormSchema) => string;
      computeHelper?: (schema: HaFormSchema) => string;
    };
    'ha-entity-picker': LitElement & {
      hass?: HomeAssistant;
      value?: string;
      label?: string;
      allowCustomEntity?: boolean;
      includeDomains?: string[];
    };
    'ha-yaml-editor': LitElement & {
      hass?: HomeAssistant;
      defaultValue?: unknown;
      label?: string;
      readOnly?: boolean;
    };
    'ha-icon-button': LitElement & {
      path?: string;
      label?: string;
      disabled?: boolean;
    };
    'ha-icon': LitElement & {
      icon?: string;
    };
    'ha-textfield': LitElement & {
      value?: string;
      label?: string;
      placeholder?: string;
      type?: string;
      autoValidate?: boolean;
      disabled?: boolean;
    };
    'ha-expansion-panel': LitElement & {
      header?: string;
      outlined?: boolean;
      expanded?: boolean;
      leftChevron?: boolean;
    };
    'ha-svg-icon': LitElement & { path?: string };
  }
}

export {};
