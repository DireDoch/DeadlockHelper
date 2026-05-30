/**
 * Configuration - Sub Page
 */

import { UserProfile } from '../../componentsUI/UserProfile';
import type { OverlaySettings } from '../../../lib/types';

type SteamProfile = { steamId64: string; avatarUrl?: string; personaname?: string } | null;

const DEFAULT_OVERLAY: OverlaySettings = {
  corner: 'center-right',
  opacity: 0.25,
  logPath: '',
  showSoulsPerMin: true,
  showMidBossTimer: true,
  showUrnTimer: true,
  showItemSuggestions: true,
};

export class ConfigurationPage {
  private container: HTMLElement | null = null;
  private demoModeEnabled = false;
  private steamProfile: SteamProfile = null;
  private overlaySettings: OverlaySettings = { ...DEFAULT_OVERLAY };

  mount(container: HTMLElement): void {
    this.container = container;
    this.container.addEventListener('click', this.boundHandleContainerClick);
    Promise.all([
      this.loadDemoModeState(),
      this.loadSteamProfile(),
      this.loadOverlaySettings(),
    ]).then(() => this.render());
  }

  /** Called when Steam profile is updated (e.g. after login) so the page re-renders with new data. */
  refresh(): void {
    if (!this.container) return;
    Promise.all([
      this.loadDemoModeState(),
      this.loadSteamProfile(),
      this.loadOverlaySettings(),
    ]).then(() => this.render());
  }

  private boundHandleContainerClick = (e: Event): void => {
    const target = e.target as HTMLElement;
    if (target.closest('#steam-connect-btn')) {
      this.handleSteamStartAuth();
    } else if (target.closest('#steam-disconnect-btn')) {
      this.handleSteamLogout();
    }
  };

  private async loadSteamProfile(): Promise<void> {
    try {
      if (window.api?.steamGetProfile) {
        this.steamProfile = await window.api.steamGetProfile();
      }
    } catch (error) {
      console.error('Failed to load Steam profile:', error);
    }
  }

  private async loadOverlaySettings(): Promise<void> {
    try {
      const s = await (window.api as any).getOverlaySettings?.();
      if (s) this.overlaySettings = s;
    } catch {
      // not yet wired — use defaults
    }
  }

  private async saveOverlaySettings(): Promise<void> {
    try {
      await (window.api as any).updateOverlaySettings?.(this.overlaySettings);
    } catch {
      // ignore
    }
  }

  private async loadDemoModeState(): Promise<void> {
    try {
      const stored = localStorage.getItem('demoModeEnabled');
      if (stored !== null) {
        this.demoModeEnabled = stored === 'true';
      } else {
        // Migrate old mockModeEnabled key if present
        const legacy = localStorage.getItem('mockModeEnabled');
        if (legacy !== null) {
          this.demoModeEnabled = legacy === 'true';
          localStorage.setItem('demoModeEnabled', legacy);
          localStorage.removeItem('mockModeEnabled');
        }
      }
    } catch (error) {
      console.error('Failed to load demo mode state:', error);
    }
  }

  private async toggleDemoMode(enabled: boolean): Promise<void> {
    try {
      this.demoModeEnabled = enabled;
      localStorage.setItem('demoModeEnabled', enabled.toString());
      this.updateToggleUI();
    } catch (error) {
      console.error('Failed to toggle demo mode:', error);
    }
  }

