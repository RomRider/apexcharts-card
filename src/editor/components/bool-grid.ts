import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { editorStyles } from '../styles';

export interface BoolField {
  name: string;
  label: string;
  helper?: string;
  value: boolean;
  disabled?: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'ha-switch': HTMLElement & { checked: boolean; disabled?: boolean };
    'ha-formfield': HTMLElement & { label?: string; alignEnd?: boolean; disabled?: boolean };
  }
}

@customElement('apexcharts-card-bool-grid')
export class ApexChartsCardBoolGrid extends LitElement {
  @property({ attribute: false }) public fields: BoolField[] = [];
  @property({ type: Number }) public columns = 2;

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _toggle(name: string, ev: Event): void {
    const checked = (ev.target as { checked?: boolean }).checked === true;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { name, value: checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render(): TemplateResult {
    const style = `grid-template-columns: repeat(${this.columns}, minmax(0, 1fr));`;
    return html`
      <div class="bool-grid" style=${style}>
        ${this.fields.map(
          (f) => html`
            <div class="bool-row" title=${f.helper || ''}>
              <ha-switch
                .checked=${!!f.value}
                .disabled=${!!f.disabled}
                @change=${(ev: Event) => this._toggle(f.name, ev)}
              ></ha-switch>
              <div class="bool-row-text">
                <span class="bool-row-label">${f.label}</span>
                ${f.helper
                  ? html`<span class="bool-row-helper">${f.helper}</span>`
                  : ''}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }
}
