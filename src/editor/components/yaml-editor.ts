import { LitElement, html, TemplateResult, nothing, CSSResultGroup, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { editorStyles } from '../styles';

@customElement('apexcharts-card-yaml-editor')
export class ApexChartsCardYamlEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public value?: unknown;
  @property({ type: String }) public label = '';
  @property({ type: Boolean }) public readOnly = false;
  @state() private _invalid = false;

  // ha-yaml-editor consumes `defaultValue` only on initial mount; we push later updates via setValue().
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @query('ha-yaml-editor') private _yamlEditor?: any;

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('value') && this._yamlEditor && typeof this._yamlEditor.setValue === 'function') {
      const incoming = this.value || {};
      const previous = changed.get('value');
      // Skip if value is identical (avoid clobbering user-typed text mid-edit when an unrelated re-render runs).
      if (JSON.stringify(incoming) !== JSON.stringify(previous)) {
        this._yamlEditor.setValue(incoming);
      }
    }
  }

  private _onChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const detail = ev.detail as { value: unknown; isValid?: boolean };
    if (detail.isValid === false) {
      this._invalid = true;
      return;
    }
    this._invalid = false;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: detail.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  protected render(): TemplateResult {
    if (!this.hass) return html``;
    return html`
      <div class="yaml-block">
        <ha-yaml-editor
          .hass=${this.hass}
          .defaultValue=${this.value || {}}
          .label=${this.label}
          .readOnly=${this.readOnly}
          @value-changed=${this._onChanged}
        ></ha-yaml-editor>
        ${this._invalid ? html`<div class="validation-error">Invalid YAML</div>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-yaml-editor': ApexChartsCardYamlEditor;
  }
}
