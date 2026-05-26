/**
 * Main Application Controller
 * Manages navigation and page rendering
 */

import { Sidebar, Page } from './components/Sidebar';
import type { MainPage, SubPage } from '../lib/types';
import { ApiStatusWidget } from './componentsUI/ApiStatusWidget';
import { GameStatusIndicator } from './componentsUI/GameStatusIndicator';
import { UserProfile } from './componentsUI/UserProfile';
import { SpotifyMiniPlayer } from './componentsUI/SpotifyMiniPlayer';
import type { Page } from './components/Sidebar';

// Main pages
import { ProfilPage } from './pages/Profil';
import { HeroPage } from './pages/Hero';
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
  private heroPage = new HeroPage();
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
    appContainer.innerHTML = `
      <div class="flex h-screen bg-charcoal-100">
        <div id="sidebar-container"></div>
        <main id="content" class="flex-1 overflow-y-auto transition-all duration-300" style="margin-left: 16rem;">
          <!-- Content will be rendered here -->
        </main>
        <div id="game-status-sticky" class="fixed top-4 right-4 z-70"></div>
      </div>
    `;

    // Mount sidebar
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
      this.sidebar.mount(sidebarContainer);
    }

    // Mount API status widget and user profile in sidebar
    ApiStatusWidget.mount();
    UserProfile.mount();
    GameStatusIndicator.mount();
    SpotifyMiniPlayer.mount((page) => this.sidebar.navigateTo(page as Page));

    if (window.api?.onSteamProfileUpdated) {
      window.api.onSteamProfileUpdated(() => {
        UserProfile.refresh();
        if (this.currentPage === 'configuration') {
          this.configurationPage.refresh();
        }
      });
    }

    // Redirection to live dashboard when a match is started
    if (window.api?.onMatchStarted) {
      window.api.onMatchStarted(({ matchId }) => {
        this.liveDashboardPage.handleDetectedMatch(matchId);
        GameStatusIndicator.refresh();
        if (this.currentPage !== 'live-dashboard') {
          this.sidebar.navigateTo('live-dashboard');
        }
      });
    }

    if (window.api?.onMatchEnded) {
      window.api.onMatchEnded(() => {
        this.liveDashboardPage.clearDetectedMatchId();
        GameStatusIndicator.refresh();
      });
    }

    if (window.api?.onGameProcessStatusChange) {
      window.api.onGameProcessStatusChange(() => {
        GameStatusIndicator.refresh();
      });
    }

    // Get content container
    this.contentContainer = document.getElementById('content');

    // Initial page render
    this.renderPage(this.currentPage);

    // Handle window resize for responsive sidebar
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();
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
          this.heroPage.mount(this.contentContainer);
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

  private handleResize(): void {
    // Adjust main content margin based on sidebar state
    const content = this.contentContainer;
    const sidebar = document.getElementById('sidebar');
    
    if (content && sidebar) {
      const sidebarWidth = sidebar.classList.contains('w-64') ? '16rem' : '5rem';
      content.style.marginLeft = sidebarWidth;
    }
  }
}
