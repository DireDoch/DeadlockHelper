type GameStatus = {
  isRunning: boolean;
  inMatch: boolean;
  matchId: number | null;
  state?: 'GAME_CLOSED' | 'GAME_MENU' | 'GAME_IN_MATCH';
  timestamp: number;
};

const containerId = 'game-status-sticky';

function getStatusUi(status: GameStatus): { label: string; classes: string; dotClasses: string } {
  const state = status.state;

  const inMatch = state === 'GAME_IN_MATCH' || (!state && status.inMatch);
  const isRunning = state === 'GAME_MENU' || (!state && status.isRunning);

  if (inMatch) {
    return {
      label: 'En jeu',
      classes: 'text-frosted-mint-500 border-frosted-mint-500/40 bg-frosted-mint-500/10',
      dotClasses: 'bg-frosted-mint-500 animate-pulse',
    };
  }

  if (isRunning) {
    return {
      label: 'Deadlock lancé',
      classes: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
      dotClasses: 'bg-blue-400',
    };
  }

  return {
    label: 'Deadlock non lancé',
    classes: 'text-grey-300 border-grey-600 bg-charcoal-300',
    dotClasses: 'bg-grey-500',
  };
}

function renderContent(status: GameStatus): string {
  const ui = getStatusUi(status);
  const isClosed = status.state === 'GAME_CLOSED' || (!status.isRunning && !status.inMatch);

  const statusBadge = `
    <div
      class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold shadow-sm ${ui.classes}"
      title="${ui.label}"
    >
      <span class="w-2 h-2 rounded-full ${ui.dotClasses}"></span>
      <span>${ui.label}</span>
    </div>
  `;

  const launchBtn = isClosed ? `
    <button
      id="launch-deadlock-btn"
      type="button"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-frosted-mint-500/60 bg-frosted-mint-500/15 text-frosted-mint-400 text-xs font-bold shadow-md hover:bg-frosted-mint-500/25 hover:border-frosted-mint-400 transition-all duration-150 cursor-pointer"
      title="Lancer Deadlock avec les options configurées"
    >
      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
      </svg>
      Lancer Deadlock
    </button>
  ` : '';

  return `<div class="flex items-center gap-2">${launchBtn}${statusBadge}</div>`;
}

async function renderToContainer(): Promise<void> {
  const container = document.getElementById(containerId);
  if (!container) return;

  let status: GameStatus = {
    isRunning: false,
    inMatch: false,
    matchId: null,
    state: 'GAME_CLOSED',
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

function bindLaunchButton(): void {
  const btn = document.getElementById('launch-deadlock-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    btn.setAttribute('disabled', 'true');
    btn.classList.add('opacity-60');
    try {
      await (window.api as any).launchDeadlock?.();
    } catch (e) {
      console.error('[GameStatus] Failed to launch Deadlock:', e);
    }
    // Re-enable after 3s (Steam needs time to open)
    setTimeout(() => {
      btn.removeAttribute('disabled');
      btn.classList.remove('opacity-60');
    }, 3000);
  });
}

export const GameStatusIndicator = {
  containerId,

  mount(): void {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    container.innerHTML = '<div class="text-xs text-grey-400">...</div>';
    renderToContainer().then(() => bindLaunchButton());
  },

  refresh(): void {
    renderToContainer().then(() => bindLaunchButton());
  },
};
