/**
 * Hero Library — Grille complète de tous les héros Deadlock actifs.
 *
 * DATA FLOW:
 *   GET https://api.deadlock-api.com/v1/assets/heroes
 *   → tableau de HeroData complet (id, name, player_selectable, disabled, in_development, images)
 *   Filtre: player_selectable=true AND disabled=false AND in_development=false
 *   Image portrait: images.icon_hero_card_webp (portrait plein) > icon_image_small_webp (icône fallback)
 */

import type { HeroData } from '../../../lib/types';

const DEADLOCK_API = 'https://api.deadlock-api.com';

export class HeroLibraryPage {
  private container: HTMLElement | null = null;

  mount(container: HTMLElement): void {
    this.container = container;
    this.renderSkeleton();
    this.fetchAndRender();
  }

  private renderSkeleton(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          ${this.renderHeader()}
          <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 gap-2">
            ${Array.from({ length: 27 }).map(() => `
              <div class="flex flex-col items-center gap-2 animate-pulse">
                <div class="w-[96px] h-[128px] rounded-lg bg-charcoal-300 border border-charcoal-400"></div>
                <div class="h-2 w-16 rounded-full bg-charcoal-300"></div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  private renderHeader(): string {
    return `
      <div class="mb-5">
        <h1 class="text-3xl font-bold text-white tracking-wide">Heroes</h1>
        <p class="text-dry-sage-500 text-sm mt-1">
          Browse all Deadlock heroes and view their builds, stats, and guides
        </p>
        <div class="mt-4 h-px bg-gradient-to-r from-dry-sage-400/50 via-charcoal-400 to-transparent"></div>
      </div>`;
  }

  /**
   * GET /v1/assets/heroes — liste complète des héros avec portraits CDN.
   * Exclut les héros dépréciés / en développement / désactivés.
   */
  private async fetchAndRender(): Promise<void> {
    if (!this.container) return;

    let heroes: HeroData[] = [];
    try {
      const res = await fetch(`${DEADLOCK_API}/v1/assets/heroes`);
      if (res.ok) {
        const raw = await res.json();
        const all: HeroData[] = Array.isArray(raw) ? raw : (raw.data ?? []);
        heroes = all.filter(h =>
          h.player_selectable === true &&
          h.disabled === false &&
          h.in_development === false
        );
        heroes.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
      }
    } catch {
      // Render error state below
    }

    if (!this.container) return;

    if (heroes.length === 0) {
      this.container.innerHTML = `
        <div class="p-8 bg-charcoal-100 min-h-screen flex flex-col items-center justify-center gap-3">
          <div class="w-12 h-12 rounded-full border-2 border-charcoal-400 flex items-center justify-center">
            <span class="text-grey-500 text-xl">!</span>
          </div>
          <p class="text-grey-500 text-sm">Impossible de charger les héros.</p>
        </div>`;
      return;
    }

    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          ${this.renderHeader()}
          <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 gap-2">
            ${heroes.map((h) => this.renderHeroCard(h)).join('')}
          </div>
        </div>
      </div>`;

    // Wire hero card clicks → navigate-hero event
    this.container.querySelectorAll<HTMLButtonElement>('button[data-hero-id]').forEach(btn => {
      const id = parseInt(btn.dataset.heroId ?? '', 10);
      const hero = heroes.find(h => h.id === id);
      if (hero) {
        btn.addEventListener('click', () => {
          document.dispatchEvent(new CustomEvent('navigate-hero', { detail: { heroId: id, heroData: hero } }));
        });
      }
    });
  }

  private renderHeroCard(hero: HeroData): string {
    // Préférer l'image portrait complète (hero card) plutôt que la petite icône
    const imgUrl = hero.images?.icon_hero_card_webp
                ?? hero.images?.icon_hero_card
                ?? hero.images?.icon_image_small_webp
                ?? hero.images?.icon_image_small
                ?? '';
    const name = hero.name ?? '—';

    const imgHtml = imgUrl
      ? `<img src="${imgUrl}" alt="${name}"
              class="w-full h-full object-cover object-top
                     transition-transform duration-300 ease-out
                     group-hover:scale-[1.06]"/>`
      : `<div class="w-full h-full flex items-center justify-center
                    text-grey-600 text-xs bg-charcoal-300">?</div>`;

    return `
      <button data-hero-id="${hero.id}"
              title="${name}"
              class="group flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0">
        <div class="w-[96px] h-[128px] rounded-lg overflow-hidden
                    border border-charcoal-400
                    group-hover:border-dry-sage-400
                    shadow-md group-hover:shadow-dry-sage-400/20 group-hover:shadow-lg
                    transition-all duration-250 bg-charcoal-200 shrink-0">
          ${imgHtml}
        </div>
        <span class="text-[11px] leading-tight text-center text-grey-500
                     w-[96px] truncate
                     transition-colors duration-200 group-hover:text-dry-sage-400">
          ${name}
        </span>
      </button>`;
  }
}
