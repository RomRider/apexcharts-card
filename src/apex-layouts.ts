import { HomeAssistant } from 'custom-card-helpers';
import parse from 'parse-duration';
import {
  DEFAULT_AREA_OPACITY,
  DEFAULT_FLOAT_PRECISION,
  DEFAULT_SERIE_TYPE,
  HOUR_24,
  NO_VALUE,
  PLAIN_COLOR_TYPES,
  TIMESERIES_TYPES,
} from './const';
import { ChartCardConfig } from './types';
import { computeName, computeUom, is12Hour, mergeDeep, prettyPrintTime, truncateFloat } from './utils';
import { layoutMinimal } from './layouts/minimal';
import * as ca from 'apexcharts/dist/locales/ca.json';
import * as cs from 'apexcharts/dist/locales/cs.json';
import * as de from 'apexcharts/dist/locales/de.json';
import * as el from 'apexcharts/dist/locales/el.json';
import * as en from 'apexcharts/dist/locales/en.json';
import * as es from 'apexcharts/dist/locales/es.json';
import * as fi from 'apexcharts/dist/locales/fi.json';
import * as fr from 'apexcharts/dist/locales/fr.json';
import * as he from 'apexcharts/dist/locales/he.json';
import * as hi from 'apexcharts/dist/locales/hi.json';
import * as hr from 'apexcharts/dist/locales/hr.json';
import * as hy from 'apexcharts/dist/locales/hy.json';
import * as id from 'apexcharts/dist/locales/id.json';
import * as it from 'apexcharts/dist/locales/it.json';
import * as ka from 'apexcharts/dist/locales/ka.json';
import * as ko from 'apexcharts/dist/locales/ko.json';
import * as lt from 'apexcharts/dist/locales/lt.json';
import * as nb from 'apexcharts/dist/locales/nb.json';
import * as nl from 'apexcharts/dist/locales/nl.json';
import * as pl from 'apexcharts/dist/locales/pl.json';
import * as pt_br from 'apexcharts/dist/locales/pt-br.json';
import * as pt from 'apexcharts/dist/locales/pt.json';
import * as rs from 'apexcharts/dist/locales/rs.json';
import * as ru from 'apexcharts/dist/locales/ru.json';
import * as se from 'apexcharts/dist/locales/se.json';
import * as sk from 'apexcharts/dist/locales/sk.json';
import * as sl from 'apexcharts/dist/locales/sl.json';
import * as sq from 'apexcharts/dist/locales/sq.json';
import * as th from 'apexcharts/dist/locales/th.json';
import * as tr from 'apexcharts/dist/locales/tr.json';
import * as ua from 'apexcharts/dist/locales/ua.json';
import * as zh_cn from 'apexcharts/dist/locales/zh-cn.json';

