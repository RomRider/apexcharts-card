import { LitElement, html, TemplateResult, nothing, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { editorStyles } from '../styles';
import {
  ChartCardAllSeriesExternalConfig,
  ChartCardExternalConfig,
  ChartCardSeriesExternalConfig,
} from '../../types-config';
import { computeColor } from '../../utils';
import { HaFormSchema } from '../types';
import {
  computeHelper,
  computeLabel,
  fromSelectValue,
  parseStrokeDash,
  serializeStrokeDash,
  toSelectValue,
} from '../helpers';
import {
  SERIES_ADVANCED_BASE_SCHEMA,
  SERIES_APPEARANCE_SCHEMA,
  SERIES_CORE_SCHEMA,
  SERIES_DATA_PROCESSING_SCHEMA,
  SERIES_GROUP_BY_SCHEMA,
  SERIES_VISIBILITY_BOOL_FIELDS,
  SERIES_VISIBILITY_SELECT_SCHEMA,
} from '../schemas/series';
import { BoolField } from './bool-grid';
import './color-threshold-editor';
import './actions-editor';
import './bool-grid';

type Series = ChartCardSeriesExternalConfig | ChartCardAllSeriesExternalConfig;

@customElement('apexcharts-card-series-item-editor')
export class ApexChartsCardSeriesItemEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: ChartCardExternalConfig;
  @property({ attribute: false }) public series?: Series;
  @property({ attribute: false }) public isAllSeriesConfig = false;

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  // â”€â”€ Core helpers â”€â”€

  private _fire(updates: Partial<Series>): void {
    const next: Series = { ...(this.series || {}), ...updates };
    // Strip keys whose new value is undefined so the YAML stays clean
    for (const k of Object.keys(updates) as (keyof Series)[]) {
      if (updates[k] === undefined) {
        delete (next as Record<string, unknown>)[k as string];
      }
    }
    this.dispatchEvent(
      new CustomEvent('series-changed', {
        detail: { series: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _swatch(): string {
    const s = this.series;
    if (s?.color) {
      try {
        return computeColor(s.color);
      } catch {
        return 'transparent';
      }
    }
    return 'transparent';
  }

  // â”€â”€ Field handlers â”€â”€

  private _entityChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { entity?: string };
    this._fire({ entity: data.entity || '' } as Partial<ChartCardSeriesExternalConfig>);
  };

  private _coreChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { name?: string; type?: string };
    const updates: Partial<Series> = {};
    if ('name' in data) updates.name = data.name || undefined;
    if ('type' in data) {
      updates.type = (data.type || undefined) as Series['type'];
    }
    this._fire(updates);
  };

  private _colorChanged = (ev: Event): void => {
    const value = (ev.target as HTMLInputElement).value;
    this._fire({ color: value || undefined } as Partial<Series>);
  };

  private _swatchHex(): string {
    const s = this.series;
    if (s?.color) {
      try {
        return computeColor(s.color);
      } catch {
        return '#000000';
      }
    }
    return '#000000';
  }

  private _dataProcessingData(): Record<string, unknown> {
    const s = this.series || {};
    return {
      statistics: s.statistics || {},
      fill_raw: s.fill_raw,
      transform: s.transform,
      data_generator: s.data_generator,
    };
  }

  private _groupByData(): Record<string, unknown> {
    const g = this.series?.group_by || {};
    return {
      duration: g.duration || '',
      func: g.func || '',
      fill: g.fill || '',
    };
  }

  private _groupByChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { duration?: string; func?: string; fill?: string };
    const g: NonNullable<Series['group_by']> = { ...(this.series?.group_by || {}) };
    if ('duration' in data) {
      if (data.duration) g.duration = data.duration;
      else delete g.duration;
    }
    if ('func' in data) {
      if (data.func) g.func = data.func as NonNullable<Series['group_by']>['func'];
      else delete g.func;
    }
    if ('fill' in data) {
      if (data.fill) g.fill = data.fill as NonNullable<Series['group_by']>['fill'];
      else delete g.fill;
    }
    this._fire({ group_by: Object.keys(g).length > 0 ? g : undefined } as Partial<Series>);
  };

  private _dataProcessingChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as {
      statistics?: { type?: string; period?: string; align?: string };
      fill_raw?: string;
      transform?: string;
      data_generator?: string;
    };

    const updates: Partial<Series> = {};

    if (data.statistics) {
      const st: NonNullable<Series['statistics']> = {};
      if (data.statistics.type) st.type = data.statistics.type as NonNullable<Series['statistics']>['type'];
      if (data.statistics.period) st.period = data.statistics.period as NonNullable<Series['statistics']>['period'];
      if (data.statistics.align) st.align = data.statistics.align as NonNullable<Series['statistics']>['align'];
      updates.statistics = Object.keys(st).length > 0 ? st : undefined;
    }
    if ('fill_raw' in data) updates.fill_raw = (data.fill_raw || undefined) as Series['fill_raw'];
    if ('transform' in data) updates.transform = data.transform || undefined;
    if ('data_generator' in data) updates.data_generator = data.data_generator || undefined;

    this._fire(updates);
  };

  private _appearanceData(): Record<string, unknown> {
    const s = this.series || {};
    return {
      curve: s.curve || '',
      opacity: s.opacity,
      stroke_width: s.stroke_width,
      stroke_dash: serializeStrokeDash(s.stroke_dash),
      extend_to: toSelectValue(s.extend_to),
    };
  }

  private _appearanceChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as Record<string, unknown>;
    const updates: Partial<Series> = {};
    if ('curve' in data) updates.curve = (data.curve as Series['curve']) || undefined;
    if ('opacity' in data) updates.opacity = data.opacity === undefined ? undefined : Number(data.opacity);
    if ('stroke_width' in data)
      updates.stroke_width = data.stroke_width === undefined ? undefined : Number(data.stroke_width);
    if ('stroke_dash' in data) {
      const sd = parseStrokeDash(data.stroke_dash as string);
      updates.stroke_dash = sd;
    }
    if ('extend_to' in data) {
      const v = fromSelectValue(data.extend_to as string);
      if (v === false) updates.extend_to = false;
      else if (v === 'end' || v === 'now') updates.extend_to = v;
      else updates.extend_to = undefined;
    }
    this._fire(updates);
  };

  private _invertChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { value } = ev.detail as { name: string; value: boolean };
    this._fire({ invert: value ? true : undefined } as Partial<Series>);
  };

  private _groupByStartWithLastChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { value } = ev.detail as { name: string; value: boolean };
    const g: NonNullable<Series['group_by']> = { ...(this.series?.group_by || {}) };
    if (value) g.start_with_last = true;
    else delete g.start_with_last;
    this._fire({ group_by: Object.keys(g).length > 0 ? g : undefined } as Partial<Series>);
  };

  private _visibilitySelectData(): Record<string, unknown> {
    const show = (this.series?.show || {}) as Record<string, unknown>;
    return {
      in_header: toSelectValue(show.in_header as undefined),
      as_duration: toSelectValue(show.as_duration as undefined),
      extremas: toSelectValue(show.extremas as undefined),
      datalabels: toSelectValue(show.datalabels as undefined),
    };
  }

  private _visibilityBoolFields(): BoolField[] {
    const show = (this.series?.show || {}) as Record<string, unknown>;
    const fields: BoolField[] = SERIES_VISIBILITY_BOOL_FIELDS.map(({ name, defaultValue }) => ({
      name,
      label: computeLabel({ name } as HaFormSchema),
      value: (show[name] as boolean | undefined) ?? defaultValue,
    }));
    // Conditional experimental booleans
    if (this.config?.experimental?.color_threshold) {
      fields.push({
        name: 'header_color_threshold',
        label: computeLabel({ name: 'header_color_threshold' } as HaFormSchema),
        value: !!show.header_color_threshold,
      });
    }
    if (this.config?.experimental?.hidden_by_default) {
      fields.push({
        name: 'hidden_by_default',
        label: computeLabel({ name: 'hidden_by_default' } as HaFormSchema),
        value: !!show.hidden_by_default,
      });
    }
    if (this.config?.experimental?.brush) {
      fields.push({
        name: 'in_brush',
        label: computeLabel({ name: 'in_brush' } as HaFormSchema),
        value: !!show.in_brush,
      });
    }
    return fields;
  }

  private _visibilityBoolChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { name, value } = ev.detail as { name: string; value: boolean };
    const show: Record<string, unknown> = { ...(this.series?.show || {}) };
    const def = SERIES_VISIBILITY_BOOL_FIELDS.find((f) => f.name === name);
    if (def) {
      // Persist only when value differs from the schema default
      if (value === def.defaultValue) delete show[name];
      else show[name] = value;
    } else {
      // Optional/experimental fields: persist only when true
      if (value) show[name] = true;
      else delete show[name];
    }
    this._fire({ show: Object.keys(show).length > 0 ? (show as Series['show']) : undefined });
  };

  private _visibilitySelectChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as Record<string, unknown>;
    const show: Record<string, unknown> = { ...(this.series?.show || {}) };
    for (const k of ['in_header', 'as_duration', 'extremas', 'datalabels']) {
      if (k in data) {
        const v = fromSelectValue(data[k] as string);
        if (v === undefined) delete show[k];
        else show[k] = v;
      }
    }
    this._fire({ show: Object.keys(show).length > 0 ? (show as Series['show']) : undefined });
  };

  private _advancedData(): Record<string, unknown> {
    const s = this.series || {};
    return {
      attribute: s.attribute,
      unit: s.unit,
      float_precision: s.float_precision,
      offset: s.offset,
      time_delta: s.time_delta,
      min: s.min,
      max: s.max,
      stack_group: s.stack_group,
    };
  }

  private _advancedSchema(): HaFormSchema[] {
    const schema: HaFormSchema[] = [...SERIES_ADVANCED_BASE_SCHEMA];
    if (this.config?.chart_type === 'radialBar') {
      schema.push({
        type: 'grid',
        name: '',
        schema: [
          { name: 'min', selector: { number: { mode: 'box' } } },
          { name: 'max', selector: { number: { mode: 'box' } } },
        ],
      });
    }
    if (this.config?.stacked) {
      schema.push({ name: 'stack_group', selector: { text: {} } });
    }
    return schema;
  }

  private _yaxisIdSchema(): HaFormSchema[] {
    const yaxes = this.config?.yaxis;
    if (!yaxes || yaxes.length === 0) return [];
    const options = yaxes
      .filter((y) => y.id)
      .map((y) => ({ value: y.id as string, label: y.id as string }));
    if (options.length === 0) return [];
    const currentId = (this.series as ChartCardSeriesExternalConfig | undefined)?.yaxis_id;
    if (currentId && !options.some((o) => o.value === currentId)) {
      options.push({ value: currentId, label: `${currentId} (missing)` });
    }
    return [
      {
        name: 'yaxis_id',
        selector: {
          select: {
            mode: 'dropdown',
            options: [{ value: '', label: '(default)' }, ...options],
          },
        },
      },
    ];
  }

  private _yaxisIdChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { yaxis_id?: string };
    const updates: Partial<Series> = {};
    if ('yaxis_id' in data) {
      (updates as Partial<ChartCardSeriesExternalConfig>).yaxis_id = data.yaxis_id || undefined;
    }
    if (Object.keys(updates).length === 0) return;
    this._fire(updates);
  };


  private _advancedChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as Record<string, unknown>;
    const updates: Partial<Series> = {};
    const stringKeys: (keyof Series)[] = ['attribute', 'unit', 'offset', 'time_delta', 'stack_group'];
    for (const k of stringKeys) {
      if (k in data) (updates as Record<string, unknown>)[k as string] = (data[k as string] as string) || undefined;
    }
    const numKeys: (keyof Series)[] = ['float_precision', 'min', 'max'];
    for (const k of numKeys) {
      if (k in data) {
        const v = data[k as string];
        (updates as Record<string, unknown>)[k as string] = v === undefined || v === '' ? undefined : Number(v);
      }
    }
    this._fire(updates);
  };

  private _thresholdsChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as ChartCardSeriesExternalConfig['color_threshold'];
    this._fire({ color_threshold: value && value.length > 0 ? value : undefined } as Partial<Series>);
  };

  private _actionsChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as ChartCardSeriesExternalConfig['header_actions'];
    this._fire({ header_actions: value } as Partial<Series>);
  };

  protected render(): TemplateResult {
    if (!this.hass || !this.series) return html``;
    const s = this.series as ChartCardSeriesExternalConfig;
    const showColorThreshold = !this.isAllSeriesConfig && this.config?.experimental?.color_threshold;
    const showHeaderActions = !this.isAllSeriesConfig;
    const yaxisIdSchema = this._yaxisIdSchema();

    return html`
      <div class="section">
        ${this.isAllSeriesConfig
          ? nothing
          : html`
              <ha-form
                .hass=${this.hass}
                .data=${{ entity: s.entity || '' }}
                .schema=${[
                  { name: 'entity', selector: { entity: {} } } as HaFormSchema,
                ]}
                .computeLabel=${computeLabel}
                @value-changed=${this._entityChanged}
              ></ha-form>
              ${!s.entity
                ? html`<div class="validation-error">Entity is required.</div>`
                : nothing}
            `}

        <ha-form
          .hass=${this.hass}
          .data=${{ name: s.name || '', type: s.type || '' }}
          .schema=${SERIES_CORE_SCHEMA}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._coreChanged}
        ></ha-form>

        ${yaxisIdSchema.length > 0
          ? html`
              <ha-form
                .hass=${this.hass}
                .data=${{ yaxis_id: s.yaxis_id || '' }}
                .schema=${yaxisIdSchema}
                .computeLabel=${computeLabel}
                .computeHelper=${computeHelper}
                @value-changed=${this._yaxisIdChanged}
              ></ha-form>
            `
          : nothing}

        <ha-expansion-panel outlined header="Appearance">
          <div class="section">
            <div class="color-field">
              <span class="color-field-label">Color</span>
              <label class="color-preview" title="Pick color">
                <span style="display:block;width:100%;height:100%;background: ${this._swatch()};"></span>
                <input type="color" .value=${this._swatchHex()} @input=${this._colorChanged} />
              </label>
              <ha-textfield
                label="Color"
                .value=${s.color || ''}
                placeholder="e.g. #ff0000, red, var(--my-color)"
                @change=${this._colorChanged}
              ></ha-textfield>
            </div>
            <ha-form
              .hass=${this.hass}
              .data=${this._appearanceData()}
              .schema=${SERIES_APPEARANCE_SCHEMA}
              .computeLabel=${computeLabel}
              .computeHelper=${computeHelper}
              @value-changed=${this._appearanceChanged}
            ></ha-form>
            <apexcharts-card-bool-grid
              .fields=${[
                {
                  name: 'invert',
                  label: computeLabel({ name: 'invert' } as HaFormSchema),
                  value: s.invert ?? false,
                },
              ]}
              .columns=${1}
              @value-changed=${this._invertChanged}
            ></apexcharts-card-bool-grid>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Visibility">
          <div class="section">
            <apexcharts-card-bool-grid
              .fields=${this._visibilityBoolFields()}
              .columns=${2}
              @value-changed=${this._visibilityBoolChanged}
            ></apexcharts-card-bool-grid>
            <ha-form
              .hass=${this.hass}
              .data=${this._visibilitySelectData()}
              .schema=${SERIES_VISIBILITY_SELECT_SCHEMA}
              .computeLabel=${computeLabel}
              .computeHelper=${computeHelper}
              @value-changed=${this._visibilitySelectChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Data Processing">
          <div class="section">
            <ha-expansion-panel outlined header="Group By">
              <div class="section">
                <ha-form
                  .hass=${this.hass}
                  .data=${this._groupByData()}
                  .schema=${SERIES_GROUP_BY_SCHEMA}
                  .computeLabel=${computeLabel}
                  .computeHelper=${computeHelper}
                  @value-changed=${this._groupByChanged}
                ></ha-form>
                <apexcharts-card-bool-grid
                  .fields=${[
                    {
                      name: 'start_with_last',
                      label: computeLabel({ name: 'start_with_last' } as HaFormSchema),
                      value: !!this.series?.group_by?.start_with_last,
                    },
                  ]}
                  .columns=${1}
                  @value-changed=${this._groupByStartWithLastChanged}
                ></apexcharts-card-bool-grid>
              </div>
            </ha-expansion-panel>
            <ha-form
              .hass=${this.hass}
              .data=${this._dataProcessingData()}
              .schema=${SERIES_DATA_PROCESSING_SCHEMA}
              .computeLabel=${computeLabel}
              .computeHelper=${computeHelper}
              @value-changed=${this._dataProcessingChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Advanced">
          <ha-form
            .hass=${this.hass}
            .data=${this._advancedData()}
            .schema=${this._advancedSchema()}
            .computeLabel=${computeLabel}
            .computeHelper=${computeHelper}
            @value-changed=${this._advancedChanged}
          ></ha-form>
        </ha-expansion-panel>

        ${showColorThreshold
          ? html`
              <ha-expansion-panel outlined header="Color Thresholds">
                <apexcharts-card-color-threshold-editor
                  .thresholds=${s.color_threshold || []}
                  @value-changed=${this._thresholdsChanged}
                ></apexcharts-card-color-threshold-editor>
              </ha-expansion-panel>
            `
          : nothing}

        ${showHeaderActions
          ? html`
              <ha-expansion-panel outlined header="Header Actions">
                <apexcharts-card-actions-editor
                  .hass=${this.hass}
                  .actions=${s.header_actions}
                  @value-changed=${this._actionsChanged}
                ></apexcharts-card-actions-editor>
              </ha-expansion-panel>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-series-item-editor': ApexChartsCardSeriesItemEditor;
  }
}
