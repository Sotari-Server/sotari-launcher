import path from 'path';
import { addLog } from './tools';
import { app } from 'electron';

export const isMac = process.platform === 'darwin';
export const isWindows = process.platform === 'win32';
export const isLinux = process.platform === 'linux';

export const platform = isWindows
  ? 'win32'
  : isLinux
  ? 'linux'
  : isMac
  ? 'mac'
  : 'not supported';

let directory: string;
let java_dir: string;
if (isLinux) {
  directory = path.join(app.getPath('home'), '.local', 'share', 'sotari');
  java_dir = path.join(directory, 'runtime', 'jre-11', 'bin', 'java');
} else if (isWindows) {
  directory = path.join(app.getPath('appData'), 'sotari');
  java_dir = path.join(directory, 'runtime', 'jre-11', 'bin', 'java.exe');
} else if (isMac) {
  directory = path.join(app.getPath('appData'), 'sotari');
  java_dir = path.join(directory, 'runtime', 'jre-11', 'bin', 'java');
} else {
  addLog('Platform not supported', process.platform);
  directory = path.join(app.getPath('appData'), 'sotari');
  java_dir = path.join(directory, 'runtime', 'jre-11', 'bin', 'java');
}
export const launcherDir = directory;

export const javaPath = java_dir;
