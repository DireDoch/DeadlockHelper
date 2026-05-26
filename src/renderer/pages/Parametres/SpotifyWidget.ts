export class SpotifyWidgetPage {
  private container: HTMLElement | null = null;
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private devicesOpen = false;

  // Client-side interpolation state
  private trackFetchedAt = 0;
  private trackProgressMs = 0;
  private trackDurationMs = 0;
  private trackIsPlaying = false;

  mount(container: HTMLElement): void {
    this.stopAll();
    this.container = container;
    this.init();
  }

  private stopAll(): void {
    if (this.pollInterval !== null) { clearInterval(this.pollInterval); this.pollInterval = null; }
    if (this.tickInterval !== null) { clearInterval(this.tickInterval); this.tickInterval = null; }
  }

  private async init(): Promise<void> {
    this.renderSkeleton();
    const status = await window.spotify.getAuthStatus();
    if (status.isAuthenticated) {
      await this.renderPlayer(status.displayName);
      this.startIntervals();
    } else {
      this.renderLogin();
    }
  }

  // ─── Skeleton ──────────────────────────────────────────────────────────────

  private renderSkeleton(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-xl mx-auto">
          <div class="h-8 w-48 bg-charcoal-200 rounded animate-pulse mb-8"></div>
          <div class="bg-charcoal-200 rounded-2xl p-6 border border-grey-600 animate-pulse">
            <div class="flex items-center gap-5 mb-6">
              <div class="w-20 h-20 rounded-xl bg-charcoal-100 shrink-0"></div>
              <div class="flex-1 space-y-3">
                <div class="h-5 bg-charcoal-100 rounded w-3/4"></div>
                <div class="h-4 bg-charcoal-100 rounded w-1/2"></div>
              </div>
            </div>
            <div class="h-1.5 bg-charcoal-100 rounded-full mb-6"></div>
            <div class="flex justify-center gap-6">
              <div class="w-10 h-10 rounded-full bg-charcoal-100"></div>
              <div class="w-12 h-12 rounded-full bg-charcoal-100"></div>
              <div class="w-10 h-10 rounded-full bg-charcoal-100"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  // ─── Login ─────────────────────────────────────────────────────────────────

  private renderLogin(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-8">Spotify Widget</h1>
          <div class="bg-charcoal-200 rounded-2xl p-10 border border-grey-600 text-center">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style="background:#1DB954">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-white mb-2">Connecter Spotify</h2>
            <p class="text-grey-400 mb-8 text-sm">
              Contrôlez votre musique sans quitter l'application.<br>Un compte Spotify Premium est requis.
            </p>
            <button id="spotify-login-btn"
              class="px-8 py-3 rounded-xl font-semibold text-black transition-all duration-200 hover:scale-105 active:scale-95"
              style="background:#1DB954">
              Se connecter avec Spotify
            </button>
          </div>
        </div>
      </div>`;
    document.getElementById('spotify-login-btn')?.addEventListener('click', () => this.handleLogin());
  }

  private async handleLogin(): Promise<void> {
    const btn = document.getElementById('spotify-login-btn') as HTMLButtonElement | null;
    if (btn) { btn.disabled = true; btn.textContent = 'Ouverture du navigateur…'; }
    this.renderSkeleton();
    const result = await window.spotify.login();
    if (result.success) {
      await this.renderPlayer(result.displayName ?? null);
      this.startIntervals();
    } else {
      this.renderLogin();
      this.showToast(`Connexion échouée : ${result.error ?? 'erreur inconnue'}`, 'error');
    }
  }

  // ─── Player ────────────────────────────────────────────────────────────────

  private async renderPlayer(displayName: string | null): Promise<void> {
    if (!this.container) return;
    const [track, devices] = await Promise.all([
      window.spotify.getCurrentlyPlaying(),
      window.spotify.getDevices(),
    ]);
    this.storeTrackState(track);

    const { pct } = this.currentProgress();
    const activeDevice = devices.find((d) => d.is_active);

    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold text-white">Spotify Widget</h1>
            <div class="flex items-center gap-3">
              ${displayName ? `<span class="text-grey-400 text-sm">${this.esc(displayName)}</span>` : ''}
              <button id="spotify-logout-btn"
                class="px-3 py-1.5 rounded-lg text-sm text-grey-400 border border-grey-600 hover:border-grey-400 hover:text-white transition-colors">
                Déconnecter
              </button>
            </div>
          </div>

          <!-- Player card -->
          <div class="bg-charcoal-200 rounded-2xl p-6 border border-grey-600 mb-4" id="spotify-player-card">
            ${this.buildTrackHTML(track, pct)}
          </div>

          <!-- Device selector -->
          <div class="bg-charcoal-200 rounded-xl border border-grey-600 overflow-hidden" id="devices-section">
            <div class="flex items-center">
              <button id="devices-toggle"
                class="flex-1 flex items-center gap-2 px-5 py-3 text-sm text-grey-300 hover:text-white hover:bg-charcoal-100 transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                </svg>
                <span>${activeDevice ? this.esc(activeDevice.name) : 'Appareils'}</span>
                <svg id="devices-chevron" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" class="ml-auto transition-transform">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </button>
              <button id="devices-refresh-btn" title="Actualiser les appareils"
                class="px-3 py-3 text-grey-500 hover:text-white transition-colors border-l border-grey-600">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </div>
            <div id="devices-list" class="hidden border-t border-grey-600">
              ${this.buildDevicesHTML(devices)}
            </div>
          </div>

          <div id="spotify-toast" class="hidden mt-4 px-4 py-2 rounded-lg text-sm text-center"></div>
        </div>
      </div>`;

    this.attachPlayerListeners(track?.isPlaying ?? false, devices);
  }

  private storeTrackState(track: Awaited<ReturnType<typeof window.spotify.getCurrentlyPlaying>>): void {
    if (track) {
      this.trackFetchedAt = Date.now();
      this.trackProgressMs = track.progressMs;
      this.trackDurationMs = track.durationMs;
      this.trackIsPlaying = track.isPlaying;
    } else {
      this.trackFetchedAt = 0;
      this.trackProgressMs = 0;
      this.trackDurationMs = 0;
      this.trackIsPlaying = false;
    }
  }

  private currentProgress(): { progressMs: number; pct: number } {
    if (this.trackDurationMs === 0) return { progressMs: 0, pct: 0 };
    const elapsed = this.trackIsPlaying ? Date.now() - this.trackFetchedAt : 0;
    const ms = Math.min(this.trackProgressMs + elapsed, this.trackDurationMs);
    return { progressMs: ms, pct: (ms / this.trackDurationMs) * 100 };
  }

  private buildTrackHTML(
    track: Awaited<ReturnType<typeof window.spotify.getCurrentlyPlaying>>,
    pct: number,
  ): string {
    if (!track) {
      return `
        <div class="flex items-center gap-5 mb-6">
          <div class="w-20 h-20 rounded-xl bg-charcoal-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="#666"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
          <div>
            <p class="text-white font-medium">Rien en cours de lecture</p>
            <p class="text-grey-400 text-sm mt-1">Lancez de la musique sur Spotify</p>
          </div>
        </div>
        <div class="h-1.5 bg-charcoal-100 rounded-full mb-2">
          <div class="h-full w-0 rounded-full" style="background:#1DB954"></div>
        </div>
        <div class="flex justify-between text-xs text-grey-500 mb-6"><span>0:00</span><span>0:00</span></div>
        ${this.buildControlsHTML(false)}`;
    }

    return `
      <div class="flex items-center gap-5 mb-4">
        ${track.albumArtUrl
          ? `<img src="${this.esc(track.albumArtUrl)}" alt="Pochette" class="w-20 h-20 rounded-xl object-cover shrink-0 shadow-lg">`
          : `<div class="w-20 h-20 rounded-xl bg-charcoal-100 flex items-center justify-center shrink-0">
               <svg viewBox="0 0 24 24" width="32" height="32" fill="#666"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
             </div>`}
        <div class="min-w-0 flex-1">
          <p class="text-white font-semibold text-lg leading-tight truncate" title="${this.esc(track.title)}">${this.esc(track.title)}</p>
          <p class="text-grey-400 text-sm mt-1 truncate">${this.esc(track.artist)}</p>
        </div>
      </div>
      <div class="h-1.5 bg-charcoal-100 rounded-full mb-2 overflow-hidden">
        <div id="spotify-progress-bar" class="h-full rounded-full" style="background:#1DB954;width:${pct.toFixed(1)}%;transition:width 1s linear"></div>
      </div>
      <div class="flex justify-between text-xs text-grey-500 mb-6">
        <span id="spotify-time-current">${this.fmtMs(this.trackProgressMs)}</span>
        <span>${this.fmtMs(track.durationMs)}</span>
      </div>
      ${this.buildControlsHTML(track.isPlaying)}`;
  }

  private buildControlsHTML(isPlaying: boolean): string {
    const base = 'flex items-center justify-center rounded-full transition-all duration-150 active:scale-90';
    return `
      <div class="flex items-center justify-center gap-6">
        <button id="spotify-prev" title="Précédent" class="${base} w-10 h-10 text-grey-400 hover:text-white">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
        </button>
        <button id="spotify-play-pause" title="${isPlaying ? 'Pause' : 'Lecture'}"
          class="${base} w-14 h-14 text-black hover:scale-105" style="background:#1DB954">
          ${isPlaying
            ? `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
            : `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`}
        </button>
        <button id="spotify-next" title="Suivant" class="${base} w-10 h-10 text-grey-400 hover:text-white">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>
        </button>
      </div>`;
  }

  private buildDevicesHTML(devices: Awaited<ReturnType<typeof window.spotify.getDevices>>): string {
    if (devices.length === 0) {
      return `<p class="px-5 py-3 text-grey-400 text-sm">Aucun appareil actif trouvé</p>`;
    }
    return devices.map((d) => `
      <button data-device-id="${this.esc(d.id)}"
        class="device-item w-full flex items-center gap-3 px-5 py-3 text-sm hover:bg-charcoal-100 transition-colors text-left
               ${d.is_active ? 'text-white' : 'text-grey-400'}">
        ${d.is_active ? `<span style="color:#1DB954;font-size:10px">●</span>` : '<span style="width:10px;display:inline-block"></span>'}
        <span class="flex-1 truncate">${this.esc(d.name)}</span>
        ${d.is_active ? `<span class="text-xs" style="color:#1DB954">ACTIF</span>` : ''}
      </button>`).join('');
  }

  // ─── Listeners ─────────────────────────────────────────────────────────────

  private attachPlayerListeners(
    isPlaying: boolean,
    devices: Awaited<ReturnType<typeof window.spotify.getDevices>>,
  ): void {
    let playing = isPlaying;

    document.getElementById('spotify-logout-btn')?.addEventListener('click', () => this.handleLogout());

    document.getElementById('spotify-prev')?.addEventListener('click', async () => {
      await window.spotify.previous().catch(() => null);
      setTimeout(() => this.syncTrack(), 500);
    });

    document.getElementById('spotify-next')?.addEventListener('click', async () => {
      await window.spotify.next().catch(() => null);
      setTimeout(() => this.syncTrack(), 500);
    });

    document.getElementById('spotify-play-pause')?.addEventListener('click', async () => {
      if (playing) {
        this.trackIsPlaying = false;
        await window.spotify.pause().catch(() => null);
      } else {
        this.trackIsPlaying = true;
        this.trackFetchedAt = Date.now();
        await window.spotify.play().catch(() => null);
      }
      playing = !playing;
      this.updatePlayPauseBtn(playing);
      setTimeout(() => this.syncTrack(), 500);
    });

    document.getElementById('devices-toggle')?.addEventListener('click', () => {
      this.devicesOpen = !this.devicesOpen;
      document.getElementById('devices-list')?.classList.toggle('hidden', !this.devicesOpen);
      const chevron = document.getElementById('devices-chevron');
      if (chevron) chevron.style.transform = this.devicesOpen ? 'rotate(180deg)' : '';
    });

    document.getElementById('devices-refresh-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('devices-refresh-btn') as HTMLButtonElement | null;
      if (btn) btn.style.opacity = '0.4';
      const fresh = await window.spotify.getDevices().catch(() => devices);
      const list = document.getElementById('devices-list');
      if (list) list.innerHTML = this.buildDevicesHTML(fresh);
      this.attachDeviceListeners(fresh);
      const toggle = document.getElementById('devices-toggle');
      const activeDevice = fresh.find((d) => d.is_active);
      const label = toggle?.querySelector('span');
      if (label) label.textContent = activeDevice ? activeDevice.name : 'Appareils';
      if (btn) btn.style.opacity = '';
    });

    this.attachDeviceListeners(devices);
  }

  private attachDeviceListeners(devices: Awaited<ReturnType<typeof window.spotify.getDevices>>): void {
    document.getElementById('devices-list')?.querySelectorAll('.device-item').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = (btn as HTMLElement).dataset.deviceId!;
        await window.spotify.transferDevice(id).catch(() => null);
        this.devicesOpen = false;
        document.getElementById('devices-list')?.classList.add('hidden');
        const chevron = document.getElementById('devices-chevron');
        if (chevron) chevron.style.transform = '';
        setTimeout(async () => {
          const fresh = await window.spotify.getDevices().catch(() => devices);
          const list = document.getElementById('devices-list');
          if (list) list.innerHTML = this.buildDevicesHTML(fresh);
          this.attachDeviceListeners(fresh);
          const activeDevice = fresh.find((d) => d.is_active);
          const label = document.getElementById('devices-toggle')?.querySelector('span');
          if (label) label.textContent = activeDevice ? activeDevice.name : 'Appareils';
          await this.syncTrack();
        }, 1200);
      });
    });
  }

  private updatePlayPauseBtn(isPlaying: boolean): void {
    const btn = document.getElementById('spotify-play-pause');
    if (!btn) return;
    btn.title = isPlaying ? 'Pause' : 'Lecture';
    btn.innerHTML = isPlaying
      ? `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
      : `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  }

  // ─── Intervals ─────────────────────────────────────────────────────────────

  private startIntervals(): void {
    this.stopAll();

    // 1-second tick: interpolate progress without API call
    this.tickInterval = setInterval(() => this.tick(), 1000);

    // 5-second poll: resync with API
    this.pollInterval = setInterval(() => this.syncTrack(), 5_000);
  }

  private tick(): void {
    if (!this.trackIsPlaying || this.trackDurationMs === 0) return;
    const { progressMs, pct } = this.currentProgress();

    const bar = document.getElementById('spotify-progress-bar');
    if (bar) bar.style.width = `${pct.toFixed(1)}%`;

    const timeEl = document.getElementById('spotify-time-current');
    if (timeEl) timeEl.textContent = this.fmtMs(progressMs);

    if (progressMs >= this.trackDurationMs - 1500) this.syncTrack();
  }

  private async syncTrack(): Promise<void> {
    const track = await window.spotify.getCurrentlyPlaying().catch(() => null);
    this.storeTrackState(track);
    const card = document.getElementById('spotify-player-card');
    if (!card) return;

    // Update play/pause button state
    this.updatePlayPauseBtn(this.trackIsPlaying);

    // Full re-render of card only when track changes
    const currentTitle = card.querySelector('[title]')?.getAttribute('title') ?? '';
    if (currentTitle !== (track?.title ?? '')) {
      const { pct } = this.currentProgress();
      card.innerHTML = this.buildTrackHTML(track, pct);
      this.attachPlayerListeners(this.trackIsPlaying, await window.spotify.getDevices().catch(() => []));
    }
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

  private async handleLogout(): Promise<void> {
    this.stopAll();
    await window.spotify.logout();
    this.renderLogin();
  }

  // ─── Toast ─────────────────────────────────────────────────────────────────

  private showToast(message: string, type: 'error' | 'success'): void {
    const toast = document.getElementById('spotify-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `mt-4 px-4 py-2 rounded-lg text-sm text-center ${type === 'error' ? 'bg-red-900 text-red-200' : 'text-black'}`;
    if (type === 'success') toast.style.background = '#1DB954';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 5_000);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private esc(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  private fmtMs(ms: number): string {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  }
}
