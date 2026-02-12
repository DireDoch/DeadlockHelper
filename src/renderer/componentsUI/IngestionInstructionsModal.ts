const INSTALL_COMMAND =
  'irm https://raw.githubusercontent.com/deadlock-api/deadlock-api-ingest/master/install-windows.ps1 | iex';

type ModalState = {
  acknowledged: boolean;
  copied: boolean;
  copyError: boolean;
};

let modalElement: HTMLDivElement | null = null;
let escapeHandler: ((event: KeyboardEvent) => void) | null = null;
let state: ModalState = {
  acknowledged: false,
  copied: false,
  copyError: false,
};

function canClose(): boolean {
  return state.acknowledged;
}

function closeModal(): void {
  if (!modalElement || !canClose()) return;

  modalElement.remove();
  modalElement = null;

  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }
}

async function handleCopyCommand(): Promise<void> {
  let copied = false;

  if (window.api?.copyToClipboard) {
    try {
      copied = (await window.api.copyToClipboard(INSTALL_COMMAND)) === true;
    } catch {
      copied = false;
    }
  }

  if (!copied && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      copied = true;
    } catch {
      copied = false;
    }
  }

  state = { ...state, copied, copyError: !copied };
  render();
}

function attachEvents(): void {
  if (!modalElement) return;

  const closeButtons = modalElement.querySelectorAll<HTMLButtonElement>('[data-ingestion-close]');
  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      closeModal();
    });
  });

  const checkbox = modalElement.querySelector<HTMLInputElement>('#ingestion-acknowledge-checkbox');
  checkbox?.addEventListener('change', (event) => {
    const target = event.currentTarget as HTMLInputElement;
    state = { ...state, acknowledged: target.checked };
    render();
  });

  const copyButton = modalElement.querySelector<HTMLButtonElement>('#ingestion-copy-command-btn');
  copyButton?.addEventListener('click', () => {
    handleCopyCommand();
  });

  modalElement.addEventListener('click', (event) => {
    if (event.target === modalElement && canClose()) {
      closeModal();
    }
  });
}

