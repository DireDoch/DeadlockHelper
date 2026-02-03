/**
 * Settings - Main Page
 */

export class SettingsPage {
  private container: HTMLElement | null = null;

  mount(container: HTMLElement): void {
    this.container = container;
    this.render();
  }

  private render(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Settings
          </h1>
          <p class="text-grey-300 mb-8">
            Configuration de l'application, langue, thème, chemins système et intégrations.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Settings
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
