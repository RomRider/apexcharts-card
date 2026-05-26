import { LitElement, html, TemplateResult, nothing, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardChartType, ChartCardExternalConfig } from '../../types-config';
import { GENERAL_BOTTOM_SCHEMA, GENERAL_TOP_SCHEMA, LAYOUT_SCHEMA } from '../schemas/general';
import { editorStyles } from '../styles';
import { computeHelper, computeLabel, fromSelectValue, isValidDuration, isValidOffset, toSelectValue } from '../helpers';
import '../components/chart-type-picker';
import '../components/bool-grid';
import { BoolField } from '../components/bool-grid';
import { HaFormSchema } from '../types';

interface FormData {
  graph_span?: string;
  update_interval?: string;
  update_delay?: string;
  layout?: string;
  hours_12?: string;
  span?: {
    start?: string;
    end?: string;
    offset?: string;
  };
}

@customElement('apexcharts-card-editor-general')
export class ApexChartsCardEditorGeneral extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: ChartCardExternalConfig;

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _formData(): FormData {
    if (!this.config) return {};
    const span = this.config.span || {};
    return {
      graph_span: this.config.graph_span,
      update_interval: this.config.update_interval,
      update_delay: this.config.update_delay,
      layout: this.config.layout || '',
      hours_12: toSelectValue(this.config.hours_12),
      span: {
        start: span.start || '',
        end: span.end || '',
        offset: span.offset,
      },
    };
  }

  private _onValueChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    if (!this.config) return;
    const data = ev.detail.value as FormData;

    const newConfig: ChartCardExternalConfig = { ...this.config };

    // Direct fields
    if ('graph_span' in data) {
      if (data.graph_span) newConfig.graph_span = data.graph_span;
      else delete newConfig.graph_span;
    }
    if ('update_interval' in data) {
      if (data.update_interval) newConfig.update_interval = data.update_interval;
      else delete newConfig.update_interval;
    }
    if ('update_delay' in data) {
      if (data.update_delay) newConfig.update_delay = data.update_delay;
      else delete newConfig.update_delay;
    }
    if ('layout' in data) {
      if (data.layout) newConfig.layout = data.layout;
      else delete newConfig.layout;
    }
    if ('hours_12' in data) {
      const v = fromSelectValue(data.hours_12);
      if (v === true) newConfig.hours_12 = true;
      else if (v === false) newConfig.hours_12 = false;
      else delete newConfig.hours_12;
    }
    if (data.span) {
      const span: ChartCardExternalConfig['span'] = {};
      if (data.span.start) span.start = data.span.start as NonNullable<ChartCardExternalConfig['span']>['start'];
      if (data.span.end) span.end = data.span.end as NonNullable<ChartCardExternalConfig['span']>['end'];
      if (data.span.offset) span.offset = data.span.offset;
      if (Object.keys(span).length > 0) newConfig.span = span;
      else delete newConfig.span;
    }

    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _validation(): TemplateResult | typeof nothing {
    if (!this.config) return nothing;
    const errors: string[] = [];
    if (this.config.graph_span && !isValidDuration(this.config.graph_span)) {
      errors.push('X Axis Span: invalid duration format (e.g. 1h, 12h, 7d).');
    }
    if (this.config.update_interval && !isValidDuration(this.config.update_interval)) {
      errors.push('Update Interval: invalid duration format.');
    }
    if (this.config.update_delay && !isValidDuration(this.config.update_delay)) {
      errors.push('Update Delay: invalid duration format.');
    }
    if (this.config.span?.offset && !isValidOffset(this.config.span.offset)) {
      errors.push('Span Offset: must start with + or - (e.g. -1d).');
    }
    if (this.config.span?.start && this.config.span?.end) {
      errors.push('Span: only one of "Start" or "End" is allowed.');
    }
    if (errors.length === 0) return nothing;
    return html`<div class="validation-error">${errors.map((e) => html`<div>â€¢ ${e}</div>`)}</div>`;
  }

  private _boolChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    if (!this.config) return;
    const { name, value } = ev.detail as { name: string; value: boolean };
    const next: ChartCardExternalConfig = { ...this.config };
    if (value) (next as unknown as Record<string, unknown>)[name] = true;
    else delete (next as unknown as Record<string, unknown>)[name];
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _chartTypeChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    if (!this.config) return;
    const v = ev.detail.value as ChartCardChartType | undefined;
    const next: ChartCardExternalConfig = { ...this.config };
    if (v) next.chart_type = v;
    else delete next.chart_type;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  };

  protected render(): TemplateResult {
    if (!this.config || !this.hass) return html``;
    const data = this._formData();
    const stackedFields: BoolField[] = [
      {
        name: 'stacked',
        label: computeLabel({ name: 'stacked' } as HaFormSchema),
        value: this.config.stacked ?? false,
      },
    ];
    return html`
      <div class="section">
        <div>
          <div style="font-size: 0.85em; color: var(--secondary-text-color); margin-bottom: 4px;">
            Chart Type
          </div>
          <apexcharts-card-chart-type-picker
            .value=${this.config.chart_type}
            @value-changed=${this._chartTypeChanged}
          ></apexcharts-card-chart-type-picker>
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${GENERAL_TOP_SCHEMA}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._onValueChanged}
        ></ha-form>
        <div class="layout-stacked-row">
          <apexcharts-card-bool-grid
            .fields=${stackedFields}
            .columns=${1}
            @value-changed=${this._boolChanged}
          ></apexcharts-card-bool-grid>
          <ha-form
            .hass=${this.hass}
            .data=${data}
            .schema=${LAYOUT_SCHEMA}
            .computeLabel=${computeLabel}
            .computeHelper=${computeHelper}
            @value-changed=${this._onValueChanged}
          ></ha-form>
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${GENERAL_BOTTOM_SCHEMA}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._onValueChanged}
        ></ha-form>
        ${this._validation()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-editor-general': ApexChartsCardEditorGeneral;
  }
}
