/**
 * Match Detail Panel — orchestrator.
 *
 * Owns the per-match interactive UI state (kept OUTSIDE the DOM, because the
 * Profil match-row list re-renders its full innerHTML on metadata/name loads),
 * renders the 5-tab panel, and handles all clicks via one delegated listener
 * per panel root using `data-action` attributes.
 *
 * Tabs (verified against GET /v1/matches/{id}/metadata — see ../../../../../CONTEXT.md):
 *   Overview · Lane Stats · Items · Economy · Damage   (no TL Score — out of scope)
 */

import type {
  DetailContext, DetailTab, MatchDetailState, RichMatchMeta,
} from './types';
import { renderOverview, renderLane, renderItems, renderEconomy, renderDamage } from './tabs';
import { isNormalMode, loadAbilityData, getAbilityData } from './helpers';

type DetailContextBase = Omit<DetailContext, 'state'>;

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'lane',     label: 'Lane Stats' },
  { id: 'items',    label: 'Items' },
  { id: 'economy',  label: 'Economy' },
  { id: 'damage',   label: 'Damage' },
];

export class MatchDetailController {
  private states = new Map<number, MatchDetailState>();
  private container: HTMLElement | null = null;
  private getBase: ((matchId: number) => DetailContextBase | null) | null = null;

  /** Forget state for a collapsed match so re-opening starts fresh-ish (optional housekeeping). */
  reset(): void { this.states.clear(); }

