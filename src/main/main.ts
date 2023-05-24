import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './util';
import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
// create server express with express types
import express, { Request, Response } from 'express';
import cors from 'cors';
import fp from 'find-free-port';
import { addLog, addRenderProcessLog, downloadAssets } from './utils/tools';
import { isLinux, javaPath, launcherDir, platform } from './utils/const';
import { startIpc } from './ipc/update';

const server = express();
server.use(cors());
server.use(express.json());

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minHeight: 720,
    minWidth: 1280,
    icon: getAssetPath('logo.png'),

    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      addLog('mainWindow is not defined');
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();
  mainWindow.setMenu(null);
  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
// verifie si l'appli est a jour
startIpc();
ipcMain.on('add-log', async (event, arg) => {
  addRenderProcessLog(arg[0], arg[1]);
});

ipcMain.on('save-json-user', async (event, arg) => {
  const writeFile = promisify(fs.writeFile);
  const readFile = promisify(fs.readFile);
  let filePath = path.join(launcherDir, 'data', 'json', 'user.json');
  const user = arg;

  // create file if not exists
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(user));
    } else {
      fs.writeFileSync(filePath, JSON.stringify(user));
    }
  } catch (e) {
    addLog('Error saving user.json', e);
  }

  event.reply('save-json-user', 'success');
});

ipcMain.on('save-json-settings', async (event, arg) => {
  const writeFile = promisify(fs.writeFile);
  const readFile = promisify(fs.readFile);
  // if linux
  let filePath = path.join(launcherDir, 'data', 'json', 'settings.json');
  const user = arg;

  // create file if not exists
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(user));
  } else {
    fs.writeFileSync(filePath, JSON.stringify(user));
  }

  event.reply('save-json-settings', 'success');
});

ipcMain.on('play', async (event, arg) => {
  console.log('play');
  const launcherPath = path.join(
    launcherDir,
    'data',
    'utils',
    'SotariMinecraftLauncher.jar'
  );
  isLinux && exec(`chmod +x ${launcherPath}`);
  const child = exec(`${javaPath} -jar ${launcherPath}`);
  event.reply('okey');
});
ipcMain.on('download-java', async () => {
  await downloadAssets(launcherDir, platform);

  mainWindow?.webContents.send('java-ok');
});
(async () => {
  const port = await fp(3000, 3100);
  console.log(port[0]);

  ipcMain.on('download-assets', async (event, arg) => {
    const downloaderPath = path.join(
      launcherDir,
      'data',
      'utils',
      'SotariMinecraftUpdater.jar'
    );
    console.log(`${javaPath} -jar ${downloaderPath} ${port[0]}`);
    isLinux && exec(`chmod +x ${downloaderPath}`);
    console.log(`${javaPath} -jar ${downloaderPath} ${port[0]}`);
    const child = exec(`${javaPath} -jar ${downloaderPath} ${port[0]}`);
    event.reply('download-assets', 'started');
  });

  server.get('/:name', async (req: Request, res: Response) => {
    console.log(req.params.name);
    mainWindow?.webContents.send('step', req.params.name);
    res.send('true');
  });
  server.get('/progress/:number', async (req: Request, res: Response) => {
    mainWindow?.webContents.send('progress', req.params.number);
    res.send('true');
  });
  server.get('/confirme', async (req: Request, res: Response) => {
    mainWindow?.webContents.send('confirme-assets', req.params.number);
    res.send('true');
  });

  server.listen(port[0], () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();

export default mainWindow;
