/**
 * Sidebar — Navigation latérale collapse/expand au survol.
 *
 * ## Architecture en 2 couches
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │  COUCHE 1 — Section principale (s'adapte à la largeur)       │
 *   │  ┌─────────────────────────────────────────────────────────┐ │
 *   │  │  UserProfile                                             │ │
 *   │  ├─────────────────────────────────────────────────────────┤ │
 *   │  │  Navigation (scrollable)                                 │ │
 *   │  ├─────────────────────────────────────────────────────────┤ │
 *   │  │  API Status                                              │ │
 *   │  ├─────────────────────────────────────────────────────────┤ │
 *   │  │  Settings                                                │ │
 *   │  ├─────────────────────────────────────────────────────────┤ │
 *   │  │  SPACER h-44 — réserve l'espace du widget Spotify       │ │
 *   │  └─────────────────────────────────────────────────────────┘ │
 *   └──────────────────────────────────────────────────────────────┘
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │  COUCHE 2 — Spotify (absolute bottom-0 left-0, toujours w-64)│
 *   │  Déborde à droite quand la sidebar est en mode étroit (w-16) │
 *   │  mais ne recouvre JAMAIS les boutons de la couche 1, car il  │
 *   │  est positionné en dessous (z-order naturel dans le same     │
 *   │  stacking context).                                          │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * ## Pourquoi Spotify est en position absolute
 *
 *   Le widget Spotify doit toujours être lisible (~256 px de large)
 *   même quand la sidebar est rétractée à w-16 (64 px). En le sortant
 *   du flux flex et en le positionnant absolute bottom-0 left-0 w-64,
 *   il occupe toujours exactement 256 px horizontalement, indépendamment
 *   de la largeur courante du <aside>.
 *
 *   Le contenu principal a margin-left: 16rem (256 px), donc le widget
 *   s'affiche juste à gauche du contenu sans le recouvrir.
 *
 * ## Pourquoi la couche 1 a un spacer
 *
 *   Le spacer (h-44 ≈ 176 px) en bas de la section principale empêche
 *   Settings et API Status d'être masqués par le widget Spotify absolu.
 *   Si le widget Spotify change de hauteur selon son état (lecture,
 *   inactif, non connecté), augmenter ce spacer.
 *
 * ## Comportement hover
 *
 *   - Au repos  : sidebar w-16. Labels cachés par overflow-hidden sur la
 *                 section principale. Le spacer + Spotify restent visibles.
 *   - Au survol : sidebar w-64. Labels révélés. Les labels ont aussi une
 *                 transition opacity (200 ms) pour un rendu plus fluide.
 *   - Debounce  : 150 ms en entrée, 100 ms en sortie pour éviter les
 *                 déclenchements accidentels.
 *
 * ## Indicateur d'item actif
 *
 *   Une bandelette w-0.5 absolument positionnée sur le bord gauche de
 *   chaque <li> prend la couleur dry-sage-400 quand l'item est actif.
 *   Séparée du <a> pour ne pas perturber le padding / layout.
 *
 * ## Sous-menus (accordion)
 *
 *   Un seul sous-menu peut être ouvert à la fois. Ils se ferment tous
 *   automatiquement quand la souris quitte la sidebar.
 */

import {
  HomeIcon,
  SettingsIcon,
  BugAntIcon,
  VideoCameraIcon,
  ListBulletIcon,
  CubeIcon,
  PresentationChartBarIcon,
} from './icons';
import type { MainPage, SubPage } from '../../lib/types';
import { ApiStatusWidget } from '../componentsUI/ApiStatusWidget';
import { UserProfile } from '../componentsUI/UserProfile';
import { SpotifyMiniPlayer } from '../componentsUI/SpotifyMiniPlayer';

export type Page = MainPage | SubPage;

interface NavConfig {
  main: MainPage;
  label: string;
  icon: (className: string) => string;
  subPages?: { id: SubPage; label: string }[];
}

/**
 * Items de navigation principale, dans l'ordre d'affichage vertical.
 * SETTINGS_ITEM est séparé car il est épinglé juste au-dessus du widget Spotify.
 */
const NAV_ITEMS: NavConfig[] = [
  { main: 'profil',            label: 'Profile',           icon: HomeIcon },
  {
    main: 'game-overlay',
    label: 'Live Dashboard',
    icon: VideoCameraIcon,
    subPages: [
      { id: 'live-dashboard',    label: 'Live Dashboard' },
      { id: 'tactical-analysis', label: 'Tactical Analysis' },
    ],
  },
  {
    main: 'hero-stats',
    label: 'Hero Statistics',
    icon: BugAntIcon,
    subPages: [
      { id: 'hero-library', label: 'Hero Library' },
      { id: 'hero-details', label: 'Hero Details' },
      { id: 'meta-builds',  label: 'Meta & Builds' },
    ],
  },
  { main: 'meta-items',        label: 'Items & Builds',    icon: CubeIcon },
  {
    main: 'leaderboards',
    label: 'Leaderboard',
    icon: ListBulletIcon,
    subPages: [
      { id: 'rankings',       label: 'Rankings' },
      { id: 'rank-analytics', label: 'Rank Analytics' },
    ],
  },
  { main: 'rank-distribution', label: 'Rank Distribution', icon: PresentationChartBarIcon },
];

