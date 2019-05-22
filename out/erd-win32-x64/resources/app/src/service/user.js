const {
  electron: { ipcRenderer },
} = window;

export function signin(params) {
  return ipcRenderer.sendSync('signin', params);
}

export function signup(params) {
  return ipcRenderer.sendSync('signup', params);
}
