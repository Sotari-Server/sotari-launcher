import { addLog } from './tools';

export function fetchWindowsJsonFile() {
  return fetch('https://sotari.eu/sotari-files/java/java-windows.php')
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      addLog('fetchWindowsJsonFile', err);
    });
}

export function fetchLinuxJsonFile() {
  return fetch('https://sotari.eu/sotari-files/java/java-linux.php')
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      addLog('fetchLinuxJsonFile', { message: err });
    });
}

export function fetchMacJsonFile() {
  return fetch('https://sotari.eu/sotari-files/java/java-mac.php')
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      addLog('fetchLinuxJsonFile', err);
    });
}
