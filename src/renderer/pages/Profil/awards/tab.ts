/**
 * Awards Tab — renderer (UI refactor: cyber-tactical glassmorphism)
 *
 * Exports:
 *   renderAwardsTab(earnedMap)                              → HTML string
 *   attachAwardsTabEvents(container, earnedMap, onMatchInspect) → void
 *
 * Visual system:
 *   • Glassmorphism dark cards (bg rgba(4,8,28,0.85) + backdrop-blur)
 *   • Per-rarity border + glow colors (purple / cyan / emerald / slate / rose)
 *   • Locked: grayscale + contrast-125 + opacity-40 + padlock
 *   • Hover (earned): glow box-shadow (via CSS var) + shimmer sweep once
 *   • Stats header: combat score + per-rarity breakdown badges
 *   • Clickable cards → slide-in drawer with date / match IDs / inspect button
 */

import { AWARD_DEFINITIONS } from '../../../../lib/awards';
import type { AwardRarity, AwardEntry, AwardId, AwardDefinition } from '../../../../lib/awards';

// ── Rarity config ─────────────────────────────────────────────────────────────

interface RarityConfig {
  label: string;
  short: string;           // Single letter for compact badges
  color: string;           // CSS hex/rgba — used in inline styles
  glow: string;            // rgba for box-shadow glow var
  points: number;          // Score pts per occurrence
}

const RARITY_CONFIG: Record<AwardRarity, RarityConfig> = {
  epic:     { label: 'EPIC',     short: 'E', color: '#a855f7', glow: 'rgba(168,85,247,0.50)',  points: 150 },
  rare:     { label: 'RARE',     short: 'R', color: '#06b6d4', glow: 'rgba(6,182,212,0.50)',   points: 75  },
  uncommon: { label: 'UNCOMMON', short: 'U', color: '#34d399', glow: 'rgba(52,211,153,0.45)',  points: 35  },
  common:   { label: 'COMMON',   short: 'C', color: '#94a3b8', glow: 'rgba(148,163,184,0.40)', points: 15  },
  infamous: { label: 'INFAMOUS', short: 'I', color: '#e11d48', glow: 'rgba(225,29,72,0.50)',   points: 5   },
};

const RARITY_ORDER: AwardRarity[] = ['infamous', 'common', 'uncommon', 'rare', 'epic'];

// ── Score helpers ─────────────────────────────────────────────────────────────

function totalScore(earnedMap: Map<AwardId, AwardEntry>): number {
  let score = 0;
  for (const [id, entry] of earnedMap) {
    const def = AWARD_DEFINITIONS.find(d => d.id === id);
    if (def) score += RARITY_CONFIG[def.rarity].points * entry.count;
  }
  return score;
}

function rarityStats(rarity: AwardRarity, earnedMap: Map<AwardId, AwardEntry>) {
  const computable = AWARD_DEFINITIONS.filter(d => d.rarity === rarity && d.computable);
  return { earned: computable.filter(d => earnedMap.has(d.id)).length, total: computable.length };
}

// ── renderAwardsTab ───────────────────────────────────────────────────────────

