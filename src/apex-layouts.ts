import { HomeAssistant } from 'custom-card-helpers';
import parse from 'parse-duration';
import { DEFAULT_FLOAT_PRECISION, DEFAULT_SERIE_TYPE, HOUR_24, moment, NO_VALUE, TIMESERIES_TYPES } from './const';
import { ChartCardConfig } from './types';
import { computeName, computeUom, mergeDeep, prettyPrintTime } from './utils';

export function getLayoutConfig(config: ChartCardConfig, hass: HomeAssistant | undefined = undefined): unknown {
  const def = {
    chart: {
      type: config.chart_type || DEFAULT_SERIE_TYPE,
      stacked: config?.stacked,
      // type: 'line',
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
      opacity: config.series.flatMap((serie) => {
        if (!serie.show.in_chart) return [];
        return [serie.type === 'area' ? 0.7 : 1];
      }),
    },
    series: TIMESERIES_TYPES.includes(config.chart_type)
      ? config?.series.flatMap((serie, index) => {
          if (!serie.show.in_chart) return [];
          return [
            {
              name: computeName(index, config.series, undefined, hass?.states[serie.entity]),
              type: serie.type,
              data: [],
            },
          ];
        })
      : [],
    labels: TIMESERIES_TYPES.includes(config.chart_type)
      ? []
      : config.series.flatMap((serie, index) => {
          if (!serie.show.in_chart) return [];
          return [computeName(index, config.series, undefined, hass?.states[serie.entity])];
        }),
    xaxis: TIMESERIES_TYPES.includes(config.chart_type)
      ? {
          type: 'datetime',
          // range: getMilli(config.hours_to_show),
          labels: {
            datetimeUTC: false,
            datetimeFormatter: getDateTimeFormatter(config.hours_12),
          },
        }
      : {},
    yaxis: Array.isArray(config.apex_config?.yaxis)
      ? undefined
      : {
          decimalsInFloat: config.y_axis_precision === undefined ? DEFAULT_FLOAT_PRECISION : config.y_axis_precision,
        },
    tooltip: {
      x: {
        formatter: getXTooltipFormatter(config),
      },
      y: {
        formatter: function (value, opts, conf = config, hass2 = hass) {
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
        },
      },
    },
    dataLabels: {
      formatter: function (value, opts, conf = config) {
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
      },
    },
    plotOptions: {
      radialBar:
        config.chart_type === 'radialBar'
          ? {
              track: {
                background: 'rgba(128, 128, 128, 0.2)',
              },
            }
          : {},
    },
    legend: {
      position: 'bottom',
      show: true,
      formatter: function (_, opts, conf = config, hass2 = hass) {
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
      },
    },
    stroke: {
      curve: config.series.flatMap((serie) => {
        if (!serie.show.in_chart) return [];
        return [serie.curve || 'smooth'];
      }),
      lineCap: config.chart_type === 'radialBar' ? 'round' : 'butt',
      colors:
        config.chart_type === 'pie' || config.chart_type === 'donut' ? ['var(--card-background-color)'] : undefined,
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
      conf = {
        chart: {
          offsetY: 15,
          parentHeightOffset: 0,
        },
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0,
          },
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            show: true,
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          show: false,
          showAlways: true,
          tooltip: {
            enabled: true,
          },
        },
        legend: {
          position: 'top',
        },
      };
      break;

    default:
      break;
  }

  return config.apex_config ? mergeDeep(mergeDeep(def, conf), config.apex_config) : mergeDeep(def, conf);
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