const SETTINGS_ITEM: NavConfig = {
  main: 'settings',
  label: 'Settings',
  icon: SettingsIcon,
  subPages: [
    { id: 'configuration',  label: 'Configuration' },
    { id: 'spotify-widget', label: 'Spotify Widget' },
  ],
};

const ALL_CONFIGS: NavConfig[] = [...NAV_ITEMS, SETTINGS_ITEM];

export class Sidebar {
  private sidebarEl: HTMLElement | null = null;

  /**
   * true = sidebar étendue (w-64), labels visibles.
   * false = sidebar rétractée (w-16), labels cachés.
   */
  private isExpanded = false;

  private currentPage: Page = 'profil';
  private expandedMenus: Set<MainPage> = new Set();

  /** Handle pour le debounce mouseenter / mouseleave. */
  private hoverTimer: ReturnType<typeof setTimeout> | null = null;

  private onPageChange: (page: Page) => void;

  constructor(onPageChange: (page: Page) => void) {
    this.onPageChange = onPageChange;
  }

  // ─── Rendering ──────────────────────────────────────────────────────────────

  /**
   * Génère le HTML d'un item de navigation (avec sous-menu optionnel).
   *
   * Structure :
   *   <li class="relative">
   *     <div …/>           ← bandelette active dry-sage-400
   *     <a class="nav-main-link">
   *       icône | <span class="nav-label"> label </span> | chevron
   *     </a>
   *     <ul class="sub-menu">…</ul>
   *   </li>
   */
  private renderNavItem(config: NavConfig): string {
    const isActive =
      this.currentPage === config.main ||
      config.subPages?.some((sp) => sp.id === this.currentPage) === true;
    const isMenuOpen = this.expandedMenus.has(config.main);
    const hasSubPages = !!(config.subPages?.length);

    const activeBg = isActive
      ? 'bg-charcoal-300 text-dry-sage-400'
      : 'text-grey-700 hover:bg-charcoal-200 hover:text-white';

    const chevronSvg = `
      <svg class="w-3 h-3 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
      </svg>`;

    const subMenuHtml = hasSubPages ? `
      <ul class="sub-menu overflow-hidden ${isMenuOpen && this.isExpanded ? '' : 'hidden'}"
          data-parent="${config.main}">
        ${config.subPages!.map((sp) => {
          const isSubActive = this.currentPage === sp.id;
          return `
            <li>
              <a href="#" data-page="${sp.id}"
                class="nav-sub-link flex items-center gap-2 pl-12 pr-4 py-2 text-xs transition-colors
                  ${isSubActive
                    ? 'text-dry-sage-400 bg-charcoal-200'
                    : 'text-grey-600 hover:text-white hover:bg-charcoal-200'}">
                <span class="w-1 h-1 rounded-full bg-current shrink-0"></span>
                <span class="whitespace-nowrap">${sp.label}</span>
              </a>
            </li>`;
        }).join('')}
      </ul>` : '';

    return `
      <li class="relative">
        <div class="absolute left-0 top-0 h-full w-0.5 rounded-r transition-colors
                    ${isActive ? 'bg-dry-sage-400' : 'bg-transparent'}"></div>
        <a href="#" data-page="${config.main}" data-has-subpages="${hasSubPages}"
          class="nav-main-link flex items-center gap-3 pl-5 pr-4 py-2.5 transition-colors ${activeBg}">
          <span class="shrink-0">${config.icon('w-5 h-5')}</span>
          <!--
            nav-label : opacity-0 au repos (sidebar w-16).
            Révélé via transition opacity quand la sidebar s'étend à w-64.
            whitespace-nowrap évite que le texte wrap pendant la transition.
          -->
          <span class="nav-label flex-1 text-sm font-medium whitespace-nowrap
                        transition-opacity duration-200
                        ${this.isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}">
            ${config.label}
          </span>
          ${hasSubPages ? `
            <span class="nav-chevron shrink-0 transition-opacity duration-200
                          ${this.isExpanded ? 'opacity-100' : 'opacity-0'}">
              ${chevronSvg}
            </span>` : ''}
        </a>
        ${subMenuHtml}
      </li>`;
  }

