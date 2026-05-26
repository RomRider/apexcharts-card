import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { computeColor } from '../../utils';

const ICON_DELETE = 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z';
const ICON_ADD = 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z';

export interface AnnotationItem {
  value?: string | number;
  label?: string;
  color?: string;
}

@customElement('apexcharts-card-annotations-editor')
export class ApexChartsCardAnnotationsEditor extends LitElement {
  // 'xaxis' or 'yaxis'; only affects whether `value` is shown as a date string or number hint
  @property({ type: String }) public axis: 'xaxis' | 'yaxis' = 'yaxis';
  @property({ attribute: false }) public items: AnnotationItem[] = [];

  // Render in light DOM so the parent editor's CSS (annotation-row, color-field, etc.) applies,
  // and ha-textfield uses HA's default theming exactly as it does in other forms.
  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  private _swatch(color?: string): string {
    if (!color) return 'transparent';
    try {
      return computeColor(color);
    } catch {
      return 'transparent';
    }
  }

  private _hex(color?: string): string {
    if (!color) return '#000000';
    try {
      return computeColor(color);
    } catch {
      return '#000000';
    }
  }

  private _fire(items: AnnotationItem[]): void {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: items.length > 0 ? items : undefined },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _update(index: number, patch: Partial<AnnotationItem>): void {
    const next = [...this.items];
    next[index] = { ...next[index], ...patch };
    // Strip empty fields
    for (const k of Object.keys(next[index]) as (keyof AnnotationItem)[]) {
      if (next[index][k] === '' || next[index][k] === undefined) {
        delete next[index][k];
      }
    }
    this._fire(next);
  }

  private _add(): void {
    const next = [...this.items, {} as AnnotationItem];
    this._fire(next);
  }

  private _remove(index: number): void {
    const next = [...this.items];
    next.splice(index, 1);
    this._fire(next);
  }

  protected render(): TemplateResult {
    const isXAxis = this.axis === 'xaxis';
    const valuePlaceholder = isXAxis ? '2024-02-11 14:30 or 1707609600000' : '50';
    const valueHelper = isXAxis
      ? html`The time position on the x-axis. Accepts an ISO date/time string
          (e.g. <code>2024-02-11</code> or <code>2024-02-11 14:30:00</code>) which will be
          converted to a millisecond timestamp, or paste a raw millisecond Unix timestamp
          (e.g. <code>1707609600000</code>) directly.`
      : html`A numeric value on this y-axis scale (e.g. <code>50</code>, <code>-3.14</code>).`;
    return html`
      <div class="list-editor">
        ${this.items.length === 0
          ? html`<div style="color: var(--secondary-text-color); font-size: 0.9em;">
              No annotations.
            </div>`
          : nothing}
        ${this.items.map(
          (item, i) => html`
            <div class="annotation-row">
              <div class="annotation-field">
                <label class="annotation-label">Value</label>
                <input
                  class="annotation-input"
                  type="text"
                  placeholder=${valuePlaceholder}
                  .value=${item.value === undefined ? '' : String(item.value)}
                  @change=${(ev: Event) =>
                    this._update(i, { value: (ev.target as HTMLInputElement).value })}
                />
                <div class="annotation-helper">${valueHelper}</div>
              </div>
              <div class="annotation-field">
                <label class="annotation-label">Label</label>
                <input
                  class="annotation-input"
                  type="text"
                  placeholder="Annotation text"
                  .value=${item.label || ''}
                  @change=${(ev: Event) =>
                    this._update(i, { label: (ev.target as HTMLInputElement).value })}
                />
              </div>
              <div class="annotation-field">
                <label class="annotation-label">Color</label>
                <div class="annotation-color-row">
                  <label class="color-preview" title="Pick color">
                    <span style="display:block;width:100%;height:100%;background: ${this._swatch(item.color)};"></span>
                    <input
                      type="color"
                      .value=${this._hex(item.color)}
                      @input=${(ev: Event) =>
                        this._update(i, { color: (ev.target as HTMLInputElement).value })}
                    />
                  </label>
                  <input
                    class="annotation-input"
                    type="text"
                    placeholder="#ff0000, red, var(--my-color)"
                    .value=${item.color || ''}
                    @change=${(ev: Event) =>
                      this._update(i, { color: (ev.target as HTMLInputElement).value })}
                  />
                  <ha-icon-button
                    .path=${ICON_DELETE}
                    .label=${'Remove annotation'}
                    @click=${() => this._remove(i)}
                  ></ha-icon-button>
                </div>
              </div>
            </div>
          `,
        )}
        <button class="add-button" type="button" @click=${this._add}>
          <ha-icon-button .path=${ICON_ADD} .label=${'Add annotation'}></ha-icon-button>
          Add ${this.axis === 'xaxis' ? 'X-Axis' : 'Y-Axis'} Annotation
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-annotations-editor': ApexChartsCardAnnotationsEditor;
  }
}
