/**
 * ApiStatusWidget - Persistent sidebar widget showing API availability diagnostic
 */

import { IngestionInstructionsModal } from './IngestionInstructionsModal';

let lastAvailability = 100;

function renderContent(availability: number, isOpen: boolean): string {
  const isHealthy = availability >= 100;
  const statusClass = isHealthy ? 'text-frosted-mint-500' : (availability >= 90 ? 'text-yellow-500' : 'text-orange-500');
  const statusLabel = isHealthy ? 'OK' : 'Degradé';
  const dotClass = isHealthy ? 'bg-frosted-mint-500' : (availability >= 90 ? 'bg-yellow-500' : 'bg-orange-500');

  if (!isOpen) {
    return `
      <div class="flex items-center justify-center gap-1" title="API ${availability}%">
        <span class="w-2 h-2 rounded-full ${dotClass} shrink-0"></span>
      </div>
    `;
  }

  return `
    <div class="flex items-center gap-2 flex-wrap">
      <span class="w-2 h-2 rounded-full ${dotClass} shrink-0" aria-hidden="true"></span>
      <span class="text-sm text-grey-300">API</span>
      <span class="text-sm font-medium ${statusClass}">${availability}%</span>
      <span class="text-xs text-grey-400">${statusLabel}</span>
      <button
        id="api-status-refresh-btn"
        class="text-xs px-2 py-1 rounded bg-charcoal-300 text-grey-300 hover:text-frosted-mint-500 hover:bg-charcoal-400 transition-colors"
        type="button"
      >Vérifier</button>
      <div class="relative group">
        <button
          id="api-ingestion-help-trigger"
          class="text-xs font-semibold px-2 py-1 rounded border border-yellow-400/50 bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25 hover:text-yellow-200 transition-colors animate-pulse"
          type="button"
          aria-label="Open ingestion instructions"
        >Ingestion required for full match history</button>
        <div
          class="invisible opacity-0 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto absolute left-0 top-full mt-2 w-80 rounded-lg border border-yellow-400/40 bg-charcoal-100 p-3 shadow-xl z-50 transition-all duration-150"
          role="tooltip"
        >
          <p class="text-xs text-white leading-relaxed mb-3">
            Even with a healthy API, your personal matches can stay missing until ingestion is configured.
            Enable it to unlock complete tracking and history pages.
          </p>
          <button
            id="api-ingestion-open-btn"
            class="w-full text-xs font-semibold px-3 py-2 rounded bg-frosted-mint-500/25 text-frosted-mint-500 hover:bg-frosted-mint-500/35 transition-colors"
            type="button"
          >Learn how to ingest now</button>
        </div>
      </div>
    </div>
  `;
}

function renderToContainer(availability: number): void {
  lastAvailability = availability;
  const container = document.getElementById(ApiStatusWidget.containerId);
  if (!container) return;
  const isOpen = document.getElementById('sidebar')?.classList.contains('w-64') ?? true;
  container.innerHTML = renderContent(availability, isOpen);
  const btn = document.getElementById(ApiStatusWidget.refreshButtonId);
  btn?.addEventListener('click', () => {
    window.api?.triggerHealthCheck?.();
  });

  const openIngestionBtn = document.getElementById(ApiStatusWidget.ingestionOpenButtonId);
  openIngestionBtn?.addEventListener('click', () => {
    IngestionInstructionsModal.open();
  });

  const ingestionTrigger = document.getElementById(ApiStatusWidget.ingestionTriggerButtonId);
  ingestionTrigger?.addEventListener('click', () => {
    IngestionInstructionsModal.open();
  });
}

export const ApiStatusWidget = {
  containerId: 'api-status-placeholder',
  refreshButtonId: 'api-status-refresh-btn',
  ingestionOpenButtonId: 'api-ingestion-open-btn',
  ingestionTriggerButtonId: 'api-ingestion-help-trigger',

  mount(): void {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    container.innerHTML = '<div class="text-sm text-grey-500">…</div>';
    window.api?.getApiAvailability?.().then((av: number) => renderToContainer(av)).catch(() => renderToContainer(100));

    if (window.api?.onHealthStatusChange) {
      window.api.onHealthStatusChange((availability: number) => renderToContainer(availability));
    }
  },

  refresh(): void {
    renderToContainer(lastAvailability);
  },
};
