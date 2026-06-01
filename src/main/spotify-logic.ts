import 'dotenv/config';
import { ipcMain, shell, app } from 'electron';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import Store from 'electron-store';

interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAtMs: number;
  displayName: string | null;
}

interface CurrentlyPlaying {
  title: string;
  artist: string;
  albumArtUrl: string | null;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
}

interface SpotifyDevice {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  volume_percent: number;
}

const spotifyStore = new Store<{ auth: SpotifyTokens | null }>({
  name: 'spotify-auth',
  defaults: { auth: null },
});

// Load credentials from userData/spotify-credentials.json if present (runtime override),
// otherwise fall back to values baked in at build time via Vite define.
// File location on Linux : ~/.config/DeadlockHelper/spotify-credentials.json
// File location on Windows: %APPDATA%\DeadlockHelper\spotify-credentials.json
// Expected format: { "clientId": "...", "clientSecret": "...", "redirectUri": "..." }
function loadCredentials() {
  try {
    const configPath = path.join(app.getPath('userData'), 'spotify-credentials.json');
    if (fs.existsSync(configPath)) {
      const raw = JSON.parse(fs.readFileSync(configPath, 'utf8')) as Record<string, string>;
      return {
        clientId: raw['clientId'] || process.env.SPOTIFY_CLIENT_ID || '',
        clientSecret: raw['clientSecret'] || process.env.SPOTIFY_CLIENT_SECRET || '',
        redirectUri: raw['redirectUri'] || process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:30765/spotify/callback',
      };
    }
  } catch { /* ignore — fall through to baked values */ }
  return {
    clientId: process.env.SPOTIFY_CLIENT_ID ?? '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? '',
    redirectUri: process.env.SPOTIFY_REDIRECT_URI ?? 'http://127.0.0.1:30765/spotify/callback',
  };
}

const { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, redirectUri: REDIRECT_URI } = loadCredentials();
const SCOPES = 'user-modify-playback-state user-read-playback-state user-read-currently-playing';

function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state,
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function parseRedirectUri(): { port: number; path: string } {
  try {
    const url = new URL(REDIRECT_URI);
    return { port: parseInt(url.port, 10) || 80, path: url.pathname };
  } catch {
    return { port: 30765, path: '/callback' };
  }
}

async function exchangeCodeForToken(code: string): Promise<SpotifyTokens> {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI }).toString(),
  });

  if (!response.ok) {
    const err = await parseSpotifyError(response);
    throw new Error(`Token exchange failed: ${err}`);
  }

  const data = await response.json() as { access_token: string; refresh_token: string; expires_in: number };

  let displayName: string | null = null;
  try {
    const profileRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    if (profileRes.ok) {
      const profile = await profileRes.json() as { display_name?: string };
      displayName = profile.display_name ?? null;
    }
  } catch { /* ignore */ }

  const tokens: SpotifyTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAtMs: Date.now() + data.expires_in * 1000,
    displayName,
  };
  spotifyStore.set('auth', tokens);
  return tokens;
}

async function refreshAccessToken(): Promise<string> {
  const auth = spotifyStore.get('auth');
  if (!auth?.refreshToken) throw new Error('No refresh token available');

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: auth.refreshToken }).toString(),
  });

  if (!response.ok) {
    const err = await parseSpotifyError(response);
    throw new Error(`Token refresh failed: ${err}`);
  }

  const data = await response.json() as { access_token: string; refresh_token?: string; expires_in: number };
  const updated: SpotifyTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? auth.refreshToken,
    expiresAtMs: Date.now() + data.expires_in * 1000,
    displayName: auth.displayName,
  };
  spotifyStore.set('auth', updated);
  return updated.accessToken;
}

async function getValidAccessToken(): Promise<string> {
  const auth = spotifyStore.get('auth');
  if (!auth) throw new Error('Not authenticated with Spotify');
  if (Date.now() >= auth.expiresAtMs - 60_000) return refreshAccessToken();
  return auth.accessToken;
}

async function parseSpotifyError(res: Response): Promise<string> {
  try {
    const body = await res.json() as { error?: { message?: string } | string };
    if (typeof body.error === 'object' && body.error?.message) return body.error.message;
    if (typeof body.error === 'string') return body.error;
  } catch { /* ignore */ }
  return `HTTP ${res.status}`;
}

