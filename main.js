const {
  app,
  BrowserWindow
} = require('electron');
const path = require('path');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow(
    {
      width: 1400,
      height: 900,
      webPreferences: { nodeIntegration: true }
    }
  );
  mainWindow.webContents.loadFile(path.join(__dirname,"./app/index.html"));
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