export function getLayoutConfig(config: ChartCardConfig, hass: HomeAssistant | undefined = undefined): unknown {
  const locales = {
    ca: ca,
    cs: cs,
    de: de,
    el: el,
    en: en,
    es: es,
    fi: fi,
    fr: fr,
    he: he,
    hi: hi,
    hr: hr,
    hy: hy,
    id: id,
    it: it,
    ka: ka,
    ko: ko,
    lt: lt,
    nb: nb,
    nl: nl,
    pl: pl,
    'pt-br': pt_br,
    pt: pt,
    rs: rs,
    ru: ru,
    se: se,
    sk: sk,
    sl: sl,
    sq: sq,
    th: th,
    tr: tr,
    ua: ua,
    'zh-cn': zh_cn,
  };
  const def = {
    chart: {
      locales: [(config.locale && locales[config.locale]) || (hass?.language && locales[hass.language]) || en],
      defaultLocale:
        (config.locale && locales[config.locale] && config.locale) ||
        (hass?.language && locales[hass.language] && hass.language) ||
        'en',
      type: config.chart_type || DEFAULT_SERIE_TYPE,
      stacked: config?.stacked,
      foreColor: 'var(--primary-text-color)',
      width: '100%',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    grid: {
      strokeDashArray: 3,
    },
    fill: {
      opacity: getFillOpacity(config),
      type: getFillType(config),
    },
    series: getSeries(config, hass),
    labels: getLabels(config, hass),
    xaxis: getXAxis(config, hass),
    yaxis: getYAxis(config),
    tooltip: {
      x: {
        formatter: getXTooltipFormatter(config, config.locale || hass?.language || 'en'),
      },
      y: {
        formatter: getYTooltipFormatter(config, hass),
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: getDataLabels_enabledOnSeries(config),
      formatter: getDataLabelsFormatter(config),
    },
    plotOptions: {
      radialBar: getPlotOptions_radialBar(config),
    },
    legend: {
      position: 'bottom',
      show: true,
      formatter: getLegendFormatter(config, hass),
    },
    stroke: {
      curve: getStrokeCurve(config),
      lineCap: config.chart_type === 'radialBar' ? 'round' : 'butt',
      colors:
        config.chart_type === 'pie' || config.chart_type === 'donut' ? ['var(--card-background-color)'] : undefined,
      width: getStrokeWidth(config),
    },
    markers: {
      showNullDataPoints: false,
    },
    noData: {
      text: 'Loading...',
    },
  };

  let conf = {};
  switch (config.layout) {
    case 'minimal':
      conf = layoutMinimal;
      break;

    default:
      break;
  }

  return config.apex_config ? mergeDeep(mergeDeep(def, conf), config.apex_config) : mergeDeep(def, conf);
}

function getFillOpacity(config: ChartCardConfig): number[] {
  return config.series_in_graph.map((serie) => {
    return serie.opacity !== undefined ? serie.opacity : serie.type === 'area' ? DEFAULT_AREA_OPACITY : 1;
  });
}

function getSeries(config: ChartCardConfig, hass: HomeAssistant | undefined) {
  if (TIMESERIES_TYPES.includes(config.chart_type)) {
    return config?.series_in_graph.map((serie, index) => {
      return {
        name: computeName(index, config.series_in_graph, undefined, hass?.states[serie.entity]),
        type: serie.type,
        data: [],
      };
    });
  } else {
    return [];
  }
}

function getLabels(config: ChartCardConfig, hass: HomeAssistant | undefined) {
  if (TIMESERIES_TYPES.includes(config.chart_type)) {
    return [];
  } else {
    return config.series_in_graph.map((serie, index) => {
      return computeName(index, config.series_in_graph, undefined, hass?.states[serie.entity]);
    });
  }
}

function getXAxis(config: ChartCardConfig, hass: HomeAssistant | undefined) {
  if (TIMESERIES_TYPES.includes(config.chart_type)) {
    const hours12 = config.hours_12 !== undefined ? config.hours_12 : is12Hour(config.locale || hass?.language || 'en');
    return {
      type: 'datetime',
      // range: getMilli(config.hours_to_show),
      labels: {
        datetimeUTC: false,
        datetimeFormatter: getDateTimeFormatter(hours12),
      },
    };
  } else {
    return {};
  }
}

function getYAxis(config: ChartCardConfig) {
  return Array.isArray(config.apex_config?.yaxis)
    ? undefined
    : {
        decimalsInFloat: config.y_axis_precision === undefined ? DEFAULT_FLOAT_PRECISION : config.y_axis_precision,
      };
}

function getDateTimeFormatter(hours12: boolean | undefined): unknown {
  if (!hours12) {
    return {
      year: 'yyyy',
      month: "MMM 'yy",
      day: 'dd MMM',
      hour: 'HH:mm',
      minute: 'HH:mm:ss',
    };
  } else {
    return {
      year: 'yyyy',
      month: "MMM 'yy",
      day: 'dd MMM',
      hour: 'hh:mm tt',
      minute: 'hh:mm:ss tt',
    };
  }
}

function getXTooltipFormatter(
  config: ChartCardConfig,
  lang: string,
): ((val: number, _a: any, _b: any) => string) | undefined {
  if (config.apex_config?.tooltip?.x?.format) return undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let hours12: any = undefined;
  if (config.hours_12 !== undefined) {
    hours12 = config.hours_12 ? { hour12: true } : { hourCycle: 'h23' };
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return parse(config.graph_span)! < HOUR_24 && !config.span?.offset
    ? function (val, _a, _b, hours_12 = hours12) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Intl.DateTimeFormat(lang, {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          ...hours_12,
        } as any).format(val);
      }
    : function (val, _a, _b, hours_12 = hours12) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Intl.DateTimeFormat(lang, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          ...hours_12,
        } as any).format(val);
      };
}

