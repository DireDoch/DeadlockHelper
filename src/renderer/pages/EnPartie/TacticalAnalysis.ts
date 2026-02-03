/**
 * Tactical Analysis - Sub Page
 */

export class TacticalAnalysisPage {
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
            Tactical Analysis
          </h1>
          <p class="text-grey-300 mb-8">
            Behavior Tags (Python) et Recommandeur d'items (Contres).
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Tactical Analysis
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
