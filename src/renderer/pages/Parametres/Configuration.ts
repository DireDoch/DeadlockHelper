/**
 * Configuration - Sub Page
 */

export class ConfigurationPage {
  private container: HTMLElement | null = null;
  private mockModeEnabled: boolean = false;

  mount(container: HTMLElement): void {
    this.container = container;
    this.loadMockModeState();
    this.render();
  }

  private async loadMockModeState(): Promise<void> {
    try {
      // Try to load from localStorage first (for quick access)
      const stored = localStorage.getItem('mockModeEnabled');
      if (stored !== null) {
        this.mockModeEnabled = stored === 'true';
      } else {
        // Fallback to IPC if not in localStorage
        if (window.api?.getMockMode) {
          this.mockModeEnabled = await window.api.getMockMode();
        }
      }
    } catch (error) {
      console.error('Failed to load mock mode state:', error);
    }
  }

  private async toggleMockMode(enabled: boolean): Promise<void> {
    try {
      this.mockModeEnabled = enabled;
      
      // Save to localStorage
      localStorage.setItem('mockModeEnabled', enabled.toString());
      
      // Sync with main process
      if (window.api?.setMockMode) {
        await window.api.setMockMode(enabled);
      }
      
      // Update UI
      this.updateToggleUI();
    } catch (error) {
      console.error('Failed to toggle mock mode:', error);
    }
  }

  private updateToggleUI(): void {
    const toggle = document.getElementById('mock-mode-toggle');
    const indicator = document.getElementById('mock-mode-indicator');
    
    if (toggle) {
      toggle.setAttribute('aria-checked', this.mockModeEnabled.toString());
      toggle.classList.toggle('bg-frosted-mint-500', this.mockModeEnabled);
      toggle.classList.toggle('bg-grey-600', !this.mockModeEnabled);
    }
    
    if (indicator) {
      indicator.textContent = this.mockModeEnabled ? 'Actif' : 'Inactif';
      indicator.classList.toggle('text-frosted-mint-500', this.mockModeEnabled);
      indicator.classList.toggle('text-grey-400', !this.mockModeEnabled);
    }
  }

  private render(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Configuration
          </h1>
          <p class="text-grey-300 mb-8">
            Langue, Thème, Chemins .exe et Authentification Steam.
          </p>
          
          <!-- Mode Démo Toggle -->
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white mb-2">
                  Mode Démo
                </h3>
                <p class="text-sm text-grey-400 mb-1">
                  Active les données fictives pour tester l'interface sans lancer Steam ou appeler l'API réelle.
                </p>
                <p class="text-xs text-grey-500">
                  <span id="mock-mode-indicator" class="font-semibold ${this.mockModeEnabled ? 'text-frosted-mint-500' : 'text-grey-400'}">
                    ${this.mockModeEnabled ? 'Actif' : 'Inactif'}
                  </span>
                </p>
              </div>
              <button
                id="mock-mode-toggle"
                role="switch"
                aria-checked="${this.mockModeEnabled}"
                aria-label="Toggle Mode Démo"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-frosted-mint-500 focus:ring-offset-2 focus:ring-offset-charcoal-200 ${
                  this.mockModeEnabled ? 'bg-frosted-mint-500' : 'bg-grey-600'
                }"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    this.mockModeEnabled ? 'translate-x-5' : 'translate-x-0'
                  }"
                ></span>
              </button>
            </div>
          </div>
          
          <!-- Other settings placeholder -->
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Autres paramètres à venir...
            </p>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const toggle = document.getElementById('mock-mode-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        this.toggleMockMode(!this.mockModeEnabled);
      });
    }
  }
}
