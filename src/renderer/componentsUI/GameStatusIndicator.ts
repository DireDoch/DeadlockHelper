type GameStatus = {
  isRunning: boolean;
  inMatch: boolean;
  matchId: number | null;
  timestamp: number;
};

const containerId = 'game-status-sticky';

function getStatusUi(status: GameStatus): { label: string; classes: string; dotClasses: string } {
  if (status.inMatch) {
    return {
      label: 'En jeu',
      classes: 'text-frosted-mint-500 border-frosted-mint-500/40 bg-frosted-mint-500/10',
      dotClasses: 'bg-frosted-mint-500',
    };
  }

  if (status.isRunning) {
    return {
      label: 'Deadlock lance',
      classes: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
      dotClasses: 'bg-blue-400',
    };
  }

  return {
    label: 'Deadlock non lance',
    classes: 'text-grey-300 border-grey-600 bg-charcoal-300',
    dotClasses: 'bg-grey-500',
  };
}

function renderContent(status: GameStatus): string {
  const ui = getStatusUi(status);

  return `
    <button
      type="button"
      class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold shadow-sm ${ui.classes}"
      title="${ui.label}"
      aria-label="${ui.label}"
    >
      <span class="w-2 h-2 rounded-full ${ui.dotClasses}"></span>
      <span>${ui.label}</span>
    </button>
  `;
}

async function renderToContainer(): Promise<void> {
  const container = document.getElementById(containerId);
  if (!container) return;

  let status: GameStatus = {
    isRunning: false,
    inMatch: false,
    matchId: null,
    timestamp: Date.now(),
  };

  try {
    if (window.api?.getGameStatus) {
      status = await window.api.getGameStatus();
    }
  } catch {
    // Keep default status in UI.
  }

  container.innerHTML = renderContent(status);
}

export const GameStatusIndicator = {
  containerId,

  mount(): void {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    container.innerHTML = '<div class="text-xs text-grey-400">...</div>';
    renderToContainer();
  },

  refresh(): void {
    renderToContainer();
  },
};
