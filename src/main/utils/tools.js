import http from 'http';
import fs from 'fs';
import { launcherDir } from '../main';
import path from 'path';
export function setPercentage(length, progress) {
  return Math.round((progress / length) * 100);
}

export async function downloadFile(path, url) {
  try {
    await http.get(url, async (response) => {
      const fileStream = await fs.createWriteStream(path);
      await response.pipe(fileStream);
    });
  } catch (error) {
    addLog('downloadFile', error);
  }
}

export async function addLog(name, message) {
  let mainProcessLogFilePath = path.join(
    launcherDir,
    'data',
    'logs',
    'mainProcess.log'
  );
  // eslint-disable-next-line no-undef
  let log = `${name} : ${message} | Platforme=${process.platform}\n`;
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
