/**
 * Main Application Controller
 * Manages navigation and page rendering
 */

import { Sidebar, Page } from './components/Sidebar';
import type { MainPage, SubPage } from '../lib/types';
import { GameStatusIndicator } from './componentsUI/GameStatusIndicator';
import { UserProfile } from './componentsUI/UserProfile';

// Main pages
import { ProfilPage } from './pages/Profil';
import { GameOverlayPage } from './pages/EnPartie';
import { LeaderboardPage } from './pages/Leaderboard';
import { MetaItemsPage } from './pages/Items';
import { RankDistributionPage } from './pages/RankDistribution';
import { SettingsPage } from './pages/Parametres';

// Sub pages
import { HeroLibraryPage } from './pages/Hero/HeroLibrary';
import { HeroDetailsPage } from './pages/Hero/HeroDetails';
import { MetaBuildsPage } from './pages/Hero/MetaBuilds';
import { LiveDashboardPage } from './pages/EnPartie/LiveDashboard';
import { TacticalAnalysisPage } from './pages/EnPartie/TacticalAnalysis';
import { RankingsPage } from './pages/Leaderboard/Rankings';
import { RankAnalyticsPage } from './pages/Leaderboard/RankAnalytics';
import { ConfigurationPage } from './pages/Parametres/Configuration';
import { SpotifyWidgetPage } from './pages/Parametres/SpotifyWidget';

// Legacy pages (to be migrated)
import { AccueilPage } from './pages/Accueil';

export class App {
  private sidebar: Sidebar;
  private currentPage: Page = 'profil';
  private contentContainer: HTMLElement | null = null;

  // Main page instances
  private profilPage = new ProfilPage();
  private gameOverlayPage = new GameOverlayPage();
  private leaderboardPage = new LeaderboardPage();
  private metaItemsPage = new MetaItemsPage();
  private rankDistributionPage = new RankDistributionPage();
  private settingsPage = new SettingsPage();

  // Sub page instances
  private heroLibraryPage = new HeroLibraryPage();
  private heroDetailsPage = new HeroDetailsPage();
  private metaBuildsPage = new MetaBuildsPage();
  private liveDashboardPage = new LiveDashboardPage();
  private tacticalAnalysisPage = new TacticalAnalysisPage();
  private rankingsPage = new RankingsPage();
  private rankAnalyticsPage = new RankAnalyticsPage();
  private configurationPage = new ConfigurationPage();
  private spotifyWidgetPage = new SpotifyWidgetPage();

  // Legacy pages
  private accueilPage = new AccueilPage();

  constructor() {
    this.sidebar = new Sidebar((page) => this.handlePageChange(page));
  }

  init(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    const appContainer = document.getElementById('app');
    if (!appContainer) {
      console.error('App container not found');
      return;
    }

    // Create layout structure
    // margin-left: 16rem correspond à w-64 — la sidebar est toujours à cette largeur
    // pour que le widget Spotify en bas reste toujours entièrement visible.
    appContainer.innerHTML = `
      <div class="flex h-screen bg-charcoal-100">
        <div id="sidebar-container"></div>
        <main id="content" class="flex-1 overflow-y-auto" style="margin-left: 16rem;">
          <!-- Content will be rendered here -->
        </main>
        <div id="game-status-sticky" class="fixed top-4 right-4 z-[70]"></div>
      </div>
    `;

    // Sidebar.mount() monte aussi UserProfile, ApiStatusWidget et SpotifyMiniPlayer
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
      this.sidebar.mount(sidebarContainer);
    }

    GameStatusIndicator.mount();

    if (window.api?.onSteamProfileUpdated) {
      window.api.onSteamProfileUpdated(() => {
        UserProfile.refresh();
        if (this.currentPage === 'configuration') {
          this.configurationPage.refresh();
        }
      });
    }

    if (window.api?.onGameStateChanged) {
      window.api.onGameStateChanged(({ state, matchId }) => {
        GameStatusIndicator.refresh();
        this.liveDashboardPage.handleGameStateChanged(state, matchId);

        if (state === 'GAME_IN_MATCH' || state === 'GAME_MENU') {
          if (this.currentPage !== 'live-dashboard') {
            this.sidebar.navigateTo('live-dashboard');
          }
        }
      });
    }

