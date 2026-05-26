import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardExternalConfig } from '../types-config';
import { EDITOR_TABS } from './types';
import { editorStyles } from './styles';

// Side-effect imports so the custom elements are registered when the editor is loaded.
import './components/series-editor';
import './components/header-editor';
import './components/yaxis-editor';
import './components/color-list-editor';
import './components/yaml-editor';
import './tabs/general-tab';
import './tabs/display-tab';
import './tabs/advanced-tab';

@customElement('apexcharts-card-editor')
export class ApexChartsCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: ChartCardExternalConfig;
  @state() private _activeTab = 0;

  public setConfig(config: ChartCardExternalConfig): void {
    const configDup = JSON.parse(JSON.stringify(config));
    // Migrate legacy 'entities' key (same as the card's setConfig does)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((configDup as any).entities) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      configDup.series = (configDup as any).entities;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (configDup as any).entities;
    }
    this._config = configDup;
  }

  private _fireConfig(config: ChartCardExternalConfig): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onConfigChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const cfg = ev.detail?.config as ChartCardExternalConfig | undefined;
    if (cfg) this._fireConfig(cfg);
  };

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) return html``;

    return html`
      <div class="tab-bar" role="tablist">
        ${EDITOR_TABS.map(
          (tab, index) => html`
            <button
              class="tab ${index === this._activeTab ? 'active' : ''}"
              role="tab"
              aria-selected=${index === this._activeTab}
              @click=${() => {
                this._activeTab = index;
              }}
            >
              <ha-icon icon=${tab.icon}></ha-icon>
              <span>${tab.label}</span>
            </button>
          `,
        )}
      </div>
      <div class="tab-content">${this._renderTab()}</div>
    `;
  }

  private _renderTab(): TemplateResult {
    switch (this._activeTab) {
      case 0:
        return this._renderGeneralTab();
      case 1:
        return this._renderSeriesTab();
      case 2:
        return this._renderDisplayTab();
      case 3:
        return this._renderYAxisTab();
      case 4:
        return this._renderAdvancedTab();
      default:
        return html``;
    }
  }

  private _renderGeneralTab(): TemplateResult {
    return html`
      <apexcharts-card-editor-general
        .hass=${this.hass}
        .config=${this._config}
        @config-changed=${this._onConfigChanged}
      ></apexcharts-card-editor-general>
    `;
  }

  private _renderSeriesTab(): TemplateResult {
    return html`
      <apexcharts-card-series-editor
        .hass=${this.hass}
        .config=${this._config}
        @config-changed=${this._onConfigChanged}
      ></apexcharts-card-series-editor>
    `;
  }

  private _renderDisplayTab(): TemplateResult {
    return html`
      <apexcharts-card-editor-display
        .hass=${this.hass}
        .config=${this._config}
        @config-changed=${this._onConfigChanged}
      ></apexcharts-card-editor-display>
    `;
  }

  private _renderYAxisTab(): TemplateResult {
    return html`
      <apexcharts-card-yaxis-editor
        .hass=${this.hass}
        .config=${this._config}
        @config-changed=${this._onConfigChanged}
      ></apexcharts-card-yaxis-editor>
    `;
  }

  private _renderAdvancedTab(): TemplateResult {
    return html`
      <apexcharts-card-editor-advanced
        .hass=${this.hass}
        .config=${this._config}
        @config-changed=${this._onConfigChanged}
      ></apexcharts-card-editor-advanced>
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-editor': ApexChartsCardEditor;
  }
}
