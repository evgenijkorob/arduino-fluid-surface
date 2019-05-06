const AppRenderer = require('./app-renderer');
const AppModel = require('./app-model');

class AppController {
  constructor() {
    this.data = new AppModel();
    this.view = new AppRenderer(this.data);
    this.setDevice();
    this.data.dom = this.view.render();
    this.setHandlers();
    return this.data.dom;
  }

  setDevice() {
    this.data.createDevice();
    this.data.device
    .on('data', console.log)
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
