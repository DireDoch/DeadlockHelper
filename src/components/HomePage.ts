/**
 * Home Page Component
 */

export class HomePage {
  render(): string {
    return `
      <div class="p-8">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Accueil
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mt-4">
          Bienvenue sur la page d'accueil de votre application Electron.
        </p>
        <div class="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 class="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Test de Tailwind CSS
          </h2>
          <p class="text-blue-700 dark:text-blue-300">
            Cette page démontre l'utilisation de Tailwind CSS dans votre application Electron.
            Les styles sont appliqués avec des classes utilitaires.
          </p>
        </div>
      </div>
    `;
  }

  mount(container: HTMLElement): void {
    container.innerHTML = this.render();
  }
}
