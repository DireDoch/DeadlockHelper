# DeadlockHelper — Domain Glossary

## Hero Library
The grid page listing all playable Deadlock heroes. Filters: `player_selectable=true`, `disabled=false`, `in_development=false`. Source: `GET /v1/assets/heroes`.

## Hero Detail Page
The page shown after selecting a hero from the Hero Library. Receives a `HeroData` object via a `navigate-hero` CustomEvent dispatched by HeroLibrary and caught by App. Contains a sticky header and 5 tabs.

## Hero Detail Header
Sticky header displayed on the Hero Detail Page. Contains the hero portrait (`icon_hero_card_webp`), hero name, and a full-bleed background image (`background_image_webp`) from `HeroImages`.

## Tab
One of 5 horizontal navigation items below the sticky header: **Builds**, **Items**, **Skill Path**, **Overview & Abilities**, **Lore**. Builds, Skill Path, Items, and Overview & Abilities are functional; Lore is display-only.

## Overview & Abilities Tab
The tab that shows a hero's combat statistics and all four signature abilities. Left panel: **Weapon Stats** (`clip_size`, `bullet_damage`, `shots_per_second`, `damage_per_second` from `weapon_info` on the hero's primary weapon item, resolved via `hero.items.weapon_primary` class name in the items cache) and **Base Stats** (`max_health`, `max_move_speed`, `light_melee_damage`, `heavy_melee_damage` from `hero.starting_stats`). Right panel: an ability selector row (4 buttons) and a dynamic description panel below it. Requires zero additional API fetches — all data is already in `this.heroAbilities`, `this.items`, and `this.hero`.

## Ability Detail Panel
The expandable detail area shown when an ability is selected in the Overview & Abilities tab. Displays: ability name, **type badge** (Signature or Ultimate), **quip** (one-line subtitle from `description.quip`), **rich text description** (HTML-stripped then keyword-highlighted via `parseAbilityDesc`), **upgrade tiers** (T1/T2/T3 from `description.t1_desc/t2_desc/t3_desc`), **key dynamic stats** (non-zero labeled `properties` entries, up to 6), and **standard stat chips** (Cooldown, Cast Range, Duration, Charges if applicable).

## Ultimate Ability
The fourth signature ability of each hero, identified by `ability_type === 'ultimate'` on the full `ItemData`. Rendered with a permanent golden pulsing glow animation (`ability-ultimate-glow` CSS class), a `ULT` badge on the selector button, an amber header gradient on the detail panel, and a glowing border.

## Rich Text Parser
The `parseAbilityDesc(raw)` method on `HeroDetailsPage`. Strips all HTML tags and entities from an ability description string, then applies a single-pass regex replacement to highlight status effect keywords and damage type keywords with colored `<span>` elements and inline SVG icons. Keywords sourced from `docs/statusEffect.md`. Handles: spirit damage (purple), weapon damage (orange), stun (amber), slow (sky), disarm (red), grounded (lime), silence (violet), immobilize/root (teal), bleed (rose), burn/curse (fuchsia), sleep (indigo), unstoppable (emerald).

## Popular Builds
The top 3 community builds for a hero, sorted by `weekly_favorites` from `GET /v1/builds?hero_id={id}&sort_by=weekly_favorites&limit=3`. Each is enriched with win rate from `GET /v1/analytics/hero-build-stats/{hero_id}`. The build with the highest win rate among the three receives the **Recommended** badge.

## Damage Type
Per-build classification: **Gun** (Weapon items dominate) or **Mystic** (Spirit items dominate). Determined by counting `item_slot_type` values (`EItemSlotType_Weapon` vs `EItemSlotType_Tech`) across all `mod_categories.mods` in the build. Item data fetched once from `GET /v1/assets/items` and cached for the session.

## Build Summary
The compact overview bar shown when a build is selected. Displays: damage split bar, unlock order (first ability upgrades in sequence), win rate + match count, and a core item icon row.

## Unlock Order
The sequence in which hero abilities are leveled in a build. Derived from `BuildHeroDetailsAbilityOrder.currency_changes[].ability_id` in the selected build's data.

## Core Items
Items from the `mod_categories` entry whose `name` matches a core-like label (e.g. "Core"). Falls back to the first non-empty category if no explicit core category exists.

