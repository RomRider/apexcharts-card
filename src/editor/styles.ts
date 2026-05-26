import { css } from 'lit';

export const editorStyles = css`
  :host {
    display: block;
  }

  .tab-bar {
    display: flex;
    border-bottom: 1px solid var(--divider-color);
    overflow-x: auto;
    scrollbar-width: thin;
  }
  .tab {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 14px;
    border: none;
    background: transparent;
    color: var(--secondary-text-color);
    font-family: inherit;
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .tab:hover {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
  }
  .tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }
  .tab ha-icon {
    --mdc-icon-size: 18px;
  }
  @media (max-width: 450px) {
    .tab span {
      display: none;
    }
  }

  .tab-content {
    padding: 16px 16px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  ha-form,
  .form-section {
    display: block;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .section-title {
    font-weight: 500;
    font-size: 1em;
    margin: 8px 0 4px;
  }

  /* Generic list editor (series, yaxis, thresholds, colors, templates) */
  .list-editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .list-item {
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
    background: var(--card-background-color, var(--primary-background-color));
  }

  .list-item-header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    gap: 8px;
    min-height: 48px;
    user-select: none;
  }

  .list-item-header:hover {
    background: var(--secondary-background-color);
  }

  .color-swatch {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    border: 1px solid var(--divider-color);
  }

  .item-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }

  .type-badge {
    font-size: 0.75em;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    text-transform: capitalize;
  }

  .item-controls {
    display: flex;
    gap: 0;
    align-items: center;
  }

  .item-controls ha-icon-button {
    --mdc-icon-button-size: 36px;
    --mdc-icon-size: 20px;
    color: var(--secondary-text-color);
  }

  .item-controls ha-icon-button[disabled] {
    opacity: 0.4;
    pointer-events: none;
  }

  .list-item-body {
    padding: 0 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Annotation row — bordered group with native inputs (avoids ha-textfield upgrade issues) */
  .annotation-row {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
  }
  .annotation-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .annotation-label {
    font-size: 0.8em;
    color: var(--secondary-text-color);
    font-weight: 500;
  }
  .annotation-input {
    box-sizing: border-box;
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background: var(--card-background-color, var(--primary-background-color));
    color: var(--primary-text-color);
    font-family: inherit;
    font-size: 0.95em;
    line-height: 1.4;
  }
  .annotation-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  .annotation-input::placeholder {
    color: var(--secondary-text-color);
    opacity: 0.6;
  }
  .annotation-color-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .annotation-color-row .annotation-input {
    flex: 1;
    min-width: 0;
  }
  .annotation-helper {
    font-size: 0.78em;
    color: var(--secondary-text-color);
    line-height: 1.35;
    margin-top: 2px;
  }
  .annotation-helper code {
    background: var(--secondary-background-color);
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 0.95em;
  }

  /* Add button */
  .add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 10px;
    border: 1px dashed var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    cursor: pointer;
    color: var(--primary-color);
    background: transparent;
    font-size: 0.95em;
    font-family: inherit;
  }
  .add-button:hover {
    background: var(--secondary-background-color);
  }

  /* Color field */
  .color-field {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .color-field-label {
    color: var(--primary-text-color);
    font-size: 0.95em;
    flex-shrink: 0;
  }
  .color-preview {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid var(--divider-color);
    flex-shrink: 0;
    background: var(--secondary-background-color);
    padding: 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .color-preview input[type='color'] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
    opacity: 0;
  }
  .color-field ha-textfield {
    flex: 1;
  }

  /* Row that mixes a bool-grid switch with another form field side-by-side */
  .layout-stacked-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: center;
  }
  @media (max-width: 480px) {
    .layout-stacked-row {
      grid-template-columns: 1fr;
    }
  }

  /* Boolean grid (custom switch rows with left-aligned switch + label) */
  .bool-grid {
    display: grid;
    gap: 8px 16px;
    margin: 4px 0;
  }
  .bool-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .bool-row-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }
  .bool-row-label {
    color: var(--primary-text-color);
    font-size: 0.95em;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bool-row-helper {
    color: var(--secondary-text-color);
    font-size: 0.78em;
    line-height: 1.2;
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Inline grid */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  /* Templates chip row */
  .chip-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--secondary-background-color);
  }
  .chip-row .chip-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chip-row ha-icon-button {
    --mdc-icon-button-size: 28px;
    --mdc-icon-size: 16px;
  }

  .add-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .add-row ha-textfield {
    flex: 1;
  }

  /* Preview panel */
  .preview-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 12px 16px;
    cursor: pointer;
    color: var(--secondary-text-color);
    font-size: 0.9em;
    border-top: 1px solid var(--divider-color);
    margin-top: 16px;
    user-select: none;
  }
  .preview-container {
    max-height: 220px;
    overflow: hidden;
    pointer-events: none;
    padding: 0 16px 16px;
  }
  .preview-error {
    color: var(--error-color);
    padding: 16px;
    font-size: 0.9em;
    white-space: pre-wrap;
    font-family: var(--code-font-family, monospace);
  }
  .preview-placeholder {
    color: var(--secondary-text-color);
    padding: 16px;
    text-align: center;
    font-style: italic;
  }

  /* Validation */
  .validation-error {
    color: var(--error-color);
    font-size: 0.85em;
    padding: 0 4px;
  }

  /* Chart-type picker grid */
  .chart-type-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 6px;
  }
  .chart-type-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 4px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    cursor: pointer;
    text-align: center;
    background: transparent;
    color: var(--primary-text-color);
    font-family: inherit;
    font-size: 0.78em;
    gap: 4px;
    min-width: 0;
  }
  .chart-type-card:hover {
    background: var(--secondary-background-color);
  }
  .chart-type-card[selected] {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
    color: var(--primary-color);
  }
  .chart-type-card .icon {
    --mdc-icon-size: 24px;
    color: inherit;
  }
  @media (max-width: 480px) {
    .chart-type-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  /* yaml editor */
  .yaml-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* Tick amount field + inline explainer */
  .tick-amount-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tick-amount-label {
    font-size: 0.8em;
    color: var(--secondary-text-color);
    font-weight: 500;
  }
  .tick-amount-input {
    box-sizing: border-box;
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background: var(--card-background-color, var(--primary-background-color));
    color: var(--primary-text-color);
    font-family: inherit;
    font-size: 0.95em;
    line-height: 1.4;
  }
  .tick-amount-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  .tick-amount-input::placeholder {
    color: var(--secondary-text-color);
    opacity: 0.6;
  }
  .tick-amount-helper {
    font-size: 0.8em;
    color: var(--secondary-text-color);
    line-height: 1.3;
  }
  .tick-amount-helper code {
    background: var(--secondary-background-color);
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 0.95em;
  }

  /* Formatter textarea (used for EVAL JS function bodies) */
  .formatter-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .formatter-label {
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }
  .formatter-textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-family: var(--code-font-family, ui-monospace, SFMono-Regular, monospace);
    font-size: 0.9em;
    line-height: 1.4;
    resize: vertical;
  }
  .formatter-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  .formatter-helper {
    font-size: 0.8em;
    color: var(--secondary-text-color);
    line-height: 1.3;
  }
  .formatter-helper code {
    background: var(--secondary-background-color);
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 0.95em;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .grid-2,
    .grid-3 {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 450px) {
    .tab-content {
      padding: 8px 8px 0;
    }
  }
`;
