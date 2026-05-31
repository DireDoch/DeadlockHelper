/**
 * Awards system — shared types and definitions.
 * Imported by both the Main Process (awards-store.ts) and the Renderer (ProfilPage).
 *
 * SOURCE: docs/AwardsList.md
 */

export type AwardRarity = 'epic' | 'rare' | 'uncommon' | 'common' | 'infamous';

export type AwardId =
  // Epic
  | 'soul-reaper' | 'immortal-bulwark' | 'military-industrial-complex' | 'damage-deity'
  | '1v11' | 'blaze-of-glory' | 'accuracy-god' | 'angel' | 'boogey-man' | 'city-flattener'
  | 'cranial-fixation' | 'full' | 'omnipresent'
  // Rare
  | 'did-everything' | 'soul-harvester' | 'monster' | 'heat-wave' | 'field-commander'
  | 'fortress' | 'lane-dominator' | 'demolitionist' | 'hospital' | 'precision-master'
  // Uncommon
  | 'damage-dreadnought' | 'on-fire' | 'fisticuffs-firewall' | 'unkillable' | 'huge'
  | 'medic' | 'sharpshooter' | 'sieger' | 'skull-collector' | 'team-player' | 'toxic'
  // Common
  | 'damage-powerhouse' | 'farmer' | 'playmaker' | 'iron-wall' | 'jab-jammer' | 'spammer'
  | 'specialist' | 'jack-of-all-trades' | 'supportive' | 'pusher' | 'bubble-burster'
  | 'headhunter'
  // Infamous
  | 'fell-off' | 'preservationist' | 'swiss-cheese-defense' | 'afk-jungler' | 'coward'
  | 'late-bloomer' | 'nerf-gun' | 'feeder';

export interface AwardDefinition {
  id: AwardId;
  name: string;
  /** Exact criterion text from AwardsList.md — shown in hover tooltip. */
  description: string;
  rarity: AwardRarity;
  /**
   * true  → can be evaluated from match metadata (stats[], player fields).
   * false → data absent from CMsgMatchMetaDataContents; always shown as "Données indisponibles".
   *
   * Non-computable fields verified absent across 153 API keys:
   *   headshot %, parry count, antiheal, per-ability damage, category scores.
   */
  computable: boolean;
}

export interface AwardEntry {
  awardId: AwardId;
  /** match_id of every match where this award was earned. */
  matchIds: number[];
  /** Unix ms — set to match start_time of the first occurrence. */
  firstEarnedAt: number;
  /** Always === matchIds.length. */
  count: number;
}

/** Shape of the 'awards' electron-store. */
export interface AwardsStoreShape {
  awards: Record<string, AwardEntry>;
}

/** Payload sent from renderer → main via awards:save-batch. */
export type AwardBatch = AwardEntry[];

/** Payload sent back from awards:save-batch — only truly new match occurrences. */
export interface NewAwardsResult {
  newEntries: Array<{ awardId: AwardId; matchId: number }>;
}

// ── Definitions ────────────────────────────────────────────────────────────────

