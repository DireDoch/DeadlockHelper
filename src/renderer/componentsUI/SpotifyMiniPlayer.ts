/**
 * SpotifyMiniPlayer — persistent sidebar widget with real-time progress interpolation.
 * Polls the API every 10 s; interpolates progress locally every 1 s between polls.
 */

interface TrackState {
  title: string;
  artist: string;
  albumArtUrl: string | null;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  fetchedAt: number; // Date.now() at the moment the API response was received
}

interface Device {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
}

// ─── Module state ─────────────────────────────────────────────────────────────

let trackState: TrackState | null = null;
let devices: Device[] = [];
let isAuthenticated = false;
let isLoading = true;
let devicesOpen = false;
let pollInterval: ReturnType<typeof setInterval> | null = null;
let tickInterval: ReturnType<typeof setInterval> | null = null;
let navigateCb: ((page: string) => void) | null = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sidebarIsOpen(): boolean {
  return document.getElementById('sidebar')?.classList.contains('w-64') ?? true;
}

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function interpolatedProgress(): { progressMs: number; pct: number } {
  if (!trackState) return { progressMs: 0, pct: 0 };
  const elapsed = trackState.isPlaying ? Date.now() - trackState.fetchedAt : 0;
  const ms = Math.min(trackState.progressMs + elapsed, trackState.durationMs);
  const pct = trackState.durationMs > 0 ? (ms / trackState.durationMs) * 100 : 0;
  return { progressMs: ms, pct };
}

// ─── SVG icons (inline, no external dependency) ───────────────────────────────

const I = {
  music: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`,
  play:  `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
  prev:  `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>`,
  next:  `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
  device: `<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
  speaker: `<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 14.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm3.5-9H8V5h7v2.5z"/></svg>`,
};

// ─── Rendering ────────────────────────────────────────────────────────────────

function buildHTML(): string {
  const open = sidebarIsOpen();

  if (isLoading) return buildSkeleton(open);
  if (!isAuthenticated) return buildNotConnected(open);
  if (!trackState) return buildIdle(open);
  return buildPlayer(open);
}

function buildSkeleton(open: boolean): string {
  if (!open) return `<div class="flex justify-center py-2"><div class="w-8 h-8 rounded bg-charcoal-300 animate-pulse"></div></div>`;
  return `
    <div class="flex items-center gap-2 animate-pulse">
      <div class="w-10 h-10 rounded bg-charcoal-300 shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="h-2.5 bg-charcoal-300 rounded w-3/4"></div>
        <div class="h-2.5 bg-charcoal-300 rounded w-1/2"></div>
      </div>
    </div>`;
}

function buildNotConnected(open: boolean): string {
  if (!open) {
    return `
      <button id="smp-connect-btn" class="flex items-center justify-center w-full py-2 text-grey-500 hover:text-white transition-colors" title="Connecter Spotify">
        ${I.music}
      </button>`;
  }
  return `
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-black" style="background:#1DB954">${I.music}</div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-white">Spotify</p>
        <button id="smp-connect-btn" class="text-xs underline hover:opacity-80 transition-opacity mt-0.5" style="color:#1DB954">Se connecter</button>
      </div>
    </div>`;
}

function buildIdle(open: boolean): string {
  if (!open) {
    return `<div class="flex items-center justify-center py-2 text-grey-500">${I.music}</div>`;
  }
  return `
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded bg-charcoal-100 flex items-center justify-center shrink-0 text-grey-500">${I.music}</div>
      <div class="flex-1 min-w-0">
        <p class="text-xs text-grey-400 leading-tight">Rien en lecture</p>
        <button id="smp-refresh-btn" class="flex items-center gap-1 text-grey-500 hover:text-white transition-colors text-xs mt-1">
          ${I.refresh}<span>Actualiser</span>
        </button>
      </div>
    </div>`;
}