## Item Hover
A tooltip shown on hover over any item icon in the Build Summary or full item grid. Displays item name and description from `GET /v1/assets/items`.

## Full Item Grid
The expanded build view below the Build Summary. All `mod_categories` are rendered as labeled columns of item icons. Every icon has an Item Hover tooltip.

## Skill Path
The Skill Path tab shows the top 5 ability upgrade sequences by match count, from `GET /v1/analytics/ability-order-stats?hero_id={id}`. Rendered as a grid: rows = the 4 hero abilities (icons from `GET /v1/assets/items/by-hero-id/{id}`), columns = game levels. Each variation shows win rate and game count.

## navigate-hero Event
A `CustomEvent` dispatched on the document root by HeroLibrary when a hero card is clicked. `detail: { heroId: number, heroData: HeroData }`. Caught by App, which mounts HeroDetailsPage with the hero data.

## Match Detail Panel
The expandable analysis panel revealed when a match row in the Profil match history is expanded (the `expand-match-btn` chevron). Contains a horizontal tab bar of exactly five per-match analysis tabs: **Overview**, **Lane Stats**, **Items**, **Economy**, **Damage**. (The screenshots' sixth "TL Score" tab and its embedded radar panels are explicitly out of scope — no API basis.) Data source is the full `GET /v1/matches/{match_id}/metadata` response (`CMsgMatchMetaDataContents`). Distinct from the Profil page's own tabs (Overview/Heroes/Matches).

## The Amber Hand / The Sapphire Flame
The two factions of a Deadlock match, used as section headers throughout the Match Detail Panel. `team` 0 = **THE AMBER HAND** (gold/amber accent); `team` 1 = **THE SAPPHIRE FLAME** (blue accent). Each header is suffixed with `(WINNER)` or `(LOSER)`, derived from `match_info.winning_team`. (These replace the spec's non-canonical "Hidden King / Archmother" labels.)

## Item Timeline
The chronological item-acquisition strip in the Match Detail Panel's Items tab. One card per **distinct shop item** (resolved through the items cache: requires `shop_image_webp` + `item_tier`), placed at its **first** `game_time_s`, deduplicated by `item_id`, and grouped into cards by minute. Items later sold (`sold_time_s != 0`) are shown but dimmed.

## Ability Build (Match Detail)
The intended skill-order section in the Items tab. The match metadata does **not** contain a player's actual in-match ability leveling order (verified: `ability_stats`/`book_rewards`/`hero_equips` empty, only a total `ability_points`). Best-effort only: when a player's `hero_build_id` is present, the planned order is read from that build's `ability_order.currency_changes` via `GET /v1/builds`; otherwise the section is hidden.

## Match Overview Tab
The match scoreboard: two stacked team sections, each headed by its [[the-amber-hand-the-sapphire-flame]] faction label + `(WINNER/LOSER)` and the team's cumulative `Kills/Deaths/Assists`. Six player rows per team, each showing: hero icon + Steam name (a link firing the existing `navigate-player` event to that player's Profil), a fixed 6×2 build grid (12 slots, empties shown; reuses the Profil [[item-timeline]] item filter), KDA ratio with numeric `(K+A)/D` below, CS (= player-level `last_hits`) with KP (`((K+A)/teamKills)*100`, formatted `55.1% KP`), and a Damage column = `player_damage` (hero damage). Item icons use the [[item-tooltip]] hover (I–IV).

## Match Economy Tab
Reduced to a single **team-comparison** block (the per-player subtabs and income breakdown were dropped as low-value/high-complexity). Four advantage bars reusing the Lane Stats bar visual: Net Worth (Σ`net_worth`), Total CS (Σ`last_hits`), Denies (Σ`gold_denied` — denied **souls**, not the deny *count*), Death Loss (Σ`gold_death_loss`). Leader side bolded.

## Match Damage Tab
The richest tab. A team-comparison block (5 advantage bars: Hero Damage=`player_damage`, Hero Healing=`player_healing`, Obj Damage=`boss_damage`, Damage Taken=`player_damage_taken`, Mitigated=`damage_mitigated`); a **unified per-player chart** with four subtabs (Hero Damage, Total Damage=`player_damage+creep_damage+neutral_damage+boss_damage`, Hero Healing, Obj Damage), each rendering all players in one sorted, team-colored horizontal bar list with absolute value + `%` contribution (no split blocks); and a selected-player detail panel (default = profile owner, click a bar to switch): **Damage Breakdown** (Heroes/Creeps/Neutrals/Objectives + DMG/min + Team Share + DMG/Death), **Accuracy** (`shots_hit`/`shots_missed`), **Survivability** (deaths/`player_damage_taken`/`damage_mitigated`), **Power** (`weapon_power`/`tech_power`/`max_health`). All from the final `stats[]` snapshot — `damage_matrix` is not needed.

## Item Tooltip
The hover tooltip on any item icon in the Match Detail Panel. Shows the item name, its stat properties (from the items cache), and a Tier badge on the **I–IV** scale via the shared `renderItemTierBadge` util. (Deadlock has four item tiers; the spec's "Tier I–VI" does not exist.)

## Lane Color
A Normal 6v6 match has three lanes; `assigned_lane` values map `1` = **blue**, `4` = **yellow**, `6` = **green** (already encoded in `types/index.ts`), each lane a 2v2. Lane color tints the hero-icon borders in the Lane Stats hero bar. **Caveat (verified 2026-05-30 against live API):** the distinct `assigned_lane` count is **not** a reliable mode discriminator — a Street Brawl 4v4 still reports `assigned_lane` values `[1,4,6]`, so a "count the lanes present" heuristic wrongly treats it as a three-lane match. Lane *meaning* must be gated on [[street-brawl]] (`game_mode`), not on the lanes present. On the [[live-dashboard]] this is why lane color is suppressed by game mode, not by lane count.

## Match Lane Stats Tab
Compares an arbitrary **selected set of left players vs a selected set of right players** (asymmetric N-vs-M allowed) at a chosen time snapshot. The selector buttons are generated from the match's actual `stats[]` `time_stamp_s` values (rounded to minutes — typically 3/6/9/12/15/20/25/…/end, no 0m); default = final snapshot. On open, the profile player's [[lane-color]] is preselected (their 2v2). Lane-color buttons are presets that replace the selection with that lane's players (both teams); manual hero toggles refine it. Each metric reads the cumulative `stats[]` value at the selected snapshot: Kills=`kills`, Souls=`net_worth`, Last Hits=`creep_kills`, Denies=`denies` (count), Damage=`player_damage`, Obj Damage=`boss_damage`, Shots Hit %=`shots_hit/(shots_hit+shots_missed)`, Level=`level`. The leading side per metric is bolded with an advantage gauge.

## Live Dashboard
The page shown while a Deadlock match is detected (or, absent a live match, for the logged-in player's most recent match). Presents every player in the match as a [[player-tile]], laid out in two rows — top row = `team` 0, bottom row = `team` 1 — with the column count equal to the team size (**6** columns in Normal, **4** in [[street-brawl]]). The same tile is reused for both modes. The visible [[game-mode]] is shown as a header badge. Roster source depends on liveness: a [[demo-mode]] or historical match resolves via the bulk metadata path; a live-detected match is best-effort (see [[live-roster-availability]]).

## Player Tile
A single player's card on the [[live-dashboard]] (component `PlayerCard`). Shows only: player name (links to Steam profile), hero portrait + games-played + win% on that hero, average K/D/A + KDA ratio, rank badge + name + Top%, and 12H / 30D activity (games · wins). Mode-agnostic. [[lane-color]] (left-border + dot) is shown in Normal mode and **suppressed** in [[street-brawl]], because Street Brawl lanes are meaningless even though `assigned_lane` is populated.

## Game Mode
The Normal-vs-Street-Brawl axis of a match, from the API `game_mode` field. `1` / `"Normal"` = Normal (6v6, three lanes); `4` / `"StreetBrawl"` = [[street-brawl]] (4v4, one lane). Distinct from `match_mode` (the Unranked/Ranked/etc. axis), which the dashboard does not key behaviour on. The dashboard accepts both the integer form (per-match metadata) and the PascalCase string form (bulk metadata).

## Street Brawl
A 4v4 Deadlock game mode (`game_mode` `4` / `"StreetBrawl"`) where all players share a single lane. Renders 4 tiles per team on the [[live-dashboard]]. Lane distinctions carry no meaning here, so [[lane-color]] is suppressed.

## Demo Mode
A Configuration toggle (`demoModeEnabled`, formerly `mockModeEnabled` — "Mock" is **not** the canonical term) that makes the [[live-dashboard]] load real *historical* match IDs from a fixed rotation instead of waiting for a live match, so the UI can be exercised on demand. The rotation includes at least one [[street-brawl]] match (`84553413`) so the 4v4 layout is testable. The Refresh control advances to the next match in the rotation.

## Live Roster Availability
The fact that the community API is **post-match ingested**, so a match that is currently in progress has no metadata available from the bulk endpoint, and `/v1/matches/active` (the only live roster source) is unreliable in practice (observed empty for an entire real match, 2026-05-30). Consequence: the [[live-dashboard]] reliably renders [[demo-mode]] / historical matches, while a freshly-detected live match is best-effort and may show a "données indisponibles en direct" pending state until the match is ingested. See [[adr-0004]] and the overlay's VAC-safe-source constraint.

## Game Overlay Window
A second Electron `BrowserWindow` (`overlayWindow`) created in `main.ts` when `GAME_IN_MATCH` is detected and hidden/destroyed at `GAME_MENU`/`GAME_CLOSED`. Properties: `frame: false`, `transparent: true`, `alwaysOnTop: true`, `setIgnoreMouseEvents(true)` except on interactive zones. Rendered by a dedicated `overlay.html` in vanilla TypeScript. Requires the game to run in **Borderless Windowed** mode on Linux (fullscreen exclusive blocks Electron's `alwaysOnTop`). See [[mid-boss-timer]], [[urn-timer]], [[souls-per-min]], [[item-suggestions]].

## Game Clock
A local wall-clock timer started in the overlay renderer when `ChangeGameState: InProgress` is detected in the Deadlock `console.log` file (requires `-condebug` Steam launch option). Game clock = `Date.now()` at that event − current `Date.now()`. All time-based overlay components derive from this single clock. If the log event is missed (app started mid-game), the clock starts from overlay init time as an approximation.

## Mid Boss Timer
Overlay component showing the Mid Boss respawn countdown. States: **Spawned** (boss alive, shown at game start and after each respawn) → countdown triggered manually by the player pressing a button when they see the boss die in-game. Respawn cycle: 7 min after 1st death, 6 min after 2nd, 5 min after 3rd and all subsequent. Boss death detection is not available from any VAC-safe source; the manual trigger is the canonical solution. See [[adr-0003]].

## Urn Timer
Overlay component showing the countdown to the next Soul Urn spawn. First spawn at game clock 12:00. Subsequent spawns every 6 minutes (18:00, 24:00, 30:00…). Lane alternation is fixed and deterministic: **Yellow lane** at 12min, **Green lane** at 18min, alternating. The 12-second descent animation is included in the countdown (urn is collectible 12s after the displayed spawn time). Edge case: if the urn is picked up before its cycle ends but delivered after the next theoretical spawn time, the next spawn skips to the following 6-minute slot — this is tracked locally by comparing delivery time to the schedule.

## Souls Per Min
Overlay component displaying the player's souls-per-minute farming rate vs. the rank/hero average. **Currently a placeholder** — displays `-- SPM` with a "Donnée indisponible" label. No VAC-safe live data source for soul counts exists (not in `console.log`, not in the active match API). Reserved for a future iteration if a live source becomes available.

## Item Suggestions
Overlay component showing the top 3 recommended items against the current enemy team composition. Source: `GET /v1/analytics/item-stats?hero_ids={player_hero}&enemy_hero_ids={enemy_hero_ids}` — returns items ranked by winrate when facing those specific heroes. Labeled "vs composition ennemie" to be transparent that suggestions are not filtered by the player's current inventory (inventory is unavailable live).

## Condebug Log Path
The file path to Deadlock's `console.log`, produced when `-condebug` is added to Steam launch options. Auto-detected by parsing `libraryfolders.vdf` in standard Steam locations: Linux priority (`~/.local/share/Steam/steamapps/`), Windows fallback (`C:\Program Files (x86)\Steam\steamapps\`). The resolved path follows the pattern `{library}/steamapps/common/Deadlock/game/citadel/console.log`. User can override via the Settings page if auto-detection fails.