function getTemplate(): string {
  const closeDisabledAttr = canClose() ? '' : 'disabled';
  const closeDisabledClasses = canClose()
    ? 'text-grey-300 hover:text-white'
    : 'text-grey-600 cursor-not-allowed';

  return `
      <div class="w-full max-w-2xl rounded-xl border border-charcoal-200 bg-charcoal-300 shadow-xl overflow-hidden">
        <div class="flex items-start justify-between gap-3 px-5 py-4 border-b border-charcoal-200 bg-charcoal-200/60">
          <div>
            <h3 id="ingestion-modal-title" class="text-lg font-semibold text-white">
              Learn how to ingest your match data
            </h3>
            <p class="text-sm text-frosted-mint-500 mt-1">
              This feed powers all Deadlock stats sites.
            </p>
          </div>
          <button
            type="button"
            data-ingestion-close
            ${closeDisabledAttr}
            class="text-sm transition-colors ${closeDisabledClasses}"
            aria-label="Close ingestion guide"
          >
            Fermer
          </button>
        </div>

        <div class="px-5 py-4 space-y-4 text-base text-grey-900 max-h-[70vh] overflow-y-auto">
          <p class="leading-relaxed text-grey-900">
            Thank you for helping us migrate to community ingestion. While Valve has reduced API access to match
            data, the community ensures match statistics remain available.
          </p>

          <p class="text-sm font-semibold text-cream-500">Setup in 7 steps</p>

          <ol class="space-y-3">
            <li class="flex gap-3 rounded-lg border border-charcoal-100 bg-charcoal-200/70 p-3">
              <span class="h-6 w-6 shrink-0 rounded-full bg-cream-500/25 text-cream-500 text-xs font-semibold flex items-center justify-center">1</span>
              <span class="text-sm text-grey-900 leading-relaxed">Press <span class="font-semibold text-white">Win + X</span>, then <span class="font-semibold text-white">A</span>, and accept the prompt.</span>
            </li>
            <li class="flex gap-3 rounded-lg border border-charcoal-100 bg-charcoal-200/70 p-3">
              <span class="h-6 w-6 shrink-0 rounded-full bg-cream-500/25 text-cream-500 text-xs font-semibold flex items-center justify-center">2</span>
              <span class="text-sm text-grey-900 leading-relaxed">If nothing opens, search <span class="font-semibold text-white">PowerShell</span> as <span class="font-semibold text-white">Administrator</span> in Windows and launch it manually.</span>
            </li>
            <li class="flex gap-3 rounded-lg border border-charcoal-100 bg-charcoal-200/70 p-3">
              <span class="h-6 w-6 shrink-0 rounded-full bg-cream-500/25 text-cream-500 text-xs font-semibold flex items-center justify-center">3</span>
              <span class="text-sm text-grey-900 leading-relaxed">Copy and run this command:</span>
            </li>
          </ol>

          <div class="rounded-lg border border-charcoal-200 bg-charcoal-400 p-3">
            <code class="block text-xs text-frosted-mint-500 break-all leading-relaxed">${INSTALL_COMMAND}</code>
            <div class="mt-3 flex items-center gap-2">
              <button
                id="ingestion-copy-command-btn"
                type="button"
                class="text-xs px-3 py-2 rounded bg-cream-500/30 text-cream-500 hover:bg-cream-500/40 transition-colors font-semibold"
              >
                Copy command
              </button>
              <span class="text-xs ${
                state.copyError ? 'text-orange-300' : state.copied ? 'text-frosted-mint-500' : 'text-grey-400'
              }">
                ${
                  state.copyError
                    ? 'Copy failed. Please select the command manually.'
                    : state.copied
                      ? 'Command copied to clipboard.'
                      : 'Use copy/paste in your terminal.'
                }
              </span>
            </div>
          </div>

          <ol class="space-y-3" start="4">
            <li class="flex gap-3 rounded-lg border border-charcoal-100 bg-charcoal-200/70 p-3">
              <span class="h-6 w-6 shrink-0 rounded-full bg-cream-500/25 text-cream-500 text-xs font-semibold flex items-center justify-center">4</span>
              <span class="text-sm text-grey-900 leading-relaxed">Select your auto-update options with <span class="font-semibold text-white">Y</span> or <span class="font-semibold text-white">N</span>.</span>
            </li>
            <li class="flex gap-3 rounded-lg border border-charcoal-100 bg-charcoal-200/70 p-3">
              <span class="h-6 w-6 shrink-0 rounded-full bg-cream-500/25 text-cream-500 text-xs font-semibold flex items-center justify-center">5</span>
              <span class="text-sm text-grey-900 leading-relaxed">Keep the tool installed; it runs in the background and uploads data automatically.</span>
            </li>
            <li class="flex gap-3 rounded-lg border border-charcoal-100 bg-charcoal-200/70 p-3">
              <span class="h-6 w-6 shrink-0 rounded-full bg-cream-500/25 text-cream-500 text-xs font-semibold flex items-center justify-center">6</span>
              <span class="text-sm text-grey-900 leading-relaxed">After playing, restart Deadlock and open matches from the previous session.</span>
            </li>
            <li class="flex gap-3 rounded-lg border border-charcoal-100 bg-charcoal-200/70 p-3">
              <span class="h-6 w-6 shrink-0 rounded-full bg-cream-500/25 text-cream-500 text-xs font-semibold flex items-center justify-center">7</span>
              <span class="text-sm text-grey-900 leading-relaxed">Wait a few minutes for ingestion and cache propagation.</span>
            </li>
          </ol>

          <p class="text-xs text-grey-600 leading-relaxed">
            Important: The Deadlock API is an independent, community-run open source project. It is not developed by
            Valve or DeadlockHelper.
          </p>

          <label class="flex items-start gap-2 rounded-md border border-charcoal-100 bg-charcoal-200/80 p-3">
            <input
              id="ingestion-acknowledge-checkbox"
              type="checkbox"
              class="mt-0.5"
              ${state.acknowledged ? 'checked' : ''}
            />
            <span class="text-xs text-grey-800 leading-relaxed">
              I understand my match data may be incomplete or missing if I do not ingest my matches, and this impacts
              all tracking sites.
            </span>
          </label>
        </div>

        <div class="px-5 py-4 border-t border-charcoal-200 flex justify-end">
          <button
            type="button"
            data-ingestion-close
            ${closeDisabledAttr}
            class="text-xs px-3 py-2 rounded transition-colors ${
              canClose()
                ? 'bg-frosted-mint-500/20 text-frosted-mint-500 hover:bg-frosted-mint-500/30'
                : 'bg-charcoal-200 text-grey-500 cursor-not-allowed'
            }"
          >
            I acknowledge to continue
          </button>
        </div>
      </div>
  `;
}

function render(): void {
  if (!modalElement) return;
  modalElement.innerHTML = getTemplate();
  attachEvents();
}

export const IngestionInstructionsModal = {
  open(): void {
    if (modalElement) {
      render();
      return;
    }

    state = {
      acknowledged: false,
      copied: false,
      copyError: false,
    };

    modalElement = document.createElement('div');
    modalElement.id = 'ingestion-instructions-modal';
    modalElement.className = 'fixed inset-0 bg-black/65 flex items-center justify-center p-4';
    modalElement.style.zIndex = '999';
    modalElement.setAttribute('role', 'dialog');
    modalElement.setAttribute('aria-modal', 'true');
    modalElement.setAttribute('aria-labelledby', 'ingestion-modal-title');
    document.body.appendChild(modalElement);
    render();

    escapeHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', escapeHandler);
  },
};
