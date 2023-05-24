import { app, ipcMain } from 'electron';
import { isLinux, isWindows, launcherDir } from '../utils/const';
import { addLog, downloadFile } from '../utils/tools';
import path from 'path';
import mainWindow from '../main';
import fs from 'fs';

export function startIpc() {
  /*-------------------------------------
              Check Update
  -------------------------------------*/
  ipcMain.on('check-update', async () => {
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
         donwload all utils programm
  -------------------------------------*/
  ipcMain.on('download-utils', async () => {
    console.log('download utils');

    !fs.existsSync(
      path.join(launcherDir, 'data', 'utils', 'SotariMinecraftUpdater.jar')
    ) &&
      (await downloadFile(
        path.join(launcherDir, 'data', 'utils', 'SotariMinecraftUpdater.jar'),
        'http://sotari.eu/sotari-files/utils/SotariMinecraftUpdater.jar'
      ));

    !fs.existsSync(
      path.join(launcherDir, 'data', 'utils', 'SotariMinecraftUpdater.jar')
    ) &&
      (await downloadFile(
        path.join(launcherDir, 'data', 'utils', 'SotariMinecraftLauncher.jar'),
        'http://sotari.eu/sotari-files/utils/SotariMinecraftLauncher.jar'
      ));
    console.log('sned utils -ok');
    mainWindow?.webContents.send('utils-ok', 'ok');
  });
}
