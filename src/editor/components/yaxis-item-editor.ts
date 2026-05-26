import { LitElement, html, TemplateResult, nothing, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardYAxisExternal } from '../../types-config';
import { HaFormSchema } from '../types';
import { editorStyles } from '../styles';
import { computeHelper, computeLabel, isValidYaxisLimit } from '../helpers';
import { BoolField } from './bool-grid';
import './bool-grid';

// `show` boolean rendered via bool-grid; rest stays in ha-form
const SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'id', selector: { text: {} } },
      {
        name: 'axis',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ],
          },
        },
      },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'min', selector: { text: {} } },
      { name: 'max', selector: { text: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'decimals', selector: { number: { min: 0, max: 10, step: 1, mode: 'box' } } },
      { name: 'align_to', selector: { number: { mode: 'box' } } },
    ],
  },
];

@customElement('apexcharts-card-yaxis-item-editor')
export class ApexChartsCardYAxisItemEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public yaxis?: ChartCardYAxisExternal;
  // Labels (apex_config.yaxis[i].labels) â€” handled separately from the yaxis core fields.
  @property({ type: Boolean }) public labelsShow = true;
  @property({ type: String }) public labelsFormatterBody = '';
  // Tick amount (apex_config.yaxis[i].tickAmount) â€” handled separately
  @property({ type: Number }) public tickAmount?: number;

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _formData(): Record<string, unknown> {
    const y = this.yaxis || {};
    return {
      id: y.id || '',
      axis: y.opposite ? 'right' : 'left',
      min: y.min === undefined ? '' : String(y.min),
      max: y.max === undefined ? '' : String(y.max),
      decimals: y.decimals,
      align_to: y.align_to,
    };
  }

  private _showChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { value } = ev.detail as { name: string; value: boolean };
    const next: ChartCardYAxisExternal = { ...(this.yaxis || {}) };
    // show defaults to true; persist only the explicit `false`
    if (value === false) next.show = false;
    else delete next.show;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _fireLabels(show: boolean | undefined, formatterBody: string): void {
    this.dispatchEvent(
      new CustomEvent('labels-changed', {
        detail: { show, formatterBody },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _labelsShowChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { value } = ev.detail as { name: string; value: boolean };
    // Default is true; persist only the explicit `false`
    this._fireLabels(value === false ? false : undefined, this.labelsFormatterBody);
  };

  private _labelsFormatterChanged = (ev: Event): void => {
    const body = (ev.target as HTMLInputElement | HTMLTextAreaElement).value;
    this._fireLabels(this.labelsShow === false ? false : undefined, body);
  };

  private _tickAmountChanged = (ev: Event): void => {
    const raw = (ev.target as HTMLInputElement).value;
    const trimmed = raw.trim();
    let value: number | undefined;
    if (trimmed === '') {
      value = undefined;
    } else {
      const n = Number(trimmed);
      value = isNaN(n) || n < 0 ? undefined : Math.floor(n);
    }
    this.dispatchEvent(
      new CustomEvent('tick-amount-changed', {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _onChange = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as Record<string, unknown>;
    const next: ChartCardYAxisExternal = { ...(this.yaxis || {}) };
    if ('id' in data) {
      if (data.id) next.id = data.id as string;
      else delete next.id;
    }
    if ('axis' in data) {
      if (data.axis === 'right') next.opposite = true;
      else delete next.opposite;
    }
    if ('min' in data) {
      const raw = (data.min as string | undefined) ?? '';
      const v = typeof raw === 'string' ? raw.trim() : String(raw);
      if (v === '' || data.min === undefined || data.min === null) {
        delete next.min;
      } else if (!isNaN(Number(v)) && !v.startsWith('~') && !v.startsWith('|')) {
        next.min = Number(v);
      } else {
        next.min = v;
      }
    }
    if ('max' in data) {
      const raw = (data.max as string | undefined) ?? '';
      const v = typeof raw === 'string' ? raw.trim() : String(raw);
      if (v === '' || data.max === undefined || data.max === null) {
        delete next.max;
      } else if (!isNaN(Number(v)) && !v.startsWith('~') && !v.startsWith('|')) {
        next.max = Number(v);
      } else {
        next.max = v;
      }
    }
    if ('decimals' in data) {
      if (data.decimals === undefined || data.decimals === '') delete next.decimals;
      else next.decimals = Number(data.decimals);
    }
    if ('align_to' in data) {
      if (data.align_to === undefined || data.align_to === '') delete next.align_to;
      else next.align_to = Number(data.align_to);
    }
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _validation(): TemplateResult | typeof nothing {
    const y = this.yaxis;
    if (!y) return nothing;
    const errors: string[] = [];
    if (y.min !== undefined && !isValidYaxisLimit(String(y.min))) {
      errors.push('Min: use number, "auto", "~N" (soft), or "|N|" (absolute).');
    }
    if (y.max !== undefined && !isValidYaxisLimit(String(y.max))) {
      errors.push('Max: use number, "auto", "~N" (soft), or "|N|" (absolute).');
    }
    if (errors.length === 0) return nothing;
    return html`<div class="validation-error">${errors.map((e) => html`<div>â€¢ ${e}</div>`)}</div>`;
  }

  protected render(): TemplateResult {
    if (!this.hass) return html``;
    const showFields: BoolField[] = [
      {
        name: 'show',
        label: computeLabel({ name: 'show' } as HaFormSchema),
        value: this.yaxis?.show ?? true,
      },
    ];
    const labelsShowFields: BoolField[] = [
      {
        name: 'labels_show',
        label: 'Show Labels',
        helper: 'Toggle tick labels on this axis.',
        value: this.labelsShow,
      },
    ];
    return html`
      <div class="section">
        <ha-form
          .hass=${this.hass}
          .data=${this._formData()}
          .schema=${SCHEMA}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._onChange}
        ></ha-form>
        <apexcharts-card-bool-grid
          .fields=${showFields}
          .columns=${1}
          @value-changed=${this._showChanged}
        ></apexcharts-card-bool-grid>
        <div class="tick-amount-block">
          <label class="tick-amount-label">Tick Amount</label>
          <input
            class="tick-amount-input"
            type="number"
            min="0"
            step="1"
            placeholder="Auto"
            .value=${this.tickAmount === undefined ? '' : String(this.tickAmount)}
            @change=${this._tickAmountChanged}
          />
          <div class="tick-amount-helper">
            Number of intervals shown between Min and Max on this axis. For a 0â€“10 range,
            <code>10</code> produces ticks every <code>1</code> unit (at 0, 1, 2 â€¦ 10). For 0â€“100,
            <code>10</code> would step every 10. Leave empty to use the ApexCharts default
            (auto, usually 6).
          </div>
        </div>
        <ha-expansion-panel outlined header="Labels">
          <div class="section">
            <apexcharts-card-bool-grid
              .fields=${labelsShowFields}
              .columns=${1}
              @value-changed=${this._labelsShowChanged}
            ></apexcharts-card-bool-grid>
            <div class="formatter-block">
              <label class="formatter-label">Formatter (JS function body)</label>
              <textarea
                class="formatter-textarea"
                rows="4"
                placeholder="return value + ' kWh';"
                .value=${this.labelsFormatterBody}
                @change=${this._labelsFormatterChanged}
              ></textarea>
              <div class="formatter-helper">
                Receives the raw axis value as <code>value</code>. Saved as
                <code>EVAL:function(value) { ... }</code> so apexcharts-card evaluates it at runtime.
              </div>
            </div>
          </div>
        </ha-expansion-panel>
      </div>
      ${this._validation()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-yaxis-item-editor': ApexChartsCardYAxisItemEditor;
  }
}
