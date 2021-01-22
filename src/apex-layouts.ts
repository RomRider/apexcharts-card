import moment from 'moment';
import { ChartCardConfig } from './types';
import { getMilli, mergeDeep } from './utils';

export function getLayoutConfig(config: ChartCardConfig): unknown {
  const def = {
    chart: {
      stacked: config?.stacked,
      type: 'line',
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
    series: config?.series.map((serie) => {
      return {
        name: serie.name || serie.entity,
        type: serie.type || 'line',
        data: [],
      };
    }),
    xaxis: {
      type: 'datetime',
      range: getMilli(config.hours_to_show),
      labels: {
        datetimeUTC: false,
      },
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
    stroke: {
      curve: config.series.map((serie) => {
        return serie.curve || 'smooth';
      }),
      lineCap: 'round',
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