export function renderAwardsTab(earnedMap: Map<AwardId, AwardEntry>): string {
  const score     = totalScore(earnedMap);
  const allComp   = AWARD_DEFINITIONS.filter(d => d.computable);
  const numEarned = allComp.filter(d => earnedMap.has(d.id)).length;
  const pct       = allComp.length > 0 ? (numEarned / allComp.length) * 100 : 0;

  // Per-rarity summary badges (highest rarity first in the display row)
  const rarityBadges = [...RARITY_ORDER].reverse().map(r => {
    const cfg   = RARITY_CONFIG[r];
    const stats = rarityStats(r, earnedMap);
    return `
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded"
           style="background:${cfg.color}12; border:0.5px solid ${cfg.color}40;">
        <span class="text-[8px] font-black tracking-widest" style="color:${cfg.color};">${cfg.short}</span>
        <span class="text-[11px] font-semibold tabular-nums text-white/60">${stats.earned}<span class="text-white/20">/${stats.total}</span></span>
      </div>`;
  }).join('');

  const sections = RARITY_ORDER.map(r => renderSection(r, earnedMap)).join('');

  return `
    <div class="px-6 py-5 max-w-7xl mx-auto awards-tab-root" style="position:relative;">

      <!-- ── Combat score header ── -->
      <div class="mb-7 p-4 rounded-xl relative overflow-hidden"
           style="background:rgba(4,8,28,0.80); border:0.5px solid rgba(255,255,255,0.07); backdrop-filter:blur(16px);">
        <!-- Decorative scan-line texture -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.03]"
             style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px);"></div>
        <!-- Top accent gradient -->
        <div class="absolute top-0 left-0 right-0 h-px"
             style="background:linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(6,182,212,0.5), rgba(52,211,153,0.3), transparent);"></div>

        <div class="relative flex items-center justify-between flex-wrap gap-4">
          <!-- Score block -->
          <div class="flex items-end gap-4">
            <div>
              <p class="text-[8px] font-black tracking-[0.3em] text-white/25 uppercase mb-0.5">Combat Score</p>
              <p class="text-4xl font-black tabular-nums text-white leading-none tracking-tight">
                ${score.toLocaleString('en-US')}
                <span class="text-lg font-semibold text-white/30 ml-1">pts</span>
              </p>
            </div>
            <!-- Vertical separator -->
            <div class="w-px h-10 self-center" style="background:rgba(255,255,255,0.08);"></div>
            <!-- Progress -->
            <div>
              <p class="text-[8px] font-black tracking-[0.2em] text-white/25 uppercase mb-1.5">Progression</p>
              <div class="flex items-center gap-2">
                <div class="w-36 h-1 rounded-full overflow-hidden" style="background:rgba(255,255,255,0.06);">
                  <div class="h-full rounded-full transition-all duration-700"
                       style="width:${pct.toFixed(1)}%;
                              background:linear-gradient(90deg,#a855f7,#06b6d4,#34d399);"></div>
                </div>
                <span class="text-[11px] font-semibold text-white/40 tabular-nums">${numEarned}/${allComp.length}</span>
              </div>
            </div>
          </div>
          <!-- Per-rarity badges -->
          <div class="flex items-center gap-2 flex-wrap">${rarityBadges}</div>
        </div>
      </div>

      <!-- ── Award sections ── -->
      ${sections}

      <!-- ── Detail drawer (slide-in from right) ── -->
      ${renderDrawer()}
    </div>`;
}

// ── Drawer HTML ───────────────────────────────────────────────────────────────

