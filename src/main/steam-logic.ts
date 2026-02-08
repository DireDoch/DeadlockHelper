/**
 * Steam detection and authentication logic
 * Handles Steam-related operations in the Main Process (OpenID, store, GetPlayerSummaries, installation check)
 * Uses a local HTTP server on localhost for the OpenID callback (Steam does not accept custom protocols).
 *
 * Security: Callback server binds to 127.0.0.1 only. STEAM_API_KEY must be set in environment (.env).
 * OpenID response is validated by checking claimed_id format (steamcommunity.com/openid/id/ID64) only;
 * for production you may add full OpenID verification (POST to Steam's verify endpoint). See docs/STEAM_AUTH.md.
 */

import { BrowserWindow, ipcMain, shell } from 'electron';
import Store from 'electron-store';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import * as http from 'node:http';
import * as querystring from 'node:querystring';

// Steam returns identity URL like https://steamcommunity.com/openid/id/76561198002516729
const STEAM_ID_REGEX = /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/;
const STEAM_ID_FALLBACK_REGEX = /\/id\/(\d+)(?:\?|$)/;

interface SteamStoreShape {
  steamId64: string | null;
  avatarUrl?: string;
  personaname?: string;
}

const steamStore = new Store<SteamStoreShape>({
  name: 'steam-profile',
  defaults: {
    steamId64: null,
    avatarUrl: undefined,
    personaname: undefined,
  },
});

function getSteamApiKey(): string {
  const key = process.env.STEAM_API_KEY;
  if (!key) {
    throw new Error('STEAM_API_KEY is not set in environment');
  }
  return key;
}

/**
 * Extract SteamID64 from OpenID identity or claimed_id URL.
 * Accepts full URL or path, with or without encoding.
 */
function extractSteamId64(identityOrClaimedId: string): string | null {
  if (!identityOrClaimedId || typeof identityOrClaimedId !== 'string') return null;
  const decoded = tryDecodeUri(identityOrClaimedId);
  let match = decoded.match(STEAM_ID_REGEX);
  if (match) return match[1];
  match = decoded.match(STEAM_ID_FALLBACK_REGEX);
  return match ? match[1] : null;
}

function tryDecodeUri(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/**
 * Fetch player summary (avatar, personaname) from Steam Web API
 */
async function fetchPlayerSummary(steamId64: string): Promise<{ avatarUrl?: string; personaname?: string }> {
  const key = getSteamApiKey();
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${encodeURIComponent(key)}&steamids=${encodeURIComponent(steamId64)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status}`);
  }
  const data = (await res.json()) as { response?: { players?: Array<{ avatar?: string; avatarmedium?: string; personaname?: string }> } };
  const players = data?.response?.players;
  if (!players || players.length === 0) {
    return {};
  }
  const p = players[0];
  return {
    avatarUrl: p.avatarmedium || p.avatar || undefined,
    personaname: p.personaname || undefined,
  };
}

/**
 * Check if Steam is installed on Windows (registry + default path). Linux/macOS not implemented.
 */
function checkSteamInstallation(): { installed: boolean; path: string | null; error?: string } {
  if (process.platform !== 'win32') {
    return { installed: false, path: null, error: 'Vérification Steam disponible uniquement sur Windows.' };
  }

  let steamPath: string | null = null;

  try {
    // Try HKLM first (common for 64-bit)
    const key = 'HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam';
    const result = execSync(`reg query "${key}" /v InstallPath 2>nul`, { encoding: 'utf8' });
    const match = result.match(/InstallPath\s+REG_SZ\s+(.+)/);
    if (match) {
      steamPath = match[1].trim();
    }
  } catch {
    // ignore
  }

  if (!steamPath) {
    try {
      const keyHkcu = 'HKCU\\Software\\Valve\\Steam';
      const result = execSync(`reg query "${keyHkcu}" /v SteamPath 2>nul`, { encoding: 'utf8' });
      const match = result.match(/SteamPath\s+REG_SZ\s+(.+)/);
      if (match) {
        steamPath = match[1].trim().replace(/^"|"$/g, '');
      }
    } catch {
      // ignore
    }
  }

  if (!steamPath) {
    const defaultPath = path.join('C:', 'Program Files (x86)', 'Steam', 'steam.exe');
    if (fs.existsSync(defaultPath)) {
      steamPath = path.dirname(defaultPath);
    }
  }

  if (!steamPath) {
    return {
      installed: false,
      path: null,
      error: 'Nous ne détectons pas Steam sur votre ordinateur.',
    };
  }

  const exePath = path.join(steamPath, 'steam.exe');
  if (!fs.existsSync(exePath)) {
    return {
      installed: false,
      path: steamPath,
      error: 'Nous ne détectons pas Steam sur votre ordinateur.',
    };
  }

  return { installed: true, path: steamPath };
}

const CALLBACK_PATH = '/callback';

/** Fixed port so realm/return_to are stable; Steam validates against registered domain. */
const STEAM_CALLBACK_PORT = 30765;

/**
 * Build Steam OpenID login URL with return_to on localhost (Steam accepts only HTTP/HTTPS).
 * Uses fixed port so realm matches what you register in Steam Partner (e.g. http://localhost:30765).
 */
function buildSteamOpenIdUrl(port: number): string {
  const base = `http://localhost:${port}`;
  const returnTo = `${base}${CALLBACK_PATH}`;
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': returnTo,
    'openid.realm': base + '/',
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });
  return `https://steamcommunity.com/openid/login?${params.toString()}`;
}

