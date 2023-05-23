import { app, ipcMain } from 'electron';
import { mainWindow } from '../main';
import { isLinux, isWindows, launcherDir, platform } from '../utils/const';
import { addLog, downloadAssets, downloadFile } from '../utils/tools';
import path from 'path';

export function startIpc() {
  /*-------------------------------------
              Check Update
  -------------------------------------*/
  ipcMain.on('check-update', async (event, arg) => {
    const appVersion = app.getVersion();

    const jsonInfoUrl = isWindows
      ? 'http://sotari.eu/sotari-files/launcher/windows/info.json'
      : isLinux
      ? 'http://sotari.eu/sotari-files/launcher/linux/info.json'
      : 'http://sotari.eu/sotari-files/launcher/mac/info.json';

    let jsonInfo;
    try {
      jsonInfo = await fetch(jsonInfoUrl).then((res) => res.json());
    } catch (e) {
      addLog('Error fetching jsonInfo', e);
    }
    if (jsonInfo.version !== appVersion) {
      mainWindow?.webContents.send('update-available', jsonInfo.version);
    }
  });

  /*-------------------------------------
              Download Java
  -------------------------------------*/
  ipcMain.on('download-java', async (event, arg) => {
    console.log('ipc: download-java');
    await downloadAssets(launcherDir, platform);
    mainWindow?.webContents.send('java-ok', 'ok');
  });

  /*-------------------------------------
         donwload all utils programm
  -------------------------------------*/
  ipcMain.on('download-utils', async (event, arg) => {
    await downloadFile(
      path.join(launcherDir, 'data', 'utils', 'SotariMinecraftUpdater.jar'),
      'http://sotari.eu/sotari-files/utils/SotariMinecraftUpdater.jar'
    );
    mainWindow?.webContents.send('utils-ok', 'ok');
  });
}