function renderDrawer(): string {
  return `
    <!-- Backdrop -->
    <div class="awards-backdrop"
         style="position:fixed; inset:0; z-index:90; background:rgba(0,0,0,0.55);
                backdrop-filter:blur(4px); opacity:0; pointer-events:none;
                transition:opacity 0.25s ease;"
         data-awards-action="close-drawer"></div>

    <!-- Drawer panel -->
    <div class="awards-drawer"
         style="position:fixed; top:0; right:0; height:100vh; width:400px; z-index:100;
                background:rgba(3,6,22,0.97); backdrop-filter:blur(28px);
                border-left:0.5px solid rgba(255,255,255,0.07);
                transform:translateX(100%); transition:transform 0.3s cubic-bezier(0.22,1,0.36,1);
                overflow-y:auto;">

      <!-- Rarity accent stripe on left edge -->
      <div class="awards-drawer-stripe"
           style="position:absolute; left:0; top:0; width:2px; height:100%;
                  background:rgba(168,85,247,0.7); transition:background 0.3s ease;"></div>

      <!-- Scan lines -->
      <div style="position:absolute; inset:0; pointer-events:none; opacity:0.025;
                  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.6) 2px,rgba(255,255,255,0.6) 3px);"></div>

      <!-- Inner content -->
      <div style="padding:1.5rem 1.5rem 1.5rem 2rem; position:relative;">

        <!-- Close button + rarity label -->
        <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.25rem;">
          <div>
            <p class="awards-drawer-rarity"
               style="font-size:8px; font-weight:900; letter-spacing:0.22em; color:#a855f7; margin-bottom:4px; text-transform:uppercase;">EPIC</p>
            <h2 class="awards-drawer-name"
                style="font-size:1.25rem; font-weight:900; color:white; line-height:1.2;">Award Name</h2>
          </div>
          <button data-awards-action="close-drawer"
                  style="width:2rem; height:2rem; display:flex; align-items:center; justify-content:center;
                         border-radius:8px; background:rgba(255,255,255,0.05); border:none; cursor:pointer;
                         color:rgba(255,255,255,0.35); transition:background 0.2s, color 0.2s; flex-shrink:0;"
                  onmouseover="this.style.background='rgba(255,255,255,0.10)'; this.style.color='rgba(255,255,255,0.8)';"
                  onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.color='rgba(255,255,255,0.35)';">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Description block -->
        <div style="margin-bottom:1.25rem; padding:0.75rem; border-radius:10px;
                    background:rgba(255,255,255,0.03); border:0.5px solid rgba(255,255,255,0.06);">
          <p style="font-size:8px; font-weight:800; letter-spacing:0.2em; color:rgba(255,255,255,0.25);
                    text-transform:uppercase; margin-bottom:6px;">Critère</p>
          <p class="awards-drawer-desc"
             style="font-size:13px; color:rgba(255,255,255,0.65); line-height:1.5;">—</p>
        </div>

        <!-- Stats grid -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
          <div style="padding:0.75rem; border-radius:10px;
                      background:rgba(255,255,255,0.03); border:0.5px solid rgba(255,255,255,0.06);">
            <p style="font-size:8px; font-weight:800; letter-spacing:0.2em; color:rgba(255,255,255,0.25);
                      text-transform:uppercase; margin-bottom:4px;">Obtenu</p>
            <p class="awards-drawer-count"
               style="font-size:2rem; font-weight:900; color:white; line-height:1; font-variant-numeric:tabular-nums;">—</p>
            <p style="font-size:9px; color:rgba(255,255,255,0.25); margin-top:2px;">fois</p>
          </div>
          <div style="padding:0.75rem; border-radius:10px;
                      background:rgba(255,255,255,0.03); border:0.5px solid rgba(255,255,255,0.06);">
            <p style="font-size:8px; font-weight:800; letter-spacing:0.2em; color:rgba(255,255,255,0.25);
                      text-transform:uppercase; margin-bottom:4px;">Première fois</p>
            <p class="awards-drawer-first-date"
               style="font-size:13px; font-weight:600; color:rgba(255,255,255,0.6);">—</p>
          </div>
        </div>

        <!-- Match list -->
        <div>
          <p style="font-size:8px; font-weight:800; letter-spacing:0.2em; color:rgba(255,255,255,0.25);
                    text-transform:uppercase; margin-bottom:0.75rem;">Matchs associés</p>
          <div class="awards-drawer-matches"></div>
        </div>
      </div>
    </div>`;
}

// ── Section ───────────────────────────────────────────────────────────────────

function renderSection(rarity: AwardRarity, earnedMap: Map<AwardId, AwardEntry>): string {
  const cfg   = RARITY_CONFIG[rarity];
  const defs  = AWARD_DEFINITIONS.filter(d => d.rarity === rarity);
  const stats = rarityStats(rarity, earnedMap);
  const cards = defs.map(def => renderCard(def, earnedMap.get(def.id), cfg)).join('');

  return `
    <div style="margin-bottom:2rem;">
      <!-- Section header -->
      <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.875rem;">
        <div style="width:3px; height:1rem; border-radius:999px; background:${cfg.color}; flex-shrink:0;"></div>
        <span style="font-size:9px; font-weight:900; letter-spacing:0.22em; text-transform:uppercase; color:${cfg.color};">${cfg.label}</span>
        <div style="flex:1; height:1px; background:linear-gradient(to right, ${cfg.color}30, transparent);"></div>
        <span style="font-size:10px; color:rgba(255,255,255,0.2); font-variant-numeric:tabular-nums;">${stats.earned}/${stats.total}</span>
      </div>
      <!-- Card grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:0.625rem;">
        ${cards}
      </div>
    </div>`;
}

// ── Card ──────────────────────────────────────────────────────────────────────

