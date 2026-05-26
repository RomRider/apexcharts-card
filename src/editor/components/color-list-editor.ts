import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { computeColor } from '../../utils';
import { editorStyles } from '../styles';

const ICON_DELETE = 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z';
const ICON_ADD = 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z';

@customElement('apexcharts-card-color-list-editor')
export class ApexChartsCardColorListEditor extends LitElement {
  @property({ attribute: false }) public colors: string[] = [];

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _swatch(color: string): string {
    if (!color) return 'transparent';
    try {
      return computeColor(color);
    } catch {
      return 'transparent';
    }
  }

  private _fire(colors: string[]): void {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: colors.length > 0 ? colors : undefined },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _update(index: number, value: string): void {
    const list = [...this.colors];
    list[index] = value;
    this._fire(list);
  }

  private _add(): void {
    this._fire([...this.colors, '']);
  }

  private _remove(index: number): void {
    const list = [...this.colors];
    list.splice(index, 1);
    this._fire(list);
  }

  protected render(): TemplateResult {
    return html`
      <div class="list-editor">
        ${this.colors.map(
          (c, i) => html`
            <div class="color-field" style="padding: 0 4px;">
              <span class="color-preview" style="background: ${this._swatch(c)};"></span>
              <ha-textfield
                label="Color"
                .value=${c}
                @change=${(ev: Event) => this._update(i, (ev.target as HTMLInputElement).value)}
              ></ha-textfield>
              <ha-icon-button
                .path=${ICON_DELETE}
                .label=${'Remove color'}
                @click=${() => this._remove(i)}
              ></ha-icon-button>
            </div>
          `,
        )}
        <button class="add-button" type="button" @click=${this._add}>
          <ha-icon-button .path=${ICON_ADD} .label=${'Add color'}></ha-icon-button>
          Add Color
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-color-list-editor': ApexChartsCardColorListEditor;
  }
}
