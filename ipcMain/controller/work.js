const { dialog } = require('electron');
const { spawn, spawnSync } = require('child_process');
const iconv = require('iconv-lite');

const encoding = 'cp936';
const binaryEncoding = 'buffer';
const Result = require('../utils/result');
const workServer = require('../server/work');

function deBanceSend(event, channel, data) {
  if (Date.now() - (deBanceSend.lastTime || 0) < 1000) {
    deBanceSend.timer = setTimeout(() => {
      deBanceSend(event, channel, data);
    }, 500);
  } else {
    if (deBanceSend.timer) clearTimeout(deBanceSend.timer);
    const work = data;
    deBanceSend.lastTime = Date.now();
    event.sender.send('runWorkResult', work);
    work.log = '';
  }
}

module.exports = {
  checkWorkName: (e, name) => {
    const event = e;
    workServer
      .find({ name })
      .then(list => {
        if (Array.isArray(list) && list.length > 0) {
          event.returnValue = Result.success(false);
        } else {
          event.returnValue = Result.success(true);
        }
      })
      .catch(err => {
        event.returnValue = Result.error(err.toString());
      });
  },
  getWorkSpacePath: e => {
    const event = e;
    try {
      const path = dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory', 'multiSelections'],
      });
      event.returnValue = Result.success((path || [])[0]);
    } catch (err) {
      event.returnValue = Result.error(err.toString());
    }
  },

  saveWorkSpace: async (e, data) => {
    const event = e;
    workServer
      .save(data)
      .then(recode => {
        event.returnValue = Result.success(recode);
      })
      .catch(err => {
        event.returnValue = Result.error(err.toString());
      });
  },

  updateWorkSpace: async (e, data) => {
    const event = e;
    workServer
      .update(data)
      .then(recode => {
        event.returnValue = Result.success(recode);
      })
      .catch(err => {
        event.returnValue = Result.error(err.toString());
      });
  },

  queryWorkList: async (e, params) => {
    const event = e;
    workServer
      .find(params)
      .then(data => {
        event.returnValue = Result.success(data);
      })
      .catch(err => {
        event.returnValue = Result.error(err.toString());
      });
  },

  runWorkCode: async (e, workSpace) => {
    const { code, path } = workSpace;
    const event = e;
    const work = workSpace;
    work.log = work.log || `${code}\n`;
    const workerProcess = spawn(code, {
      cwd: path,
      encoding: binaryEncoding,
      shell: process.platform === 'win32',
    });
    work.pid = workerProcess.pid;

    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', data => {
      let log;
      if (Object.prototype.toString.apply(data) === '[object Number]') {
        log = data.toString();
      } else {
        log = iconv.decode(Buffer.from(data, binaryEncoding), encoding);
      }
      work.log += `${log}\n`
        .match(/[^(\b)]/gi)
        .join('')
        .replace(/^' '+/, '');

      deBanceSend(event, 'runWorkResult', work);
    });

    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', data => {
      let log;
      if (Object.prototype.toString.apply(data) === '[object Number]') {
        log = data.toString();
      } else {
        log = iconv.decode(Buffer.from(data, binaryEncoding), encoding);
      }
      work.log += `${log}\n`
        .match(/[^(\b)]/gi)
        .join('')
        .replace(/^' '+/, '');

      deBanceSend(event, 'runWorkResult', work);
    });
    // 退出之后的输出
    workerProcess.on('exit', outCode => {
      const data = outCode || 0;
      console.log(103, data);
      let log;
      if (Object.prototype.toString.apply(data) === '[object Number]') {
        log = `退出码：${data}`;
        work.pid = undefined;
      } else {
        log = iconv.decode(Buffer.from(data, binaryEncoding), encoding);
      }
      work.log += `${log}\n`
        .match(/[^(\b)]/gi)
        .join('')
        .replace(/^' '+/, '');

      deBanceSend(event, 'runWorkResult', work);
    });
  },
  killWork: (e, workSpace) => {
    const event = e;
    const work = workSpace;
    try {
      const { pid } = work;
      const code = `taskkill /pid ${pid} /t /f`;
      const ret = spawnSync(code, {
        shell: process.platform === 'win32',
      });
      work.log = iconv.decode(Buffer.from(ret.stdout, binaryEncoding), encoding);
    } catch (err) {
      work.log = err.toString();
    }
    deBanceSend(event, 'runWorkResult', work);
  },
};