const SUCCESS_HTML = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Connexion réussie</title></head>
<body style="font-family:system-ui;background:#252525;color:#edf7d2;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
  <p style="font-size:18px;">Connexion réussie. Vous pouvez fermer cet onglet et revenir à l'application.</p>
</body>
</html>
`;

export type SteamAuthResult =
  | { success: true; steamId64: string }
  | { success: false; error: string; cancelled?: boolean };

/**
 * Open Steam OpenID in the system browser. The local HTTP server receives the callback
 * when Steam redirects to localhost (avoids Electron window parsing issues).
 */
function openSteamAuthWindow(_parentWindow: BrowserWindow | null): Promise<SteamAuthResult> {
  return new Promise((resolve) => {
    let resolved = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const doResolve = (result: SteamAuthResult) => {
      if (resolved) return;
      resolved = true;
      if (timeoutId) clearTimeout(timeoutId);
      resolve(result);
    };

    const handleClaimedId = (claimedId: string | null): boolean => {
      if (resolved) return false;
      const steamId64 = claimedId ? extractSteamId64(claimedId) : null;
      if (!steamId64) return false;
      steamStore.set('steamId64', steamId64);
      fetchPlayerSummary(steamId64)
        .then(({ avatarUrl, personaname }) => {
          if (avatarUrl !== undefined) steamStore.set('avatarUrl', avatarUrl);
          else steamStore.delete('avatarUrl');
          if (personaname !== undefined) steamStore.set('personaname', personaname);
          else steamStore.delete('personaname');
        })
        .catch(() => {
          // keep steamId64 even if profile fetch fails
        })
        .finally(() => {
          server.close(() => {
            doResolve({ success: true, steamId64 });
          });
        });
      return true;
    };

    const sendSuccessHtml = (res: http.ServerResponse) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(SUCCESS_HTML);
    };

    const server = http.createServer((req, res) => {
      const reqUrl = req.url ?? '';
      let pathname: string;
      try {
        const urlObj = new URL(reqUrl, 'http://127.0.0.1/');
        pathname = urlObj.pathname;
      } catch {
        res.writeHead(400);
        res.end();
        return;
      }
      if (pathname !== CALLBACK_PATH) {
        res.writeHead(404);
        res.end();
        return;
      }

      if (req.method === 'POST') {
        const chunks: Buffer[] = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          const params = querystring.parse(body);
          const claimedId = (params['openid.claimed_id'] ?? params['openid.identity']) as string | undefined;
          const value = Array.isArray(claimedId) ? claimedId[0] : claimedId;
          const ok = handleClaimedId(value ?? null);
          sendSuccessHtml(res);
          if (!ok) {
            server.close(() => doResolve({ success: false, error: 'Réponse Steam invalide (claimed_id).' }));
          }
        });
        req.on('error', () => {
          res.writeHead(400);
          res.end();
        });
        return;
      }

      // GET: Steam redirects the browser to this URL with query params
      const urlObj = new URL(reqUrl, 'http://127.0.0.1/');
      const openIdMode = urlObj.searchParams.get('openid.mode');
      const openIdError = urlObj.searchParams.get('openid.error');
      if (openIdMode === 'error' && openIdError) {
        sendSuccessHtml(res);
        server.close(() => doResolve({ success: false, error: `Steam: ${openIdError}` }));
        return;
      }
      const claimedId = urlObj.searchParams.get('openid.claimed_id') ?? urlObj.searchParams.get('openid.identity');
      const hasOpenIdParams = Array.from(urlObj.searchParams.keys()).some((k) => k.startsWith('openid.'));
      if (!claimedId && !hasOpenIdParams) {
        sendSuccessHtml(res);
        return;
      }
      const ok = handleClaimedId(claimedId);
      sendSuccessHtml(res);
      if (!ok) {
        server.close(() => doResolve({ success: false, error: 'Réponse Steam invalide (claimed_id).' }));
      }
    });

    server.listen(STEAM_CALLBACK_PORT, '127.0.0.1', () => {
      const port = STEAM_CALLBACK_PORT;
      shell.openExternal(buildSteamOpenIdUrl(port));
      timeoutId = setTimeout(() => {
        if (!resolved) {
          server.close(() => doResolve({ success: false, error: 'Connexion annulée.', cancelled: true }));
        }
      }, 5 * 60 * 1000);
    });

    server.on('error', (err) => {
      if (!resolved) {
        doResolve({ success: false, error: (err as Error).message });
      }
    });
  });
}

export function setupSteamHandlers(): void {
  // Resolve only after server.close() callback so the port is released before the renderer gets the result.
  ipcMain.handle('steam:startAuth', async (event) => {
    const sender = event.sender;
    const parentWindow = BrowserWindow.fromWebContents(sender) ?? null;
    const result = await openSteamAuthWindow(parentWindow);
    if (result.success && !sender.isDestroyed()) {
      sender.send('steam:profile-updated');
    }
    return result;
  });

  ipcMain.handle('steam:getProfile', async () => {
    const steamId64 = steamStore.get('steamId64');
    const avatarUrl = steamStore.get('avatarUrl');
    const personaname = steamStore.get('personaname');
    if (!steamId64) return null;
    return {
      steamId64,
      avatarUrl,
      personaname,
    };
  });

  ipcMain.handle('steam:logout', async (event) => {
    // Single place for "clear Steam profile": store assign + notify renderer (same event as login)
    steamStore.store = { steamId64: null } as SteamStoreShape;
    const sender = event.sender;
    if (!sender.isDestroyed()) {
      sender.send('steam:profile-updated');
    }
  });

  ipcMain.handle('steam:checkInstallation', async () => {
    return checkSteamInstallation();
  });
}