  /** Inner panel HTML (tab bar + active tab). Wrapped by the caller in a `[data-detail-root]`. */
  renderInner(base: DetailContextBase): string {
    const state = this.ensureState(base);
    const ctx: DetailContext = { ...base, state };
    return `
      <div class="flex gap-1 border-b border-grey-700/50 mb-3 -mt-1 flex-wrap">
        ${TABS.map((t) => `<button data-action="detail-tab" data-value="${t.id}"
            class="px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${state.tab === t.id
              ? 'text-dry-sage-400 border-dry-sage-400'
              : 'text-grey-400 border-transparent hover:text-grey-200'}">${t.label}</button>`).join('')}
      </div>
      ${this.renderTab(ctx)}`;
  }

  private renderTab(ctx: DetailContext): string {
    switch (ctx.state.tab) {
      case 'overview': return renderOverview(ctx);
      case 'lane':     return renderLane(ctx);
      case 'items':    return renderItems(ctx);
      case 'economy':  return renderEconomy(ctx);
      case 'damage':   return renderDamage(ctx);
    }
  }

  /**
   * Bind the delegated click handler to every open panel root inside `container`.
   * `getBase(matchId)` returns the fresh context (assets + meta) for that match.
   */
  attach(container: HTMLElement, getBase: (matchId: number) => DetailContextBase | null): void {
    this.container = container;
    this.getBase = getBase;
    container.querySelectorAll<HTMLElement>('[data-detail-root]').forEach((root) => {
      if (!(root as { _mdBound?: boolean })._mdBound) {
        (root as { _mdBound?: boolean })._mdBound = true;
        root.addEventListener('click', (e) => this.onClick(e, root, getBase));
      }
      // Kick off ability-order loads for any panel already sitting on the Items tab
      // (covers the case where the whole row list re-rendered while Items was open).
      const base = getBase(Number(root.dataset.matchId));
      if (base && this.ensureState(base).tab === 'items') this.ensureItemsAbilities(base);
    });
  }

  /** Re-render a single open panel's content from the live DOM (used after async loads). */
  private rerender(matchId: number): void {
    const base = this.getBase?.(matchId);
    const content = this.container
      ?.querySelector(`[data-detail-root][data-match-id="${matchId}"] [data-detail-content]`) as HTMLElement | null;
    if (base && content) content.innerHTML = this.renderInner(base);
  }

  /** Lazy-load + cache the most-popular ability order for both selected Items players. */
  private ensureItemsAbilities(base: DetailContextBase): void {
    const state = this.ensureState(base);
    const heroOf = (slot: number) => base.meta.players.find((p) => p.player_slot === slot)?.hero_id;
    const heroes = [heroOf(state.itemsLeftSlot), heroOf(state.itemsRightSlot)]
      .filter((h): h is number => typeof h === 'number');
    for (const heroId of new Set(heroes)) {
      if (getAbilityData(heroId)) continue;
      loadAbilityData(heroId).then(() => {
        if (this.ensureState(base).tab === 'items') this.rerender(base.matchId);
      });
    }
  }

  private onClick(
    e: Event, root: HTMLElement, getBase: (matchId: number) => DetailContextBase | null,
  ): void {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!el || !root.contains(el)) return;
    const action = el.dataset.action!;

    // Player links bubble up to the existing app-level navigation.
    if (action === 'navigate-player') {
      const accountId = Number(el.dataset.accountId);
      if (accountId) document.dispatchEvent(new CustomEvent('navigate-player', { detail: { accountId } }));
      return;
    }

    const matchId = Number(root.dataset.matchId);
    const base = getBase(matchId);
    if (!base) return;
    const state = this.ensureState(base);

    switch (action) {
      case 'detail-tab':  state.tab = el.dataset.value as DetailTab; break;
      case 'lane-snap':   state.laneSnapshotIdx = Number(el.dataset.idx); break;
      case 'lane-preset': this.applyLanePreset(base.meta, state, Number(el.dataset.lane)); break;
      case 'lane-toggle': {
        const set = el.dataset.side === 'left' ? state.laneLeft : state.laneRight;
        const slot = Number(el.dataset.slot);
        set.has(slot) ? set.delete(slot) : set.add(slot);
        break;
      }
      case 'items-pick':
        if (el.dataset.side === 'left') state.itemsLeftSlot = Number(el.dataset.slot);
        else state.itemsRightSlot = Number(el.dataset.slot);
        break;
      case 'dmg-subtab': state.damageSubtab = el.dataset.value as MatchDetailState['damageSubtab']; break;
      case 'dmg-pick':   state.damageSlot = Number(el.dataset.slot); break;
      case 'eco-subtab': state.economySubtab = el.dataset.value as MatchDetailState['economySubtab']; break;
      case 'eco-pick':   state.economySlot = Number(el.dataset.slot); break;
      default: return;
    }

    const content = root.querySelector('[data-detail-content]') as HTMLElement | null;
    if (content) content.innerHTML = this.renderInner(base);

    // Items tab needs the (async) ability-order data for the selected heroes.
    if (state.tab === 'items') this.ensureItemsAbilities(base);
  }

  // ── state init ───────────────────────────────────────────────────────────
  private ensureState(base: DetailContextBase): MatchDetailState {
    const existing = this.states.get(base.matchId);
    if (existing?.initialized) return existing;

    const meta = base.meta;
    const owner = meta.players.find((p) => p.account_id === base.ownerAccountId);
    const team0 = meta.players.filter((p) => p.team === 0);
    const team1 = meta.players.filter((p) => p.team === 1);

    const state: MatchDetailState = {
      tab: 'overview',
      laneSnapshotIdx: -1,
      laneLeft: new Set(),
      laneRight: new Set(),
      itemsLeftSlot: (owner?.team === 0 ? owner : team0[0])?.player_slot ?? 0,
      itemsRightSlot: (owner?.team === 1 ? owner : team1[0])?.player_slot ?? 0,
      damageSubtab: 'hero',
      damageSlot: (owner ?? meta.players[0])?.player_slot ?? 0,
      economySubtab: 'networth',
      economySlot: (owner ?? meta.players[0])?.player_slot ?? 0,
      initialized: true,
    };

    // Normal mode: default lane selection = the profile owner's lane (their 2v2).
    // Street Brawl (no lanes): default = full team-vs-team.
    if (isNormalMode(base.gameMode) && owner && owner.assigned_lane != null) {
      this.applyLanePreset(meta, state, owner.assigned_lane);
    }
    if (!state.laneLeft.size && !state.laneRight.size) {
      team0.forEach((p) => state.laneLeft.add(p.player_slot));
      team1.forEach((p) => state.laneRight.add(p.player_slot));
    }

    this.states.set(base.matchId, state);
    return state;
  }

  private applyLanePreset(meta: RichMatchMeta, state: MatchDetailState, lane: number): void {
    state.laneLeft = new Set(meta.players.filter((p) => p.team === 0 && p.assigned_lane === lane).map((p) => p.player_slot));
    state.laneRight = new Set(meta.players.filter((p) => p.team === 1 && p.assigned_lane === lane).map((p) => p.player_slot));
  }
}
