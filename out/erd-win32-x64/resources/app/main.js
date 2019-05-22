const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
// const reload = require('electron-reload');
// const { client } = require('electron-connect');

require('./ipcMain');

function isDev() {
  return process.env.NODE_ENV === 'development';
}
// if (isDev()) {
//   reload(__dirname, {
//     electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
//     hardResetMethod: 'exit',
//   });
// }

console.log(19, 'app start');

let win;
function createWindow() {
  if (!win) {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      autoHideMenuBar: true,
      fullscreenable: false,
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: false, // 不集成 Nodejs
        webSecurity: false,
        preload: path.join(__dirname, './public/renderer.js'), // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
      },
    });

    win.loadURL(
      url.format({
        pathname: path.join(__dirname, './dist/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
    if (isDev()) {
      const host = process.env.HOST || '127.0.0.1';
      const port = process.env.PORT || '8000';
      // 这里的url换成你所使用框架开发时的url
      win.loadURL(`http://${host}:${port}/`);
      // client.create(win);
      win.webContents.openDevTools();
    } else {
      // win.loadFile('./dist/index.html');
      win.loadURL(
        url.format({
          pathname: path.join(__dirname, './dist/index.html'),
          protocol: 'file:',
          slashes: true,
        })
      );
      // win.webContents.openDevTools();
    }
  }
  win.on('closed', () => {
    win = null;
    console.log(57, 'cloaedae');
  });
}

app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
