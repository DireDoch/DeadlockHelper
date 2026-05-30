import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { EventEmitter } from 'node:events';

const DEADLOCK_LOG_SUBPATH = 'steamapps/common/Deadlock/game/citadel/console.log';

export class LogWatcher extends EventEmitter {
  private logPath = '';
  private watcher: fs.FSWatcher | null = null;
  private lastSize = 0;
  private gameStarted = false;

  // Returns the best auto-detected path for the current OS, or '' if not found.
  static detectLogPath(): string {
    if (process.platform === 'linux') {
      const defaults = [
        path.join(os.homedir(), '.local/share/Steam', DEADLOCK_LOG_SUBPATH),
        path.join(os.homedir(), '.steam/steam', DEADLOCK_LOG_SUBPATH),
      ];
      const fromDefaults = defaults.find((p) => fs.existsSync(p));
      if (fromDefaults) return fromDefaults;

      const vdfs = [
        path.join(os.homedir(), '.local/share/Steam/steamapps/libraryfolders.vdf'),
        path.join(os.homedir(), '.steam/steam/steamapps/libraryfolders.vdf'),
      ];
      return LogWatcher.searchLibraryFolders(vdfs) ?? defaults[0];
    }

    if (process.platform === 'win32') {
      const defaults = [
        path.join('C:\\Program Files (x86)\\Steam', DEADLOCK_LOG_SUBPATH),
        path.join('C:\\Program Files\\Steam', DEADLOCK_LOG_SUBPATH),
      ];
      const fromDefaults = defaults.find((p) => fs.existsSync(p));
      if (fromDefaults) return fromDefaults;

      const vdfs = [
        'C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf',
        'C:\\Program Files\\Steam\\steamapps\\libraryfolders.vdf',
      ];
      return LogWatcher.searchLibraryFolders(vdfs) ?? defaults[0];
    }

    return '';
  }

  private static searchLibraryFolders(vdfPaths: string[]): string | null {
    for (const vdfPath of vdfPaths) {
      if (!fs.existsSync(vdfPath)) continue;
      try {
        const content = fs.readFileSync(vdfPath, 'utf8');
        // Simple VDF parser: extract all "path" values
        for (const match of content.matchAll(/"path"\s+"([^"]+)"/g)) {
          const candidate = path.join(match[1], DEADLOCK_LOG_SUBPATH);
          if (fs.existsSync(candidate)) return candidate;
        }
      } catch {
        // ignore unreadable VDF
      }
    }
    return null;
  }

  setLogPath(logPath: string): void {
    this.logPath = logPath;
    this.restart();
  }

  start(): void {
    if (!this.logPath) return;
    if (!fs.existsSync(this.logPath)) return;

    try {
      this.lastSize = fs.statSync(this.logPath).size;
    } catch {
      this.lastSize = 0;
    }

    try {
      this.watcher = fs.watch(this.logPath, () => this.readNewContent());
    } catch {
      // File not watchable yet — polling not added to keep it simple
    }
  }

  stop(): void {
    this.watcher?.close();
    this.watcher = null;
  }

  restart(): void {
    this.stop();
    this.gameStarted = false;
    this.start();
  }

  resetGameState(): void {
    this.gameStarted = false;
  }

  private readNewContent(): void {
    if (!this.logPath) return;
    try {
      const stat = fs.statSync(this.logPath);
      if (stat.size <= this.lastSize) return;

      const length = stat.size - this.lastSize;
      const buf = Buffer.alloc(length);
      const fd = fs.openSync(this.logPath, 'r');
      fs.readSync(fd, buf, 0, length, this.lastSize);
      fs.closeSync(fd);
      this.lastSize = stat.size;

      const chunk = buf.toString('utf8');
      if (!this.gameStarted && chunk.includes('ChangeGameState: InProgress')) {
        this.gameStarted = true;
        // Emit wall-clock time of the game start event
        this.emit('game-started', Date.now());
      }
    } catch {
      // File may be locked by the game process — ignore silently
    }
  }
}
