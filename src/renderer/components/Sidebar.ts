/**
 * Sidebar component with hierarchical navigation
 */

import { 
  HomeIcon, 
  SettingsIcon, 
  BugAntIcon,
  TrophyIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from './icons';
import { MainPage, SubPage, NavigationItem } from '../../lib/types';
import { ApiStatusWidget } from '../componentsUI/ApiStatusWidget';
import { UserProfile } from '../componentsUI/UserProfile';
import { SpotifyMiniPlayer } from '../componentsUI/SpotifyMiniPlayer';

export type Page = MainPage | SubPage;

interface NavigationConfig {
  main: MainPage;
  label: string;
  icon: string;
  subPages?: { id: SubPage; label: string; route: string }[];
}

const NAVIGATION_CONFIG: NavigationConfig[] = [
  {
    main: 'profil',
    label: 'Profil',
    icon: 'home',
  },
  {
    main: 'hero-stats',
    label: 'Hero Statistics',
    icon: 'bug-ant',
    subPages: [
      { id: 'hero-library', label: 'Hero Library', route: '/hero/library' },
      { id: 'hero-details', label: 'Hero Details', route: '/hero/details' },
      { id: 'meta-builds', label: 'Meta & Builds', route: '/hero/meta-builds' },
    ],
  },
  {
    main: 'game-overlay',
    label: 'Game Overlay',
    icon: 'video-camera',
    subPages: [
      { id: 'live-dashboard', label: 'Live Dashboard', route: '/game/live-dashboard' },
      { id: 'tactical-analysis', label: 'Tactical Analysis', route: '/game/tactical-analysis' },
    ],
  },
  {
    main: 'leaderboards',
    label: 'Leaderboards',
    icon: 'trophy',
    subPages: [
      { id: 'rankings', label: 'Rankings', route: '/leaderboard/rankings' },
      { id: 'rank-analytics', label: 'Rank Analytics', route: '/leaderboard/rank-analytics' },
    ],
  },
  {
    main: 'meta-items',
    label: 'Meta Items & Builds',
    icon: 'wrench-screwdriver',
  },
  {
    main: 'rank-distribution',
    label: 'Rank Distribution',
    icon: 'chart-bar',
  },
  {
    main: 'settings',
    label: 'Settings',
    icon: 'settings',
    subPages: [
      { id: 'configuration', label: 'Configuration', route: '/settings/configuration' },
      { id: 'spotify-widget', label: 'Spotify Widget', route: '/settings/spotify-widget' },
    ],
  },
];

export class Sidebar {
  private sidebarElement: HTMLElement | null = null;
  private overlayElement: HTMLElement | null = null;
  private isOpen: boolean = true;
  private currentPage: Page = 'profil';
  private expandedMenus: Set<MainPage> = new Set();
  private onPageChange: (page: Page) => void;

  constructor(onPageChange: (page: Page) => void) {
    this.onPageChange = onPageChange;
  }

  private getIcon(iconName: string): string {
    const iconMap: Record<string, (className: string) => string> = {
      'home': HomeIcon,
      'settings': SettingsIcon,
      'bug-ant': BugAntIcon,
      'trophy': TrophyIcon,
      'video-camera': VideoCameraIcon,
      'wrench-screwdriver': WrenchScrewdriverIcon,
      'chart-bar': ChartBarIcon,
    };
    const iconFn = iconMap[iconName] || HomeIcon;
    return iconFn('w-6 h-6');
  }

  render(): string {
    const toggleIcon = this.isOpen 
      ? ChevronDoubleLeftIcon('w-5 h-5') 
      : ChevronDoubleRightIcon('w-5 h-5');

    return `
      <!-- Overlay for mobile -->
      <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden hidden transition-opacity duration-300"></div>
      
      <!-- Sidebar -->
      <aside id="sidebar" class="fixed left-0 top-0 h-full bg-charcoal-100 text-white z-50 transition-all duration-300 ease-in-out flex flex-col ${
        this.isOpen ? 'w-64' : 'w-20'
      }">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between p-4 border-b border-grey-600">
          ${this.isOpen ? '<h2 class="text-xl font-bold text-white">Navigation</h2>' : ''}
          <button 
            id="toggle-sidebar" 
            class="p-2 rounded-lg hover:bg-charcoal-300 transition-colors text-white hover:text-frosted-mint-500"
            aria-label="Toggle sidebar"
          >
            ${toggleIcon}
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto mt-4">
          <ul class="space-y-1 px-2">
            ${NAVIGATION_CONFIG.map(config => this.renderNavItem(config)).join('')}
          </ul>
        </nav>

        <!-- User Profile (Steam) -->
        <div id="user-profile-placeholder" class="p-3 border-t border-grey-600 min-h-[52px] flex items-center justify-center">
          <div class="text-sm text-grey-500">…</div>
        </div>
        <!-- API Status Widget -->
        <div id="api-status-placeholder" class="p-3 border-t border-grey-600 min-h-[52px] flex items-center justify-center">
          <div class="text-sm text-grey-500">…</div>
        </div>
        <!-- Spotify Mini Player -->
        <div id="spotify-widget-placeholder" class="px-3 py-3 border-t border-grey-600"></div>
      </aside>
    `;
  }

  private renderNavItem(config: NavigationConfig): string {
    const isActive = this.currentPage === config.main || 
                     (config.subPages?.some(sp => sp.id === this.currentPage));
    const isExpanded = this.expandedMenus.has(config.main);
    const hasSubPages = config.subPages && config.subPages.length > 0;

    const icon = this.getIcon(config.icon);
    const chevronIcon = hasSubPages 
      ? (isExpanded 
          ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19.5 8.25-7.5 7.5-7.5-7.5"></path></svg>`
          : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>`)
      : '';

    return `
      <li>
        <div>
          <a 
            href="#" 
            data-page="${config.main}"
            data-has-subpages="${hasSubPages}"
            class="nav-main-link flex items-center gap-3 p-3 rounded-lg transition-all text-white ${
              isActive ? 'bg-charcoal-300' : 'hover:bg-charcoal-300 hover:text-frosted-mint-500'
            }"
          >
            <span class="shrink-0">${icon}</span>
            ${this.isOpen ? `
              <span class="font-medium flex-1">${config.label}</span>
              ${hasSubPages ? `<span class="shrink-0">${chevronIcon}</span>` : ''}
            ` : ''}
          </a>
          ${hasSubPages && this.isOpen ? `
            <ul class="sub-menu mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200 ${isExpanded ? 'animate-fade-in-down' : 'hidden'}" data-parent="${config.main}">
              ${config.subPages!.map(subPage => {
                const isSubActive = this.currentPage === subPage.id;
                return `
                  <li>
                    <a 
                      href="#" 
                      data-page="${subPage.id}"
                      class="nav-sub-link flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-grey-300 ${
                        isSubActive 
                          ? 'bg-charcoal-300 text-white' 
                          : 'hover:bg-charcoal-300 hover:text-frosted-mint-500'
                      }"
                    >
                      <span class="w-1 h-1 rounded-full bg-grey-500"></span>
                      <span class="text-sm">${subPage.label}</span>
                    </a>
                  </li>
                `;
              }).join('')}
            </ul>
          ` : ''}
        </div>
      </li>
    `;
  }

  mount(container: HTMLElement): void {
    container.innerHTML = this.render();
    
    this.sidebarElement = document.getElementById('sidebar');
    this.overlayElement = document.getElementById('sidebar-overlay');
    
    // Toggle sidebar button
    const toggleButton = document.getElementById('toggle-sidebar');
    toggleButton?.addEventListener('click', () => this.toggle());

    // Main navigation links
    const mainLinks = document.querySelectorAll('.nav-main-link');
    mainLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = (link as HTMLElement).dataset.page as MainPage;
        const hasSubPages = (link as HTMLElement).dataset.hasSubpages === 'true';
        
        // If sidebar is closed and link has sub-pages, open sidebar first
        if (!this.isOpen && hasSubPages) {
          this.expand();
          // Wait for sidebar to open, then expand the sub-menu
          setTimeout(() => {
            this.toggleSubMenu(page);
          }, 300); // Match sidebar transition duration
        } else if (hasSubPages) {
          this.toggleSubMenu(page);
        } else {
          this.navigateTo(page);
        }
      });
    });

    // Sub navigation links
    const subLinks = document.querySelectorAll('.nav-sub-link');
    subLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = (link as HTMLElement).dataset.page as SubPage;
        this.navigateTo(page);
      });
    });

    // Overlay click to close (mobile)
    this.overlayElement?.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        this.collapse();
      }
    });
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    this.update();
  }

  expand(): void {
    this.isOpen = true;
    this.update();
  }

  collapse(): void {
    this.isOpen = false;
    this.update();
  }

  toggleSubMenu(mainPage: MainPage): void {
    if (this.expandedMenus.has(mainPage)) {
      // Si le menu est déjà ouvert, on le ferme
      this.expandedMenus.delete(mainPage);
    } else {
      // Si on ouvre un nouveau menu, on ferme tous les autres d'abord
      this.expandedMenus.clear();
      this.expandedMenus.add(mainPage);
    }
    this.update();
  }

  navigateTo(page: Page): void {
    this.currentPage = page;
    this.onPageChange(page);
    
    // Find the config for this page
    const config = NAVIGATION_CONFIG.find(c => 
      c.main === page || c.subPages?.some(sp => sp.id === page)
    );
    
    if (config) {
      // If navigating to a sub-page, close all other menus and open parent
      if (config.subPages?.some(sp => sp.id === page)) {
        this.expandedMenus.clear();
        this.expandedMenus.add(config.main);
      }
      // If navigating to a main page with sub-pages, close all other menus
      else if (config.subPages && config.subPages.length > 0) {
        // If clicking on main page, toggle its menu (close others first)
        if (this.expandedMenus.has(config.main)) {
          this.expandedMenus.delete(config.main);
        } else {
          this.expandedMenus.clear();
          this.expandedMenus.add(config.main);
        }
      }
      // If navigating to a main page without sub-pages, close all menus
      else {
        this.expandedMenus.clear();
      }
    }
    
    this.update();
  }

  private update(): void {
    if (!this.sidebarElement) return;

    // Update sidebar width
    if (this.isOpen) {
      this.sidebarElement.classList.remove('w-20');
      this.sidebarElement.classList.add('w-64');
    } else {
      this.sidebarElement.classList.remove('w-64');
      this.sidebarElement.classList.add('w-20');
    }

    // Update toggle button icon
    const toggleButton = document.getElementById('toggle-sidebar');
    if (toggleButton) {
      const toggleIcon = this.isOpen 
        ? ChevronDoubleLeftIcon('w-5 h-5') 
        : ChevronDoubleRightIcon('w-5 h-5');
      toggleButton.innerHTML = toggleIcon;
    }

    // Update header text
    const header = this.sidebarElement.querySelector('h2');
    if (header) {
      header.textContent = this.isOpen ? 'Navigation' : '';
      header.style.display = this.isOpen ? 'block' : 'none';
    }

    // Update nav link text visibility
    const navTexts = this.sidebarElement.querySelectorAll('.nav-main-link span:nth-child(2)');
    navTexts.forEach(text => {
      const span = text as HTMLElement;
      span.style.display = this.isOpen ? 'inline' : 'none';
    });

    // Update sub-menus visibility with animation
    const subMenus = this.sidebarElement.querySelectorAll('.sub-menu');
    subMenus.forEach(menu => {
      const parentId = (menu as HTMLElement).dataset.parent as MainPage;
      const menuElement = menu as HTMLElement;
      const isExpanded = this.expandedMenus.has(parentId);
      
      if (this.isOpen && isExpanded) {
        // Opening: remove hidden, add fade-in animation
        menuElement.classList.remove('hidden', 'animate-fade-out-up');
        menuElement.classList.add('animate-fade-in-down');
      } else if (this.isOpen && !isExpanded && !menuElement.classList.contains('hidden')) {
        // Closing: add fade-out animation, then hide after animation
        menuElement.classList.remove('animate-fade-in-down');
        menuElement.classList.add('animate-fade-out-up');
        
        // Hide after animation completes
        setTimeout(() => {
          if (!this.expandedMenus.has(parentId)) {
            menuElement.classList.add('hidden');
            menuElement.classList.remove('animate-fade-out-up');
          }
        }, 200); // Match animation duration
      } else {
        // Sidebar closed or menu should be hidden
        menuElement.classList.add('hidden');
        menuElement.classList.remove('animate-fade-in-down', 'animate-fade-out-up');
      }
    });

    // Update chevron icons in main links
    const mainLinks = this.sidebarElement.querySelectorAll('.nav-main-link');
    mainLinks.forEach(link => {
      const hasSubPages = (link as HTMLElement).dataset.hasSubpages === 'true';
      if (hasSubPages && this.isOpen) {
        const parentId = (link as HTMLElement).dataset.page as MainPage;
        const isExpanded = this.expandedMenus.has(parentId);
        const chevron = link.querySelector('span:last-child');
        if (chevron) {
          chevron.innerHTML = isExpanded 
            ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19.5 8.25-7.5 7.5-7.5-7.5"></path></svg>`
            : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>`;
        }
      }
    });

    // Refresh sidebar widgets (compact vs full layout)
    ApiStatusWidget.refresh();
    UserProfile.refresh();
    SpotifyMiniPlayer.refresh();

    // Update active states
    this.updateActiveStates();

    // Update overlay visibility (mobile)
    if (this.overlayElement) {
      if (this.isOpen && window.innerWidth < 1024) {
        this.overlayElement.classList.remove('hidden');
      } else {
        this.overlayElement.classList.add('hidden');
      }
    }
  }

  private updateActiveStates(): void {
    // Update main links active state
    const mainLinks = this.sidebarElement?.querySelectorAll('.nav-main-link');
    mainLinks?.forEach(link => {
      const page = (link as HTMLElement).dataset.page as MainPage;
      const isActive = this.currentPage === page || 
                       NAVIGATION_CONFIG.find(c => c.main === page)?.subPages?.some(sp => sp.id === this.currentPage);
      
      if (isActive) {
        link.classList.add('bg-charcoal-300');
        link.classList.remove('hover:bg-charcoal-300');
      } else {
        link.classList.remove('bg-charcoal-300');
        link.classList.add('hover:bg-charcoal-300');
      }
    });

    // Update sub links active state
    const subLinks = this.sidebarElement?.querySelectorAll('.nav-sub-link');
    subLinks?.forEach(link => {
      const page = (link as HTMLElement).dataset.page as SubPage;
      const isActive = this.currentPage === page;
      
      if (isActive) {
        link.classList.add('bg-charcoal-300', 'text-white');
        link.classList.remove('text-grey-300', 'hover:bg-charcoal-300', 'hover:text-frosted-mint-500');
      } else {
        link.classList.remove('bg-charcoal-300', 'text-white');
        link.classList.add('text-grey-300', 'hover:bg-charcoal-300', 'hover:text-frosted-mint-500');
      }
    });
  }
}
