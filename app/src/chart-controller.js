//const Chart = require('chart.js');
const FileSaver = require('file-saver');

class ChartController {
  constructor(chartsContaner) {
    this._mode = null;
    this._charts = chartsContaner;
    window.addEventListener('beforeprint', function(ev) {
      for (let id in Chart.instances) {
        Chart.instances[id].resize();
      }
    }.bind(this));
    Chart.defaults.global.elements.line.tension = 0;
    Chart.defaults.global.elements.line.borderWidth = 4;
    Chart.defaults.global.elements.point.radius = 4;
  }

  get _modeProps() {
    return this._charts[this._mode];
  }

  onModeGet(mode) {
    this._mode = null;
    switch(mode) {
      case 'surface':
      case 'deep':
        this._mode = mode;
    }
    if (!this._mode) {
      return;
    }
    let modeProps = this._modeProps;
    this._modeProps.options.options = this._charts.sharedOptions;
    this._modeProps.options.options.title.text = 'Измерение ' + ((this._mode === 'deep') ? 'глубины' : 'формы');
    if (!modeProps.chart) {
      modeProps.chart = new Chart(
        this._modeProps.canvas,
        this._modeProps.options
      );
    }
  }

  onBegin() {
    if (!this._modeProps.options.data) {
      this._modeProps.options.data = {};
      this._modeProps.options.data.datasets = [];
    }
    this._modeProps.options.data.datasets.push({
      label: `#${this._modeProps.options.data.datasets.length + 1}`,
      data: [],
      showLine: true,
      fill: false,
      interpolate: true
    });
    this._modeProps.chart.update();
  }

  onDataGet(receivedDataStrings) {
    let x = +receivedDataStrings[0],
        y = +receivedDataStrings[1],
        rps = +receivedDataStrings[2],
        length = this._modeProps.options.data.datasets.length;
    this._modeProps.options.data.datasets[length - 1].data.push({
      x: x,
      y: y,
      rps: rps
    });
    this._modeProps.chart.update(0);
  }

  onEnd() {
  }

  save(onStart, onEnd) {
    onStart();
    let saveOptions = {type: "text/plain;charset=utf-8"},
        deepFileName,
        surfaceFileName,
        deepBlob,
        surfaceBlob;
    if (this._charts.deep.options.data) {
      deepBlob = this._makeBlob('deep', saveOptions);
      deepFileName = this._generateFileName('deep');
      FileSaver.saveAs(deepBlob, deepFileName + '.txt');
    }
    if (this._charts.surface.options.data) {
      surfaceBlob = this._makeBlob('surface', saveOptions);
      surfaceFileName = this._generateFileName('surface');
      FileSaver.saveAs(surfaceBlob, surfaceFileName + '.txt');
    }
    onEnd();
  }

  _makeBlob(mode, saveOptions) {
    let content = this._makeContent(mode);
    return new Blob([content], saveOptions);
  }

  _makeContent(mode) {
    let modeOptions = this._charts[mode].options,
        datasets = modeOptions.data.datasets,
        modeTitle = modeOptions.options.title.text,
        content = `${modeTitle}\n\nX\tY\tRPS\n`;
    datasets.forEach((dataset) => {
      content += `\n${dataset.label}\n`;
      dataset.data.forEach((data) => {
        content += `${data.x}\t${data.y}\t${data.rps}\n`;
      });
    });
    return content;
  }

  _generateFileName(mode) {
    let dateFormatter = new Intl.DateTimeFormat('ru', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        }),
        timeFormatter = new Intl.DateTimeFormat('ru', {
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
          seconds: 'numeric'
        }),
        now = new Date(),
        formatedDateStr = dateFormatter.format(now),
        formatedTimeStr = timeFormatter.format(now),
        fileName = `${mode}_${formatedDateStr}-${formatedTimeStr}`;
    return fileName;
  }
}

module.exports = ChartController;
