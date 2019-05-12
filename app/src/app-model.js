const DeviceController =
//require('./device-simulator')
require('./device-controller')
;


class AppModel {
  constructor() {
    this.device = null;
    this.dom = null;
    this.charts = {
      surface: {
        canvas: null,
        chart: null,
        options: {
          type: 'scatter',
          data: null,
          options: null
        }
      },
      deep: {
        canvas: null,
        chart: null,
        options: {
          type: 'scatter',
          data: null,
          options: null
        }
      },
      sharedOptions: {
        maintainAspectRatio: true,
        title: {
          display: true,
          position: 'bottom',
          fontSize: 20,
          fontColor: 'rgba(255,255,255)'
        },
        tooltips: {
          titleFontSize: 18,
          bodyFontSize: 18,
          footerFontSize: 18,
          mode: "interpolate",
          intersect: false,
          callbacks: {
            title: function(a, d) {
              return a[0].xLabel.toFixed(2);
            },
            label: function(i, d) {
              return (
                d.datasets[i.datasetIndex].label + ": " + i.yLabel.toFixed(2)
              );
            }
          }
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              fontSize: 18,
              fontColor: 'rgba(255,255,255)'
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.2)',
              tickMarkLength: 15,
              lineWidth: 2
            }
          }],
          xAxes: [{
            scaleLabel: {
              fontSize: 18,
              fontColor: 'rgba(255,255,255)'
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.2)',
              tickMarkLength: 15,
              lineWidth: 2
            }
          }]
        },
        plugins: {
          colorschemes: {
            scheme: 'tableau.Classic10'
          },
          crosshair: {
            sync: {
              enabled: false
            }
          }
        },
        legend: {
          labels: {
            fontColor: 'white',
            fontSize: 20
          }
        }
      }
    };
  }

  createDevice() {
    this.device = new DeviceController();
  }
}

module.exports = AppModel;
