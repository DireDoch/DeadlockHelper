/**
 * ⚠️ TEMPORAIRE — Logger de diagnostic pour la détection de partie/match.
 *
 * But : tracer en temps réel, dans un fichier, pourquoi l'application n'arrive pas
 * à savoir si une partie Deadlock est lancée (process trouvé ? steamId64 présent ?
 * l'API /v1/matches/active renvoie-t-elle le match ?).
 *
 * Le fichier est écrit à la racine du projet : detection-debug.log
 * (le chemin exact est affiché dans la console au premier write).
 *
 * POUR RETIRER APRÈS LE DIAGNOSTIC :
 *   1. Supprimer ce fichier.
 *   2. Supprimer toutes les lignes contenant `detectionLog(` (tag `[TEMP DEBUG]`)
 *      dans main.ts et deadlock-detector.ts.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { app } from 'electron';

let logFilePath: string | null = null;

function resolvePath(): string {
  if (logFilePath) return logFilePath;

  logFilePath = path.join(app.getAppPath(), 'detection-debug.log');

  const header =
    `\n========================================================\n` +
    `  Session diagnostic détection — ${new Date().toISOString()}\n` +
    `  platform=${process.platform}  cwd=${process.cwd()}\n` +
    `========================================================\n`;
  try {
    fs.appendFileSync(logFilePath, header);
  } catch {
    /* ignore */
  }
  console.log('[detection-logger] Écriture du log dans :', logFilePath);
  return logFilePath;
}

/**
 * Append a timestamped, human-readable line to the debug log.
 * Never throws — logging must never break the app.
 */
export function detectionLog(event: string, details?: Record<string, unknown>): void {
  const ts = new Date().toISOString();
  let line = `[${ts}] ${event}`;
  if (details && Object.keys(details).length > 0) {
    line += '  ' + JSON.stringify(details);
  }
  try {
    fs.appendFileSync(resolvePath(), line + '\n');
  } catch {
    /* ignore — jamais laisser le logging casser l'app */
  }
}
