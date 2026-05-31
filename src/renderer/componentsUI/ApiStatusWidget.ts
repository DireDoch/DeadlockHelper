/**
 * ApiStatusWidget - Persistent sidebar widget showing API availability diagnostic
 */

let lastAvailability = 100;

function renderContent(availability: number, isOpen: boolean): string {
  const isHealthy = availability >= 100;
  const statusClass = isHealthy ? 'text-frosted-mint-500' : (availability >= 90 ? 'text-yellow-500' : 'text-orange-500');
  const statusLabel = isHealthy ? 'OK' : 'Degradé';
  const dotClass = isHealthy ? 'bg-frosted-mint-500' : (availability >= 90 ? 'bg-yellow-500' : 'bg-orange-500');

  if (!isOpen) {
    return `
      <div class="w-full flex items-center justify-center gap-1" title="API ${availability}%">
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
}

export const ApiStatusWidget = {
  containerId: 'api-status-placeholder',
  refreshButtonId: 'api-status-refresh-btn',

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
