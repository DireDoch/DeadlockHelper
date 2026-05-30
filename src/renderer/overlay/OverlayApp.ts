import type { OverlaySettings, OverlayMatchData, OverlayItemSuggestion } from '../../lib/types';

// ── Game rules constants ──────────────────────────────────────────────────────

const URN_FIRST_SPAWN_S = 720;   // 12:00
const URN_INTERVAL_S    = 360;   // every 6 min
const URN_DESCENT_S     = 12;    // animation before collectible
const URN_LANES         = ['Jaune', 'Verte'] as const;

function midBossRespawnS(deathCount: number): number {
  if (deathCount === 1) return 420; // 7 min
  if (deathCount === 2) return 360; // 6 min
  return 300;                       // 5 min thereafter
}

function fmtTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ── OverlayApp ────────────────────────────────────────────────────────────────

export class OverlayApp {
  private settings: OverlaySettings | null = null;
  private matchData: OverlayMatchData | null = null;
  private tickTimer: ReturnType<typeof setInterval> | null = null;

  private startWallTime = 0;
  private clockRunning  = false;

  private midBossDeathCount    = 0;
  private midBossAlive         = true;
  private midBossRespawnAtS: number | null = null;

  private itemSuggestions: OverlayItemSuggestion[] = [];
  private itemsFetched = false;

  init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    const root = document.getElementById('overlay-root')!;
    root.innerHTML = this.renderPanel();
    this.bindMouseEvents(root);
    this.bindMidBossButton();

    window.overlayApi.getSettings().then((s) => {
      this.settings = s;
      console.log('[OverlayApp] Settings loaded:', JSON.stringify(s));
      this.applyOpacity(s.opacity);
      this.applyToggles(s);
    });

    window.overlayApi.onSettings((s) => {
      this.settings = s;
      this.applyOpacity(s.opacity);
      this.applyToggles(s);
    });

    window.overlayApi.onMatchData((data) => this.onMatchStarted(data));
    window.overlayApi.onMatchEnded(() => this.onMatchEnded());

