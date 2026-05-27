# DeadlockHelper — Domain Glossary

## Hero Library
The grid page listing all playable Deadlock heroes. Filters: `player_selectable=true`, `disabled=false`, `in_development=false`. Source: `GET /v1/assets/heroes`.

## Hero Detail Page
The page shown after selecting a hero from the Hero Library. Receives a `HeroData` object via a `navigate-hero` CustomEvent dispatched by HeroLibrary and caught by App. Contains a sticky header and 5 tabs.

## Hero Detail Header
Sticky header displayed on the Hero Detail Page. Contains the hero portrait (`icon_hero_card_webp`), hero name, and a full-bleed background image (`background_image_webp`) from `HeroImages`.

## Tab
One of 5 horizontal navigation items below the sticky header: **Builds**, **Items**, **Skill Path**, **Overview & Abilities**, **Lore**. Only Builds and Skill Path are functional; the others are placeholder stubs.

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