    // Get content container
    this.contentContainer = document.getElementById('content');

    // Initial page render
    this.renderPage(this.currentPage);

    // No resize handling needed: sidebar is overlay mode (content margin fixed at 4rem)
  }

  private handlePageChange(page: Page): void {
    // Animate out current page before changing
    if (this.contentContainer && this.currentPage !== page) {
      this.animatePageOut(() => {
        this.currentPage = page;
        this.renderPage(page);
      });
    } else {
      this.currentPage = page;
      this.renderPage(page);
    }
  }

  private animatePageOut(callback: () => void): void {
    if (!this.contentContainer) {
      callback();
      return;
    }

    // Add fade-out animation
    this.contentContainer.classList.add('page-fade-out');
    this.contentContainer.classList.remove('page-fade-in');

    // Wait for animation to complete, then change page
    setTimeout(() => {
      callback();
      // Add fade-in animation for new page
      if (this.contentContainer) {
        this.contentContainer.classList.remove('page-fade-out');
        this.contentContainer.classList.add('page-fade-in');
        
        // Remove animation class after it completes
        setTimeout(() => {
          if (this.contentContainer) {
            this.contentContainer.classList.remove('page-fade-in');
          }
        }, 250);
      }
    }, 250); // Match animation duration
  }

  private renderPage(page: Page): void {
    if (!this.contentContainer) return;

    // Main pages
    if (this.isMainPage(page)) {
      switch (page as MainPage) {
        case 'profil':
          this.profilPage.mount(this.contentContainer);
          break;
        case 'hero-stats':
          this.heroLibraryPage.mount(this.contentContainer);
          break;
        case 'game-overlay':
          this.gameOverlayPage.mount(this.contentContainer);
          break;
        case 'leaderboards':
          this.leaderboardPage.mount(this.contentContainer);
          break;
        case 'meta-items':
          this.metaItemsPage.mount(this.contentContainer);
          break;
        case 'rank-distribution':
          this.rankDistributionPage.mount(this.contentContainer);
          break;
        case 'settings':
          this.settingsPage.mount(this.contentContainer);
          break;
      }
    }
    // Sub pages
    else if (this.isSubPage(page)) {
      switch (page as SubPage) {
        case 'hero-library':
          this.heroLibraryPage.mount(this.contentContainer);
          break;
        case 'hero-details':
          this.heroDetailsPage.mount(this.contentContainer);
          break;
        case 'meta-builds':
          this.metaBuildsPage.mount(this.contentContainer);
          break;
        case 'live-dashboard':
          this.liveDashboardPage.mount(this.contentContainer);
          break;
        case 'tactical-analysis':
          this.tacticalAnalysisPage.mount(this.contentContainer);
          break;
        case 'rankings':
          this.rankingsPage.mount(this.contentContainer);
          break;
        case 'rank-analytics':
          this.rankAnalyticsPage.mount(this.contentContainer);
          break;
        case 'configuration':
          this.configurationPage.mount(this.contentContainer);
          break;
        case 'spotify-widget':
          this.spotifyWidgetPage.mount(this.contentContainer);
          break;
      }
    }
    // Legacy pages (backward compatibility)
    else {
      switch (page) {
        case 'accueil':
          this.accueilPage.mount(this.contentContainer);
          break;
        default:
          console.warn(`Unknown page: ${page}`);
          this.profilPage.mount(this.contentContainer);
      }
    }
  }

  private isMainPage(page: Page): page is MainPage {
    const mainPages: MainPage[] = [
      'profil',
      'hero-stats',
      'game-overlay',
      'leaderboards',
      'meta-items',
      'rank-distribution',
      'settings',
    ];
    return mainPages.includes(page as MainPage);
  }

  private isSubPage(page: Page): page is SubPage {
    const subPages: SubPage[] = [
      'hero-library',
      'hero-details',
      'meta-builds',
      'live-dashboard',
      'tactical-analysis',
      'rankings',
      'rank-analytics',
      'configuration',
      'spotify-widget',
    ];
    return subPages.includes(page as SubPage);
  }

}
