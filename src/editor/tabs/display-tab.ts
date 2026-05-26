import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardExternalConfig, ChartCardHeaderExternalConfig } from '../../types-config';
import { computeHelper, computeLabel } from '../helpers';
import { editorStyles } from '../styles';
import { NOW_SCHEMA, SHOW_BOOL_FIELDS } from '../schemas/display';
import {
  CHART_COLORS_SCHEMA,
  GRID_BOOL_FIELDS,
  GRID_SCHEMA,
  LEGEND_SCHEMA,
  MARKERS_SCHEMA,
  TOOLBAR_BOOL_FIELDS,
  TOOLTIP_SCHEMA,
} from '../schemas/apex';
import { HaFormSchema } from '../types';
import { BoolField } from '../components/bool-grid';
import { AnnotationItem } from '../components/annotations-editor';
import { getApexValue, setApexValue, setApexValues } from '../apex-config-utils';
import '../components/header-editor';
import '../components/color-list-editor';
import '../components/bool-grid';
import '../components/annotations-editor';

function msToLocalDateTimeString(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number): string => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  return `${date} ${time}`;
}

@customElement('apexcharts-card-editor-display')
export class ApexChartsCardEditorDisplay extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: ChartCardExternalConfig;

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _fire(updates: Partial<ChartCardExternalConfig>): void {
    if (!this.config) return;
    const next: ChartCardExternalConfig = { ...this.config, ...updates };
    for (const k of Object.keys(updates) as (keyof ChartCardExternalConfig)[]) {
      if (updates[k] === undefined) delete (next as unknown as Record<string, unknown>)[k as string];
    }
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _headerChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as ChartCardHeaderExternalConfig | undefined;
    this._fire({ header: value });
  };

  private _nowChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { color?: string; label?: string };
    const existing = this.config?.now || {};
    const next: NonNullable<ChartCardExternalConfig['now']> = { ...existing };
    if ('color' in data) {
      if (data.color) next.color = data.color;
      else delete next.color;
    }
    if ('label' in data) {
      if (data.label) next.label = data.label;
      else delete next.label;
    }
    this._fire({ now: Object.keys(next).length > 0 ? next : undefined });
  };

  private _nowShowChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { value } = ev.detail as { name: string; value: boolean };
    const existing = this.config?.now || {};
    const next: NonNullable<ChartCardExternalConfig['now']> = { ...existing };
    if (value) next.show = true;
    else delete next.show;
    this._fire({ now: Object.keys(next).length > 0 ? next : undefined });
  };

  private _showBoolChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { name, value } = ev.detail as { name: string; value: boolean };
    const existing = this.config?.show || {};
    const next: NonNullable<ChartCardExternalConfig['show']> = { ...existing };
    if (name === 'loading') {
      // loading defaults to true; only persist explicit false
      if (value === false) next.loading = false;
      else delete next.loading;
    } else if (name === 'last_updated') {
      if (value) next.last_updated = true;
      else delete next.last_updated;
    }
    this._fire({ show: Object.keys(next).length > 0 ? next : undefined });
  };

  private _colorListChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as string[] | undefined;
    this._fire({ color_list: value });
  };

  // â”€â”€ apex_config-driven sections â”€â”€

  private _fireConfig(next: ChartCardExternalConfig): void {
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _setApex(path: string, value: unknown): void {
    if (!this.config) return;
    this._fireConfig(setApexValue(this.config, path, value));
  }

  private _setApexMany(patches: Record<string, unknown>): void {
    if (!this.config) return;
    this._fireConfig(setApexValues(this.config, patches));
  }

  // Grid
  private _gridSelectChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { position?: string; borderColor?: string };
    this._setApexMany({
      'grid.position': data.position || undefined,
      'grid.borderColor': data.borderColor || undefined,
    });
  };

  private _gridBoolChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { name, value } = ev.detail as { name: string; value: boolean };
    const pathMap: Record<string, string> = {
      show: 'grid.show',
      xaxis_lines_show: 'grid.xaxis.lines.show',
      yaxis_lines_show: 'grid.yaxis.lines.show',
    };
    const path = pathMap[name];
    if (!path) return;
    // ApexCharts defaults: grid.show=true, grid.yaxis.lines.show=true, grid.xaxis.lines.show=false.
    // For fields that default to true, persist only explicit false. For xaxis lines, persist only explicit true.
    if (name === 'xaxis_lines_show') {
      this._setApex(path, value ? true : undefined);
    } else {
      this._setApex(path, value ? undefined : false);
    }
  };

  // Legend
  private _legendSelectChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { position?: string; horizontalAlign?: string };
    this._setApexMany({
      'legend.position': data.position || undefined,
      'legend.horizontalAlign': data.horizontalAlign || undefined,
    });
  };

  private _legendShowChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { value } = ev.detail as { name: string; value: boolean };
    // Default is shown; persist only explicit false
    this._setApex('legend.show', value ? undefined : false);
  };

  // Tooltip
  private _tooltipChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { theme?: string; x_format?: string };
    this._setApexMany({
      'tooltip.theme': data.theme || undefined,
      'tooltip.x.format': data.x_format || undefined,
    });
  };

  private _tooltipSharedChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { value } = ev.detail as { name: string; value: boolean };
    // ApexCharts requires `intersect: false` for shared tooltips
    this._setApexMany({
      'tooltip.shared': value ? true : undefined,
      'tooltip.intersect': value ? false : undefined,
    });
  };

  // Toolbar
  private _toolbarBoolChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const { name, value } = ev.detail as { name: string; value: boolean };
    if (name === 'show') {
      // apexcharts-card forces chart.toolbar.show=false AND chart.zoom.enabled=false in its defaults.
      // ApexCharts hides zoom/pan/reset icons when chart.zoom.enabled is false, leaving only the
      // download menu — so when the user enables the toolbar we also enable zoom (and clear both on off).
      this._setApexMany({
        'chart.toolbar.show': value ? true : undefined,
        'chart.zoom.enabled': value ? true : undefined,
      });
      return;
    }
    const toolMap: Record<string, string> = {
      tool_zoom: 'chart.toolbar.tools.zoom',
      tool_pan: 'chart.toolbar.tools.pan',
      tool_download: 'chart.toolbar.tools.download',
      tool_reset: 'chart.toolbar.tools.reset',
    };
    const path = toolMap[name];
    if (!path) return;
    this._setApex(path, value ? undefined : false);
  };

  // Markers
  private _markersChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { size?: number | string; shape?: string; strokeWidth?: number | string };
    const patches: Record<string, unknown> = {};
    if ('size' in data) {
      patches['markers.size'] = data.size === undefined || data.size === '' ? undefined : Number(data.size);
    }
    if ('shape' in data) {
      patches['markers.shape'] = data.shape || undefined;
    }
    if ('strokeWidth' in data) {
      patches['markers.strokeWidth'] =
        data.strokeWidth === undefined || data.strokeWidth === '' ? undefined : Number(data.strokeWidth);
    }
    this._setApexMany(patches);
  };

  // Chart background / foreground
  private _chartColorsChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { background?: string; foreColor?: string };
    this._setApexMany({
      'chart.background': data.background || undefined,
      'chart.foreColor': data.foreColor || undefined,
    });
  };

  // Annotations
  private _annotationsChanged = (axis: 'xaxis' | 'yaxis', ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as AnnotationItem[] | undefined;
    // Map UI items to ApexCharts annotation shape
    const mapped = value?.map((it) => {
      const out: Record<string, unknown> = {};
      if (axis === 'xaxis') {
        if (it.value !== undefined && it.value !== '') {
          const raw = String(it.value).trim();
          const asNum = Number(raw);
          if (!isNaN(asNum) && /^[\d.+-eE]+$/.test(raw)) {
            // Already a numeric (ms epoch) value -> keep as-is.
            out.x = asNum;
          } else {
            // Try to interpret as a date/time string and store as ms epoch
            // (ApexCharts xaxis annotations on a datetime axis require a numeric x).
            const parsed = Date.parse(raw);
            out.x = isNaN(parsed) ? raw : parsed;
          }
        }
      } else {
        if (it.value !== undefined && it.value !== '') {
          const n = Number(it.value);
          out.y = isNaN(n) ? it.value : n;
        }
      }
      if (it.color) {
        out.borderColor = it.color;
      }
      if (it.label) {
        out.label = {
          text: it.label,
          ...(it.color ? { style: { background: it.color, color: '#fff' } } : {}),
        };
      }
      return out;
    });
    this._setApex(axis === 'xaxis' ? 'annotations.xaxis' : 'annotations.yaxis', mapped);
  };

  private _readAnnotations(axis: 'xaxis' | 'yaxis'): AnnotationItem[] {
    const list = getApexValue(this.config, axis === 'xaxis' ? 'annotations.xaxis' : 'annotations.yaxis');
    if (!Array.isArray(list)) return [];
    return list.map((a) => {
      const rec = a as Record<string, unknown>;
      const rawValue = (axis === 'xaxis' ? rec.x : rec.y) as string | number | undefined;
      const labelObj = rec.label as Record<string, unknown> | undefined;
      const labelText = labelObj?.text as string | undefined;
      const color = (rec.borderColor as string | undefined) || ((labelObj?.style as Record<string, unknown> | undefined)?.background as string | undefined);
      const item: AnnotationItem = {};
      if (rawValue !== undefined) {
        // For xaxis: ms-epoch numbers should be shown as a readable local datetime so the user
        // can see what they typed. Anything below ~1973 (10^11 ms) is assumed to be a real numeric
        // category value, not an epoch.
        if (axis === 'xaxis' && typeof rawValue === 'number' && rawValue >= 1e11) {
          item.value = msToLocalDateTimeString(rawValue);
        } else {
          item.value = rawValue;
        }
      }
      if (labelText) item.label = labelText;
      if (color) item.color = color;
      return item;
    });
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) return html``;
    const cfg = this.config;
    const showFields: BoolField[] = SHOW_BOOL_FIELDS.map((name) => {
      const isLoading = name === 'loading';
      return {
        name,
        label: computeLabel({ name } as HaFormSchema),
        value: isLoading ? cfg.show?.loading ?? true : !!cfg.show?.[name as keyof NonNullable<typeof cfg.show>],
      };
    });
    const nowShowFields: BoolField[] = [
      {
        name: 'show',
        label: computeLabel({ name: 'show' } as HaFormSchema),
        value: !!cfg.now?.show,
      },
    ];

    // Grid
    const gridBoolFields: BoolField[] = GRID_BOOL_FIELDS.map((f) => {
      const pathMap: Record<string, string> = {
        show: 'grid.show',
        xaxis_lines_show: 'grid.xaxis.lines.show',
        yaxis_lines_show: 'grid.yaxis.lines.show',
      };
      const raw = getApexValue(cfg, pathMap[f.name]);
      // ApexCharts defaults: grid.show=true, grid.yaxis.lines.show=true, grid.xaxis.lines.show=false.
      const defaultsTrue = f.name !== 'xaxis_lines_show';
      const value = raw === undefined ? defaultsTrue : raw !== false;
      return {
        name: f.name,
        label: f.label,
        helper: f.helper,
        value,
      };
    });
    const gridSelectData = {
      position: (getApexValue(cfg, 'grid.position') as string) || '',
      borderColor: (getApexValue(cfg, 'grid.borderColor') as string) || '',
    };

    // Legend
    const legendShowFields: BoolField[] = [
      {
        name: 'show',
        label: 'Show Legend',
        value: getApexValue(cfg, 'legend.show') === false ? false : true,
      },
    ];
    const legendSelectData = {
      position: (getApexValue(cfg, 'legend.position') as string) || '',
      horizontalAlign: (getApexValue(cfg, 'legend.horizontalAlign') as string) || '',
    };

    // Tooltip
    const tooltipData = {
      theme: (getApexValue(cfg, 'tooltip.theme') as string) || '',
      x_format: (getApexValue(cfg, 'tooltip.x.format') as string) || '',
    };
    const tooltipSharedFields: BoolField[] = [
      {
        name: 'shared',
        label: 'Shared Tooltip',
        helper: 'Show one combined tooltip for all series instead of per-series.',
        value: !!getApexValue(cfg, 'tooltip.shared'),
      },
    ];

    // Toolbar
    const toolbarFields: BoolField[] = TOOLBAR_BOOL_FIELDS.map((f) => {
      const pathMap: Record<string, string> = {
        show: 'chart.toolbar.show',
        tool_zoom: 'chart.toolbar.tools.zoom',
        tool_pan: 'chart.toolbar.tools.pan',
        tool_download: 'chart.toolbar.tools.download',
        tool_reset: 'chart.toolbar.tools.reset',
      };
      const raw = getApexValue(cfg, pathMap[f.name]);
      // chart.toolbar.show defaults OFF (card forces false); the individual tools default ON when toolbar is shown.
      const defaultValue = f.name === 'show' ? false : true;
      return {
        name: f.name,
        label: f.label,
        helper: f.helper,
        value: raw === undefined ? defaultValue : raw === true,
      };
    });

    // Markers
    const markersData = {
      size: getApexValue(cfg, 'markers.size'),
      shape: (getApexValue(cfg, 'markers.shape') as string) || '',
      strokeWidth: getApexValue(cfg, 'markers.strokeWidth'),
    };

    // Chart background / foreground
    const chartColorsData = {
      background: (getApexValue(cfg, 'chart.background') as string) || '',
      foreColor: (getApexValue(cfg, 'chart.foreColor') as string) || '',
    };

    // Annotations
    const xAnnotations = this._readAnnotations('xaxis');
    const yAnnotations = this._readAnnotations('yaxis');

    return html`
      <div class="section">
        <ha-expansion-panel outlined header="Header" expanded>
          <apexcharts-card-header-editor
            .hass=${this.hass}
            .header=${cfg.header}
            @value-changed=${this._headerChanged}
          ></apexcharts-card-header-editor>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Now Marker">
          <div class="section">
            <apexcharts-card-bool-grid
              .fields=${nowShowFields}
              .columns=${1}
              @value-changed=${this._nowShowChanged}
            ></apexcharts-card-bool-grid>
            <ha-form
              .hass=${this.hass}
              .data=${{ color: cfg.now?.color || '', label: cfg.now?.label || '' }}
              .schema=${NOW_SCHEMA}
              .computeLabel=${computeLabel}
              .computeHelper=${computeHelper}
              @value-changed=${this._nowChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Show Options">
          <apexcharts-card-bool-grid
            .fields=${showFields}
            .columns=${2}
            @value-changed=${this._showBoolChanged}
          ></apexcharts-card-bool-grid>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Grid">
          <div class="section">
            <apexcharts-card-bool-grid
              .fields=${gridBoolFields}
              .columns=${2}
              @value-changed=${this._gridBoolChanged}
            ></apexcharts-card-bool-grid>
            <ha-form
              .hass=${this.hass}
              .data=${gridSelectData}
              .schema=${GRID_SCHEMA}
              .computeLabel=${computeLabel}
              .computeHelper=${computeHelper}
              @value-changed=${this._gridSelectChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Legend">
          <div class="section">
            <apexcharts-card-bool-grid
              .fields=${legendShowFields}
              .columns=${1}
              @value-changed=${this._legendShowChanged}
            ></apexcharts-card-bool-grid>
            <ha-form
              .hass=${this.hass}
              .data=${legendSelectData}
              .schema=${LEGEND_SCHEMA}
              .computeLabel=${computeLabel}
              .computeHelper=${computeHelper}
              @value-changed=${this._legendSelectChanged}
            ></ha-form>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Tooltip">
          <div class="section">
            <ha-form
              .hass=${this.hass}
              .data=${tooltipData}
              .schema=${TOOLTIP_SCHEMA}
              .computeLabel=${computeLabel}
              .computeHelper=${computeHelper}
              @value-changed=${this._tooltipChanged}
            ></ha-form>
            <apexcharts-card-bool-grid
              .fields=${tooltipSharedFields}
              .columns=${1}
              @value-changed=${this._tooltipSharedChanged}
            ></apexcharts-card-bool-grid>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Toolbar">
          <apexcharts-card-bool-grid
            .fields=${toolbarFields}
            .columns=${2}
            @value-changed=${this._toolbarBoolChanged}
          ></apexcharts-card-bool-grid>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Markers">
          <ha-form
            .hass=${this.hass}
            .data=${markersData}
            .schema=${MARKERS_SCHEMA}
            .computeLabel=${computeLabel}
            .computeHelper=${computeHelper}
            @value-changed=${this._markersChanged}
          ></ha-form>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Chart Background">
          <ha-form
            .hass=${this.hass}
            .data=${chartColorsData}
            .schema=${CHART_COLORS_SCHEMA}
            .computeLabel=${computeLabel}
            .computeHelper=${computeHelper}
            @value-changed=${this._chartColorsChanged}
          ></ha-form>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Annotations">
          <div class="section">
            <div style="font-weight: 500; margin-top: 4px;">X-Axis Annotations</div>
            <apexcharts-card-annotations-editor
              axis="xaxis"
              .items=${xAnnotations}
              @value-changed=${(ev: CustomEvent) => this._annotationsChanged('xaxis', ev)}
            ></apexcharts-card-annotations-editor>
            <div style="font-weight: 500; margin-top: 12px;">Y-Axis Annotations</div>
            <apexcharts-card-annotations-editor
              axis="yaxis"
              .items=${yAnnotations}
              @value-changed=${(ev: CustomEvent) => this._annotationsChanged('yaxis', ev)}
            ></apexcharts-card-annotations-editor>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Color Palette">
          <apexcharts-card-color-list-editor
            .colors=${cfg.color_list || []}
            @value-changed=${this._colorListChanged}
          ></apexcharts-card-color-list-editor>
        </ha-expansion-panel>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-editor-display': ApexChartsCardEditorDisplay;
  }
}
