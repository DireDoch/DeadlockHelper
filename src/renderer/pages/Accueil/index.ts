/**
 * Page d'accueil avec test de l'API Deadlock
 * Permet de tester la récupération et l'affichage des données en temps réel
 */

export class AccueilPage {
  private container: HTMLElement | null = null;
  private isLoading = false;

  mount(container: HTMLElement): void {
    this.container = container;
    this.render();
  }

  private render(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-3xl font-bold text-frosted-mint-500 mb-6">
            Deadlock Helper - Test API
          </h1>
          
          <div class="bg-charcoal-200 rounded-lg p-6 mb-6">
            <p class="text-grey-300 mb-4">
              Cette page permet de tester la récupération des données depuis l'API Deadlock.
              Cliquez sur le bouton ci-dessous pour récupérer les items.
            </p>
            
            <button
              id="test-api-btn"
              class="px-6 py-3 bg-frosted-mint-500 text-charcoal-100 rounded-lg font-semibold hover:bg-frosted-mint-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tester l'API Deadlock
            </button>
          </div>
          
          <div id="loading-indicator" class="hidden mb-4">
            <div class="flex items-center gap-2 text-cream-500">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-cream-500"></div>
              <span>Chargement des données...</span>
            </div>
          </div>
          
          <div id="error-message" class="hidden mb-4 p-4 bg-charcoal-200 border border-grey-600 rounded-lg text-cream-500 whitespace-pre-line"></div>
          
          <div id="success-message" class="hidden mb-4 p-4 bg-charcoal-200 border border-dry-sage-500 rounded-lg text-frosted-mint-500"></div>
          
          <div id="results-container" class="bg-charcoal-200 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-frosted-mint-500 mb-4">
              Résultats
            </h2>
            <div id="results-content" class="text-grey-300">
              <p class="text-dry-sage-400">Aucune donnée récupérée pour le moment.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const testBtn = document.getElementById('test-api-btn');
    if (testBtn) {
      testBtn.addEventListener('click', () => this.handleTestApi());
    }
  }

  private async handleTestApi(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    this.updateUIState('loading');

    try {
      // Vérifier que l'API window est disponible
      if (!window.api || !window.api.executePython) {
        throw new Error('API Electron non disponible. Assurez-vous que preload.ts est correctement configuré.');
      }

      // Appeler le script Python via IPC
      const result = await window.api.executePython('items');

      if (result.success) {
        this.displayResults(result);
        this.updateUIState('success', `Données récupérées avec succès ! (${result.data?.returned_count || 0} items)`);
      } else {
        // Afficher les détails de l'erreur (chemin Python, etc.)
        let errorMsg = result.error || 'Erreur inconnue lors de la récupération des données';
        if (result.pythonScript) {
          errorMsg += `\n\nChemin Python: ${result.pythonScript}`;
        }
        if (result.workingDir) {
          errorMsg += `\nRépertoire de travail: ${result.workingDir}`;
        }
        if (result.stderr) {
          errorMsg += `\n\nDétails Python:\n${result.stderr}`;
        }
        this.updateUIState('error', errorMsg);
      }
    } catch (error: any) {
      console.error('Erreur lors du test API:', error);
      let errorMsg = error.message || 'Erreur lors de la communication avec le processus Python';
      if (error.pythonScript) {
        errorMsg += `\n\nChemin Python: ${error.pythonScript}`;
      }
      if (error.workingDir) {
        errorMsg += `\nRépertoire de travail: ${error.workingDir}`;
      }
      this.updateUIState('error', errorMsg);
    } finally {
      this.isLoading = false;
      this.updateUIState('idle');
    }
  }

  private updateUIState(state: 'loading' | 'success' | 'error' | 'idle', message?: string): void {
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const testBtn = document.getElementById('test-api-btn') as HTMLButtonElement;

    // Reset all states
    if (loadingIndicator) loadingIndicator.classList.add('hidden');
    if (errorMessage) {
      errorMessage.classList.add('hidden');
      errorMessage.textContent = '';
    }
    if (successMessage) {
      successMessage.classList.add('hidden');
      successMessage.textContent = '';
    }
    if (testBtn) {
      testBtn.disabled = false;
    }

    switch (state) {
      case 'loading':
        if (loadingIndicator) loadingIndicator.classList.remove('hidden');
        if (testBtn) testBtn.disabled = true;
        break;
      case 'success':
        if (successMessage) {
          successMessage.classList.remove('hidden');
          successMessage.textContent = message || 'Succès !';
        }
        break;
      case 'error':
        if (errorMessage) {
          errorMessage.classList.remove('hidden');
          errorMessage.textContent = message || 'Une erreur est survenue';
        }
        break;
      case 'idle':
        // Already reset above
        break;
    }
  }

  private displayResults(result: any): void {
    const resultsContent = document.getElementById('results-content');
    if (!resultsContent) return;

    const data = result.data;
    
    if (!data || !data.items || data.items.length === 0) {
      resultsContent.innerHTML = `
        <p class="text-dry-sage-400">Aucun item trouvé dans la réponse.</p>
        <pre class="mt-4 p-4 bg-charcoal-100 rounded text-xs overflow-auto">${JSON.stringify(result, null, 2)}</pre>
      `;
      return;
    }

    const itemsHtml = data.items.map((item: any) => `
      <div class="bg-charcoal-200 rounded-lg p-4 mb-3 border border-grey-600 hover:border-dry-sage-500 transition-colors">
        <div class="flex items-start gap-4">
          ${item.image_webp || item.image ? `
            <div class="shrink-0">
              <img 
                src="${item.image_webp || item.image}" 
                alt="${item.name || 'Item'}"
                class="w-20 h-20 object-cover rounded-lg border-2 border-grey-600 bg-charcoal-100"
                onerror="this.onerror=null; this.src='${item.image || ''}'; this.onerror=function(){this.style.display='none';}"
                loading="lazy"
              />
            </div>
          ` : `
            <div class="shrink-0 w-20 h-20 rounded-lg border-2 border-grey-600 bg-charcoal-100 flex items-center justify-center">
              <span class="text-grey-500 text-xs">No Image</span>
            </div>
          `}
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-frosted-mint-500 mb-2 wrap-break-words">
              ${item.name || 'Nom inconnu'}
            </h3>
            <div class="space-y-1">
              <p class="text-sm text-grey-300">
                <span class="text-dry-sage-400 font-medium">ID:</span> 
                <span class="text-cream-500">${item.id || 'N/A'}</span>
              </p>
              <p class="text-sm text-grey-300">
                <span class="text-dry-sage-400 font-medium">Class:</span> 
                <span class="text-grey-400">${item.class_name || 'N/A'}</span>
              </p>
              ${item.heroes && item.heroes.length > 0 ? `
                <p class="text-sm text-grey-300">
                  <span class="text-dry-sage-400 font-medium">Heroes:</span> 
                  <span class="text-frosted-mint-400">${item.heroes.length}</span>
                </p>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');

    resultsContent.innerHTML = `
      <div class="mb-6 p-4 bg-charcoal-100 rounded-lg border border-grey-700">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-dry-sage-400 font-medium">Total d'items disponibles:</span>
            <span class="text-frosted-mint-500 font-semibold ml-2">${data.total_count || 0}</span>
          </div>
          <div>
            <span class="text-dry-sage-400 font-medium">Items affichés:</span>
            <span class="text-cream-500 font-semibold ml-2">${data.returned_count || 0}</span>
          </div>
        </div>
      </div>
      <div class="space-y-3">
        ${itemsHtml}
      </div>
    `;
  }
}