function getYTooltipFormatter(config: ChartCardConfig, hass: HomeAssistant | undefined) {
  return function (value, opts, conf = config, hass2 = hass) {
    if (!conf.series_in_graph[opts.seriesIndex]?.show.as_duration) {
      value = truncateFloat(value, conf.series_in_graph[opts.seriesIndex].float_precision);
    }
    const uom = computeUom(
      opts.seriesIndex,
      conf.series_in_graph,
      undefined,
      hass2?.states[conf.series_in_graph[opts.seriesIndex].entity],
    );
    return conf.series_in_graph[opts.seriesIndex]?.show.as_duration
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [`<strong>${prettyPrintTime(value, conf.series_in_graph[opts.seriesIndex].show.as_duration!)}</strong>`]
      : [`<strong>${value} ${uom}</strong>`];
  };
}

function getDataLabelsFormatter(config: ChartCardConfig) {
  return function (value, opts, conf = config) {
    if (conf.series_in_graph[opts.seriesIndex].show.datalabels === 'total') {
      return truncateFloat(
        opts.w.globals.stackedSeriesTotals[opts.dataPointIndex],
        conf.series_in_graph[opts.seriesIndex].float_precision,
      );
    }
    if (value === null) return;
    return truncateFloat(value, conf.series_in_graph[opts.seriesIndex].float_precision);
  };
}

function getPlotOptions_radialBar(config: ChartCardConfig) {
  if (config.chart_type === 'radialBar') {
    return {
      track: {
        background: 'rgba(128, 128, 128, 0.2)',
      },
    };
  } else {
    return {};
  }
}

function getLegendFormatter(config: ChartCardConfig, hass: HomeAssistant | undefined) {
  return function (_, opts, conf = config, hass2 = hass) {
    const name = computeName(
      opts.seriesIndex,
      conf.series_in_graph,
      undefined,
      hass2?.states[conf.series_in_graph[opts.seriesIndex].entity],
    );
    if (!conf.series_in_graph[opts.seriesIndex].show.legend_value) {
      return [name];
    } else {
      let value = TIMESERIES_TYPES.includes(config.chart_type)
        ? opts.w.globals.series[opts.seriesIndex].slice(-1)[0]
        : opts.w.globals.series[opts.seriesIndex];
      if (!conf.series_in_graph[opts.seriesIndex]?.show.as_duration) {
        value = truncateFloat(value, conf.series_in_graph[opts.seriesIndex].float_precision);
      }
      const uom = computeUom(
        opts.seriesIndex,
        conf.series_in_graph,
        undefined,
        hass2?.states[conf.series_in_graph[opts.seriesIndex].entity],
      );
      let valueString = '';
      if (value === undefined || value === null) {
        valueString = `<strong>${NO_VALUE} ${uom}</strong>`;
      } else {
        if (conf.series_in_graph[opts.seriesIndex]?.show.as_duration) {
          valueString = `<strong>${prettyPrintTime(
            value,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            conf.series_in_graph[opts.seriesIndex].show.as_duration!,
          )}</strong>`;
        } else {
          valueString = `<strong>${value} ${uom}</strong>`;
        }
      }
      return [name + ':', valueString];
    }
  };
}

function getStrokeCurve(config: ChartCardConfig) {
  return config.series_in_graph.map((serie) => {
    return serie.curve || 'smooth';
  });
}

function getDataLabels_enabledOnSeries(config: ChartCardConfig) {
  return config.series_in_graph.flatMap((serie, index) => {
    return serie.show.datalabels ? [index] : [];
  });
}

function getStrokeWidth(config: ChartCardConfig) {
  if (config.chart_type !== undefined && config.chart_type !== 'line')
    return config.apex_config?.stroke?.width === undefined ? 3 : config.apex_config?.stroke?.width;
  return config.series_in_graph.map((serie) => {
    if (serie.stroke_width !== undefined) {
      return serie.stroke_width;
    }
    return [undefined, 'line', 'area'].includes(serie.type) ? 5 : 0;
  });
}

function getFillType(config: ChartCardConfig) {
  if (!config.experimental?.color_threshold) {
    return config.apex_config?.fill?.type || 'solid';
  } else {
    return config.series_in_graph.map((serie) => {
      if (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        !PLAIN_COLOR_TYPES.includes(config.chart_type!) &&
        serie.type !== 'column' &&
        serie.color_threshold &&
        serie.color_threshold.length > 0
      ) {
        return 'gradient';
      }
      return 'solid';
    });
  }
}
