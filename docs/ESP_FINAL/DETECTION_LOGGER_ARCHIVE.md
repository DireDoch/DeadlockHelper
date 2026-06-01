# Archive : Detection Logger (code temporaire supprimé)

Ce module a été utilisé pour diagnostiquer la détection de partie en production (Phase 0).
Il a été retiré une fois le diagnostic terminé.

## Pourquoi il a existé

- Tracer en temps réel pourquoi l'app ne détectait pas les parties Deadlock
- Vérifier : process trouvé ? steamId64 présent ? API /v1/matches/active répond ?
- Le fichier `detection-debug.log` était écrit à la racine du projet en dev

## Problème de production identifié

Dans l'AppImage, `app.getAppPath()` retourne le chemin dans le `.asar` monté
(`/tmp/.mount_XXX/resources/app.asar/`) qui est en **lecture seule**.
La correction aurait été `app.getPath('userData')` → `~/.config/DeadlockHelper/`.

---

## Code archivé : `src/main/detection-logger.ts`

```typescript
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
```

---

## Appels supprimés dans `main.ts`

```typescript
// Import retiré (ligne 31)
import { detectionLog } from './detection-logger'; // [TEMP DEBUG] retirer après diagnostic

// Appels retirés :
detectionLog('PROBE live/url', { matchId, status: res.status, body: body.slice(0, 300) });
detectionLog('PROBE live/url ERREUR', { matchId, error: String(e) });
detectionLog('LOG-WATCHER match-started (console.log local)', { matchId });
detectionLog('LOG-WATCHER match-ended (console.log local)', { matchId });
detectionLog('poll', { processRunning, wasRunning, state, exeExists });
detectionLog('state -> GAME_CLOSED');
detectionLog('LogWatcher démarré', { logPath });
detectionLog('state -> GAME_MENU (process détecté)');
detectionLog('match-check throttlé', { nextCheckInMs });
detectionLog('ABANDON: steamId64 absent (pas connecté à Steam ?)');
detectionLog('ABANDON: steamId64 invalide', { steamId64 });
detectionLog('appel findActiveMatchByAccountId', { steamId64, accountId });
detectionLog('résultat match-active', { matchId, durationS, playerHeroId, enemyCount, lastKnownMatchId });
detectionLog('MATCH DÉTECTÉ via API -> emit game:match-started', { matchId });
detectionLog('state -> GAME_IN_MATCH', { matchId });
detectionLog('MATCH TERMINÉ via API -> emit game:match-ended', { lastKnownMatchId });
detectionLog('state -> GAME_MENU (match terminé)');
```

---

## Appels supprimés dans `deadlock-detector.ts`

```typescript
// Import retiré (ligne 4)
import { detectionLog } from './detection-logger'; // [TEMP DEBUG] retirer après diagnostic

// Appels retirés :
detectionLog('API /matches/active réponse HTTP', { status: response.status, ok: response.ok, accountId });
detectionLog('API /matches/active: réponse non-tableau', { accountId });
detectionLog('API /matches/active corps', {
  accountId,
  matchsRenvoyés: data.length,
  matchIds: data.map((m) => m.match_id ?? null),
  compteTrouvé: data.some((m) => Array.isArray(m.players) && m.players.some((p) => p.account_id === accountId)),
});
```
