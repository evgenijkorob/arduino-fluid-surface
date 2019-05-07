const AppRenderer = require('./app-renderer');
const AppModel = require('./app-model');
const DeviceOutputParser = require('./device-out-parser');

class AppController {
  constructor() {
    this.data = new AppModel();
    this.view = new AppRenderer(this.data);
    this.outputParser = new DeviceOutputParser();
    this.setParserCallbacks();
    this.setDevice();
    this.data.dom = this.view.render();
    this.setHandlers();
    return this.data.dom;
  }

  setParserCallbacks() {
    this.outputParser
    .on('mode', (mode) => console.log('Start in ' + mode + ' mode'))
    .on('begin', () => console.log('Beginning...'))
    .on('data', (data) => console.log(data))
    .on('end', () => console.log('Ending...'));
  }

  setDevice() {
    this.data.createDevice();
    this.data.device
    .on('data', (data) => this.outputParser.parse(data))
    .on('close', function() {
      this.view.updateInfoPanel('Девайс отключён!');
      this.view.updateConnectionButton();
    }.bind(this))
    .on('open', function() {
      this.view.updateInfoPanel('Девайс подключён!');
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
      }
    });
  }
}

module.exports = AppController;
