import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { EventEmitter } from 'node:events';

const DEADLOCK_LOG_SUBPATH = 'steamapps/common/Deadlock/game/citadel/console.log';

export class LogWatcher extends EventEmitter {
  private logPath = '';
  private watcher: fs.FSWatcher | null = null;
  private pollTimer: NodeJS.Timeout | null = null;
  private lastSize = 0;
  private gameStarted = false;
  private currentMatchId: number | null = null;

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
      // fs.watch may be unavailable — the polling fallback below covers it.
    }

    // Polling fallback (every 2 s). fs.watch does NOT reliably deliver change
    // events for console.log because the game writes it through Proton/Wine with
    // buffered flushes — relying on fs.watch alone made match-started never fire.
    // readNewContent() is cheap (reads only the bytes appended since lastSize).
    this.pollTimer = setInterval(() => this.readNewContent(), 2000);
  }

  stop(): void {
    this.watcher?.close();
    this.watcher = null;
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  restart(): void {
    this.stop();
    this.gameStarted = false;
    this.currentMatchId = null;
    this.start();
  }

  resetGameState(): void {
    this.gameStarted = false;
    this.currentMatchId = null;
  }

  private readNewContent(): void {
    if (!this.logPath) return;
    try {
      const stat = fs.statSync(this.logPath);
      if (stat.size < this.lastSize) this.lastSize = 0; // log cleared/rotated (e.g. -conclearlog) → re-read from start
      if (stat.size <= this.lastSize) return;

      const length = stat.size - this.lastSize;
      const buf = Buffer.alloc(length);
      const fd = fs.openSync(this.logPath, 'r');
      fs.readSync(fd, buf, 0, length, this.lastSize);
      fs.closeSync(fd);
      this.lastSize = stat.size;

      const chunk = buf.toString('utf8');

      // ── Match start (gives the real match_id) ───────────────────────────────
      // Deadlock writes "Lobby <lobbyId> for Match <matchId> created" when it
      // connects to the match server. This is the reliable, real-time source of
      // the match_id — far more dependable than the community /matches/active API.
      // We take the last occurrence in the chunk in case several lines arrived at once.
      const startMatch = [...chunk.matchAll(/for Match (\d+) created/g)].pop();
      if (startMatch) {
        const matchId = Number(startMatch[1]);
        if (Number.isFinite(matchId) && matchId !== this.currentMatchId) {
          this.currentMatchId = matchId;
          this.emit('match-started', { matchId, wallTime: Date.now() });
        }
      }

      // ── In-game moment (kept for the overlay's start-time) ──────────────────
      // Real log line is "ChangeGameState: GameInProgress (7)" — the previous
      // code matched "InProgress" with a leading space and never fired.
      if (!this.gameStarted && chunk.includes('ChangeGameState: GameInProgress')) {
        this.gameStarted = true;
        this.emit('game-started', Date.now());
      }

      // ── Match end ───────────────────────────────────────────────────────────
      // "Lobby <lobbyId> for Match <matchId> destroyed" closes the match.
      const endMatch = [...chunk.matchAll(/for Match (\d+) destroyed/g)].pop();
      if (endMatch) {
        const matchId = Number(endMatch[1]);
        if (matchId === this.currentMatchId) {
          this.currentMatchId = null;
          this.gameStarted = false;
          this.emit('match-ended', { matchId });
        }
      }
    } catch {
      // File may be locked by the game process — ignore silently
    }
  }
}
