import path from 'path';
import fs from 'fs';
import { addLog, downloadFile } from './tools';

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
      addLog('fetchLinuxJsonFile', err);
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

export async function downloadAssets(launcherPath, platform) {
  let response;
  if (platform === 'win32') {
    response = await fetchWindowsJsonFile();
  } else if (platform === 'linux') {
    response = await fetchLinuxJsonFile();
  } else {
    // eslint-disable-next-line no-undef
    addLog('downloadAssets,', 'Platform not supported');
  }
  await response.files.forEach(async (file) => {
    const downloadUrl = file.downloadURL;
    const filePath = path.join(launcherPath, file.path);
    const dirPathForSave = path.dirname(filePath);
    try {
      if (!(await fs.existsSync(dirPathForSave))) {
        fs.mkdirSync(dirPathForSave, { recursive: true });
      }
      // check if file exists
      if (await fs.existsSync(filePath)) {
        // check if file size same
        if ((await fs.statSync(filePath).size) === file.size) {
          return;
        }
      }
    } catch (err) {
      addLog('downloadAssets', err);
    }
    await downloadFile(filePath, downloadUrl);
  });
  return;
}
