/**
 * Home Page Component
 */

export class HomePage {
  render(): string {
    return `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-5xl font-bold text-white mb-4">
            Accueil
          </h1>
          <p class="text-xl text-grey-300 mt-4">
            Bienvenue sur la page d'accueil de votre application Electron.
          </p>
          <div class="mt-8 p-6 bg-charcoal-200 rounded-lg border border-grey-600">
            <h2 class="text-2xl font-semibold text-frosted-mint-500 mb-2">
              Test de Tailwind CSS
            </h2>
            <p class="text-grey-300">
              Cette page démontre l'utilisation de Tailwind CSS dans votre application Electron.
              Les styles sont appliqués avec des classes utilitaires.
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
