import { HomeAssistant } from 'custom-card-helpers';
import parse from 'parse-duration';
import {
  DEFAULT_FLOAT_PRECISION,
  DEFAULT_SERIE_TYPE,
  HOUR_24,
  moment,
  NO_VALUE,
  PLAIN_COLOR_TYPES,
  TIMESERIES_TYPES,
} from './const';
import { ChartCardConfig } from './types';
import { computeName, computeUom, mergeDeep, prettyPrintTime } from './utils';
import { layoutMinimal } from './layouts/minimal';

export function getLayoutConfig(config: ChartCardConfig, hass: HomeAssistant | undefined = undefined): unknown {
  const def = {
    chart: {
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
      type: config.series.map((serie) => {
        if (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          PLAIN_COLOR_TYPES.includes(config.chart_type!) &&
          serie.type !== 'column' &&
          serie.color_threshold &&
          serie.color_threshold.length > 0
        ) {
          return 'gradient';
        }
        return 'solid';
      }),
    },
    series: getSeries(config, hass),
    labels: getLabels(config, hass),
    xaxis: getXAxis(config),
    yaxis: getYAxis(config),
    tooltip: {
      x: {
        formatter: getXTooltipFormatter(config),
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
  return config.series.flatMap((serie) => {
    if (!serie.show.in_chart) return [];
    return [serie.type === 'area' ? 0.7 : 1];
  });
}

function getSeries(config: ChartCardConfig, hass: HomeAssistant | undefined) {
  if (TIMESERIES_TYPES.includes(config.chart_type)) {
    return config?.series.flatMap((serie, index) => {
      if (!serie.show.in_chart) return [];
      return [
        {
          name: computeName(index, config.series, undefined, hass?.states[serie.entity]),
          type: serie.type,
          data: [],
        },
      ];
    });
  } else {
    return [];
  }
}

function getLabels(config: ChartCardConfig, hass: HomeAssistant | undefined) {
  if (TIMESERIES_TYPES.includes(config.chart_type)) {
    return [];
  } else {
    return config.series.flatMap((serie, index) => {
      if (!serie.show.in_chart) return [];
      return [computeName(index, config.series, undefined, hass?.states[serie.entity])];
    });
  }
}

function getXAxis(config: ChartCardConfig) {
  if (TIMESERIES_TYPES.includes(config.chart_type)) {
    return {
      type: 'datetime',
      // range: getMilli(config.hours_to_show),
      labels: {
        datetimeUTC: false,
        datetimeFormatter: getDateTimeFormatter(config.hours_12),
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

function getXTooltipFormatter(config: ChartCardConfig): ((val: number) => string) | undefined {
  if (config.apex_config?.tooltip?.x?.format) return undefined;
  let hours = 'HH:mm:ss';
  let days = 'MMM Do, HH:mm:ss';
  if (config.hours_12) {
    hours = 'hh:mm:ss a';
    days = 'MMM Do, hh:mm:ss';
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return parse(config.graph_span)! < HOUR_24 && !config.span?.offset
    ? function (val) {
        return moment(new Date(val)).format(hours);
      }
    : function (val) {
        return moment(new Date(val)).format(days);
      };
}

function getYTooltipFormatter(config: ChartCardConfig, hass: HomeAssistant | undefined) {
  return function (value, opts, conf = config, hass2 = hass) {
    if (
      value !== null &&
      typeof value === 'number' &&
      !Number.isInteger(value) &&
      !conf.series_in_graph[opts.seriesIndex]?.show.as_duration
    ) {
      value = (value as number).toFixed(
        conf.series_in_graph[opts.seriesIndex].float_precision === undefined
          ? DEFAULT_FLOAT_PRECISION
          : conf.series_in_graph[opts.seriesIndex].float_precision,
      );
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
    if (value === null) return;
    let lValue = value;
    if (lValue !== null && typeof lValue === 'number' && !Number.isInteger(lValue)) {
      lValue = (lValue as number).toFixed(
        conf.series_in_graph[opts.seriesIndex].float_precision === undefined
          ? DEFAULT_FLOAT_PRECISION
          : conf.series_in_graph[opts.seriesIndex].float_precision,
      );
    }
    return lValue;
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
      if (
        value !== null &&
        typeof value === 'number' &&
        !Number.isInteger(value) &&
        !conf.series_in_graph[opts.seriesIndex]?.show.as_duration
      ) {
        value = (value as number).toFixed(
          conf.series_in_graph[opts.seriesIndex].float_precision === undefined
            ? DEFAULT_FLOAT_PRECISION
            : conf.series_in_graph[opts.seriesIndex].float_precision,
        );
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
  return config.series.flatMap((serie) => {
    if (!serie.show.in_chart) return [];
    return [serie.curve || 'smooth'];
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
  return config.series.map((serie, index) => {
    if (serie.type === 'column') {
      return 0;
    } else if (config.apex_config?.stroke?.width !== undefined) {
      if (Array.isArray(config.apex_config.stroke.width)) {
        return [null, undefined].includes(config.apex_config.stroke.width[index] as never)
          ? 5
          : config.apex_config.stroke.width[index];
      } else {
        return config.apex_config.stroke.width[index];
      }
    }
    return 5;
  });
}