  /**
   * Génère le HTML complet de la sidebar.
   * N'est appelé qu'une seule fois dans mount(). Les mises à jour suivantes
   * passent par les méthodes DOM directes pour préserver les listeners des
   * sous-composants (Spotify, UserProfile, ApiStatus).
   */
  render(): string {
    return `
      <aside id="sidebar"
        class="fixed left-0 top-0 h-full z-50
               transition-all duration-300 ease-in-out
               ${this.isExpanded ? 'w-64' : 'w-16'}">

        <!--
          SECTION PRINCIPALE — clips à la largeur courante du <aside>.
          overflow-hidden masque les labels et chevrons quand la sidebar
          est en w-16 sans qu'on ait besoin de les retirer du DOM.
        -->
        <div class="flex flex-col h-full bg-charcoal-100 border-r border-grey-200 overflow-hidden">

          <!-- Zone 1 : UserProfile -->
          <div id="user-profile-placeholder"
            class="border-b border-grey-200 min-h-[64px] flex items-center px-3 py-3 shrink-0">
            <div class="text-sm text-grey-500">…</div>
          </div>

          <!-- Zone 2 : Navigation scrollable -->
          <nav class="flex-1 overflow-y-auto overflow-x-hidden py-2">
            <ul class="space-y-0.5">
              ${NAV_ITEMS.map((c) => this.renderNavItem(c)).join('')}
            </ul>
          </nav>

          <!-- Zone 3 : API Status -->
          <div id="api-status-placeholder"
            class="px-3 py-2.5 min-h-[40px] flex items-center border-t border-grey-200 shrink-0">
            <div class="text-sm text-grey-500">…</div>
          </div>

          <!-- Zone 4 : Settings (épinglé au-dessus du widget Spotify) -->
          <ul class="py-1 border-t border-grey-200 shrink-0">
            ${this.renderNavItem(SETTINGS_ITEM)}
          </ul>

          <!--
            SPACER — réserve la hauteur du widget Spotify absolu.
            h-44 = 176 px. Ajuster si le widget Spotify change de hauteur
            selon son état (connecté / en lecture / inactif).
          -->
          <div class="h-44 shrink-0"></div>
        </div>

        <!--
          WIDGET SPOTIFY — position absolute, toujours w-64.
          Déborde à droite quand la sidebar est en w-16 (64 px), mais
          le contenu principal a margin-left: 16rem (256 px), donc il
          n'y a aucun chevauchement avec le contenu.
          border-t pour le séparer visuellement des zones au-dessus.
        -->
        <div class="absolute bottom-0 left-0 w-64
                    bg-charcoal-100 border-t border-r border-grey-200
                    px-3 py-3">
          <div id="spotify-widget-placeholder"></div>
        </div>
      </aside>`;
  }

  // ─── Mount ──────────────────────────────────────────────────────────────────

  /**
   * Injecte la sidebar dans le container, branche les event listeners
   * et monte les sous-composants (UserProfile, ApiStatusWidget, Spotify).
   */
  mount(container: HTMLElement): void {
    container.innerHTML = this.render();
    this.sidebarEl = document.getElementById('sidebar');

    // Hover expand / collapse avec debounce
    this.sidebarEl?.addEventListener('mouseenter', () => {
      if (this.hoverTimer) clearTimeout(this.hoverTimer);
      this.hoverTimer = setTimeout(() => {
        this.isExpanded = true;
        this.applyExpansion();
      }, 150);
    });

    this.sidebarEl?.addEventListener('mouseleave', () => {
      if (this.hoverTimer) clearTimeout(this.hoverTimer);
      this.hoverTimer = setTimeout(() => {
        this.isExpanded = false;
        this.expandedMenus.clear();
        this.applyExpansion();
        this.updateSubMenus();
      }, 100);
    });

    this.wireLinks();

    UserProfile.mount();
    ApiStatusWidget.mount();
    SpotifyMiniPlayer.mount((page) => this.navigateTo(page as Page));
  }

  // ─── Navigation ─────────────────────────────────────────────────────────────

