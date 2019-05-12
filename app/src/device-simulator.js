class DeviceSimulator {
  constructor() {
    this.dataHandler = null;
    this.closeHandler = null;
    this.openHandler = null;
    this.errorHandler = function(err) {
      alert(err);
    };
    this._isConnected = false;
    this._timer;
    this._modeCount = 1;
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
    this._isConnected = true;
    this.openHandler();
    this._modeCount++;
    this._timer = setTimeout(() => this._makeJob(), 1000);
    return true;
  }

  async disconnect() {
    this._isConnected = false;
    this.closeHandler();
    clearTimeout(this._timer);
    return true;
  }

  get isConnected() {
    return this._isConnected;
  }

  async _makeJob() {
    let modeStr = (this._modeCount % 2) ? 'surface' : 'deep';
    this.dataHandler('mode ' + modeStr);
    //await this._delay(1000);
    this.dataHandler('begin');
    for (let i = 0, x = -1, y = 0; i < 30; i++) {
      x += 10;
      y += this._makeRand(0, 3);
      let rps = this._makeRand(1, 4);
      //await this._delay(300);
      this.dataHandler(`${x} ${y} ${rps}`);
    }
    this.dataHandler('end');
  }

  _makeRand(min, max) {
    let a = Math.floor(Math.random() * (max + 1)) + min;
    return a;
  }

  _delay(ms) {
    return new Promise(function(res, rej) {
      this._timer = setTimeout(res, ms);
    }.bind(this));
  }
}

module.exports = DeviceSimulator;
