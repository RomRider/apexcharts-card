import { HomeAssistant } from 'custom-card-helpers';
import { moment } from './const';
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
    // plotOptions: {
    //   bar: {
    //     distributed: true,
    //   },
    // },
    series: config?.series.map((serie, index) => {
      return {
        name: computeName(index, config, hass?.states),
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
    yaxis: {
      decimalsInFloat: 1,
    },
    tooltip: {
      x: {
        formatter:
          config.hours_to_show < 24
            ? function (val) {
                return moment(new Date(val)).format('HH:mm:ss');
              }
            : function (val) {
                return moment(new Date(val)).format('MMM Do, HH:mm:ss');
              },
      },
      fixed: {
        enabled: true,
        postion: 'topRight',
      },
    },
    legend: {
      formatter: function (_, opts, conf = config, hass2 = hass) {
        return [
          computeName(opts.seriesIndex, conf, undefined, hass2?.states[conf.series[opts.seriesIndex].entity]),
          ' - ',
          `<strong>${opts.w.globals.series[opts.seriesIndex].slice(-1)}${computeUom(
            opts.seriesIndex,
            conf,
            undefined,
            hass2?.states[conf.series[opts.seriesIndex].entity],
          )}</strong>`,
        ];
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
