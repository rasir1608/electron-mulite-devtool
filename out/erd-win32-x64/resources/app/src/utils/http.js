import { message } from 'antd';

const {
  electron: { ipcRenderer },
} = window;

function http(channel, params) {
  try {
    const ret = ipcRenderer.sendSync(channel, params);
    if (ret && ret.ok) {
      return ret.data;
    }
    message.error((ret || {}).msg || '系统异常！');
    return null;
  } catch (e) {
    message.error(e.toString());
    return null;
  }
}

http.send = function send(channel, params) {
  ipcRenderer.send(channel, params);
};

export default http;
