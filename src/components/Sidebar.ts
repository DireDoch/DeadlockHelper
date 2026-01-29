/**
 * Sidebar component with collapsible navigation
 */

import { HomeIcon, SettingsIcon, MenuIcon, CloseIcon } from './icons';

export type Page = 'home' | 'settings';

export class Sidebar {
  private sidebarElement: HTMLElement | null = null;
  private overlayElement: HTMLElement | null = null;
  private isExpanded: boolean = true;
  private currentPage: Page = 'home';
  private onPageChange: (page: Page) => void;

  constructor(onPageChange: (page: Page) => void) {
    this.onPageChange = onPageChange;
  }

  render(): string {
    return `
      <!-- Overlay for mobile -->
      <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden hidden transition-opacity duration-300"></div>
      
      <!-- Sidebar -->
      <aside id="sidebar" class="fixed left-0 top-0 h-full bg-gray-900 text-white z-50 transition-all duration-300 ease-in-out ${
        this.isExpanded ? 'w-64' : 'w-20'
      }">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-700">
          ${this.isExpanded ? '<h2 class="text-xl font-bold">Navigation</h2>' : ''}
          <button 
            id="toggle-sidebar" 
            class="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            ${this.isExpanded ? CloseIcon('w-5 h-5') : MenuIcon('w-5 h-5')}
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="mt-4">
          <ul class="space-y-2 px-2">
            <li>
              <a 
                href="#" 
                data-page="home"
                class="nav-link flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors ${
                  this.currentPage === 'home' ? 'bg-gray-800' : ''
                }"
              >
                <span class="flex-shrink-0">${HomeIcon('w-6 h-6')}</span>
                ${this.isExpanded ? '<span class="font-medium">Accueil</span>' : ''}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                data-page="settings"
                class="nav-link flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors ${
                  this.currentPage === 'settings' ? 'bg-gray-800' : ''
                }"
              >
                <span class="flex-shrink-0">${SettingsIcon('w-6 h-6')}</span>
                ${this.isExpanded ? '<span class="font-medium">Paramètres</span>' : ''}
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    `;
  }

  mount(container: HTMLElement): void {
    container.innerHTML = this.render();
    
    this.sidebarElement = document.getElementById('sidebar');
    this.overlayElement = document.getElementById('sidebar-overlay');
    
    // Toggle sidebar button
    const toggleButton = document.getElementById('toggle-sidebar');
    toggleButton?.addEventListener('click', () => this.toggle());

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = (link as HTMLElement).dataset.page as Page;
        if (page) {
          this.navigateTo(page);
        }
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
    this.isExpanded = !this.isExpanded;
    this.update();
  }

  expand(): void {
    this.isExpanded = true;
    this.update();
  }

  collapse(): void {
    this.isExpanded = false;
    this.update();
  }

  navigateTo(page: Page): void {
    this.currentPage = page;
    this.onPageChange(page);
    this.update();
  }

  private update(): void {
    if (!this.sidebarElement) return;

    // Update sidebar width
    if (this.isExpanded) {
      this.sidebarElement.classList.remove('w-20');
      this.sidebarElement.classList.add('w-64');
    } else {
      this.sidebarElement.classList.remove('w-64');
      this.sidebarElement.classList.add('w-20');
    }

    // Update toggle button icon
    const toggleButton = document.getElementById('toggle-sidebar');
    if (toggleButton) {
      toggleButton.innerHTML = this.isExpanded 
        ? CloseIcon('w-5 h-5') 
        : MenuIcon('w-5 h-5');
    }

    // Update header text
    const header = this.sidebarElement.querySelector('h2');
    if (header) {
      header.textContent = this.isExpanded ? 'Navigation' : '';
    }

    // Update nav link text visibility
    const navTexts = this.sidebarElement.querySelectorAll('.nav-link span:last-child');
    navTexts.forEach(text => {
      const span = text as HTMLElement;
      span.style.display = this.isExpanded ? 'inline' : 'none';
    });

    // Update active state
    const navLinks = this.sidebarElement.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const page = (link as HTMLElement).dataset.page;
      if (page === this.currentPage) {
        link.classList.add('bg-gray-800');
      } else {
        link.classList.remove('bg-gray-800');
      }
    });

    // Update overlay visibility (mobile)
    if (this.overlayElement) {
      if (this.isExpanded && window.innerWidth < 1024) {
        this.overlayElement.classList.remove('hidden');
      } else {
        this.overlayElement.classList.add('hidden');
      }
    }
  }
}
