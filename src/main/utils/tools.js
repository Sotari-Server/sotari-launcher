import http from 'http';
import fs from 'fs';
import { launcherDir } from './const';
import path from 'path';
import { fetchLinuxJsonFile, fetchWindowsJsonFile } from './fetch';
import { platform } from './const';

export function setPercentage(length, progress) {
  return Math.round((progress / length) * 100);
}

export async function downloadFile(path, url) {
  if (path && url) {
    try {
      await http.get(url, async (response) => {
        const filePath = path;
        const fileStream = await fs.createWriteStream(filePath);
        await response.pipe(fileStream);
      });
    } catch (error) {
      addLog('downloadFile', error);
    }
  } else {
    alert('not path or url');
  }
  return;
}

export async function addLog(name, message) {
  let mainProcessLogFilePath = path.join(
    launcherDir,
    'data',
    'logs',
    'mainProcess.log'
  );

  let log = `${name} : ${JSON.stringify(message)} | Platforme=${platform}\n`;
  await fs.appendFileSync(mainProcessLogFilePath, log);
  return;
}

export async function addRenderProcessLog(name, message) {
  let renderProcessLogFilePath = path.join(
    launcherDir,
    'data',
    'logs',
    'renderProcess.log'
  );
  let log = `${name} : ${message}\n`;
  await fs.appendFileSync(renderProcessLogFilePath, log);
  return;
}

export async function downloadAssets(launcherPath, platform) {
  let response;
  if (platform === 'win32') {
    console.log('is Windows');
    response = await fetchWindowsJsonFile();
  } else if (platform === 'linux') {
    console.log('is Linux');

    response = await fetchLinuxJsonFile();
  } else {
    // eslint-disable-next-line no-undef
    addLog('downloadAssets,', { message: 'Platform not supported' + platform });
    return;
  }
  if (response.files) {
    await response.files.forEach(async (file) => {
      const downloadUrl = file.downloadURL;

      const filePath = path.join(launcherPath, file.path);

      const dirPathForSave = path.dirname(filePath);
      try {
        if (!(await fs.existsSync(dirPathForSave))) {
          await fs.mkdirSync(dirPathForSave, { recursive: true });
        }

        if (await fs.existsSync(filePath)) {
          if ((await fs.statSync(filePath).size) === file.size) {
            return;
          }
        }
      } catch (err) {
        addLog('downloadAssets', err);
      }

      await downloadFile(filePath, downloadUrl);
    });
  } else {
    alert(response);
  }

  return;
}