  private wireLinks(): void {
    if (!this.sidebarEl) return;

    this.sidebarEl.querySelectorAll('.nav-main-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const el = link as HTMLElement;
        const page = el.dataset.page as MainPage;
        if (el.dataset.hasSubpages === 'true') {
          this.toggleSubMenu(page);
        } else {
          this.navigateTo(page);
        }
      });
    });

    this.sidebarEl.querySelectorAll('.nav-sub-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo((link as HTMLElement).dataset.page as SubPage);
      });
    });
  }

  private toggleSubMenu(mainPage: MainPage): void {
    if (this.expandedMenus.has(mainPage)) {
      this.expandedMenus.delete(mainPage);
    } else {
      this.expandedMenus.clear();
      this.expandedMenus.add(mainPage);
    }
    this.updateSubMenus();
  }

  navigateTo(page: Page): void {
    this.currentPage = page;
    this.onPageChange(page);

    const config = ALL_CONFIGS.find(
      (c) => c.main === page || c.subPages?.some((sp) => sp.id === page),
    );

    if (config) {
      if (config.subPages?.some((sp) => sp.id === page)) {
        this.expandedMenus.clear();
        this.expandedMenus.add(config.main);
      } else if (config.subPages?.length) {
        if (this.expandedMenus.has(config.main)) {
          this.expandedMenus.delete(config.main);
        } else {
          this.expandedMenus.clear();
          this.expandedMenus.add(config.main);
        }
      } else {
        this.expandedMenus.clear();
      }
    }

    this.updateActiveStates();
    this.updateSubMenus();
  }

  // ─── DOM updates ────────────────────────────────────────────────────────────

  /**
   * Applique le changement de largeur (w-16 ↔ w-64) sur l'<aside>
   * et bascule la visibilité des labels / chevrons.
   * N'agit pas sur le widget Spotify (absolute, hors du flux).
   */
  private applyExpansion(): void {
    if (!this.sidebarEl) return;

    // Largeur de la sidebar (transition CSS gère l'animation)
    if (this.isExpanded) {
      this.sidebarEl.classList.remove('w-16');
      this.sidebarEl.classList.add('w-64');
    } else {
      this.sidebarEl.classList.remove('w-64');
      this.sidebarEl.classList.add('w-16');
    }

    // Labels : fade in/out via opacity (le overflow-hidden de la section
    // principale suffit à les masquer, mais l'opacity ajoute un rendu plus doux)
    this.sidebarEl.querySelectorAll<HTMLElement>('.nav-label').forEach((el) => {
      if (this.isExpanded) {
        el.classList.remove('opacity-0', 'pointer-events-none');
        el.classList.add('opacity-100');
      } else {
        el.classList.remove('opacity-100');
        el.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    this.sidebarEl.querySelectorAll<HTMLElement>('.nav-chevron').forEach((el) => {
      el.classList.toggle('opacity-0', !this.isExpanded);
      el.classList.toggle('opacity-100', this.isExpanded);
    });

    ApiStatusWidget.refresh();
    UserProfile.refresh();
  }

  private updateSubMenus(): void {
    if (!this.sidebarEl) return;

    this.sidebarEl.querySelectorAll<HTMLElement>('.sub-menu').forEach((menu) => {
      const parentId = menu.dataset.parent as MainPage;
      menu.classList.toggle('hidden', !(this.isExpanded && this.expandedMenus.has(parentId)));
    });

    this.sidebarEl.querySelectorAll<HTMLElement>('.nav-main-link').forEach((link) => {
      const svg = link.querySelector<SVGElement>('.nav-chevron svg');
      if (svg) svg.classList.toggle('rotate-90', this.expandedMenus.has(link.dataset.page as MainPage));
    });
  }

  private updateActiveStates(): void {
    if (!this.sidebarEl) return;

    this.sidebarEl.querySelectorAll<HTMLElement>('.nav-main-link').forEach((link) => {
      const page = link.dataset.page as MainPage;
      const isActive =
        this.currentPage === page ||
        ALL_CONFIGS.find((c) => c.main === page)?.subPages?.some(
          (sp) => sp.id === this.currentPage,
        ) === true;

      const indicator = link.closest('li')?.querySelector<HTMLElement>('div.absolute');
      if (indicator) {
        indicator.classList.toggle('bg-dry-sage-400', isActive);
        indicator.classList.toggle('bg-transparent', !isActive);
      }

      if (isActive) {
        link.classList.remove('text-grey-700', 'hover:bg-charcoal-200', 'hover:text-white');
        link.classList.add('bg-charcoal-300', 'text-dry-sage-400');
      } else {
        link.classList.remove('bg-charcoal-300', 'text-dry-sage-400');
        link.classList.add('text-grey-700', 'hover:bg-charcoal-200', 'hover:text-white');
      }
    });

    this.sidebarEl.querySelectorAll<HTMLElement>('.nav-sub-link').forEach((link) => {
      const isActive = this.currentPage === (link.dataset.page as SubPage);
      if (isActive) {
        link.classList.remove('text-grey-600', 'hover:text-white', 'hover:bg-charcoal-200');
        link.classList.add('text-dry-sage-400', 'bg-charcoal-200');
      } else {
        link.classList.remove('text-dry-sage-400', 'bg-charcoal-200');
        link.classList.add('text-grey-600', 'hover:text-white', 'hover:bg-charcoal-200');
      }
    });
  }

  // ─── API publique ────────────────────────────────────────────────────────────

  expand(): void {
    this.isExpanded = true;
    this.applyExpansion();
  }

  collapse(): void {
    this.isExpanded = false;
    this.expandedMenus.clear();
    this.applyExpansion();
    this.updateSubMenus();
  }
}
