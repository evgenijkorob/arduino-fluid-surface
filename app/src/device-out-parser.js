class DeviceOutputParser {
  constructor() {
    this.onMode = function(){};
    this.onBegin = function(){};
    this.onData = function(){};
    this.onEnd = function(){};
  }

  parse(str) {
    let result;
    if ((result = str.match(this._modeRegExp)) !== null) {
      this.onMode(result[0]);
      return;
    }
    if ((result = str.match(this._beginRegExp)) !== null) {
      this.onBegin();
      return;
    }
    if ((result = str.match(this._dataRegExp)) !== null) {
      this.onData(result);
      return;
    }
    if ((result = str.match(this._endRegExp)) !== null) {
      this.onEnd();
      return;
    }
  }

  get _modeRegExp() {
    return /((?<=mode\s)\w+)/gi;
  }

  get _beginRegExp() {
    return /begin/gi;
  }

  get _dataRegExp() {
    return /([-]?\d+\.?\d*)/gi;
  }

  get _endRegExp() {
    return /end/gi;
  }

  on(eventName, callback) {
    switch(eventName) {
      case 'mode':
        this.onMode = callback;
        break;
      case 'begin':
        this.onBegin = callback;
        break;
      case 'data':
        this.onData = callback;
        break;
      case 'end':
        this.onEnd = callback;
        break;
    }
    return this;
  }
}

module.exports = DeviceOutputParser;
