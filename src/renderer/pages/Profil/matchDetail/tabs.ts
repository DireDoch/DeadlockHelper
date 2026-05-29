/**
 * Match Detail Panel — tab renderers (pure functions of DetailContext).
 * All interactivity is driven by `data-action` attributes, handled centrally
 * by the orchestrator (./index.ts).
 */

import { renderItemTierBadge } from '../../../../lib/utils';
import abilityLearnUrl from '../../../../assets/icons/ability-learn.png?url';
import type {
  AbilityData, DetailContext, RichMetaPlayer, StatSnapshot,
} from './types';
import {
  TEAM_NAME, teamColor, laneColor, fmtCompact, fmtRaw, fmtMinute,
  heroIcon, heroMini, heroName, itemImg, playerName, escapeHtml,
  snapshotStamps, snapshotAt, endGameBuild, itemTimeline, itemTitle,
  shotsHitPct, advantageBar, playerStatRow, incomeBreakdown, donutChart,
  orderPlayers, orderedLanes, isNormalMode, getAbilityData, abilityImg,
} from './helpers';

// ── shared bits ──────────────────────────────────────────────────────────────
function teamHeaderLabel(meta: DetailContext['meta'], team: number): string {
  const won = meta.winning_team === team;
  return `${TEAM_NAME[team]} <span class="${won ? 'text-emerald-400' : 'text-red-400'}">(${won ? 'WINNER' : 'LOSER'})</span>`;
}
/** Team players, ordered by fixed lane order in Normal (yellow→blue→green), else by slot. */
function teamPlayers(ctx: DetailContext, team: number): RichMetaPlayer[] {
  return orderPlayers(ctx.meta.players.filter((p) => p.team === team), ctx.gameMode);
}
function finalSnap(p: RichMetaPlayer): StatSnapshot | undefined {
  return snapshotAt(p, -1);
}
function nameLink(ctx: DetailContext, p: RichMetaPlayer, extra = ''): string {
  const isOwner = p.account_id === ctx.ownerAccountId;
  return `<button data-action="navigate-player" data-account-id="${p.account_id}"
            class="text-left truncate transition-colors hover:text-dry-sage-400 ${isOwner ? 'text-white font-semibold' : 'text-grey-300'} ${extra}"
            title="${escapeHtml(playerName(ctx.playerNameMap, p.account_id))}">
            ${escapeHtml(playerName(ctx.playerNameMap, p.account_id))}</button>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1 · OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════
export function renderOverview(ctx: DetailContext): string {
  return `<div class="space-y-4">
    ${[0, 1].map((team) => renderOverviewTeam(ctx, team)).join('')}
  </div>`;
}

function renderOverviewTeam(ctx: DetailContext, team: number): string {
  const players = teamPlayers(ctx, team);
  const k = players.reduce((s, p) => s + p.kills, 0);
  const d = players.reduce((s, p) => s + p.deaths, 0);
  const a = players.reduce((s, p) => s + p.assists, 0);
  const teamKills = k || 1;
  return `
    <div class="rounded-lg border border-grey-700/50 overflow-hidden" style="border-top:2px solid ${teamColor(team)};">
      <div class="flex items-center justify-between px-3 py-2 bg-charcoal-300/40">
        <span class="text-sm font-bold tracking-wide" style="color:${teamColor(team)};">${teamHeaderLabel(ctx.meta, team)}</span>
        <span class="text-white text-sm font-bold tabular-nums">${k}/${d}/${a}</span>
      </div>
      <div class="divide-y divide-grey-700/30">
        ${players.map((p) => renderOverviewRow(ctx, p, teamKills)).join('')}
      </div>
    </div>`;
}

function renderOverviewRow(ctx: DetailContext, p: RichMetaPlayer, teamKills: number): string {
  const icon = heroIcon(ctx.heroMap, p.hero_id);
  const build = endGameBuild(p.items, ctx.itemMap);
  const kda = p.deaths > 0 ? (p.kills + p.assists) / p.deaths : p.kills + p.assists;
  const kp = ((p.kills + p.assists) / teamKills) * 100;
  const heroDmg = finalSnap(p)?.player_damage ?? 0;

  const EMPTY = `<div class="w-7 h-7 rounded border border-grey-700/30 bg-charcoal-100/20"></div>`;
  const slots = Array(12).fill(null).map((_, i) => {
    const it = build[i];
    if (!it) return EMPTY;
    return `<div class="relative w-7 h-7 rounded overflow-hidden border border-grey-700/60" title="${itemTitle(it)}">
        <img src="${itemImg(it)}" alt="${escapeHtml(it.name)}" class="w-full h-full object-cover">
        ${renderItemTierBadge(it)}
      </div>`;
  }).join('');

  return `
    <div class="flex items-center gap-3 px-3 py-2 hover:bg-charcoal-300/20">
      <div class="flex items-center gap-2 w-40 min-w-0 flex-shrink-0">
        ${icon ? `<img src="${icon}" class="w-9 h-9 rounded object-cover border border-grey-700 flex-shrink-0" alt="${heroName(ctx.heroMap, p.hero_id)}">`
               : `<div class="w-9 h-9 rounded bg-grey-700 flex-shrink-0"></div>`}
        <div class="min-w-0">${nameLink(ctx, p, 'text-sm block w-full')}
          <span class="text-grey-600 text-[10px]">${heroName(ctx.heroMap, p.hero_id)}</span>
        </div>
      </div>
      <div class="grid grid-cols-6 gap-0.5 flex-shrink-0">${slots}</div>
      <div class="flex-1 flex items-center justify-end gap-5 text-right">
        <div class="w-20">
          <p class="text-sm tabular-nums leading-none"><span class="text-emerald-400">${p.kills}</span>/<span class="text-red-400">${p.deaths}</span>/<span class="text-amber-400">${p.assists}</span></p>
          <p class="text-grey-500 text-[10px] mt-0.5">${kda.toFixed(2)} KDA</p>
        </div>
        <div class="w-16">
          <p class="text-grey-200 text-sm tabular-nums leading-none">${p.last_hits} CS</p>
          <p class="text-grey-500 text-[10px] mt-0.5">${kp.toFixed(1)}% KP</p>
        </div>
        <div class="w-16">
          <p class="text-grey-200 text-sm tabular-nums leading-none">${fmtCompact(heroDmg)}</p>
          <p class="text-grey-500 text-[10px] mt-0.5">DMG</p>
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 2 · LANE STATS
// ═══════════════════════════════════════════════════════════════════════════
export function renderLane(ctx: DetailContext): string {
  const { state } = ctx;
  const stamps = snapshotStamps(ctx.meta);
  const snapIdx = state.laneSnapshotIdx < 0 || state.laneSnapshotIdx >= stamps.length
    ? stamps.length - 1 : state.laneSnapshotIdx;

  // Lanes only exist in Normal mode; Street Brawl shows no lane UI (just selectable champions).
  const isNormal = isNormalMode(ctx.gameMode);
  const lanes = isNormal ? orderedLanes(ctx.meta.players) : [];

  const left  = teamPlayers(ctx, 0);
  const right = teamPlayers(ctx, 1);

  // hero bar (selectable). Lane-colored border in Normal; neutral in Brawl.
  const heroChip = (p: RichMetaPlayer, side: 'left' | 'right') => {
    const sel = (side === 'left' ? state.laneLeft : state.laneRight).has(p.player_slot);
    const bc  = isNormal ? laneColor(p.assigned_lane) : '#4b5563';
    return `<button data-action="lane-toggle" data-side="${side}" data-slot="${p.player_slot}"
        class="relative w-9 h-9 rounded overflow-hidden transition-all ${sel ? 'ring-2 scale-105' : 'opacity-50 hover:opacity-90'}"
        style="${sel ? `box-shadow:0 0 0 2px ${bc};` : ''}border:2px solid ${bc};"
        title="${escapeHtml(playerName(ctx.playerNameMap, p.account_id))}">
        <img src="${heroMini(ctx.heroMap, p.hero_id)}" class="w-full h-full object-cover pointer-events-none" alt="">
      </button>`;
  };

  const selList = (players: RichMetaPlayer[], sel: Set<number>) =>
    players.filter((p) => sel.has(p.player_slot))
      .map((p) => `<div class="flex items-center gap-1.5">
          <img src="${heroMini(ctx.heroMap, p.hero_id)}" class="w-4 h-4 rounded-full object-cover" alt="">
          ${nameLink(ctx, p, 'text-xs')}</div>`).join('') || '<span class="text-grey-600 text-xs">—</span>';

  // aggregate metric rows
  const selLeft  = left.filter((p) => state.laneLeft.has(p.player_slot));
  const selRight = right.filter((p) => state.laneRight.has(p.player_slot));
  const sum = (players: RichMetaPlayer[], f: (s: StatSnapshot) => number) =>
    players.reduce((acc, p) => acc + (snapshotAt(p, snapIdx) ? f(snapshotAt(p, snapIdx)!) : 0), 0);
  const avg = (players: RichMetaPlayer[], f: (s: StatSnapshot) => number) =>
    players.length ? sum(players, f) / players.length : 0;
  const hitPct = (players: RichMetaPlayer[]) => {
    const hit = sum(players, (s) => s.shots_hit);
    const tot = hit + sum(players, (s) => s.shots_missed);
    return tot > 0 ? (hit / tot) * 100 : 0;
  };

  return `
    <div class="space-y-3">
      ${lanes.length ? `<!-- lane color filter (Normal only) -->
      <div class="flex items-center justify-center gap-3">
        ${lanes.map((l) => `<button data-action="lane-preset" data-lane="${l}"
            class="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
            style="background:${laneColor(l)}40;border-color:${laneColor(l)};" title="Lane"></button>`).join('')}
      </div>` : ''}

      <!-- hero bar -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex-1">
          <p class="text-[10px] font-bold mb-1" style="color:${teamColor(0)};">${TEAM_NAME[0]}</p>
          <div class="flex flex-wrap gap-1">${left.map((p) => heroChip(p, 'left')).join('')}</div>
        </div>
        <span class="text-grey-500 text-xs font-bold px-2">VS</span>
        <div class="flex-1">
          <p class="text-[10px] font-bold mb-1 text-right" style="color:${teamColor(1)};">${TEAM_NAME[1]}</p>
          <div class="flex flex-wrap gap-1 justify-end">${right.map((p) => heroChip(p, 'right')).join('')}</div>
        </div>
      </div>

      <!-- time selector -->
      <div class="flex flex-wrap items-center justify-center gap-1">
        ${stamps.map((s, i) => `<button data-action="lane-snap" data-idx="${i}"
            class="px-2 py-1 rounded text-xs transition-colors ${i === snapIdx ? 'bg-dry-sage-500 text-charcoal-100 font-semibold' : 'text-grey-400 hover:bg-charcoal-300'}">
            ${fmtMinute(s)}</button>`).join('')}
      </div>

      <!-- selected names -->
      <div class="flex justify-between gap-4 border-t border-grey-700/40 pt-2">
        <div class="flex-1 space-y-0.5">${selList(left, state.laneLeft)}</div>
        <div class="flex-1 space-y-0.5 flex flex-col items-end">${selList(right, state.laneRight)}</div>
      </div>

      <!-- comparison bars -->
      <div class="space-y-0.5">
        ${advantageBar('Kills',       sum(selLeft, (s) => s.kills),         sum(selRight, (s) => s.kills),         fmtCompact)}
        ${advantageBar('Souls',       sum(selLeft, (s) => s.net_worth),     sum(selRight, (s) => s.net_worth),     fmtRaw)}
        ${advantageBar('Last Hits',   sum(selLeft, (s) => s.creep_kills),   sum(selRight, (s) => s.creep_kills),   fmtCompact)}
        ${advantageBar('Denies',      sum(selLeft, (s) => s.denies),        sum(selRight, (s) => s.denies),        fmtCompact)}
        ${advantageBar('Damage',      sum(selLeft, (s) => s.player_damage), sum(selRight, (s) => s.player_damage), fmtRaw)}
        ${advantageBar('Obj Damage',  sum(selLeft, (s) => s.boss_damage),   sum(selRight, (s) => s.boss_damage),   fmtRaw)}
        ${advantageBar('Shots Hit %', hitPct(selLeft),                      hitPct(selRight),                      (n) => `${n.toFixed(0)}%`)}
        ${advantageBar('Level',       avg(selLeft, (s) => s.level),         avg(selRight, (s) => s.level),         (n) => n.toFixed(0))}
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 3 · ITEMS
// ═══════════════════════════════════════════════════════════════════════════
export function renderItems(ctx: DetailContext): string {
  const { state } = ctx;
  const left  = teamPlayers(ctx, 0);
  const right = teamPlayers(ctx, 1);

  const selectorRow = (players: RichMetaPlayer[], side: 'left' | 'right', selSlot: number) =>
    players.map((p) => `<button data-action="items-pick" data-side="${side}" data-slot="${p.player_slot}"
        class="relative w-9 h-9 rounded overflow-hidden transition-all ${p.player_slot === selSlot ? 'ring-2 ring-dry-sage-400 scale-105' : 'opacity-50 hover:opacity-90'}"
        title="${escapeHtml(playerName(ctx.playerNameMap, p.account_id))}">
        <img src="${heroMini(ctx.heroMap, p.hero_id)}" class="w-full h-full object-cover" alt=""></button>`).join('');

  const lp = left.find((p) => p.player_slot === state.itemsLeftSlot)  ?? left[0];
  const rp = right.find((p) => p.player_slot === state.itemsRightSlot) ?? right[0];

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-2">
        <div class="flex flex-wrap gap-1 flex-1">${selectorRow(left, 'left', state.itemsLeftSlot)}</div>
        <span class="text-grey-500 text-xs font-bold px-2">VS</span>
        <div class="flex flex-wrap gap-1 flex-1 justify-end">${selectorRow(right, 'right', state.itemsRightSlot)}</div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        ${renderItemColumn(ctx, lp, 0)}
        ${renderItemColumn(ctx, rp, 1)}
      </div>
    </div>`;
}

// Per-ability row accents for the skill-order grid.
const ABILITY_ROW_COLORS = ['#6eb3a8', '#c9a46e', '#a86e9e', '#8cb86e'];

/**
 * Ability Build grid (Items tab). The match metadata has no real per-match
 * skill order (ADR 0002), so this shows the #1 most-popular community sequence
 * for the player's hero. Data is loaded async + cached by the orchestrator.
 */
function renderAbilityGrid(p: RichMetaPlayer): string {
  const data: AbilityData | undefined = getAbilityData(p.hero_id);
  if (!data) {
    return `<div class="mt-3 pt-2 border-t border-grey-700/30">
      <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-1">Ability Build</p>
      <p class="text-grey-600 text-xs flex items-center gap-2">
        <span class="w-3 h-3 border-2 border-grey-600 border-t-dry-sage-400 rounded-full animate-spin"></span>
        Chargement de l'ordre de compétences…</p></div>`;
  }
  if (!data.topSeq || !data.abilities.length) {
    return `<div class="mt-3 pt-2 border-t border-grey-700/30">
      <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-1">Ability Build</p>
      <p class="text-grey-600 text-xs">Ordre de compétences indisponible pour ce héros.</p></div>`;
  }
  const seq = data.topSeq;
  const idxMap = new Map<number, number>(data.abilities.map((a, i) => [a.id, i]));
  const steps = seq.abilities.length;
  const grid: boolean[][] = Array.from({ length: data.abilities.length }, () => Array(steps).fill(false));
  seq.abilities.forEach((id, step) => { const r = idxMap.get(id); if (r !== undefined) grid[r][step] = true; });
  const wr = seq.matches > 0 ? (seq.wins / seq.matches * 100).toFixed(0) : '—';
  const CELL = 13;

  return `
    <div class="mt-3 pt-2 border-t border-grey-700/30">
      <div class="flex items-center justify-between mb-1">
        <p class="text-grey-600 text-[10px] uppercase tracking-wider">Ability Build · + populaire</p>
        <span class="text-grey-500 text-[10px] tabular-nums">${wr}% WR · ${fmtRaw(seq.matches)} matchs</span>
      </div>
      <div class="space-y-0.5 overflow-x-auto">
        ${data.abilities.map((a, row) => {
          const color = ABILITY_ROW_COLORS[row] ?? ABILITY_ROW_COLORS[0];
          const img = abilityImg(a);
          return `<div class="flex items-center gap-1">
            <div class="w-6 h-6 rounded overflow-hidden border border-grey-700/60 flex-shrink-0" title="${escapeHtml(a.name)}">
              ${img ? `<img src="${img}" class="w-full h-full object-cover" alt="">`
                    : `<div class="w-full h-full flex items-center justify-center text-grey-600 text-[9px]">${row + 1}</div>`}
            </div>
            <div class="flex gap-0.5">
              ${grid[row].map((f) => `<div class="rounded-sm flex-shrink-0 flex items-center justify-center" style="width:${CELL}px;height:${CELL}px;background:${f ? color + '33' : 'rgba(255,255,255,0.04)'};">
                ${f ? `<img src="${abilityLearnUrl}" alt="" class="w-2.5 h-2.5 object-contain"/>` : ''}</div>`).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
      <p class="text-grey-700 text-[9px] mt-1 italic">Ordre communautaire (patch actuel) — pas celui de ce match.</p>
    </div>`;
}

function renderItemColumn(ctx: DetailContext, p: RichMetaPlayer | undefined, team: number): string {
  if (!p) return '<div></div>';
  const timeline = itemTimeline(p.items, ctx.itemMap);
  // group by minute
  const groups = new Map<number, typeof timeline>();
  for (const e of timeline) {
    const min = Math.floor(e.gameTimeS / 60);
    (groups.get(min) ?? groups.set(min, []).get(min)!).push(e);
  }
  const minutes = [...groups.keys()].sort((a, b) => a - b);

  const card = (min: number) => {
    const entries = groups.get(min)!;
    return `<div class="flex flex-col items-center gap-1">
        <div class="flex gap-0.5 bg-charcoal-300/40 rounded p-1 border border-grey-700/40">
          ${entries.map((e) => `<div class="relative w-8 h-8 rounded overflow-hidden border border-grey-700/60 ${e.sold ? 'opacity-40' : ''}" title="${itemTitle(e.item)}">
              <img src="${itemImg(e.item)}" class="w-full h-full object-cover" alt="${escapeHtml(e.item.name)}">
              ${renderItemTierBadge(e.item)}</div>`).join('')}
        </div>
        <span class="text-grey-500 text-[10px]">${min}m</span>
      </div>`;
  };

  const strip = minutes.map((m, i) => `${i > 0 ? '<span class="text-grey-600 self-start mt-2.5">→</span>' : ''}${card(m)}`).join('');

  return `
    <div class="rounded-lg border border-grey-700/40 p-2" style="border-top:2px solid ${teamColor(team)};">
      <div class="flex items-center gap-2 mb-2">
        <img src="${heroMini(ctx.heroMap, p.hero_id)}" class="w-5 h-5 rounded-full object-cover" alt="">
        ${nameLink(ctx, p, 'text-sm')}
      </div>
      <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-1">Item Timeline</p>
      <div class="flex flex-wrap items-start gap-1">${strip || '<span class="text-grey-600 text-xs">Aucun objet</span>'}</div>
      ${renderAbilityGrid(p)}
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 4 · ECONOMY  (team comparison + Net Worth / Income / Death Loss sub-tabs)
// ═══════════════════════════════════════════════════════════════════════════
const ECO_SUBTABS: { id: DetailContext['state']['economySubtab']; label: string }[] = [
  { id: 'networth',  label: 'Net Worth' },
  { id: 'income',    label: 'Income' },
  { id: 'deathloss', label: 'Death Loss' },
];

/** Per-player value for the active Economy sub-tab. */
function ecoMetric(sub: DetailContext['state']['economySubtab'], p: RichMetaPlayer): number {
  if (sub === 'networth') return p.net_worth;
  const s = finalSnap(p);
  if (!s) return 0;
  if (sub === 'deathloss') return s.gold_death_loss;
  return incomeBreakdown(s).total; // income = gross souls earned (sum of 5 sources)
}

export function renderEconomy(ctx: DetailContext): string {
  const { state } = ctx;
  const left  = teamPlayers(ctx, 0);
  const right = teamPlayers(ctx, 1);
  const sumNW   = (ps: RichMetaPlayer[]) => ps.reduce((s, p) => s + p.net_worth, 0);
  const sumCS   = (ps: RichMetaPlayer[]) => ps.reduce((s, p) => s + p.last_hits, 0);
  const sumGold = (ps: RichMetaPlayer[], f: (s: StatSnapshot) => number) =>
    ps.reduce((s, p) => s + (finalSnap(p) ? f(finalSnap(p)!) : 0), 0);

  // ranked list of all 12 players by the active metric
  const ranked = [...ctx.meta.players]
    .map((p) => ({ p, v: ecoMetric(state.economySubtab, p) }))
    .sort((a, b) => b.v - a.v);
  const maxV = Math.max(...ranked.map((r) => r.v), 1);

  const subtabBar = ECO_SUBTABS.map((t) => `<button data-action="eco-subtab" data-value="${t.id}"
      class="px-3 py-1.5 rounded text-xs transition-colors ${t.id === state.economySubtab ? 'bg-dry-sage-500 text-charcoal-100 font-semibold' : 'text-grey-400 hover:bg-charcoal-300'}">${t.label}</button>`).join('');

  const list = ranked.map(({ p, v }) => playerStatRow({
    iconUrl: heroMini(ctx.heroMap, p.hero_id),
    name: playerName(ctx.playerNameMap, p.account_id),
    value: v, maxValue: maxV, color: teamColor(p.team),
    selected: p.player_slot === state.economySlot,
    slot: p.player_slot, action: 'eco-pick',
  })).join('');

  return `
    <div class="space-y-4">
      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex justify-between mb-3">
          <span class="text-sm font-bold" style="color:${teamColor(0)};">${TEAM_NAME[0]}</span>
          <span class="text-sm font-bold" style="color:${teamColor(1)};">${TEAM_NAME[1]}</span>
        </div>
        ${advantageBar('Net Worth',  sumNW(left),  sumNW(right),  fmtCompact)}
        ${advantageBar('Total CS',   sumCS(left),  sumCS(right),  fmtCompact)}
        ${advantageBar('Denies',     sumGold(left, (s) => s.gold_denied),     sumGold(right, (s) => s.gold_denied),     fmtCompact)}
        ${advantageBar('Death Loss', sumGold(left, (s) => s.gold_death_loss), sumGold(right, (s) => s.gold_death_loss), fmtCompact)}
      </div>

      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex flex-wrap gap-1 mb-3">${subtabBar}</div>
        <div class="space-y-0.5">${list}</div>
      </div>

      ${renderIncomeBreakdown(ctx)}
    </div>`;
}

function renderIncomeBreakdown(ctx: DetailContext): string {
  const p = ctx.meta.players.find((pl) => pl.player_slot === ctx.state.economySlot)
    ?? ctx.meta.players.find((pl) => pl.account_id === ctx.ownerAccountId)
    ?? ctx.meta.players[0];
  const s = p ? finalSnap(p) : undefined;
  if (!p || !s) return '';
  const b = incomeBreakdown(s);
  const segments = [
    { label: 'Lane Creeps',  value: b.laneCreeps,  color: '#f59e0b' },
    { label: 'Neutrals',     value: b.neutrals,    color: '#22c55e' },
    { label: 'Player Kills', value: b.playerKills, color: '#ef4444' },
    { label: 'Bosses',       value: b.bosses,      color: '#a855f7' },
    { label: 'Treasure',     value: b.treasure,    color: '#38bdf8' },
  ];
  return `
    <div class="rounded-lg border border-grey-700/50 p-4">
      <div class="flex items-center gap-2 mb-4">
        <img src="${heroMini(ctx.heroMap, p.hero_id)}" class="w-6 h-6 rounded object-cover" alt="">
        ${nameLink(ctx, p, 'text-base')}
        <span class="text-grey-500 text-sm">· Income Breakdown</span>
      </div>
      ${donutChart({ segments, centerValue: fmtCompact(b.total), centerLabel: 'Souls' })}
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 5 · DAMAGE
// ═══════════════════════════════════════════════════════════════════════════
const DMG_SUBTABS: { id: DetailContext['state']['damageSubtab']; label: string }[] = [
  { id: 'hero',    label: 'Hero Damage' },
  { id: 'total',   label: 'Total Damage' },
  { id: 'healing', label: 'Hero Healing' },
  { id: 'obj',     label: 'Obj Damage' },
];

function dmgMetric(sub: DetailContext['state']['damageSubtab'], s: StatSnapshot | undefined): number {
  if (!s) return 0;
  switch (sub) {
    case 'hero':    return s.player_damage;
    case 'total':   return s.player_damage + s.creep_damage + s.neutral_damage + s.boss_damage;
    case 'healing': return s.player_healing;
    case 'obj':     return s.boss_damage;
  }
}

export function renderDamage(ctx: DetailContext): string {
  const { state } = ctx;
  const left  = teamPlayers(ctx, 0);
  const right = teamPlayers(ctx, 1);
  const sumF = (ps: RichMetaPlayer[], f: (s: StatSnapshot) => number) =>
    ps.reduce((s, p) => s + (finalSnap(p) ? f(finalSnap(p)!) : 0), 0);

  // team comparison (5 bars)
  const teamBars = `
    ${advantageBar('Hero Damage',  sumF(left, (s) => s.player_damage),       sumF(right, (s) => s.player_damage),       fmtCompact)}
    ${advantageBar('Hero Healing', sumF(left, (s) => s.player_healing),       sumF(right, (s) => s.player_healing),       fmtCompact)}
    ${advantageBar('Obj Damage',   sumF(left, (s) => s.boss_damage),          sumF(right, (s) => s.boss_damage),          fmtCompact)}
    ${advantageBar('Damage Taken', sumF(left, (s) => s.player_damage_taken),  sumF(right, (s) => s.player_damage_taken),  fmtCompact)}
    ${advantageBar('Mitigated',    sumF(left, (s) => s.damage_mitigated),     sumF(right, (s) => s.damage_mitigated),     fmtCompact)}`;

  // unified per-player chart
  const all = [...ctx.meta.players];
  const vals = all.map((p) => ({ p, v: dmgMetric(state.damageSubtab, finalSnap(p)) }));
  const grandTotal = vals.reduce((s, x) => s + x.v, 0) || 1;
  const maxVal = Math.max(...vals.map((x) => x.v), 1);
  vals.sort((a, b) => b.v - a.v);

  const chart = vals.map(({ p, v }) => playerStatRow({
    iconUrl: heroMini(ctx.heroMap, p.hero_id),
    name: playerName(ctx.playerNameMap, p.account_id),
    value: v, maxValue: maxVal, pct: (v / grandTotal) * 100,
    color: teamColor(p.team), selected: p.player_slot === state.damageSlot,
    slot: p.player_slot, action: 'dmg-pick',
  })).join('');

  const subtabBar = DMG_SUBTABS.map((t) => `<button data-action="dmg-subtab" data-value="${t.id}"
      class="px-3 py-1.5 rounded text-xs transition-colors ${t.id === state.damageSubtab ? 'bg-dry-sage-500 text-charcoal-100 font-semibold' : 'text-grey-400 hover:bg-charcoal-300'}">
      ${t.label}</button>`).join('');

  return `
    <div class="space-y-4">
      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-bold" style="color:${teamColor(0)};">${TEAM_NAME[0]}</span>
          <span class="text-sm font-bold" style="color:${teamColor(1)};">${TEAM_NAME[1]}</span>
        </div>
        ${teamBars}
      </div>

      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex flex-wrap gap-1 mb-3">${subtabBar}</div>
        <div class="space-y-0.5">${chart}</div>
      </div>

      ${renderDamageDetail(ctx)}
    </div>`;
}

function renderDamageDetail(ctx: DetailContext): string {
  const p = ctx.meta.players.find((pl) => pl.player_slot === ctx.state.damageSlot)
    ?? ctx.meta.players.find((pl) => pl.account_id === ctx.ownerAccountId)
    ?? ctx.meta.players[0];
  if (!p) return '';
  const s = finalSnap(p);
  if (!s) return '';

  const total = s.player_damage + s.creep_damage + s.neutral_damage + s.boss_damage;
  const durMin = Math.max(ctx.meta.duration_s / 60, 1);
  const teamHeroDmg = ctx.meta.players.filter((x) => x.team === p.team)
    .reduce((acc, x) => acc + (finalSnap(x)?.player_damage ?? 0), 0) || 1;
  const shots = s.shots_hit + s.shots_missed;
  const deaths = Math.max(p.deaths, 1);

  const card = (title: string, rows: [string, string][]) => `
    <div class="rounded-lg border border-grey-700/40 p-3 bg-charcoal-300/20">
      <p class="text-grey-400 text-sm font-semibold mb-2">${title}</p>
      ${rows.map(([k, v]) => `<div class="flex justify-between text-sm py-1"><span class="text-grey-500">${k}</span><span class="text-grey-100 tabular-nums font-medium">${v}</span></div>`).join('')}
    </div>`;

  const chip = (label: string, value: string) => `
    <div class="flex-1 rounded-lg bg-charcoal-300/40 border border-grey-700/40 px-3 py-2 text-center">
      <p class="text-white text-lg font-bold tabular-nums leading-none">${value}</p>
      <p class="text-grey-500 text-[10px] uppercase tracking-wider mt-1">${label}</p>
    </div>`;

  const segments = [
    { label: 'Heroes',     value: s.player_damage,  color: '#ef4444' },
    { label: 'Creeps',     value: s.creep_damage,   color: '#f59e0b' },
    { label: 'Neutrals',   value: s.neutral_damage, color: '#22c55e' },
    { label: 'Objectives', value: s.boss_damage,    color: '#a855f7' },
  ];

  return `
    <div class="rounded-lg border border-grey-700/50 p-4">
      <div class="flex items-center gap-2 mb-4">
        <img src="${heroMini(ctx.heroMap, p.hero_id)}" class="w-7 h-7 rounded object-cover" alt="">
        ${nameLink(ctx, p, 'text-base')}
        <span class="text-grey-500 text-sm">· ${heroName(ctx.heroMap, p.hero_id)}</span>
      </div>

      <div class="rounded-lg border border-grey-700/40 p-4 bg-charcoal-300/20 mb-3">
        <p class="text-grey-400 text-sm font-semibold mb-3">Damage Breakdown</p>
        ${donutChart({ segments, centerValue: fmtCompact(total), centerLabel: 'Damage' })}
        <div class="flex gap-2 mt-4">
          ${chip('DMG / min', fmtCompact(total / durMin))}
          ${chip('Team Share', `${((s.player_damage / teamHeroDmg) * 100).toFixed(1)}%`)}
          ${chip('DMG / Death', fmtCompact(s.player_damage / deaths))}
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        ${card('Accuracy', [
          ['Shots', fmtRaw(shots)],
          ['Hits', fmtRaw(s.shots_hit)],
          ['Hit Rate', `${shotsHitPct(s).toFixed(1)}%`],
        ])}
        ${card('Survivability', [
          ['Deaths', `${p.deaths}`],
          ['DMG Taken', fmtCompact(s.player_damage_taken)],
          ['Mitigated', fmtCompact(s.damage_mitigated)],
        ])}
        ${card('Power', [
          ['Weapon', `${Math.round(s.weapon_power)}`],
          ['Spirit', `${Math.round(s.tech_power)}`],
          ['Max HP', fmtCompact(s.max_health)],
        ])}
      </div>
    </div>`;
}
