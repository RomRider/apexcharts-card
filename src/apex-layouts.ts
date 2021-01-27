import { HomeAssistant } from 'custom-card-helpers';
import parse from 'parse-duration';
import { HOUR_24, moment } from './const';
import { ChartCardConfig } from './types';
import { computeName, computeUom, mergeDeep } from './utils';

export function getLayoutConfig(config: ChartCardConfig, hass: HomeAssistant | undefined = undefined): unknown {
  const def = {
    chart: {
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
      opacity: config.series.map((serie) => {
        return serie.type === 'area' ? 0.7 : 1;
      }),
    },
    series: config?.series.map((serie, index) => {
      return {
        name: computeName(index, config, undefined, hass?.states[serie.entity]),
        type: serie.type,
        data: [],
      };
    }),
    xaxis: {
      type: 'datetime',
      // range: getMilli(config.hours_to_show),
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: Array.isArray(config.apex_config?.yaxis)
      ? undefined
      : {
          decimalsInFloat: 1,
        },
    tooltip: {
      x: {
        formatter:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          parse(config.graph_span!)! < HOUR_24 && !config.span?.offset
            ? function (val) {
                return moment(new Date(val)).format('HH:mm:ss');
              }
            : function (val) {
                return moment(new Date(val)).format('MMM Do, HH:mm:ss');
              },
      },
      y: {
        formatter: function (value, opts, conf = config, hass2 = hass) {
          if (value !== null && typeof value === 'number' && !Number.isInteger(value)) {
            value = (value as number).toFixed(1);
          }
          const uom = computeUom(
            opts.seriesIndex,
            conf,
            undefined,
            hass2?.states[conf.series[opts.seriesIndex].entity],
          );
          return [`<strong>${value} ${uom}</strong>`];
        },
      },
      fixed: {
        enabled: true,
        postion: 'topRight',
      },
    },
    dataLabels: {
      formatter: function (value, _) {
        let lValue = value;
        if (value !== null && typeof value === 'number' && !Number.isInteger(value)) {
          lValue = (value as number).toFixed(1);
        }
        if (lValue === null) return;
        return lValue;
      },
    },
    legend: {
      formatter: function (_, opts, conf = config, hass2 = hass) {
        const name =
          computeName(opts.seriesIndex, conf, undefined, hass2?.states[conf.series[opts.seriesIndex].entity]) + ':';
        let value = opts.w.globals.series[opts.seriesIndex].slice(-1)[0];
        if (value !== null && typeof value === 'number' && !Number.isInteger(value)) {
          value = (value as number).toFixed(1);
        }
        const uom = computeUom(opts.seriesIndex, conf, undefined, hass2?.states[conf.series[opts.seriesIndex].entity]);
        return [name, value === undefined ? `<strong>N/A ${uom}</strong>` : `<strong>${value} ${uom}</strong>`];
      },
    },
    stroke: {
      curve: config.series.map((serie) => {
        return serie.curve || 'smooth';
      }),
      lineCap: 'butt',
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
