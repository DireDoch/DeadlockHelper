import { exec } from 'node:child_process';
import * as fs from 'node:fs';
import { promisify } from 'node:util';
import { detectionLog } from './detection-logger'; // [TEMP DEBUG] retirer après diagnostic

const execAsync = promisify(exec);

const DEADLOCK_PROCESS_NAME = 'Deadlock.exe';
const DEADLOCK_PROCESS_NAME_LOWER = DEADLOCK_PROCESS_NAME.toLowerCase();
const STEAM64_BASE = 76561197960265728n;
const DEFAULT_DEADLOCK_EXE_PATH =
  'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Deadlock\\game\\bin\\win64\\Deadlock.exe';

export interface DeadlockProcessStatus {
  running: boolean;
  executableExists: boolean;
  executablePath: string;
}

export interface ActiveMatchResult {
  matchId: number | null;
  durationS: number | null;
  playerHeroId: number | null;
  enemyHeroIds: number[];
}

interface ActiveMatchPlayer {
  account_id?: number | null;
  hero_id?: number | null;
  team?: number | null;
}

interface ActiveMatchEntry {
  match_id?: number | null;
  duration_s?: number | null;
  players?: ActiveMatchPlayer[];
}

export async function getDeadlockProcessStatus(
  executablePath = DEFAULT_DEADLOCK_EXE_PATH,
): Promise<DeadlockProcessStatus> {
  const executableExists = fs.existsSync(executablePath);

  if (process.platform === 'linux') {
    try {
      // pgrep exits with code 1 (throws) when no match found
      const { stdout } = await execAsync('pgrep -f "[Dd]eadlock.exe"');
      return { running: stdout.trim().length > 0, executableExists, executablePath };
    } catch {
      return { running: false, executableExists, executablePath };
    }
  }

  if (process.platform === 'win32') {
    try {
      const { stdout } = await execAsync(
        `tasklist /FI "IMAGENAME eq ${DEADLOCK_PROCESS_NAME}" /FO CSV /NH`,
      );
      return {
        running: stdout.trim().toLowerCase().includes(`"${DEADLOCK_PROCESS_NAME_LOWER}"`),
        executableExists,
        executablePath,
      };
    } catch {
      return { running: false, executableExists, executablePath };
    }
  }

  return { running: false, executableExists, executablePath };
}

export function steamId64ToAccountId(steamId64: string): number | null {
  try {
    const steamIdBigInt = BigInt(steamId64);
    if (steamIdBigInt < STEAM64_BASE) return null;

    const accountIdBigInt = steamIdBigInt - STEAM64_BASE;
    const accountId = Number(accountIdBigInt);
    return Number.isSafeInteger(accountId) ? accountId : null;
  } catch {
    return null;
  }
}

export async function findActiveMatchByAccountId(
  accountId: number,
  timeoutMs = 5000,
): Promise<ActiveMatchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `https://api.deadlock-api.com/v1/matches/active?account_ids=${accountId}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      },
    );

    // [TEMP DEBUG] statut HTTP brut de /v1/matches/active
    detectionLog('API /matches/active réponse HTTP', { status: response.status, ok: response.ok, accountId });

    if (!response.ok) return { matchId: null, durationS: null, playerHeroId: null, enemyHeroIds: [] };

    const data = (await response.json()) as ActiveMatchEntry[];
    if (!Array.isArray(data)) {
      detectionLog('API /matches/active: réponse non-tableau', { accountId }); // [TEMP DEBUG]
      return { matchId: null, durationS: null, playerHeroId: null, enemyHeroIds: [] };
    }

    // [TEMP DEBUG] combien de matchs renvoyés + le compte est-il présent dans l'un d'eux ?
    detectionLog('API /matches/active corps', {
      accountId,
      matchsRenvoyés: data.length,
      matchIds: data.map((m) => m.match_id ?? null),
      compteTrouvé: data.some((m) => Array.isArray(m.players) && m.players.some((p) => p.account_id === accountId)),
    });

    for (const match of data) {
      const matchId = match.match_id;
      if (!matchId || !Array.isArray(match.players)) continue;

      const me = match.players.find((p) => p.account_id === accountId);
      if (!me) continue;

      const myTeam = me.team ?? -1;
      const playerHeroId = me.hero_id ?? null;
      const enemyHeroIds = match.players
        .filter((p) => p.team !== myTeam && p.hero_id != null)
        .map((p) => p.hero_id as number);

      return { matchId, durationS: match.duration_s ?? null, playerHeroId, enemyHeroIds };
    }

    return { matchId: null, durationS: null, playerHeroId: null, enemyHeroIds: [] };
  } catch {
    return { matchId: null, durationS: null, playerHeroId: null, enemyHeroIds: [] };
  } finally {
    clearTimeout(timeout);
  }
}

export { DEFAULT_DEADLOCK_EXE_PATH };
