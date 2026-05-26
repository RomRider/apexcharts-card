import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ChartCardColorThreshold } from '../../types-config';
import { computeColor } from '../../utils';
import { editorStyles } from '../styles';

const ICON_DELETE = 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z';
const ICON_ADD = 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z';

@customElement('apexcharts-card-color-threshold-editor')
export class ApexChartsCardColorThresholdEditor extends LitElement {
  @property({ attribute: false }) public thresholds: ChartCardColorThreshold[] = [];

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _swatch(color?: string): string {
    if (!color) return 'transparent';
    try {
      return computeColor(color);
    } catch {
      return 'transparent';
    }
  }

  private _fire(thresholds: ChartCardColorThreshold[]): void {
    const sorted = [...thresholds].sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: sorted },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _update(index: number, key: keyof ChartCardColorThreshold, value: unknown): void {
    const list = [...this.thresholds];
    const item = { ...list[index] };
    if (value === undefined || value === null || value === '') {
      delete (item as Record<string, unknown>)[key];
    } else {
      (item as Record<string, unknown>)[key] = value;
    }
    list[index] = item;
    this._fire(list);
  }

  private _add(): void {
    const next = [...this.thresholds, { value: 0 } as ChartCardColorThreshold];
    this._fire(next);
  }

  private _remove(index: number): void {
    const list = [...this.thresholds];
    list.splice(index, 1);
    this._fire(list);
  }

  protected render(): TemplateResult {
    return html`
      <div class="list-editor">
        ${this.thresholds.map(
          (t, i) => html`
            <div class="list-item">
              <div class="list-item-body" style="padding-top: 12px;">
                <div class="grid-3">
                  <ha-textfield
                    type="number"
                    label="Value"
                    .value=${t.value !== undefined ? String(t.value) : ''}
                    @change=${(ev: Event) => {
                      const v = (ev.target as HTMLInputElement).value;
                      if (v === '') {
                        this._remove(i);
                      } else {
                        this._update(i, 'value', Number(v));
                      }
                    }}
                  ></ha-textfield>
                  <div class="color-field">
                    <span class="color-preview" style="background: ${this._swatch(t.color)}"></span>
                    <ha-textfield
                      label="Color"
                      .value=${t.color || ''}
                      @change=${(ev: Event) =>
                        this._update(i, 'color', (ev.target as HTMLInputElement).value || undefined)}
                    ></ha-textfield>
                  </div>
                  <ha-textfield
                    type="number"
                    label="Opacity"
                    .value=${t.opacity !== undefined ? String(t.opacity) : ''}
                    @change=${(ev: Event) => {
                      const v = (ev.target as HTMLInputElement).value;
                      this._update(i, 'opacity', v === '' ? undefined : Number(v));
                    }}
                  ></ha-textfield>
                </div>
              </div>
              <div class="item-controls" style="position: absolute; right: 8px; top: 8px;">
                <ha-icon-button
                  .path=${ICON_DELETE}
                  .label=${'Remove threshold'}
                  @click=${() => this._remove(i)}
                ></ha-icon-button>
              </div>
            </div>
          `,
        )}
        <button class="add-button" type="button" @click=${this._add}>
          <ha-icon-button .path=${ICON_ADD} .label=${'Add threshold'}></ha-icon-button>
          Add Threshold
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-color-threshold-editor': ApexChartsCardColorThresholdEditor;
  }
}
