import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { editorStyles } from '../styles';
import { ActionConfig } from '../../types-config';
import { HaFormSchema } from '../types';
import { computeHelper, computeLabel } from '../helpers';

const ACTION_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'more-info', label: 'More Info' },
  { value: 'toggle', label: 'Toggle' },
  { value: 'toggle-menu', label: 'Toggle Menu' },
  { value: 'call-service', label: 'Call Service' },
  { value: 'navigate', label: 'Navigate' },
  { value: 'url', label: 'URL' },
  { value: 'none', label: 'None' },
  { value: 'fire-dom-event', label: 'Fire DOM Event' },
];

const HAPTIC_OPTIONS = [
  { value: '', label: '(none)' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'failure', label: 'Failure' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'selection', label: 'Selection' },
];

interface FormData {
  action?: string;
  service?: string;
  navigation_path?: string;
  url_path?: string;
  entity?: string;
  haptic?: string;
  confirmation_text?: string;
}

@customElement('apexcharts-card-action-editor')
export class ApexChartsCardActionEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public action?: ActionConfig;
  @property({ type: String }) public label = 'Action';

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _formData(): FormData {
    const a = (this.action || {}) as ActionConfig & {
      service?: string;
      navigation_path?: string;
      url_path?: string;
      entity?: string;
      haptic?: string;
    };
    const action = a.action || 'default';
    return {
      action,
      service: a.service,
      navigation_path: a.navigation_path,
      url_path: a.url_path,
      entity: a.entity,
      haptic: a.haptic || '',
      confirmation_text: typeof a.confirmation === 'object' ? a.confirmation?.text || '' : '',
    };
  }

  private _schema(): HaFormSchema[] {
    const data = this._formData();
    const schema: HaFormSchema[] = [
      {
        name: 'action',
        selector: { select: { mode: 'dropdown', options: ACTION_OPTIONS } },
      },
    ];

    if (data.action === 'more-info') {
      schema.push({ name: 'entity', selector: { entity: {} } });
    }
    if (data.action === 'call-service') {
      schema.push({
        name: 'service',
        selector: { text: {} },
        helper: 'e.g. light.turn_on',
      } as HaFormSchema);
    }
    if (data.action === 'navigate') {
      schema.push({
        name: 'navigation_path',
        selector: { text: {} },
        helper: 'e.g. /lovelace/0',
      } as HaFormSchema);
    }
    if (data.action === 'url') {
      schema.push({
        name: 'url_path',
        selector: { text: { type: 'url' } },
      });
    }

    if (data.action && data.action !== 'default' && data.action !== 'none') {
      schema.push({
        name: 'haptic',
        selector: { select: { mode: 'dropdown', options: HAPTIC_OPTIONS } },
      });
      schema.push({
        name: 'confirmation_text',
        selector: { text: {} },
        helper: 'Optional confirmation prompt text',
      } as HaFormSchema);
    }

    return schema;
  }

  private _onValueChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as FormData;
    const actionType = data.action;

    let next: ActionConfig | undefined;

    if (!actionType || actionType === 'default') {
      next = undefined;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prev = (this.action || {}) as any;
      const prevType: string | undefined = prev.action;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const merged: any = { ...prev };

      // If the action type changed, drop keys that belonged to the old type
      // (so a stale `service` doesn't linger on a `navigate` action).
      if (prevType && prevType !== actionType) {
        const TYPE_KEYS: Record<string, string[]> = {
          'call-service': ['service'],
          navigate: ['navigation_path'],
          url: ['url_path'],
          'more-info': ['entity'],
        };
        const oldKeys = TYPE_KEYS[prevType] || [];
        for (const k of oldKeys) delete merged[k];
      }

      merged.action = actionType;

      // Overwrite only the keys that belong to the chosen action type.
      if (actionType === 'call-service') {
        merged.service = data.service || '';
      } else if (actionType === 'navigate') {
        merged.navigation_path = data.navigation_path || '';
      } else if (actionType === 'url') {
        merged.url_path = data.url_path || '';
      } else if (actionType === 'more-info') {
        if (data.entity) {
          merged.entity = data.entity;
        } else {
          delete merged.entity;
        }
      }

      // Haptic: empty string clears it, otherwise set.
      if (data.haptic === '' || data.haptic === undefined) {
        delete merged.haptic;
      } else {
        merged.haptic = data.haptic;
      }

      // Confirmation: preserve non-text confirmation state (boolean true, or
      // object with keys beyond `text`) when the user hasn't typed text.
      const prevConfirmation = prev.confirmation;
      if (data.confirmation_text) {
        if (prevConfirmation && typeof prevConfirmation === 'object') {
          merged.confirmation = { ...prevConfirmation, text: data.confirmation_text };
        } else {
          merged.confirmation = { text: data.confirmation_text };
        }
      } else {
        // No text typed. Keep confirmation only if it carries other meaning.
        if (prevConfirmation === true) {
          merged.confirmation = true;
        } else if (
          prevConfirmation &&
          typeof prevConfirmation === 'object' &&
          Object.keys(prevConfirmation).some((k) => k !== 'text')
        ) {
          const rest: Record<string, unknown> = { ...(prevConfirmation as Record<string, unknown>) };
          delete rest.text;
          merged.confirmation = rest;
        } else {
          delete merged.confirmation;
        }
      }

      next = merged as ActionConfig;
    }

    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  };

  protected render(): TemplateResult {
    if (!this.hass) return html``;
    const data = this._formData();
    if (data.action === 'default') {
      // Use a single dropdown form when no action is configured.
      return html`
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${this._schema()}
          .computeLabel=${(s: HaFormSchema) => (s.name === 'action' ? this.label : computeLabel(s))}
          .computeHelper=${computeHelper}
          @value-changed=${this._onValueChanged}
        ></ha-form>
      `;
    }
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this._schema()}
        .computeLabel=${(s: HaFormSchema) => (s.name === 'action' ? this.label : computeLabel(s))}
        .computeHelper=${computeHelper}
        @value-changed=${this._onValueChanged}
      ></ha-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-action-editor': ApexChartsCardActionEditor;
  }
}