    this.renderTick();
  }

  // ── Match lifecycle ─────────────────────────────────────────────────────────

  private onMatchStarted(data: OverlayMatchData): void {
    console.log('[OverlayApp] Match started — heroId:', data.playerHeroId, 'enemies:', data.enemyHeroIds);
    this.matchData          = data;
    this.startWallTime      = data.startWallTime;
    this.clockRunning       = true;
    this.midBossDeathCount  = 0;
    this.midBossAlive       = true;
    this.midBossRespawnAtS  = null;
    this.itemSuggestions    = [];
    this.itemsFetched       = false;

    this.startTick();

    if (data.playerHeroId && data.enemyHeroIds.length > 0 && this.settings?.showItemSuggestions) {
      this.fetchItemSuggestions(data.playerHeroId, data.enemyHeroIds);
    }
  }

  private onMatchEnded(): void {
    console.log('[OverlayApp] Match ended — resetting state');
    this.stopTick();
    this.matchData         = null;
    this.clockRunning      = false;
    this.midBossDeathCount = 0;
    this.midBossAlive      = true;
    this.midBossRespawnAtS = null;
    this.itemSuggestions   = [];
    this.itemsFetched      = false;
    this.renderTick();
  }

  // ── Tick ────────────────────────────────────────────────────────────────────

  private startTick(): void {
    this.stopTick();
    this.tickTimer = setInterval(() => this.renderTick(), 1000);
    this.renderTick();
  }

  private stopTick(): void {
    if (this.tickTimer) { clearInterval(this.tickTimer); this.tickTimer = null; }
  }

  private gameClockS(): number {
    if (!this.clockRunning) return 0;
    return Math.max(0, Math.floor((Date.now() - this.startWallTime) / 1000));
  }

  private renderTick(): void {
    const s = this.gameClockS();
    this.updateClock(s);
    this.updateMidBoss(s);
    this.updateUrn(s);
    this.updateItems();
  }

  // ── Widget updaters ─────────────────────────────────────────────────────────

  private updateClock(clockS: number): void {
    const el = document.getElementById('ov-clock');
    if (el) el.textContent = this.clockRunning ? fmtTime(clockS) : '--:--';
  }

  private updateMidBoss(clockS: number): void {
    const status = document.getElementById('ov-mb-status');
    if (!status) return;

    if (!this.clockRunning) {
      status.textContent  = '--';
      status.className    = 'text-xs font-mono text-grey-600';
      return;
    }

    if (this.midBossAlive) {
      status.textContent = 'Spawned';
      status.className   = 'text-xs font-mono font-semibold text-frosted-mint-400';
    } else if (this.midBossRespawnAtS !== null) {
      const rem = this.midBossRespawnAtS - clockS;
      if (rem <= 0) {
        this.midBossAlive      = true;
        this.midBossRespawnAtS = null;
        status.textContent     = 'Spawned';
        status.className       = 'text-xs font-mono font-semibold text-frosted-mint-400';
      } else {
        status.textContent = fmtTime(rem);
        status.className   = 'text-xs font-mono font-semibold text-red-400';
      }
    }
  }

  private updateUrn(clockS: number): void {
    const el = document.getElementById('ov-urn-content');
    if (!el) return;

    if (!this.clockRunning) {
      el.innerHTML = '<span class="text-grey-600 font-mono text-xs">--:--</span>';
      return;
    }

    // Find the next urn slot after current game clock
    let slotIndex = 0;
    let nextSpawnS = URN_FIRST_SPAWN_S;
    while (nextSpawnS <= clockS) {
      slotIndex++;
      nextSpawnS = URN_FIRST_SPAWN_S + slotIndex * URN_INTERVAL_S;
    }

    const lane      = URN_LANES[slotIndex % 2];
    const countdown = nextSpawnS - clockS;
    const laneColor = lane === 'Jaune' ? '#EFD970' : '#5AFFC3'; // rank colors from index.css

    if (countdown <= URN_DESCENT_S) {
      el.innerHTML = `
        <span class="font-semibold text-amber-300 text-xs">Descente!</span>
        <span style="color:${laneColor}" class="text-xs ml-1">${lane}</span>
      `;
    } else {
      el.innerHTML = `
        <span class="font-mono text-xs text-white/80">${fmtTime(countdown)}</span>
        <span style="color:${laneColor}" class="text-xs ml-1.5 opacity-70">${lane}</span>
      `;
    }
  }

  private updateItems(): void {
    const el = document.getElementById('ov-items');
    if (!el) return;

    if (!this.clockRunning || !this.itemsFetched) {
      if (!this.clockRunning) {
        el.innerHTML = '<span class="text-grey-600 text-xs">En attente…</span>';
      }
      return;
    }

    if (this.itemSuggestions.length === 0) {
      el.innerHTML = '<span class="text-grey-600 text-xs">Aucune donnée</span>';
      return;
    }

    el.innerHTML = this.itemSuggestions.map((item) => `
      <div class="flex items-center gap-2 py-0.5">
        ${item.imageUrl
          ? `<img src="${item.imageUrl}" class="w-5 h-5 rounded object-cover flex-shrink-0 opacity-90" alt="" />`
          : `<div class="w-5 h-5 rounded bg-charcoal-300 flex-shrink-0"></div>`
        }
        <span class="text-grey-300 text-xs truncate flex-1">${item.name}</span>
        <span class="text-frosted-mint-400 text-xs font-mono">${item.winRate.toFixed(1)}%</span>
      </div>
    `).join('');
  }

  // ── API fetch ───────────────────────────────────────────────────────────────

  private async fetchItemSuggestions(playerHeroId: number, enemyHeroIds: number[]): Promise<void> {
    try {
      // GET /v1/analytics/item-stats — "what items beat hero(es) X?"
      const params = new URLSearchParams({
        hero_ids: String(playerHeroId),
        enemy_hero_ids: enemyHeroIds.join(','),
      });
      const res = await fetch(`https://api.deadlock-api.com/v1/analytics/item-stats?${params}`);
      if (!res.ok) throw new Error(`item-stats ${res.status}`);

      const stats: Array<{ item_id: number; wins: number; losses: number; matches: number }> =
        await res.json();

      const top3 = stats
        .filter((s) => s.matches >= 50)
        .map((s) => ({ ...s, winRate: (s.wins / s.matches) * 100 }))
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 3);

      // GET /v1/assets/items/{id} — name + shop image
      const enriched = await Promise.all(
        top3.map(async (s): Promise<OverlayItemSuggestion> => {
          try {
            const ir = await fetch(`https://api.deadlock-api.com/v1/assets/items/${s.item_id}`);
            if (!ir.ok) throw new Error();
            const item = await ir.json();
            return {
              itemId:   s.item_id,
              name:     item.name ?? `Item ${s.item_id}`,
              imageUrl: item.shop_image_webp ?? item.shop_image ?? null,
              winRate:  s.winRate,
            };
          } catch {
            return { itemId: s.item_id, name: `Item ${s.item_id}`, imageUrl: null, winRate: s.winRate };
          }
        }),
      );

      this.itemSuggestions = enriched;
      console.log('[OverlayApp] Item suggestions fetched:', enriched.map((i) => i.name));
    } catch (e) {
      console.warn('[OverlayApp] Item suggestions failed:', String(e));
      this.itemSuggestions = [];
    } finally {
      this.itemsFetched = true;
      this.updateItems();
    }
  }

  // ── Event bindings ──────────────────────────────────────────────────────────

  private bindMidBossButton(): void {
    document.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('#ov-mb-btn')) return;
      if (!this.clockRunning || !this.midBossAlive) return;
      this.midBossDeathCount++;
      this.midBossAlive      = false;
      this.midBossRespawnAtS = this.gameClockS() + midBossRespawnS(this.midBossDeathCount);
      console.log(`[OverlayApp] Mid Boss death #${this.midBossDeathCount} — respawn in ${midBossRespawnS(this.midBossDeathCount)}s`);
      this.renderTick();
    });
  }

  private bindMouseEvents(root: HTMLElement): void {
    // Enable mouse events when hovering the overlay (allows clicking mid boss button
    // and dragging the handle); re-disable when leaving so game clicks pass through.
    root.addEventListener('mouseenter', () => window.overlayApi.setIgnoreMouse(false));
    root.addEventListener('mouseleave', () => window.overlayApi.setIgnoreMouse(true));
  }

  // ── Settings application ────────────────────────────────────────────────────

  private applyOpacity(opacity: number): void {
    document.getElementById('ov-panel')
      ?.style.setProperty('--ov-bg-opacity', String(opacity));
  }

  private applyToggles(s: OverlaySettings): void {
    const show = (id: string, visible: boolean) => {
      const el = document.getElementById(id);
      if (el) el.style.display = visible ? '' : 'none';
    };
    show('ov-row-souls', s.showSoulsPerMin);
    show('ov-row-mb',    s.showMidBossTimer);
    show('ov-row-urn',   s.showUrnTimer);
    show('ov-row-items', s.showItemSuggestions);
  }

  // ── HTML template ────────────────────────────────────────────────────────────

  private renderPanel(): string {
    // Colors from index.css @theme:
    // charcoal-100=#121212, charcoal-200=#252525, grey-300=#4a4a49, frosted-mint-400=#cfea86
    return `
      <div
        id="ov-panel"
        class="w-full h-full flex flex-col"
        style="
          --ov-bg-opacity: 0.25;
          background: rgba(18, 18, 18, var(--ov-bg-opacity));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(74, 74, 73, 0.35);
          border-radius: 10px;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        "
      >
        <!-- Drag handle — use -webkit-app-region:drag so Wayland compositor moves the window -->
        <div
          id="ov-drag"
          title="Glisser pour repositionner"
          style="
            -webkit-app-region: drag;
            height: 18px;
            background: rgba(74, 74, 73, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            flex-shrink: 0;
            border-bottom: 1px solid rgba(74,74,73,0.2);
          "
        >
          <span style="color:rgba(150,149,148,0.4); font-size:8px; letter-spacing:3px; pointer-events:none; -webkit-user-select:none;">⠿⠿⠿</span>
        </div>

        <!-- Content -->
        <div style="padding: 8px 12px; flex:1; display:flex; flex-direction:column; -webkit-app-region: no-drag;">

        <!-- Header: app name + game clock -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:9px; text-transform:uppercase; letter-spacing:0.1em; color:rgba(150,149,148,0.7);">Deadlock</span>
          <span id="ov-clock" style="font-family:monospace; font-size:13px; color:rgba(207,234,134,0.9); font-weight:600;">--:--</span>
        </div>

        <div style="height:1px; background:rgba(74,74,73,0.3); margin-bottom:8px;"></div>

        <!-- 1. Souls/min (placeholder) -->
        <div id="ov-row-souls" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-size:10px; color:rgba(150,149,148,0.8);">Souls / min</span>
          <div style="display:flex; align-items:center; gap:4px;">
            <span style="font-family:monospace; font-size:10px; color:rgba(100,100,100,0.7);">-- SPM</span>
            <span
              style="font-size:9px; color:rgba(100,100,100,0.5); cursor:default;"
              title="Donnée indisponible — source live requise"
            >ⓘ</span>
          </div>
        </div>

        <!-- 2. Mid Boss -->
        <div id="ov-row-mb" style="margin-bottom:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:10px; color:rgba(150,149,148,0.8);">Mid Boss</span>
            <span id="ov-mb-status" class="text-xs font-mono text-grey-600">--</span>
          </div>
          <button
            id="ov-mb-btn"
            style="
              margin-top:4px; width:100%; font-size:9px;
              border:1px solid rgba(74,74,73,0.4);
              background:rgba(37,37,37,0.5);
              color:rgba(150,149,148,0.7);
              border-radius:5px; padding:3px 0;
              cursor:pointer; transition:all 0.15s;
            "
            onmouseover="this.style.background='rgba(74,74,73,0.4)';this.style.color='rgba(207,234,134,0.8)'"
            onmouseout="this.style.background='rgba(37,37,37,0.5)';this.style.color='rgba(150,149,148,0.7)'"
          >Boss mort → démarrer timer</button>
        </div>

        <!-- 3. Urn timer -->
        <div id="ov-row-urn" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-size:10px; color:rgba(150,149,148,0.8);">Next Urn</span>
          <div id="ov-urn-content">
            <span style="font-family:monospace; font-size:10px; color:rgba(100,100,100,0.7);">--:--</span>
          </div>
        </div>

        <div style="height:1px; background:rgba(74,74,73,0.3); margin-bottom:6px;"></div>

        <!-- 4. Item suggestions -->
        <div id="ov-row-items" style="flex:1;">
          <span style="font-size:9px; text-transform:uppercase; letter-spacing:0.08em; color:rgba(100,100,100,0.6); display:block; margin-bottom:4px;">vs comp. ennemie</span>
          <div id="ov-items">
            <span style="font-size:10px; color:rgba(100,100,100,0.5);">En attente…</span>
          </div>
        </div>

        </div><!-- end content -->
      </div>
    `;
  }
}