async function spotifyRequest<T = any>(
  method: string,
  endpoint: string,
  body?: object,
  retryCount = 0,
): Promise<T | null> {
  const MAX_RETRIES = 3;

  const doRequest = (token: string) =>
    fetch(`https://api.spotify.com${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

  let token = await getValidAccessToken();
  let res = await doRequest(token);

  // Auto-refresh on 401
  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await doRequest(token);
  }

  // Exponential backoff on 429 (rate limit) — respect Retry-After header
  if (res.status === 429 && retryCount < MAX_RETRIES) {
    const retryAfter = parseInt(res.headers.get('Retry-After') ?? '1', 10);
    const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(1000 * Math.pow(2, retryCount), 30_000);
    await new Promise<void>((r) => setTimeout(r, delay));
    return spotifyRequest(method, endpoint, body, retryCount + 1);
  }

  if (res.status === 204 || res.status === 202) return null;

  if (!res.ok) {
    const message = await parseSpotifyError(res);
    throw new Error(message);
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : null;
}

export function setupSpotifyHandlers(): void {
  ipcMain.handle('spotify:login', async () => {
    const state = crypto.randomBytes(16).toString('hex');
    const authUrl = buildAuthorizeUrl(state);
    const { port, path: callbackPath } = parseRedirectUri();

    return new Promise<{ success: boolean; displayName?: string; error?: string }>((resolve) => {
      const server = http.createServer((req, res) => {
        // Parse against 127.0.0.1 base — never localhost per Spotify redirect URI rules
        const reqUrl = new URL(req.url ?? '/', `http://127.0.0.1:${port}`);
        if (reqUrl.pathname !== callbackPath) {
          res.writeHead(404).end();
          return;
        }

        const code = reqUrl.searchParams.get('code');
        const returnedState = reqUrl.searchParams.get('state');
        const error = reqUrl.searchParams.get('error');

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<html><body style="font-family:sans-serif;text-align:center;padding:40px;background:#121212;color:#fff"><h2>Authentification réussie !</h2><p style="color:#b3b3b3">Vous pouvez fermer cet onglet.</p><script>setTimeout(()=>window.close(),1500)</script></body></html>');
        server.close();

        if (error || !code) {
          resolve({ success: false, error: error ?? 'No code received' });
          return;
        }
        if (returnedState !== state) {
          resolve({ success: false, error: 'State mismatch — possible CSRF' });
          return;
        }

        exchangeCodeForToken(code)
          .then((tokens) => resolve({ success: true, displayName: tokens.displayName ?? undefined }))
          .catch((err) => resolve({ success: false, error: String(err) }));
      });

      // Bind to 127.0.0.1 explicitly — not 0.0.0.0 / localhost
      server.listen(port, '127.0.0.1', () => shell.openExternal(authUrl));
      server.on('error', (err) => resolve({ success: false, error: err.message }));

      setTimeout(() => { server.close(); resolve({ success: false, error: 'Auth timeout' }); }, 5 * 60_000);
    });
  });

  ipcMain.handle('spotify:logout', () => {
    spotifyStore.set('auth', null);
    return { success: true };
  });

  ipcMain.handle('spotify:getAuthStatus', () => {
    const auth = spotifyStore.get('auth');
    return { isAuthenticated: auth !== null, displayName: auth?.displayName ?? null };
  });

  ipcMain.handle('spotify:play', async (_, deviceId?: string) => {
    await spotifyRequest('PUT', '/v1/me/player/play', deviceId ? { device_id: deviceId } : undefined);
    return { success: true };
  });

  ipcMain.handle('spotify:pause', async () => {
    await spotifyRequest('PUT', '/v1/me/player/pause');
    return { success: true };
  });

  ipcMain.handle('spotify:next', async () => {
    await spotifyRequest('POST', '/v1/me/player/next');
    return { success: true };
  });

  ipcMain.handle('spotify:previous', async () => {
    await spotifyRequest('POST', '/v1/me/player/previous');
    return { success: true };
  });

  ipcMain.handle('spotify:getCurrentlyPlaying', async () => {
    const data = await spotifyRequest<any>('GET', '/v1/me/player/currently-playing');
    if (!data?.item) return null;
    return {
      title: data.item.name,
      artist: (data.item.artists as Array<{ name: string }>)?.map((a) => a.name).join(', ') ?? '',
      albumArtUrl: (data.item.album?.images as Array<{ url: string }>)?.[0]?.url ?? null,
      isPlaying: data.is_playing,
      progressMs: data.progress_ms ?? 0,
      durationMs: data.item.duration_ms ?? 0,
    } as CurrentlyPlaying;
  });

  ipcMain.handle('spotify:getDevices', async () => {
    const data = await spotifyRequest<{ devices: SpotifyDevice[] }>('GET', '/v1/me/player/devices');
    return data?.devices ?? [];
  });

  ipcMain.handle('spotify:transferDevice', async (_, deviceId: string) => {
    await spotifyRequest('PUT', '/v1/me/player', { device_ids: [deviceId], play: true });
    return { success: true };
  });
}
