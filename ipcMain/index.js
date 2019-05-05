const { ipcMain } = require('electron');
const workController = require('./controller/work');

Object.keys(workController).forEach(channel => {
  ipcMain.on(channel, workController[channel]);
});
