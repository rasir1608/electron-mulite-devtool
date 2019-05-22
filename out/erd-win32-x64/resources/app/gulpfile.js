const gulp = require('gulp');
const electron = require('electron-connect').server.create();

gulp.task('watch:electron', () => {
  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('main.js', electron.restart);

  // Reload renderer process
  gulp.watch(['./ipcMain/controller', './ipcMain/server', './ipcMain/index.js'], electron.restart);
});
