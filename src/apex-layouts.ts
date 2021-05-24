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
import { getLocales, getDefaultLocale } from './locales';

export function getLayoutConfig(config: ChartCardConfig, hass: HomeAssistant | undefined = undefined): unknown {
  const locales = getLocales();
  const def = {
    chart: {
      locales: [
        (config.locale && locales[config.locale]) || (hass?.language && locales[hass.language]) || getDefaultLocale(),
      ],
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
      opacity: getFillOpacity(config, false),
      type: getFillType(config, false),
    },
    series: getSeries(config, hass, false),
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
      enabled: getDataLabelsEnabled(config),
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
      curve: getStrokeCurve(config, false),
      lineCap: config.chart_type === 'radialBar' ? 'round' : 'butt',
      colors:
        config.chart_type === 'pie' || config.chart_type === 'donut' ? ['var(--card-background-color)'] : undefined,
      width: getStrokeWidth(config, false),
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

  return config.apex_config
    ? mergeDeep(mergeDeep(def, conf), evalApexConfig(config.apex_config))
    : mergeDeep(def, conf);
}

export function getBrushLayoutConfig(
  config: ChartCardConfig,
  hass: HomeAssistant | undefined = undefined,
  id: string,
): unknown {
  const locales = getLocales();
  const def = {
    chart: {
      locales: [
        (config.locale && locales[config.locale]) || (hass?.language && locales[hass.language]) || getDefaultLocale(),
      ],
      defaultLocale:
        (config.locale && locales[config.locale] && config.locale) ||
        (hass?.language && locales[hass.language] && hass.language) ||
        'en',
      type: config.chart_type || DEFAULT_SERIE_TYPE,
      stacked: config?.stacked,
      foreColor: 'var(--primary-text-color)',
      width: '100%',
      height: '120px',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      id: Math.random().toString(36).substring(7),
      brush: {
        target: id,
        enabled: true,
      },
    },
    grid: {
      strokeDashArray: 3,
    },
    fill: {
      opacity: getFillOpacity(config, true),
      type: getFillType(config, true),
    },
    series: getSeries(config, hass, true),
    xaxis: getXAxis(config, hass),
    yaxis: {
      tickAmount: 2,
      decimalsInFloat: DEFAULT_FLOAT_PRECISION,
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      curve: getStrokeCurve(config, true),
      lineCap: config.chart_type === 'radialBar' ? 'round' : 'butt',
      colors:
        config.chart_type === 'pie' || config.chart_type === 'donut' ? ['var(--card-background-color)'] : undefined,
      width: getStrokeWidth(config, true),
    },
    markers: {
      showNullDataPoints: false,
    },
    noData: {
      text: 'Loading...',
    },
  };
  return config.brush?.apex_config ? mergeDeep(def, evalApexConfig(config.brush.apex_config)) : def;
}

function getFillOpacity(config: ChartCardConfig, brush: boolean): number[] {
  const series = brush ? config.series_in_brush : config.series_in_graph;
  return series.map((serie) => {
    return serie.opacity !== undefined ? serie.opacity : serie.type === 'area' ? DEFAULT_AREA_OPACITY : 1;
  });
}

function getSeries(config: ChartCardConfig, hass: HomeAssistant | undefined, brush: boolean) {
  const series = brush ? config.series_in_brush : config.series_in_graph;
  if (TIMESERIES_TYPES.includes(config.chart_type)) {
    return series.map((serie, index) => {
      return {
        name: computeName(index, series, undefined, hass?.states[serie.entity]),
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
  return Array.isArray(config.apex_config?.yaxis) || config.yaxis
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        return new Intl.DateTimeFormat(lang, {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          ...hours_12,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any).format(val);
      };
}

function getYTooltipFormatter(config: ChartCardConfig, hass: HomeAssistant | undefined) {
  return function (value, opts, conf = config, hass2 = hass) {
    let lValue = value;
    if (conf.series_in_graph[opts.seriesIndex]?.invert && lValue) {
      lValue = -lValue;
    }
    if (!conf.series_in_graph[opts.seriesIndex]?.show.as_duration) {
      lValue = truncateFloat(lValue, conf.series_in_graph[opts.seriesIndex].float_precision);
    }
    const uom = computeUom(
      opts.seriesIndex,
      conf.series_in_graph,
      undefined,
      hass2?.states[conf.series_in_graph[opts.seriesIndex].entity],
    );
    return conf.series_in_graph[opts.seriesIndex]?.show.as_duration
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [`<strong>${prettyPrintTime(lValue, conf.series_in_graph[opts.seriesIndex].show.as_duration!)}</strong>`]
      : [`<strong>${lValue} ${uom}</strong>`];
  };
}

function getDataLabelsEnabled(config: ChartCardConfig): boolean {
  return (
    !TIMESERIES_TYPES.includes(config.chart_type) ||
    config.series_in_graph.some((serie) => {
      return serie.show.datalabels;
    })
  );
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
    let lValue = value;
    if (conf.series_in_graph[opts.seriesIndex]?.invert && lValue) {
      lValue = -lValue;
    }
    return truncateFloat(lValue, conf.series_in_graph[opts.seriesIndex].float_precision);
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
      if (conf.series_in_graph[opts.seriesIndex]?.invert && value) {
        value = -value;
      }
      if (!conf.series_in_graph[opts.seriesIndex]?.show.as_duration) {
        value = truncateFloat(value, conf.series_in_graph[opts.seriesIndex].float_precision);
      }
      const uom =
        config.chart_type === 'radialBar'
          ? '%'
          : computeUom(
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

function getStrokeCurve(config: ChartCardConfig, brush: boolean) {
  const series = brush ? config.series_in_brush : config.series_in_graph;
  return series.map((serie) => {
    return serie.curve || 'smooth';
  });
}

function getDataLabels_enabledOnSeries(config: ChartCardConfig) {
  return config.series_in_graph.flatMap((serie, index) => {
    return serie.show.datalabels ? [index] : [];
  });
}

function getStrokeWidth(config: ChartCardConfig, brush: boolean) {
  if (config.chart_type !== undefined && config.chart_type !== 'line')
    return config.apex_config?.stroke?.width === undefined ? 3 : config.apex_config?.stroke?.width;
  const series = brush ? config.series_in_brush : config.series_in_graph;
  return series.map((serie) => {
    if (serie.stroke_width !== undefined) {
      return serie.stroke_width;
    }
    return [undefined, 'line', 'area'].includes(serie.type) ? 5 : 0;
  });
}

function getFillType(config: ChartCardConfig, brush: boolean) {
  if (!config.experimental?.color_threshold) {
    return brush ? config.brush?.apex_config?.fill?.type || 'solid' : config.apex_config?.fill?.type || 'solid';
  } else {
    const series = brush ? config.series_in_brush : config.series_in_graph;
    return series.map((serie) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function evalApexConfig(apexConfig: any): any {
  const eval2 = eval;
  Object.keys(apexConfig).forEach((key) => {
    if (typeof apexConfig[key] === 'string' && apexConfig[key].trim().startsWith('EVAL:')) {
      apexConfig[key] = eval2(`(${apexConfig[key].trim().slice(5)})`);
    }
    if (typeof apexConfig[key] === 'object') {
      apexConfig[key] = evalApexConfig(apexConfig[key]);
    }
  });
  return apexConfig;
}
