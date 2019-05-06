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
    classList: ['button'],
    mod: {
      connect: '_action_connect',
      disconnect: '_action_disconnect',
      disabled: '_disabled'
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
    let deviceControl = this.queryAppElemAll(dom, 'deviceControl')[0];
    this._renderConnectionButtons(deviceControl);
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

  _renderConnectionButtons(parent) {
    let connectButton = this.createAppElem('button'),
        disconnectButton = this.createAppElem('button'),
        disabledMod = this.getModClass('button', 'disabled'),
        connectMod = this.getModClass('button', 'connect'),
        disconnectMod = this.getModClass('button', 'disconnect'),
        actionAttr = 'data-action';
    connectButton.classList.add(connectMod);
    connectButton.textContent = 'подключиться';
    connectButton.setAttribute(actionAttr, 'connect');
    disconnectButton.classList.add(disconnectMod, disabledMod);
    disconnectButton.textContent = 'отключиться';
    disconnectButton.setAttribute(actionAttr, 'disconnect');
    parent.append(connectButton, disconnectButton);
  }

  updateConnectionButtons() {
    let connectBtn = this._dom.querySelector('.' + this.getModClass('button', 'connect')),
        disconnectBtn = this._dom.querySelector('.' + this.getModClass('button', 'disconnect')),
        disabledMod = this.getModClass('button', 'disabled'),
        isDeviceConnected = this._data.device.isConnected();
    if (isDeviceConnected) {
      connectBtn.classList.add(disabledMod);
      disconnectBtn.classList.remove(disabledMod);
    }
    else {
      connectBtn.classList.remove(disabledMod);
      disconnectBtn.classList.add(disabledMod);
    }
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