function buildPlayer(open: boolean): string {
  const { progressMs, pct } = interpolatedProgress();
  const t = trackState!;
  const activeDevice = devices.find((d) => d.is_active);

  const artEl = t.albumArtUrl
    ? `<img src="${esc(t.albumArtUrl)}" alt="" class="rounded object-cover shrink-0" style="width:40px;height:40px">`
    : `<div class="rounded bg-charcoal-100 flex items-center justify-center shrink-0 text-grey-500" style="width:40px;height:40px">${I.music}</div>`;

  if (!open) {
    return `
      <div class="flex flex-col items-center gap-1.5 py-1 px-1">
        ${artEl}
        <div class="w-full h-0.5 rounded-full bg-charcoal-300 overflow-hidden">
          <div id="smp-progress" class="h-full rounded-full" style="background:#1DB954;width:${pct.toFixed(1)}%;transition:width 1s linear"></div>
        </div>
        <button id="smp-play-pause" class="text-white hover:opacity-75 transition-opacity">${t.isPlaying ? I.pause : I.play}</button>
      </div>`;
  }

  const deviceSection = devicesOpen ? buildDeviceList() : '';

  return `
    <div class="space-y-2">
      <!-- Track row -->
      <div class="flex items-center gap-2">
        ${artEl}
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-white leading-tight truncate" title="${esc(t.title)}">${esc(t.title)}</p>
          <p class="text-xs text-grey-400 truncate leading-tight mt-0.5">${esc(t.artist)}</p>
        </div>
        <button id="smp-refresh-btn" class="text-grey-500 hover:text-white transition-colors p-1 shrink-0" title="Actualiser les appareils">
          ${I.refresh}
        </button>
      </div>

      <!-- Progress bar -->
      <div class="h-0.5 rounded-full bg-charcoal-300 overflow-hidden">
        <div id="smp-progress" class="h-full rounded-full" style="background:#1DB954;width:${pct.toFixed(1)}%;transition:width 1s linear"></div>
      </div>

      <!-- Time + active device -->
      <div class="flex items-center justify-between text-grey-500" style="font-size:10px">
        <span id="smp-time">${formatMs(progressMs)}</span>
        ${activeDevice
          ? `<span class="flex items-center gap-1 truncate max-w-[90px] px-1">${activeDevice.type === 'Smartphone' ? I.speaker : I.device}<span class="truncate">${esc(activeDevice.name)}</span></span>`
          : ''}
        <span>${formatMs(t.durationMs)}</span>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center gap-5">
        <button id="smp-prev" class="text-grey-400 hover:text-white transition-colors" title="Précédent">${I.prev}</button>
        <button id="smp-play-pause" class="text-white hover:opacity-75 transition-opacity" title="${t.isPlaying ? 'Pause' : 'Lecture'}">${t.isPlaying ? I.pause : I.play}</button>
        <button id="smp-next" class="text-grey-400 hover:text-white transition-colors" title="Suivant">${I.next}</button>
      </div>

      <!-- Device list (toggled) -->
      ${deviceSection}
    </div>`;
}

function buildDeviceList(): string {
  if (devices.length === 0) {
    return `<p class="text-center text-grey-500 py-1" style="font-size:10px">Aucun appareil trouvé</p>`;
  }
  return `
    <div id="smp-device-list" class="rounded border border-grey-600 overflow-hidden" style="background:#0d0d0d">
      ${devices.map((d) => `
        <button data-device-id="${esc(d.id)}"
          class="smp-device-btn w-full text-left flex items-center gap-2 px-3 py-1.5 hover:bg-charcoal-300 transition-colors ${d.is_active ? 'text-white' : 'text-grey-400'}"
          style="font-size:11px">
          ${d.is_active ? `<span style="color:#1DB954;font-size:8px;line-height:1">●</span>` : `<span style="width:8px;display:inline-block"></span>`}
          ${d.type === 'Smartphone' ? I.speaker : I.device}
          <span class="truncate">${esc(d.name)}</span>
        </button>`).join('')}
    </div>`;
}

// ─── DOM rendering + event wiring ─────────────────────────────────────────────

function render(): void {
  const container = document.getElementById('spotify-widget-placeholder');
  if (!container) return;
  container.innerHTML = buildHTML();
  wireListeners();
}

