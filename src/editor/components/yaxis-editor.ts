import { LitElement, html, TemplateResult, nothing, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardExternalConfig, ChartCardYAxisExternal } from '../../types-config';
import { editorStyles } from '../styles';
import { getApexYaxisValue, setApexYaxisValue, unwrapEvalBody, wrapEvalBody } from '../apex-config-utils';
import './yaxis-item-editor';

const ICON_UP = 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z';
const ICON_DOWN = 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z';
const ICON_DELETE = 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z';
const ICON_EXPAND = 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z';
const ICON_COLLAPSE = 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z';
const ICON_ADD = 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z';

@customElement('apexcharts-card-yaxis-editor')
export class ApexChartsCardYAxisEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: ChartCardExternalConfig;
  @state() private _expanded: Record<number, boolean> = {};

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _fire(yaxis: ChartCardYAxisExternal[] | undefined): void {
    if (!this.config) return;
    const next: ChartCardExternalConfig = { ...this.config };
    if (!yaxis || yaxis.length === 0) delete next.yaxis;
    else next.yaxis = yaxis;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _toggle(i: number): void {
    this._expanded = { ...this._expanded, [i]: !this._expanded[i] };
  }

  private _add(): void {
    const list = [...(this.config?.yaxis || []), { id: '', show: true } as ChartCardYAxisExternal];
    this._expanded = { ...this._expanded, [list.length - 1]: true };
    this._fire(list);
  }

  private _remove(i: number): void {
    const list = [...(this.config?.yaxis || [])];
    list.splice(i, 1);
    const newExp: Record<number, boolean> = {};
    for (const k of Object.keys(this._expanded)) {
      const n = Number(k);
      if (n < i) newExp[n] = this._expanded[n];
      else if (n > i) newExp[n - 1] = this._expanded[n];
    }
    this._expanded = newExp;
    this._fire(list.length > 0 ? list : undefined);
  }

  private _move(i: number, delta: -1 | 1): void {
    const list = [...(this.config?.yaxis || [])];
    const target = i + delta;
    if (target < 0 || target >= list.length) return;
    [list[i], list[target]] = [list[target], list[i]];
    const newExp = { ...this._expanded };
    [newExp[i], newExp[target]] = [newExp[target], newExp[i]];
    this._expanded = newExp;
    this._fire(list);
  }

  private _itemChanged(i: number, ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail.value as ChartCardYAxisExternal;
    const list = [...(this.config?.yaxis || [])];
    list[i] = value;
    this._fire(list);
  }

  private _labelsChanged(i: number, ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) return;
    const { show, formatterBody } = ev.detail as { show: boolean | undefined; formatterBody: string };
    const axisCount = (this.config.yaxis || []).length;

    // Apply show first, then formatter, chaining mutations
    let next = setApexYaxisValue(this.config, i, axisCount, 'labels.show', show);
    const formatter = wrapEvalBody(formatterBody);
    next = setApexYaxisValue(next, i, axisCount, 'labels.formatter', formatter);

    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _tickAmountChanged(i: number, ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) return;
    const { value } = ev.detail as { value: number | undefined };
    const axisCount = (this.config.yaxis || []).length;
    const next = setApexYaxisValue(this.config, i, axisCount, 'tickAmount', value);
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) return html``;
    const list = this.config.yaxis || [];
    return html`
      <div class="list-editor">
        ${list.length > 0
          ? nothing
          : html`<div style="color: var(--secondary-text-color); padding: 4px;">
              No custom Y-axes. Add one to override defaults.
            </div>`}
        ${list.map((y, i) => {
          const expanded = !!this._expanded[i];
          return html`
            <div class="list-item">
              <div class="list-item-header" @click=${() => this._toggle(i)}>
                <span class="item-name">${y.id || `Y-Axis ${i + 1}`}</span>
                <div class="item-controls" @click=${(ev: Event) => ev.stopPropagation()}>
                  <ha-icon-button
                    .path=${ICON_UP}
                    .label=${'Move up'}
                    .disabled=${i === 0}
                    @click=${() => this._move(i, -1)}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${ICON_DOWN}
                    .label=${'Move down'}
                    .disabled=${i === list.length - 1}
                    @click=${() => this._move(i, 1)}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${ICON_DELETE}
                    .label=${'Delete'}
                    @click=${() => this._remove(i)}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${expanded ? ICON_COLLAPSE : ICON_EXPAND}
                    .label=${expanded ? 'Collapse' : 'Expand'}
                    @click=${() => this._toggle(i)}
                  ></ha-icon-button>
                </div>
              </div>
              ${expanded
                ? html`
                    <div class="list-item-body">
                      <apexcharts-card-yaxis-item-editor
                        .hass=${this.hass}
                        .yaxis=${y}
                        .labelsShow=${getApexYaxisValue(this.config, i, 'labels.show') === false ? false : true}
                        .labelsFormatterBody=${unwrapEvalBody(getApexYaxisValue(this.config, i, 'labels.formatter'))}
                        .tickAmount=${getApexYaxisValue(this.config, i, 'tickAmount') as number | undefined}
                        @value-changed=${(ev: CustomEvent) => this._itemChanged(i, ev)}
                        @labels-changed=${(ev: CustomEvent) => this._labelsChanged(i, ev)}
                        @tick-amount-changed=${(ev: CustomEvent) => this._tickAmountChanged(i, ev)}
                      ></apexcharts-card-yaxis-item-editor>
                    </div>
                  `
                : nothing}
            </div>
          `;
        })}
        <button class="add-button" type="button" @click=${this._add}>
          <ha-icon-button .path=${ICON_ADD} .label=${'Add Y-axis'}></ha-icon-button>
          Add Y-Axis
        </button>
        <div style="color: var(--secondary-text-color); font-size: 0.85em; padding: 4px;">
          Min/Max formats: number, "auto", "~5" (soft limit), or "|5|" (absolute offset).
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-yaxis-editor': ApexChartsCardYAxisEditor;
  }
}
