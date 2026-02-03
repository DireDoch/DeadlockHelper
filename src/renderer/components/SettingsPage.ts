/**
 * Settings Page Component
 */

export class SettingsPage {
  render(): string {
    return `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-5xl font-bold text-white mb-4">
            Paramètres
          </h1>
          <p class="text-xl text-grey-300 mt-4">
            Gérez les paramètres de votre application.
          </p>
          <div class="mt-8 space-y-4">
            <div class="p-6 bg-charcoal-200 rounded-lg border border-grey-600">
              <h2 class="text-xl font-semibold text-white mb-2">
                Paramètres généraux
              </h2>
              <p class="text-grey-300">
                Configurez les options générales de l'application.
              </p>
            </div>
            <div class="p-6 bg-charcoal-200 rounded-lg border border-grey-600">
              <h2 class="text-xl font-semibold text-white mb-2">
                Préférences
              </h2>
              <p class="text-grey-300">
                Personnalisez votre expérience utilisateur.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  mount(container: HTMLElement): void {
    container.innerHTML = this.render();
  }
}
