const AppRenderer = require('./app-renderer');
const AppModel = require('./app-model');
const DeviceOutputParser = require('./device-out-parser');
const ChartController = require('./chart-controller');

class AppController {
  constructor() {
    this.data = new AppModel();
    this.view = new AppRenderer(this.data);
    this.outputParser = new DeviceOutputParser();
    this.chartController = new ChartController(this.data.charts);
    this.setParserCallbacks();
    this.setDevice();
    this.data.dom = this.view.render();
    this.setHandlers();
    return this.data.dom;
  }

  setParserCallbacks() {
    this.outputParser
    .on('mode', (mode) => {
      console.log('Start in ' + mode + ' mode');
      this.chartController.onModeGet(mode);
      this.view.updateCharts();
    })
    .on('begin', () => {
      console.log('Beginning...');
      this.chartController.onBegin();
    })
    .on('data', (data) => {
      this.chartController.onDataGet(data);
    })
    .on('end', () => {
      console.log('Ending...');
      this.chartController.onEnd();
    });
  }

  setDevice() {
    this.data.createDevice();
    this.data.device
    .on('data', (data) => this.outputParser.parse(data))
    .on('close', function() {
      this.view.updateInfoPanel('Девайс отключён');
      this.view.updateConnectionButton();
    }.bind(this))
    .on('open', function() {
      this.view.updateInfoPanel('Девайс подключён');
      this.view.updateConnectionButton();
    }.bind(this));
  }

  setHandlers() {
    this.data.dom.addEventListener('click', async (ev) => {
      const actAttr = 'data-action';
      let target = ev.target.closest(`*[${actAttr}]`);
      if (!target) {
        return;
      }
      let action = target.getAttribute(actAttr);
      switch(action) {
        case 'connect':
          await this.data.device.connect();
          break;
        case 'disconnect':
          await this.data.device.disconnect();
          break;
        case 'save':
          this.chartController.save(
            function() {
              this.view.updateInfoPanel('Сохраняется...');
              this.view.updateSaveButton(false);
            }.bind(this),
            function() {
              this.view.updateInfoPanel('Сохранено');
              this.view.updateSaveButton(true);
            }.bind(this)
          );
          break;
      }
    });
  }
}

module.exports = AppController;
