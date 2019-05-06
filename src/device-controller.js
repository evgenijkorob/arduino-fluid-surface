const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

class DeviceController {
  constructor(deviceSerialNum, baudRate) {
    this.serialNum = deviceSerialNum;
    this.baudRate = baudRate;
    this.devicePortInfo = null;
    this.port = null;
    this.parser = new Readline();
    this.dataHandler = null;
    this.closeHandler = null;
    this.openHandler = null;
    this.errorHandler = function(err) {
      alert(err);
    };
    return this;
  }

  on(eventName, callback) {
    switch(eventName) {
      case 'open':
        this.openHandler = callback;
        break;
      case 'data':
        this.dataHandler = callback;
        break;
      case 'error':
        this.errorHandler = callback;
        break;
      case 'close':
        this.closeHandler = callback;
        break;
    }
    return this;
  }

  async connect() {
    try {
      if (!this.dataHandler) {
        throw new Error('Обработчик данных не назначен!');
      }
      await this._connectToDevice();
    }
    catch (e) {
      this.errorHandler(e);
    }
  }

  async _connectToDevice() {
    this.devicePortInfo = null;
    try {
      this.devicePortInfo = await this._searchPort();
    }
    catch (e) {
      throw e;
    }
    this.port = new SerialPort(
      this.devicePortInfo.comName,
      {
        baudRate: this.baudRate
      }
    );
    this.port.on('open', () => {
      this.port.pipe(this.parser);
      this.parser.on('data', this.dataHandler);
      if (this.openHandler) {
        this.openHandler();
      }
    });
    this.port.on('error', this.errorHandler);
    this.port.on('close', this.closeHandler);
  }

  async _searchPort() {
    let ports;
    try {
      ports = await SerialPort.list();
      if (ports.length === 0) {
        throw new Error('Действующие COM-порты не найдены!');
      }
      let devicePort = ports.filter((port) => {
        return port.serialNumber === this.serialNum;
      })[0];
      if (!devicePort) {
        throw new Error('Устройство не найдено!');
      }
      return devicePort;
    }
    catch (e) {
      throw e;
    }
  }
}

module.exports = DeviceController;