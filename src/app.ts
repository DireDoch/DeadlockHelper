/**
 * Main Application Controller
 * Manages navigation and page rendering
 */

import { Sidebar, Page } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { SettingsPage } from './components/SettingsPage';

export class App {
  private sidebar: Sidebar;
  private homePage: HomePage;
  private settingsPage: SettingsPage;
  private currentPage: Page = 'home';
  private contentContainer: HTMLElement | null = null;

  constructor() {
    this.homePage = new HomePage();
    this.settingsPage = new SettingsPage();
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
      <div class="flex h-screen bg-gray-100 dark:bg-gray-950">
        <div id="sidebar-container"></div>
        <main id="content" class="flex-1 overflow-y-auto transition-all duration-300" style="margin-left: 16rem;">
          <!-- Content will be rendered here -->
        </main>
      </div>
    `;

    // Mount sidebar
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
      this.sidebar.mount(sidebarContainer);
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
    this.currentPage = page;
    this.renderPage(page);
  }

  private renderPage(page: Page): void {
    if (!this.contentContainer) return;

    switch (page) {
      case 'home':
        this.homePage.mount(this.contentContainer);
        break;
      case 'settings':
        this.settingsPage.mount(this.contentContainer);
        break;
    }
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