export const AWARD_DEFINITIONS: AwardDefinition[] = [
  // ── EPIC ─────────────────────────────────────────────────────────────────────
  {
    id: 'soul-reaper',
    name: 'Soul Reaper',
    description: '1.6k souls per minute',
    rarity: 'epic',
    computable: true,
  },
  {
    id: 'immortal-bulwark',
    name: 'Immortal Bulwark',
    description: 'Absorb 3k damage per minute',
    rarity: 'epic',
    computable: true,
  },
  {
    id: 'military-industrial-complex',
    name: 'Military Industrial Complex',
    description: '1.5k damage & souls per minute',
    rarity: 'epic',
    computable: true,
  },
  {
    id: 'damage-deity',
    name: 'Damage Deity',
    description: '2k damage per minute',
    rarity: 'epic',
    computable: true,
  },
  {
    id: '1v11',
    name: '1v11',
    description: '80% rating in 5 playstyle categories or more',
    rarity: 'epic',
    computable: false, // category score algorithm unavailable in API
  },
  {
    id: 'blaze-of-glory',
    name: 'Blaze of Glory',
    description: '20 killstreak',
    rarity: 'epic',
    computable: true, // approximated — see criteria.ts killstreak comment
  },
  {
    id: 'accuracy-god',
    name: 'Accuracy God',
    description: 'Achieve 85% accuracy',
    rarity: 'epic',
    computable: true,
  },
  {
    id: 'angel',
    name: 'Angel',
    description: 'Heal 1000 damage per minute',
    rarity: 'epic',
    computable: true,
  },
  {
    id: 'boogey-man',
    name: 'Boogey Man',
    description: '30 kills in a single match',
    rarity: 'epic',
    computable: true,
  },
  {
    id: 'city-flattener',
    name: 'City Flattener',
    description: '1.25k building damage per minute or 40k+ overall',
    rarity: 'epic',
    computable: true,
  },
  {
    id: 'cranial-fixation',
    name: 'Cranial Fixation',
    description: '35% headshot accuracy',
    rarity: 'epic',
    computable: false, // headshot field absent from match metadata stats[]
  },
  {
    id: 'full',
    name: 'Full',
    description: '100k souls overall',
    rarity: 'epic',
    computable: true,
  },
  {
    id: 'omnipresent',
    name: 'Omnipresent',
    description: '85%+ Kill Participation and 20+ KP actions',
    rarity: 'epic',
    computable: true,
  },

  // ── RARE ─────────────────────────────────────────────────────────────────────
  {
    id: 'did-everything',
    name: 'Did Everything',
    description: '70% rating in 4 categories or more',
    rarity: 'rare',
    computable: false, // category score algorithm unavailable
  },
  {
    id: 'soul-harvester',
    name: 'Soul Harvester',
    description: '1.4k souls per minute',
    rarity: 'rare',
    computable: true,
  },
  {
    id: 'monster',
    name: 'Monster',
    description: '20 kills in a single match',
    rarity: 'rare',
    computable: true,
  },
  {
    id: 'heat-wave',
    name: 'Heat Wave',
    description: '15 killstreak',
    rarity: 'rare',
    computable: true, // approximated — see criteria.ts killstreak comment
  },
  {
    id: 'field-commander',
    name: 'Field Commander',
    description: '75%+ Kill Participation and 20+ KP actions',
    rarity: 'rare',
    computable: true,
  },
  {
    id: 'fortress',
    name: 'Fortress',
    description: 'Absorb 2.5k damage per minute',
    rarity: 'rare',
    computable: true,
  },
  {
    id: 'lane-dominator',
    name: 'Lane Dominator',
    description: '15+ kills in the first half of the game',
    rarity: 'rare',
    computable: true, // uses stats[] snapshot at ≤ duration/2
  },
  {
    id: 'demolitionist',
    name: 'Demolitionist',
    description: '1k building damage per minute or 30k+ overall',
    rarity: 'rare',
    computable: true,
  },
  {
    id: 'hospital',
    name: 'Hospital',
    description: 'Heal 600 damage per minute',
    rarity: 'rare',
    computable: true,
  },
  {
    id: 'precision-master',
    name: 'Precision Master',
    description: 'Achieve 80% accuracy',
    rarity: 'rare',
    computable: true,
  },

  // ── UNCOMMON ────────────────────────────────────────────────────────────────
  {
    id: 'damage-dreadnought',
    name: 'Damage Dreadnought',
    description: '1.5k damage per minute',
    rarity: 'uncommon',
    computable: true,
  },
  {
    id: 'on-fire',
    name: 'On Fire',
    description: '10 killstreak',
    rarity: 'uncommon',
    computable: true, // approximated — see criteria.ts killstreak comment
  },
  {
    id: 'fisticuffs-firewall',
    name: 'Fisticuffs Firewall',
    description: '20 successful parries',
    rarity: 'uncommon',
    computable: false, // parry count absent from match metadata
  },
  {
    id: 'unkillable',
    name: 'Unkillable',
    description: 'No Deaths',
    rarity: 'uncommon',
    computable: true,
  },
  {
    id: 'huge',
    name: 'Huge',
    description: '75k souls overall',
    rarity: 'uncommon',
    computable: true,
  },
  {
    id: 'medic',
    name: 'Medic',
    description: 'Heal 400 damage per minute',
    rarity: 'uncommon',
    computable: true,
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Achieve 70% accuracy',
    rarity: 'uncommon',
    computable: true,
  },
  {
    id: 'sieger',
    name: 'Sieger',
    description: '750 building damage per minute',
    rarity: 'uncommon',
    computable: true,
  },
  {
    id: 'skull-collector',
    name: 'Skull Collector',
    description: '30% headshot accuracy',
    rarity: 'uncommon',
    computable: false, // headshot field absent from match metadata stats[]
  },
  {
    id: 'team-player',
    name: 'Team Player',
    description: '5x as many assists as kills, 25+ assists',
    rarity: 'uncommon',
    computable: true,
  },
  {
    id: 'toxic',
    name: 'Toxic',
    description: '10k+ antiheal',
    rarity: 'uncommon',
    computable: false, // antiheal field absent from match metadata
  },

  // ── COMMON ───────────────────────────────────────────────────────────────────
  {
    id: 'damage-powerhouse',
    name: 'Damage Powerhouse',
    description: '1k damage per minute',
    rarity: 'common',
    computable: true,
  },
  {
    id: 'farmer',
    name: 'Farmer',
    description: '1.2k souls per minute',
    rarity: 'common',
    computable: true,
  },
  {
    id: 'playmaker',
    name: 'Playmaker',
    description: '60%+ Kill Participation and 20+ KP actions',
    rarity: 'common',
    computable: true,
  },
  {
    id: 'iron-wall',
    name: 'Iron Wall',
    description: 'Absorb 2k damage per minute',
    rarity: 'common',
    computable: true,
  },
  {
    id: 'jab-jammer',
    name: 'Jab Jammer',
    description: '10 successful parries',
    rarity: 'common',
    computable: false, // parry count absent from match metadata
  },
  {
    id: 'spammer',
    name: 'Spammer',
    description: '50%+ damage with a single ability',
    rarity: 'common',
    computable: false, // per-ability damage breakdown absent from match metadata
  },
  {
    id: 'specialist',
    name: 'Specialist',
    description: 'One category score twice as high as all others',
    rarity: 'common',
    computable: false, // category score algorithm unavailable
  },
  {
    id: 'jack-of-all-trades',
    name: 'Jack of All Trades',
    description: 'All category scores above 50% (Mystic, Vitality and Gun)',
    rarity: 'common',
    computable: false, // category score algorithm unavailable
  },
  {
    id: 'supportive',
    name: 'Supportive',
    description: '3x as many assists as kills, 15+ assists',
    rarity: 'common',
    computable: true,
  },
  {
    id: 'pusher',
    name: 'Pusher',
    description: '500 building damage per minute',
    rarity: 'common',
    computable: true,
  },
  {
    id: 'bubble-burster',
    name: 'Bubble Burster',
    description: '10+ lane denies',
    rarity: 'common',
    computable: true,
  },
  {
    id: 'headhunter',
    name: 'Headhunter',
    description: '25% headshot accuracy',
    rarity: 'common',
    computable: false, // headshot field absent from match metadata stats[]
  },

  // ── INFAMOUS ────────────────────────────────────────────────────────────────
  {
    id: 'fell-off',
    name: 'Fell Off',
    description: '70% of your kills in the first half',
    rarity: 'infamous',
    computable: true, // uses stats[] snapshot at ≤ duration/2
  },
  {
    id: 'preservationist',
    name: 'Preservationist',
    description: 'No objective damage',
    rarity: 'infamous',
    computable: true,
  },
  {
    id: 'swiss-cheese-defense',
    name: 'Swiss Cheese Defense',
    description: '20 parry attempts with 0 hits',
    rarity: 'infamous',
    computable: false, // parry data absent from match metadata
  },
  {
    id: 'afk-jungler',
    name: 'AFK Jungler',
    description: '<500 damage/min, <1.5k damage absorbed/min, and 1k+ souls',
    rarity: 'infamous',
    computable: true,
  },
  {
    id: 'coward',
    name: 'Coward',
    description: 'Take less than 300 damage per minute',
    rarity: 'infamous',
    computable: true,
  },
  {
    id: 'late-bloomer',
    name: 'Late Bloomer',
    description: '70% of kills in the second half',
    rarity: 'infamous',
    computable: true, // uses stats[] snapshot at ≤ duration/2
  },
  {
    id: 'nerf-gun',
    name: 'Nerf Gun',
    description: '400 damage per minute or less',
    rarity: 'infamous',
    computable: true,
  },
  {
    id: 'feeder',
    name: 'Feeder',
    description: '10+ deaths and 3x as many deaths as kills',
    rarity: 'infamous',
    computable: true,
  },
];
