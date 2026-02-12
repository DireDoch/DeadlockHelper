import { execSync } from 'node:child_process';
import * as fs from 'node:fs';

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
}

interface ActiveMatchPlayer {
  account_id?: number | null;
}

interface ActiveMatchEntry {
  match_id?: number | null;
  players?: ActiveMatchPlayer[];
}

/**
 * Detect whether Deadlock.exe is currently running on Windows.
 */
export function getDeadlockProcessStatus(
  executablePath = DEFAULT_DEADLOCK_EXE_PATH,
): DeadlockProcessStatus {
  const executableExists = fs.existsSync(executablePath);

  if (process.platform !== 'win32') {
    return {
      running: false,
      executableExists,
      executablePath,
    };
  }

  try {
    const output = execSync(
      `tasklist /FI "IMAGENAME eq ${DEADLOCK_PROCESS_NAME}" /FO CSV /NH`,
      { encoding: 'utf8' },
    ).trim();

    return {
      running: output.toLowerCase().includes(`"${DEADLOCK_PROCESS_NAME_LOWER}"`),
      executableExists,
      executablePath,
    };
  } catch {
    return {
      running: false,
      executableExists,
      executablePath,
    };
  }
}

/**
 * Convert SteamID64 to account_id used by Deadlock API.
 */
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

/**
 * Confirm active match from Deadlock API by account_id.
 */
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

    if (!response.ok) {
      return { matchId: null };
    }

    const data = (await response.json()) as ActiveMatchEntry[];
    if (!Array.isArray(data)) return { matchId: null };

    for (const match of data) {
      const matchId = match.match_id;
      if (!matchId || !Array.isArray(match.players)) continue;

      const hasPlayer = match.players.some(
        (player) => player.account_id === accountId,
      );
      if (hasPlayer) {
        return { matchId };
      }
    }

    return { matchId: null };
  } catch {
    return { matchId: null };
  } finally {
    clearTimeout(timeout);
  }
}

export { DEFAULT_DEADLOCK_EXE_PATH };
