/**
 * OcrWorkerManager — gestionnaire du worker Python long-vécu (ocr-worker/main.py).
 *
 * Architecture IPC : NDJSON sur stdout (une ligne JSON par scan).
 * Toutes les lignes de type "roster" sont transférées au renderer via
 * mainWindow.webContents.send('ocr:roster-updated', payload).
 * Les diagnostics du worker (stderr) sont relayés vers la console Electron.
 *
 * Cycle de vie attendu :
 *   start()  → sur GAME_IN_MATCH   + toggle espOcrEnabled=true
 *   stop()   → sur match-ended / GAME_CLOSED / fermeture app
 *
 * Déclencheur par défaut : poll (toutes les 1,5 s). Pour activer evdev
 * (ESC physique, nécessite le groupe `input`), changer les args de spawn.
 */

import { spawn, ChildProcess } from 'node:child_process';
import readline from 'node:readline';
import path from 'node:path';
import { app, BrowserWindow } from 'electron';
import type { OcrRoster } from '../lib/types';

// GET https://api.deadlock-api.com/v1/assets/heroes/{heroId} → images.icon_image_small_webp
// Chemin : ocr-worker/venv/bin/python + ocr-worker/main.py (relatif à appPath en dev,
// resources/ocr-worker en production avec extraResources dans forge.config).
function resolveOcrPaths(isPackaged: boolean): { python: string; script: string; cwd: string } {
  if (isPackaged) {
    const base = path.join(process.resourcesPath, 'ocr-worker');
    return { python: path.join(base, 'venv', 'bin', 'python'), script: path.join(base, 'main.py'), cwd: base };
  }
  const base = path.join(app.getAppPath(), 'ocr-worker');
  return { python: path.join(base, 'venv', 'bin', 'python'), script: path.join(base, 'main.py'), cwd: base };
}

export class OcrWorkerManager {
  private worker: ChildProcess | null = null;
  private targetWindow: BrowserWindow | null = null;

  start(mainWindow: BrowserWindow): void {
    if (this.worker) return;

    this.targetWindow = mainWindow;
    const { python, script, cwd } = resolveOcrPaths(app.isPackaged);

    console.log('[OcrWorker] Spawn', python, script);
    this.worker = spawn(python, [script, '--trigger', 'poll'], {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const rl = readline.createInterface({ input: this.worker.stdout! });

    rl.on('line', (line: string) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      let payload: Record<string, unknown>;
      try {
        payload = JSON.parse(trimmed) as Record<string, unknown>;
      } catch {
        console.error('[OcrWorker] stdout non-JSON:', trimmed.slice(0, 200));
        return;
      }

      if (payload['type'] === 'roster') {
        if (this.targetWindow && !this.targetWindow.isDestroyed()) {
          this.targetWindow.webContents.send('ocr:roster-updated', payload as unknown as OcrRoster);
        }
        return;
      }

      if (payload['type'] === 'status') {
        console.log('[OcrWorker] status:', payload['state']);
      }
    });

    this.worker.stderr!.on('data', (chunk: Buffer) => {
      process.stderr.write(chunk.toString());
    });

    this.worker.on('close', (code, signal) => {
      console.log(`[OcrWorker] exited — code=${code} signal=${signal}`);
      this.worker = null;
    });

    this.worker.on('error', (err: NodeJS.ErrnoException) => {
      console.error('[OcrWorker] spawn error:', err.message, '— venv présent ?', resolveOcrPaths(app.isPackaged).python);
      this.worker = null;
    });
  }

  stop(): void {
    if (!this.worker) return;
    console.log('[OcrWorker] stop (SIGTERM)');
    this.worker.kill('SIGTERM');
    this.worker = null;
    this.targetWindow = null;
  }

  get isRunning(): boolean {
    return this.worker !== null;
  }
}

// Singleton partagé avec main.ts.
export const ocrWorker = new OcrWorkerManager();