function renderCard(
  def: AwardDefinition,
  entry: AwardEntry | undefined,
  cfg: RarityConfig,
): string {
  const earned      = entry !== undefined;
  const unavailable = !def.computable;
  const locked      = !earned && !unavailable;

  const filterStyle = locked
    ? 'filter:grayscale(1) contrast(1.25); opacity:0.4;'
    : unavailable ? 'opacity:0.5;' : '';

  const cursorStyle = 'cursor:pointer;';
  const borderColor = earned ? cfg.color + '55' : 'rgba(255,255,255,0.06)';

  // Badge
  let badge: string;
  if (earned) {
    badge = `
      <span style="position:absolute; top:8px; right:8px; font-size:8px; font-weight:900;
                   padding:2px 6px; border-radius:4px; line-height:1;
                   background:${cfg.color}20; color:${cfg.color}; border:0.5px solid ${cfg.color}44;">
        ×${entry!.count}
      </span>`;
  } else if (unavailable) {
    badge = `
      <span style="position:absolute; top:8px; right:8px; font-size:8px; font-weight:700;
                   padding:2px 5px; border-radius:4px; line-height:1;
                   background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.2);
                   border:0.5px solid rgba(255,255,255,0.08);">
        N/A
      </span>`;
  } else {
    badge = `
      <div style="position:absolute; top:8px; right:8px; width:14px; height:14px;
                  display:flex; align-items:center; justify-content:center;">
        <svg width="11" height="11" fill="rgba(255,255,255,0.15)" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clip-rule="evenodd"/>
        </svg>
      </div>`;
  }

  return `
    <div class="award-card-v2${earned ? ' ac-earned' : ''}"
         data-award-id="${def.id}"
         data-rarity="${def.rarity}"
         style="position:relative; overflow:hidden; border-radius:12px; padding:14px 12px 12px;
                background:rgba(4,8,28,0.85); border:0.5px solid ${borderColor};
                backdrop-filter:blur(12px); ${filterStyle} ${cursorStyle}
                --rarity-glow:${cfg.glow}; --rarity-color:${cfg.color};
                transition:box-shadow 0.3s ease-out, border-color 0.3s ease-out;">

      <!-- Shimmer layer (fires once on hover via CSS animation) -->
      <div class="ac-shimmer" style="position:absolute; inset:0; pointer-events:none; z-index:5;
                                      overflow:hidden; border-radius:inherit;"></div>

      <!-- Top highlight line -->
      <div style="position:absolute; top:0; left:0; right:0; height:1px; border-radius:12px 12px 0 0;
                  background:linear-gradient(90deg,transparent,${cfg.color}${earned ? '60' : '20'},transparent);"></div>

      ${badge}

      <!-- Rarity label -->
      <p style="font-size:7.5px; font-weight:900; letter-spacing:0.2em; text-transform:uppercase;
                margin-bottom:6px; color:${earned ? cfg.color : 'rgba(255,255,255,0.2)'};">${cfg.label}</p>

      <!-- Name -->
      <p style="font-size:11px; font-weight:700; color:${earned ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.40)'};
                line-height:1.35; padding-right:20px; margin-bottom:6px;">${def.name}</p>

      <!-- Description -->
      <p style="font-size:9px; color:rgba(255,255,255,0.28); line-height:1.5;
                display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${def.description}</p>
    </div>`;
}

// ── Drawer logic (attach events) ──────────────────────────────────────────────

/**
 * Attach all interactive events to the awards tab.
 * Call this after the tab HTML has been injected into the DOM.
 *
 * @param container       — The ProfilPage root container
 * @param earnedMap       — Current earned awards map
 * @param onMatchInspect  — Called when user clicks "Inspect" on a match in the drawer
 */
export function attachAwardsTabEvents(
  container: HTMLElement,
  earnedMap: Map<AwardId, AwardEntry>,
  onMatchInspect: (matchId: number) => void,
): void {
  const root = container.querySelector('.awards-tab-root') as HTMLElement | null;
  if (!root) return;

  // Single delegated listener on the tab root
  root.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Close-drawer actions (backdrop + close button)
    if (target.closest('[data-awards-action="close-drawer"]')) {
      closeDrawer(root);
      return;
    }

    // Inspect match button inside the drawer
    const inspectBtn = target.closest('.ac-inspect-btn') as HTMLElement | null;
    if (inspectBtn) {
      const matchId = Number(inspectBtn.dataset.matchId);
      if (matchId) {
        closeDrawer(root);
        onMatchInspect(matchId);
      }
      return;
    }

    // Award card click → open drawer
    const card = target.closest('[data-award-id]') as HTMLElement | null;
    if (card) {
      const awardId = card.dataset.awardId as AwardId;
      const def     = AWARD_DEFINITIONS.find(d => d.id === awardId);
      if (def) openDrawer(root, def, earnedMap.get(awardId), onMatchInspect);
    }
  });
}