  private updateToggleUI(): void {
    const toggle = document.getElementById('mock-mode-toggle');
    const indicator = document.getElementById('mock-mode-indicator');

    if (toggle) {
      toggle.setAttribute('aria-checked', this.demoModeEnabled.toString());
      toggle.classList.toggle('bg-frosted-mint-500', this.demoModeEnabled);
      toggle.classList.toggle('bg-grey-600', !this.demoModeEnabled);
    }

    if (indicator) {
      indicator.textContent = this.demoModeEnabled ? 'Actif' : 'Inactif';
      indicator.classList.toggle('text-frosted-mint-500', this.demoModeEnabled);
      indicator.classList.toggle('text-grey-400', !this.demoModeEnabled);
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
                  Simule une partie en utilisant de vrais Match IDs (80659633, 83547202, 80457157). Le bouton Refresh dans le Live Dashboard fait défiler cycliquement ces parties.
                </p>
                <p class="text-xs text-grey-500">
                  <span id="mock-mode-indicator" class="font-semibold ${this.demoModeEnabled ? 'text-frosted-mint-500' : 'text-grey-400'}">
                    ${this.demoModeEnabled ? 'Actif' : 'Inactif'}
                  </span>
                </p>
              </div>
              <button
                id="mock-mode-toggle"
                role="switch"
                aria-checked="${this.demoModeEnabled}"
                aria-label="Toggle Mode Démo"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-frosted-mint-500 focus:ring-offset-2 focus:ring-offset-charcoal-200 ${
                  this.demoModeEnabled ? 'bg-frosted-mint-500' : 'bg-grey-600'
                }"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    this.demoModeEnabled ? 'translate-x-5' : 'translate-x-0'
                  }"
                ></span>
              </button>
            </div>
          </div>
          
          <!-- Compte Steam -->
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600 mb-6">
            <h3 class="text-lg font-semibold text-white mb-2">
              Compte Steam
            </h3>
            <p class="text-sm text-grey-400 mb-4">
              Connectez-vous avec Steam pour que l'application puisse afficher vos statistiques automatiquement.
            </p>
            <div id="steam-account-block">
              ${this.steamProfile?.steamId64
                ? `
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  ${this.steamProfile.avatarUrl
                    ? `<img src="${this.steamProfile.avatarUrl}" alt="Profil" class="w-12 h-12 rounded-full border-2 border-grey-600 object-cover" />`
                    : `<div class="w-12 h-12 rounded-full bg-charcoal-300 border-2 border-grey-600 flex items-center justify-center"><span class="text-grey-500">?</span></div>`
                  }
                  <div>
                    <p class="text-white font-medium">${this.steamProfile.personaname || 'Compte Steam'}</p>
                    <p class="text-xs text-grey-500">ID: ${this.steamProfile.steamId64}</p>
                  </div>
                </div>
                <button id="steam-disconnect-btn" type="button" class="shrink-0 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors border border-red-500 text-sm font-medium">
                  Se déconnecter
                </button>
              </div>
              `
                : `
              <button id="steam-connect-btn" type="button" class="px-4 py-2 rounded-lg bg-charcoal-300 text-frosted-mint-500 hover:bg-charcoal-400 hover:text-frosted-mint-400 transition-colors border border-grey-600 text-sm font-medium">
                Se connecter avec Steam
              </button>
              `
              }
            </div>
          </div>
          
          <!-- Overlay In-Game -->
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <h3 class="text-lg font-semibold text-white mb-1">Overlay In-Game</h3>
            <p class="text-sm text-grey-400 mb-4">
              Apparaît automatiquement quand Deadlock est lancé.
              Requiert <code class="text-frosted-mint-400">-condebug</code> dans les launch options Steam
              et le mode <strong class="text-white">Borderless Windowed</strong> dans le jeu.
            </p>

            <!-- Corner -->
            <div class="mb-4">
              <label class="block text-sm text-grey-300 mb-2">Position</label>
              <div class="grid grid-cols-2 gap-2 w-48">
                ${(['center-right','top-right','top-left','bottom-right'] as const).map((c) => `
                  <button
                    data-ov-corner="${c}"
                    class="px-3 py-1.5 rounded text-xs border transition-colors ${
                      this.overlaySettings.corner === c
                        ? 'border-frosted-mint-500 text-frosted-mint-400 bg-frosted-mint-500/10'
                        : 'border-grey-600 text-grey-400 hover:border-grey-400'
                    }"
                  >${c.replace('-', ' ')}</button>
                `).join('')}
              </div>
            </div>

            <!-- Opacity -->
            <div class="mb-4">
              <label class="block text-sm text-grey-300 mb-2">
                Opacité du fond — <span id="ov-opacity-label">${Math.round(this.overlaySettings.opacity * 100)}%</span>
              </label>
              <input
                id="ov-opacity-slider"
                type="range" min="20" max="90" step="5"
                value="${Math.round(this.overlaySettings.opacity * 100)}"
                class="w-48 accent-frosted-mint-500"
              />
            </div>

            <!-- Log path -->
            <div class="mb-4">
              <label class="block text-sm text-grey-300 mb-1">Chemin console.log Deadlock</label>
              <p class="text-xs text-grey-500 mb-2">Laissez vide pour l'auto-détection (Linux / Windows).</p>
              <input
                id="ov-log-path"
                type="text"
                value="${this.overlaySettings.logPath}"
                placeholder="Auto-détecté…"
                class="w-full bg-charcoal-300 border border-grey-600 rounded px-3 py-2 text-sm text-white placeholder-grey-600 focus:outline-none focus:border-frosted-mint-500"
              />
            </div>

            <!-- Component toggles -->
            <div class="mb-4">
              <label class="block text-sm text-grey-300 mb-2">Composants affichés</label>
              <div class="flex flex-col gap-2">
                ${([
                  ['showSoulsPerMin',      'Souls / min (placeholder)'],
                  ['showMidBossTimer',     'Mid Boss Timer'],
                  ['showUrnTimer',         'Urn Timer'],
                  ['showItemSuggestions',  'Item Suggestions'],
                ] as const).map(([key, label]) => `
                  <label class="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      data-ov-toggle="${key}"
                      ${this.overlaySettings[key] ? 'checked' : ''}
                      class="w-4 h-4 accent-frosted-mint-500 cursor-pointer"
                    />
                    <span class="text-sm text-grey-300">${label}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- OS info -->
            <p class="text-xs text-grey-600">
              OS détecté : <span class="text-grey-400">${
                (window.api as any).platform === 'linux' ? 'Linux (par défaut)'
                : (window.api as any).platform === 'win32' ? 'Windows'
                : (window.api as any).platform ?? 'Inconnu'
              }</span>
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
        this.toggleDemoMode(!this.demoModeEnabled);
      });
    }

    // Overlay: corner buttons
    document.querySelectorAll<HTMLButtonElement>('[data-ov-corner]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.overlaySettings.corner = btn.dataset.ovCorner as OverlaySettings['corner'];
        this.saveOverlaySettings();
        this.render();
      });
    });

    // Overlay: opacity slider
    const slider = document.getElementById('ov-opacity-slider') as HTMLInputElement | null;
    const label = document.getElementById('ov-opacity-label');
    slider?.addEventListener('input', () => {
      const val = Number(slider.value);
      if (label) label.textContent = `${val}%`;
      this.overlaySettings.opacity = val / 100;
      this.saveOverlaySettings();
    });

    // Overlay: log path
    const logInput = document.getElementById('ov-log-path') as HTMLInputElement | null;
    logInput?.addEventListener('change', () => {
      this.overlaySettings.logPath = logInput.value.trim();
      this.saveOverlaySettings();
    });

    // Overlay: component toggles
    document.querySelectorAll<HTMLInputElement>('[data-ov-toggle]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const key = cb.dataset.ovToggle as keyof OverlaySettings;
        (this.overlaySettings as any)[key] = cb.checked;
        this.saveOverlaySettings();
      });
    });

    // Steam buttons are handled via delegation in boundHandleContainerClick (mount)
  }

  private async handleSteamLogout(): Promise<void> {
    try {
      if (window.api?.steamLogout) {
        await window.api.steamLogout();
      }
      // UI refresh is driven by steam:profile-updated from main (same as login)
    } catch (error) {
      console.error('Steam logout failed:', error);
    }
  }

  private async handleSteamStartAuth(): Promise<void> {
    try {
      if (!window.api?.steamStartAuth) return;
      const result = await window.api.steamStartAuth();
      if (result.success) {
        await this.loadSteamProfile();
        this.render();
        UserProfile.refresh();
      }
    } catch (error) {
      console.error('Steam auth failed:', error);
    }
  }
}
