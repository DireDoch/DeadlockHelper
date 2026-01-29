/**
 * Settings Page Component
 */

export class SettingsPage {
  render(): string {
    return `
      <div class="p-8">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Paramètres
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mt-4">
          Gérez les paramètres de votre application.
        </p>
        <div class="mt-8 space-y-4">
          <div class="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Paramètres généraux
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              Configurez les options générales de l'application.
            </p>
          </div>
          <div class="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Préférences
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              Personnalisez votre expérience utilisateur.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  mount(container: HTMLElement): void {
    container.innerHTML = this.render();
  }
}