function openDrawer(
  root: HTMLElement,
  def: AwardDefinition,
  entry: AwardEntry | undefined,
  _onMatchInspect: (matchId: number) => void,
): void {
  const drawer   = root.querySelector('.awards-drawer')    as HTMLElement | null;
  const backdrop = root.querySelector('.awards-backdrop')  as HTMLElement | null;
  if (!drawer || !backdrop) return;

  const cfg = RARITY_CONFIG[def.rarity];

  // Update accent stripe color
  const stripe = drawer.querySelector('.awards-drawer-stripe') as HTMLElement | null;
  if (stripe) stripe.style.background = cfg.color + 'aa';

  // Update rarity label
  const rarityEl = drawer.querySelector('.awards-drawer-rarity') as HTMLElement | null;
  if (rarityEl) { rarityEl.textContent = cfg.label; rarityEl.style.color = cfg.color; }

  // Update award name
  const nameEl = drawer.querySelector('.awards-drawer-name') as HTMLElement | null;
  if (nameEl) nameEl.textContent = def.name;

  // Update description
  const descEl = drawer.querySelector('.awards-drawer-desc') as HTMLElement | null;
  if (descEl) {
    descEl.textContent = !def.computable
      ? 'Données indisponibles — ce critère ne peut pas être calculé depuis les statistiques API disponibles.'
      : def.description;
  }

  // Update count
  const countEl = drawer.querySelector('.awards-drawer-count') as HTMLElement | null;
  if (countEl) countEl.textContent = entry ? String(entry.count) : '0';

  // Update first-earned date
  const dateEl = drawer.querySelector('.awards-drawer-first-date') as HTMLElement | null;
  if (dateEl) {
    dateEl.textContent = entry
      ? new Date(entry.firstEarnedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—';
  }

  // Populate match list
  const matchesEl = drawer.querySelector('.awards-drawer-matches') as HTMLElement | null;
  if (matchesEl) {
    if (!entry?.matchIds.length) {
      matchesEl.innerHTML = `
        <div style="padding:1.5rem 0; text-align:center;">
          <svg width="28" height="28" fill="rgba(255,255,255,0.08)" viewBox="0 0 20 20" style="margin:0 auto 8px;">
            <path fill-rule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clip-rule="evenodd"/>
          </svg>
          <p style="font-size:11px; color:rgba(255,255,255,0.2);">Non débloqué</p>
        </div>`;
    } else {
      const shown = entry.matchIds.slice(0, 8);
      matchesEl.innerHTML = shown.map(matchId => `
        <div style="display:flex; align-items:center; justify-content:space-between;
                    padding:0.6rem 0.75rem; border-radius:8px; margin-bottom:0.5rem;
                    background:rgba(255,255,255,0.02); border:0.5px solid rgba(255,255,255,0.06);
                    transition:background 0.15s;">
          <div>
            <p style="font-size:8px; font-weight:700; letter-spacing:0.15em; color:rgba(255,255,255,0.2);
                      text-transform:uppercase; margin-bottom:2px;">Match</p>
            <p style="font-size:13px; font-family:monospace; font-weight:600;
                      color:rgba(255,255,255,0.6);">#${matchId}</p>
          </div>
          <button class="ac-inspect-btn"
                  data-match-id="${matchId}"
                  style="padding:5px 12px; font-size:9px; font-weight:700; letter-spacing:0.08em;
                         border-radius:6px; cursor:pointer; border:0.5px solid ${cfg.color}50;
                         background:${cfg.color}18; color:${cfg.color};
                         transition:background 0.2s, border-color 0.2s;"
                  onmouseover="this.style.background='${cfg.color}30'; this.style.borderColor='${cfg.color}80';"
                  onmouseout="this.style.background='${cfg.color}18'; this.style.borderColor='${cfg.color}50';">
            INSPECTER →
          </button>
        </div>`).join('') + (entry.matchIds.length > 8
          ? `<p style="font-size:10px; color:rgba(255,255,255,0.2); text-align:center; padding-top:4px;">
               +${entry.matchIds.length - 8} autres matchs
             </p>`
          : '');
    }
  }

  // Show drawer + backdrop
  drawer.style.transform   = 'translateX(0)';
  backdrop.style.opacity   = '1';
  backdrop.style.pointerEvents = 'auto';
}

function closeDrawer(root: HTMLElement): void {
  const drawer   = root.querySelector('.awards-drawer')   as HTMLElement | null;
  const backdrop = root.querySelector('.awards-backdrop') as HTMLElement | null;
  if (drawer)   drawer.style.transform = 'translateX(100%)';
  if (backdrop) { backdrop.style.opacity = '0'; backdrop.style.pointerEvents = 'none'; }
}
