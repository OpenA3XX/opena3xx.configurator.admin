const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

try {
  require('electron-reloader')(module);
} catch (_) {}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 2400,
    height: 1200,
    minWidth: 2400,
    minHeight: 1200,
    frame: false,
    icon: path.join(__dirname + '/dist/assets/app-icons/icons/png/512x512.png'),
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  );

  mainWindow.autoHideMenuBar = true;

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