function wireListeners(): void {
  document.getElementById('smp-connect-btn')?.addEventListener('click', () => {
    navigateCb?.('spotify-widget');
  });

  document.getElementById('smp-play-pause')?.addEventListener('click', async () => {
    if (!trackState) return;
    const wasPlaying = trackState.isPlaying;
    // Optimistic update
    trackState.isPlaying = !wasPlaying;
    if (!wasPlaying) trackState.fetchedAt = Date.now();
    render();
    if (wasPlaying) {
      await window.spotify.pause().catch(() => null);
    } else {
      await window.spotify.play().catch(() => null);
    }
    setTimeout(syncTrack, 600);
  });

  document.getElementById('smp-prev')?.addEventListener('click', async () => {
    await window.spotify.previous().catch(() => null);
    setTimeout(syncTrack, 600);
  });

  document.getElementById('smp-next')?.addEventListener('click', async () => {
    await window.spotify.next().catch(() => null);
    setTimeout(syncTrack, 600);
  });

  document.getElementById('smp-refresh-btn')?.addEventListener('click', async () => {
    const wasOpen = devicesOpen;
    if (!wasOpen) {
      await syncDevices();
      devicesOpen = true;
    } else {
      devicesOpen = false;
    }
    render();
  });

  document.getElementById('smp-device-list')?.querySelectorAll('.smp-device-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = (btn as HTMLElement).dataset.deviceId;
      if (!id) return;
      devicesOpen = false;
      await window.spotify.transferDevice(id).catch(() => null);
      setTimeout(() => { syncDevices(); syncTrack(); }, 1200);
    });
  });
}

// ─── Tick (1 s interpolation, no API call) ────────────────────────────────────

function tick(): void {
  if (!trackState?.isPlaying) return;

  const { progressMs, pct } = interpolatedProgress();

  const bar = document.getElementById('smp-progress');
  if (bar) bar.style.width = `${pct.toFixed(1)}%`;

  const timeEl = document.getElementById('smp-time');
  if (timeEl) timeEl.textContent = formatMs(progressMs);

  // Trigger a fresh API poll when we near the end of the track
  if (trackState.durationMs > 0 && progressMs >= trackState.durationMs - 1500) {
    syncTrack();
  }
}

// ─── API sync helpers ─────────────────────────────────────────────────────────

async function syncTrack(): Promise<void> {
  try {
    const data = await window.spotify.getCurrentlyPlaying();
    trackState = data ? { ...data, fetchedAt: Date.now() } : null;
    if (!isAuthenticated) { isAuthenticated = true; }
    render();
  } catch {
    // Keep last known state on transient error
  }
}

async function syncDevices(): Promise<void> {
  try {
    const data = await window.spotify.getDevices();
    devices = data;
  } catch { /* ignore */ }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const SpotifyMiniPlayer = {
  containerId: 'spotify-widget-placeholder',

  mount(navigate: (page: string) => void): void {
    navigateCb = navigate;
    isLoading = true;
    devicesOpen = false;
    trackState = null;
    devices = [];
    render();

    window.spotify.getAuthStatus()
      .then(({ isAuthenticated: auth }) => {
        isAuthenticated = auth;
        isLoading = false;
        if (auth) {
          return Promise.all([syncTrack(), syncDevices()]);
        }
        render();
        return Promise.resolve();
      })
      .catch(() => { isLoading = false; render(); });

    // 1-second tick for smooth progress interpolation
    if (tickInterval !== null) clearInterval(tickInterval);
    tickInterval = setInterval(tick, 1000);

    // 10-second poll: resync track state + re-check auth
    if (pollInterval !== null) clearInterval(pollInterval);
    pollInterval = setInterval(async () => {
      const { isAuthenticated: auth } = await window.spotify.getAuthStatus().catch(() => ({ isAuthenticated: false, displayName: null }));
      if (auth !== isAuthenticated) {
        isAuthenticated = auth;
        if (!auth) { trackState = null; devices = []; }
        render();
      }
      if (isAuthenticated) syncTrack();
    }, 10_000);
  },

  refresh(): void {
    // Called by Sidebar when open/closed state changes
    if (!sidebarIsOpen()) devicesOpen = false;
    render();
  },
};
