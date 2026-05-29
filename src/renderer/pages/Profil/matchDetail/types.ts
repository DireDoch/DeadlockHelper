/**
 * Match Detail Panel — rich metadata types.
 *
 * SOURCE: GET /v1/matches/{match_id}/metadata → response.match_info
 *   (protobuf CMsgMatchMetaDataContents, parsed to JSON).
 *
 * The ProfilPage already stores the ENTIRE match_info object at runtime
 * (Profil/index.ts → matchMetaMap), only narrowly typed as `MatchMeta`.
 * These interfaces widen that view so the detail tabs can read the rich
 * per-player time series (`stats[]`), item purchase log (`items[]`) and
 * lane assignment that were verified present in the live API.
 */

/** One cumulative stat snapshot — sampled at fixed timestamps (3/6/9/12/15 then 20/25/end min). */
export interface StatSnapshot {
  time_stamp_s: number;
  net_worth: number;
  kills: number;
  deaths: number;
  assists: number;
  creep_kills: number;        // lane-creep last hits (Lane Stats "Last Hits")
  neutral_kills: number;
  possible_creeps: number;
  denies: number;
  level: number;
  // damage / combat
  player_damage: number;      // hero damage
  creep_damage: number;
  neutral_damage: number;
  boss_damage: number;        // objective damage
  player_damage_taken: number;
  damage_mitigated: number;
  player_healing: number;
  self_healing: number;
  shots_hit: number;
  shots_missed: number;
  weapon_power: number;
  tech_power: number;         // spirit power
  max_health: number;
  // gold sources (income breakdown)
  gold_lane_creep: number;
  gold_lane_creep_orbs: number;
  gold_neutral_creep: number;
  gold_neutral_creep_orbs: number;
  gold_player: number;
  gold_player_orbs: number;
  gold_boss: number;
  gold_boss_orb: number;
  gold_treasure: number;
  gold_denied: number;
  gold_death_loss: number;
}

/** One entry in a player's purchase/upgrade log. */
export interface RichMetaItem {
  item_id: number;
  game_time_s: number;
  upgrade_id: number;
  sold_time_s: number | null;
  imbued_ability_id?: number;
  flags?: number;
}

export interface RichMetaPlayer {
  account_id: number;
  player_slot: number;
  team: number;               // 0 = Amber Hand, 1 = Sapphire Flame
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  net_worth: number;
  last_hits: number;          // Overview "CS"
  denies: number;
  level: number;
  assigned_lane: number;      // 1 = blue, 4 = yellow, 6 = green
  ability_points: number;
  hero_build_id?: number | null;
  items: RichMetaItem[];
  stats: StatSnapshot[];
  death_details?: Array<{ game_time_s: number }>;
}

export interface RichMatchMeta {
  match_id: number;
  duration_s: number;
  game_mode: number;
  winning_team: number;
  average_badge_team0: number;
  average_badge_team1: number;
  players: RichMetaPlayer[];
}

/** Item asset shape (subset of GET /v1/assets/items) used for icons + tooltips. */
export interface DetailItem {
  id: number;
  name: string;
  item_tier?: number;
  item_slot_type?: 'weapon' | 'spirit' | 'vitality' | string | null;
  shop_image_webp?: string;
  shop_image?: string;
  image_webp?: string;
  description?: { desc?: string | null; active?: string | null; passive?: string | null } | string | null;
  properties?: Record<string, { label?: string; value?: string; prefix?: string; postfix?: string; display_units?: string }>;
  tooltip_sections?: Array<{ section_attributes?: Array<{ important_properties?: string[] }> }>;
}

export interface HeroAsset {
  id: number;
  name: string;
  images: {
    icon_hero_card_webp?: string;
    minimap_image_webp?: string;
    background_image_webp?: string;
  };
}

export type DetailTab = 'overview' | 'lane' | 'items' | 'economy' | 'damage';
export type DamageSubtab = 'hero' | 'total' | 'healing' | 'obj';
export type EconomySubtab = 'networth' | 'income' | 'deathloss';

/** Hero signature ability (GET /v1/assets/items/by-hero-id/{id}). */
export interface HeroAbility {
  id: number;
  name: string;
  image?: string | null;
  image_webp?: string | null;
}

/** One ability-order sequence (GET /v1/analytics/ability-order-stats). */
export interface AbilityOrderSeq {
  abilities: number[];
  wins: number;
  losses: number;
  matches: number;
  players: number;
}

/** Cached per-hero ability data for the Items tab "Ability Build" fallback grid. */
export interface AbilityData {
  abilities: HeroAbility[];   // the 4 signature abilities (rows)
  topSeq: AbilityOrderSeq | null; // most-popular upgrade sequence (by matches)
}

/** Per-match interactive UI state — persisted outside the DOM (the row list re-renders fully). */
export interface MatchDetailState {
  tab: DetailTab;
  laneSnapshotIdx: number;       // index into the snapshot timeline (-1 → final)
  laneLeft: Set<number>;          // selected player_slots on team 0
  laneRight: Set<number>;         // selected player_slots on team 1
  itemsLeftSlot: number;          // selected team-0 player_slot
  itemsRightSlot: number;         // selected team-1 player_slot
  damageSubtab: DamageSubtab;
  damageSlot: number;             // selected player_slot for the Damage detail cards
  economySubtab: EconomySubtab;
  economySlot: number;            // selected player_slot for the Income Breakdown
  initialized: boolean;
}

/** Everything a tab renderer needs. */
export interface DetailContext {
  matchId: number;
  meta: RichMatchMeta;
  ownerAccountId: number;
  gameMode: number;
  heroMap: Map<number, HeroAsset>;
  itemMap: Map<number, DetailItem>;
  playerNameMap: Map<number, string>;
  state: MatchDetailState;
}
