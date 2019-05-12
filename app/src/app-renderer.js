const APP_CLASSES = {
  app: {
    tag: 'section',
    classList: ['app']
  },
  appInner: {
    tag: 'div',
    classList: ['app__inner']
  },
  deviceControl: {
    tag: 'div',
    classList: ['app__device-control']
  },
  button: {
    tag: 'button',
    classList: ['button', 'mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect', 'mdl-button--accent'],
    mod: {
      connect: '_action_connect',
      disconnect: '_action_disconnect',
      save: '_action_save',
      switchChart: '_action_switch-chart',
      disabled: '_disabled'
    }
  },
  connectInfoPanel: {
    tag: 'span',
    classList: ['app__connect-info-panel']
  },
  chartsControlPanel: {
    tag: 'div',
    classList: ['app__charts-control-panel']
  },
  chartsHolder: {
    tag: 'div',
    classList: ['app__charts-holder']
  },
  chartContainer: {
    tag: 'div',
    classList: ['app__chart-container'],
    mod: {
      invisible: '_invisible'
    }
  },
  chart: {
    tag: 'canvas',
    classList: ['app__chart'],
    mod: {
      surface: '_mode_surface',
      deep: '_mode_deep'
    }
  }
}

class AppRenderer {
  constructor(appModel) {
    this._data = appModel;
    this._dom = null;
  }

  render() {
    let dom = document.createElement('div');
    this._renderSkeleton(dom);
    let appInner = this.queryAppElemAll(dom, 'appInner')[0],
        deviceControl = this.queryAppElemAll(appInner, 'deviceControl')[0];
    this._renderDeviceControlPanel(deviceControl);
    this._renderChartsControlPanel(appInner);
    this._dom = dom.children[0];
    return this._dom;
  }

  _renderSkeleton(parent) {
    let app = this.createAppElem('app'),
        appInner = this.createAppElem('appInner'),
        deviceControl = this.createAppElem('deviceControl');
    parent.appendChild(app);
    app.appendChild(appInner);
    appInner.appendChild(deviceControl);
  }

  _renderChartsControlPanel(parent) {
    let panel = this.createAppElem('chartsControlPanel'),
        switchButton = this.createAppElem('button'),
        holder = this.createAppElem('chartsHolder');
    parent.appendChild(panel);
    panel.append(switchButton, holder);
    //switchButton.textContent = 'Сменить график';
    switchButton.setAttribute('data-action', 'switch-chart');
    switchButton.classList.add(this.getModClass('button', 'switch-chart'));
    this._renderChartsContainers(holder);
  }

  _renderChartsContainers(parent) {
    let surfaceContainer = this.createAppElem('chartContainer'),
        deepContainer = this.createAppElem('chartContainer'),
        chartSurface = this.createAppElem('chart'),
        chartDeep = this.createAppElem('chart'),
        surfaceMod = this.getModClass('chart', 'surface'),
        deepMod = this.getModClass('chart', 'deep');
    parent.append(surfaceContainer, deepContainer);
    deepContainer.appendChild(chartDeep);
    surfaceContainer.appendChild(chartSurface);
    chartSurface.classList.add(surfaceMod);
    chartDeep.classList.add(deepMod);
    this._data.charts.surface.canvas = chartSurface;
    this._data.charts.deep.canvas = chartDeep;
    this.updateCharts(parent);
  }

  _renderDeviceControlPanel(parent) {
    let connectButton = this.createAppElem('button'),
        saveButton = this.createAppElem('button'),
        connectInfoPanel = this.createAppElem('connectInfoPanel');
    parent.append(connectButton, saveButton, connectInfoPanel);
    this._setConnectButton(connectButton);
    this._setSaveButton(saveButton);
    this.updateInfoPanel('', parent);
  }

  _setSaveButton(button) {
    button.textContent = 'Сохранить';
    button.setAttribute('data-action', 'save');
    button.classList.add(this.getModClass('button', 'save'));
  }

  updateSaveButton(isEnabled) {
    let saveMod = this.getModClass('button', 'save'),
        button = this._dom.querySelector('.' + saveMod);
    if (isEnabled) {
      button.removeAttribute('disabled');
    }
    else {
      button.setAttribute('disabled', 'true');
    }
  }

  updateCharts(parent) {
    if (!parent) {
      parent = this._dom;
    }
    let invisibleMod = this.getModClass('chartContainer', 'invisible'),
        deepChartClass = this.getModClass('chart', 'deep'),
        deepContainer = parent.querySelector('.' + deepChartClass).parentNode,
        surfaceChartClass = this.getModClass('chart', 'surface'),
        surfaceContainer = parent.querySelector('.' + surfaceChartClass).parentNode,
        charts = this._data.charts;
    if (charts.deep.chart) {
      deepContainer.classList.remove(invisibleMod);
    }
    else {
      deepContainer.classList.add(invisibleMod);
    }
    if (charts.surface.chart) {
      surfaceContainer.classList.remove(invisibleMod);
    }
    else {
      surfaceContainer.classList.add(invisibleMod);
    }
  }

  updateInfoPanel(text, parent) {
    if (!parent) {
      parent = this._dom;
    }
    let panel = this.queryAppElemAll(parent, 'connectInfoPanel')[0];
    panel.textContent = text;
  }

  updateConnectionButton() {
    let deviceControl = this.queryAppElemAll(this._dom, 'deviceControl')[0],
        button = this.queryAppElemAll(deviceControl, 'button')[0],
        isDeviceConnected = this._data.device.isConnected;
    if (isDeviceConnected) {
      this._setDisconnectButton(button);
    }
    else {
      this._setConnectButton(button);
    }
  }

  _setConnectButton(button) {
    let connectMod = this.getModClass('button', 'connect'),
        disconnectMod = this.getModClass('button', 'disconnect');
    button.classList.remove(disconnectMod);
    button.classList.add(connectMod);
    button.setAttribute('data-action', 'connect');
    button.textContent = 'подключиться';
  }

  _setDisconnectButton(button) {
    let connectMod = this.getModClass('button', 'connect'),
        disconnectMod = this.getModClass('button', 'disconnect');
    button.classList.remove(connectMod);
    button.classList.add(disconnectMod);
    button.setAttribute('data-action', 'disconnect');
    button.textContent = 'отключиться';
  }
}

const rendererHelperMixin = {
  queryAppElemAll: function(fragment, elementName) {
    return Array.from(fragment.querySelectorAll(this.getAppElemMainClassStr(elementName)));
  },

  createAppElem: function(elementName) {
    let elementProps = APP_CLASSES[elementName],
        element = document.createElement(elementProps.tag);
    this.addClassArrToNode(element, elementProps.classList);
    return element;
  },

  addClassArrToNode: function(node, classList) {
    classList.forEach(function(className) {
      node.classList.add(className);
    });
  },

  getAppElemMainClassStr: function(elementName) {
    return "." + APP_CLASSES[elementName].classList[0];
  },

  getModClass: function(elementName, elementMod) {
    let elem = APP_CLASSES[elementName],
        elemClass = elem.classList[0],
        modifier = elemClass + elem.mod[elementMod];
    return modifier;
  },
}

for (let key in rendererHelperMixin) {
  AppRenderer.prototype[key] = rendererHelperMixin[key];
}

module.exports = AppRenderer;
