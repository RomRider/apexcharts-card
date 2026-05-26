import { LitElement, html, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardExternalConfig } from '../../types-config';

@customElement('apexcharts-card-editor-preview')
export class ApexChartsCardEditorPreview extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: ChartCardExternalConfig;
  @state() private _visible = true;
  @state() private _error?: string;

  @query('.preview-container') private _container?: HTMLDivElement;

  private _debounceTimer?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _cardElement?: any;

  static styles = undefined; // styles inherited via light DOM is not desirable; we render in shadow with no styles â†’ keep host minimal

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    // Use light DOM so the parent editor's CSS applies (preview-toggle, preview-container, preview-error)
    return this;
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('config') || changed.has('hass')) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = window.setTimeout(() => this._updatePreview(), 300);
    }
  }

  private _hasValidSeries(): boolean {
    return !!this.config?.series?.some((s) => s && s.entity);
  }

  private async _updatePreview(): Promise<void> {
    if (!this._visible || !this.config || !this.hass) return;
    await this.updateComplete;
    const container = this._container;
    if (!container) return;

    if (!this._hasValidSeries()) {
      this._teardownCard();
      this._error = undefined;
      return;
    }

    if (!this._cardElement) {
      this._cardElement = document.createElement('apexcharts-card');
      container.appendChild(this._cardElement);
    }

    try {
      this._cardElement.setConfig(JSON.parse(JSON.stringify(this.config)));
      this._cardElement.hass = this.hass;
      this._error = undefined;
    } catch (e) {
      this._error = e instanceof Error ? e.message : String(e);
      this._teardownCard();
    }
  }

  private _teardownCard(): void {
    if (this._cardElement && this._cardElement.parentNode) {
      this._cardElement.parentNode.removeChild(this._cardElement);
    }
    this._cardElement = undefined;
  }

  private _toggle(): void {
    this._visible = !this._visible;
    if (this._visible) {
      this.updateComplete.then(() => this._updatePreview());
    } else {
      this._teardownCard();
    }
  }

  protected render(): TemplateResult {
    const icon = this._visible
      ? 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z' // chevron-up
      : 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'; // chevron-down
    return html`
      <div class="preview-toggle" @click=${this._toggle}>
        <ha-svg-icon .path=${icon}></ha-svg-icon>
        <span style="margin-left: 4px;">${this._visible ? 'Hide Preview' : 'Show Preview'}</span>
      </div>
      ${this._visible
        ? html`
            <div class="preview-container">
              ${this._error
                ? html`<div class="preview-error">${this._error}</div>`
                : !this._hasValidSeries()
                  ? html`<div class="preview-placeholder">Add a series with an entity to see preview.</div>`
                  : nothing}
            </div>
          `
        : nothing}
    `;
  }

  disconnectedCallback(): void {
    clearTimeout(this._debounceTimer);
    this._teardownCard();
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-editor-preview': ApexChartsCardEditorPreview;
  }
}
