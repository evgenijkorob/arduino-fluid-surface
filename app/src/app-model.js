const DeviceController = require('./device-controller');

class AppModel {
  constructor() {
    this.device = null;
    this.dom = null;
  }

  createDevice() {
    this.device = new DeviceController();
  }
}

module.exports = AppModel;
