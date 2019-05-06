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
    }.bind(this))
    .on('open', function() {
      this.view.updateInfoPanel('Девайс подключён!');
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
          if (await this.data.device.connect()) {
            this.view.updateConnectionButton();
          };
          break;
        case 'disconnect':
          if (await this.data.device.disconnect()) {
            this.view.updateConnectionButton();
          };
          break;
      }
    });
  }
}

module.exports = AppController;
