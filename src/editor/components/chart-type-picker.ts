import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ChartCardChartType } from '../../types-config';
import { editorStyles } from '../styles';

interface ChartTypeOption {
  value: ChartCardChartType | '';
  label: string;
  icon: string;
}

const OPTIONS: ChartTypeOption[] = [
  { value: 'line', label: 'Line', icon: 'M2,3H4.5V20H2V3M21.5,3H19V20H21.5V3M16.5,8V20H14V8H16.5M7,12V20H9.5V12H7M12,15V20H14.5V15H12Z' },
  { value: 'scatter', label: 'Scatter', icon: 'M7,3A4,4 0 0,1 11,7A4,4 0 0,1 7,11A4,4 0 0,1 3,7A4,4 0 0,1 7,3M7,5A2,2 0 0,0 5,7A2,2 0 0,0 7,9A2,2 0 0,0 9,7A2,2 0 0,0 7,5M17,3A4,4 0 0,1 21,7A4,4 0 0,1 17,11A4,4 0 0,1 13,7A4,4 0 0,1 17,3M17,5A2,2 0 0,0 15,7A2,2 0 0,0 17,9A2,2 0 0,0 19,7A2,2 0 0,0 17,5M7,13A4,4 0 0,1 11,17A4,4 0 0,1 7,21A4,4 0 0,1 3,17A4,4 0 0,1 7,13M7,15A2,2 0 0,0 5,17A2,2 0 0,0 7,19A2,2 0 0,0 9,17A2,2 0 0,0 7,15M17,13A4,4 0 0,1 21,17A4,4 0 0,1 17,21A4,4 0 0,1 13,17A4,4 0 0,1 17,13M17,15A2,2 0 0,0 15,17A2,2 0 0,0 17,19A2,2 0 0,0 19,17A2,2 0 0,0 17,15Z' },
  { value: 'pie', label: 'Pie', icon: 'M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z' },
  { value: 'donut', label: 'Donut', icon: 'M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z' },
  { value: 'radialBar', label: 'Radial Bar', icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12H8A4,4 0 0,1 12,8V6Z' },
];

@customElement('apexcharts-card-chart-type-picker')
export class ApexChartsCardChartTypePicker extends LitElement {
  @property({ type: String }) public value?: string;

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _select(v: ChartCardChartType | ''): void {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: v || undefined },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    // Use light DOM so the parent editor's chart-type-grid/card styles apply
    return this;
  }

  protected render(): TemplateResult {
    return html`
      <div class="chart-type-grid">
        ${OPTIONS.map(
          (opt) => html`
            <button
              type="button"
              class="chart-type-card"
              ?selected=${this.value === opt.value || (!this.value && opt.value === 'line')}
              @click=${() => this._select(opt.value)}
            >
              <ha-svg-icon class="icon" .path=${opt.icon}></ha-svg-icon>
              <span>${opt.label}</span>
            </button>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-chart-type-picker': ApexChartsCardChartTypePicker;
  }
}
