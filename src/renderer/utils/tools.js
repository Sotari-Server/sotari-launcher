export function parseToDirectusLink(uid) {
  return `https://admin.sotari.eu/assets/${uid}`;
}

export function addReactLog(name, message) {
  return window.electron.ipcRenderer.sendMessage('add-log', [name, message]);
}
