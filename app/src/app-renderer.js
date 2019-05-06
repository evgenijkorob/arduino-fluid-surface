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
    classList: ['button', 'mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect'],
    mod: {
      connect: '_action_connect',
      disconnect: '_action_disconnect',
      disabled: '_disabled'
    }
  },
  connectInfoPanel: {
    tag: 'span',
    classList: ['app__connect-info-panel']
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
    let deviceControl = this.queryAppElemAll(dom, 'deviceControl')[0];
    this._renderDeviceControlPanel(deviceControl);
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

  _renderDeviceControlPanel(parent) {
    let button = this.createAppElem('button'),
        connectInfoPanel = this.createAppElem('connectInfoPanel');
    parent.append(button, connectInfoPanel);
    this._setConnectButton(button);
    this.updateInfoPanel('', parent);
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
