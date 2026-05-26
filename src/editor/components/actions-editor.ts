import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ActionsConfig, ActionConfig } from '../../types-config';
import { editorStyles } from '../styles';
import './action-editor';

@customElement('apexcharts-card-actions-editor')
export class ApexChartsCardActionsEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public actions?: ActionsConfig;
  @property({ attribute: false }) public showEntityOverride = true;

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _update(key: keyof ActionsConfig, value: ActionConfig | string | undefined): void {
    const next: ActionsConfig = { ...(this.actions || {}) };
    if (value === undefined || value === '') {
      delete next[key];
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (next as any)[key] = value;
    }
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: Object.keys(next).length > 0 ? next : undefined },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render(): TemplateResult {
    if (!this.hass) return html``;
    const a = this.actions || {};
    return html`
      <div class="section">
        <apexcharts-card-action-editor
          .hass=${this.hass}
          .action=${a.tap_action}
          label="Tap Action"
          @value-changed=${(ev: CustomEvent) => {
            ev.stopPropagation();
            this._update('tap_action', ev.detail.value);
          }}
        ></apexcharts-card-action-editor>
        <apexcharts-card-action-editor
          .hass=${this.hass}
          .action=${a.hold_action}
          label="Hold Action"
          @value-changed=${(ev: CustomEvent) => {
            ev.stopPropagation();
            this._update('hold_action', ev.detail.value);
          }}
        ></apexcharts-card-action-editor>
        <apexcharts-card-action-editor
          .hass=${this.hass}
          .action=${a.double_tap_action}
          label="Double-tap Action"
          @value-changed=${(ev: CustomEvent) => {
            ev.stopPropagation();
            this._update('double_tap_action', ev.detail.value);
          }}
        ></apexcharts-card-action-editor>
        ${this.showEntityOverride
          ? html`
              <ha-form
                .hass=${this.hass}
                .data=${{ entity: a.entity || '' }}
                .schema=${[
                  {
                    name: 'entity',
                    selector: { entity: {} },
                  } as unknown as import('../types').HaFormSchema,
                ]}
                .computeLabel=${(s: { name: string }) =>
                  s.name === 'entity' ? 'Entity Override (optional)' : s.name}
                @value-changed=${(ev: CustomEvent) => {
                  ev.stopPropagation();
                  const v = (ev.detail.value as { entity?: string }).entity;
                  this._update('entity', v || undefined);
                }}
              ></ha-form>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-actions-editor': ApexChartsCardActionsEditor;
  }
}
