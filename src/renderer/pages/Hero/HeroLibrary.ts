/**
 * Hero Library - Sub Page
 */

export class HeroLibraryPage {
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
            Hero Library
          </h1>
          <p class="text-grey-300 mb-8">
            Barre de recherche dynamique et cartes de héros.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Hero Library
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
