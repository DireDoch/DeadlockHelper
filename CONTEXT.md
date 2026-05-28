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
