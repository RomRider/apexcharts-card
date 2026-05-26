import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardHeaderExternalConfig, ActionsConfig } from '../../types-config';
import { computeHelper, computeLabel } from '../helpers';
import { editorStyles } from '../styles';
import { HEADER_BOOL_FIELDS, HEADER_TITLE_SCHEMA } from '../schemas/display';
import { HaFormSchema } from '../types';
import { BoolField } from './bool-grid';
import './actions-editor';
import './bool-grid';

@customElement('apexcharts-card-header-editor')
export class ApexChartsCardHeaderEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public header?: ChartCardHeaderExternalConfig;

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _fire(value: ChartCardHeaderExternalConfig | undefined): void {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: value && Object.keys(value).length > 0 ? value : undefined },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _formChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as ChartCardHeaderExternalConfig;
    const next: ChartCardHeaderExternalConfig = { ...(this.header || {}) };
    if ('title' in data) {
      if (data.title) next.title = data.title;
      else delete next.title;
    }
    this._fire(next);
  };

  private _boolChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { name, value } = ev.detail as { name: string; value: boolean };
    const next: ChartCardHeaderExternalConfig = { ...(this.header || {}) };
    if (value) (next as Record<string, unknown>)[name] = true;
    else delete (next as Record<string, unknown>)[name];
    this._fire(next);
  };

  private _titleActionsChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as ActionsConfig | undefined;
    const next: ChartCardHeaderExternalConfig = { ...(this.header || {}) };
    if (value) next.title_actions = value;
    else delete next.title_actions;
    this._fire(next);
  };

  protected render(): TemplateResult {
    if (!this.hass) return html``;
    const h = this.header || {};
    const boolFields: BoolField[] = HEADER_BOOL_FIELDS.map((name) => ({
      name,
      label: computeLabel({ name } as HaFormSchema),
      value: !!(h as Record<string, unknown>)[name],
    }));
    return html`
      <div class="section">
        <ha-form
          .hass=${this.hass}
          .data=${{ title: h.title || '' }}
          .schema=${HEADER_TITLE_SCHEMA}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._formChanged}
        ></ha-form>
        <apexcharts-card-bool-grid
          .fields=${boolFields}
          .columns=${2}
          @value-changed=${this._boolChanged}
        ></apexcharts-card-bool-grid>
        <ha-expansion-panel outlined header="Title Actions">
          <apexcharts-card-actions-editor
            .hass=${this.hass}
            .actions=${h.title_actions}
            @value-changed=${this._titleActionsChanged}
          ></apexcharts-card-actions-editor>
        </ha-expansion-panel>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-header-editor': ApexChartsCardHeaderEditor;
  }
}
