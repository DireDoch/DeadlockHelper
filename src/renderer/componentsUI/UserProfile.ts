/**
 * UserProfile - Sidebar widget for Steam connect state and avatar
 */

type SteamProfile = { steamId64: string; avatarUrl?: string; personaname?: string } | null;
type InstallationResult = { installed: boolean; path: string | null; error?: string };

const containerId = 'user-profile-placeholder';

function renderContent(
  profile: SteamProfile,
  installation: InstallationResult,
  isSidebarOpen: boolean,
): string {
  const isConnected = !!profile?.steamId64;
  const steamError = !installation.installed && installation.error;

  if (!isSidebarOpen) {
    if (isConnected && profile?.avatarUrl) {
      return `
        <div class="flex items-center justify-center" title="Prêt à analyser">
          <img src="${profile.avatarUrl}" alt="Profil Steam" class="w-8 h-8 rounded-full border-2 border-grey-600 object-cover" />
        </div>
      `;
    }
    return `
      <div class="flex items-center justify-center" title="Se connecter avec Steam">
        <div class="w-8 h-8 rounded-full bg-charcoal-300 border-2 border-grey-600 flex items-center justify-center">
          <span class="text-grey-500 text-xs">?</span>
        </div>
      </div>
    `;
  }

  if (isConnected) {
    return `
      <div class="flex items-center gap-3">
        ${profile?.avatarUrl
          ? `<img src="${profile.avatarUrl}" alt="Profil Steam" class="w-10 h-10 rounded-full border-2 border-grey-600 object-cover shrink-0" />`
          : `<div class="w-10 h-10 rounded-full bg-charcoal-300 border-2 border-grey-600 flex items-center justify-center shrink-0"><span class="text-grey-500 text-sm">?</span></div>`
        }
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-white truncate">${profile?.personaname || 'Steam'}</p>
          <p class="text-xs text-frosted-mint-500">Prêt à analyser</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="space-y-2">
      ${steamError ? `<p class="text-xs text-orange-500">${installation.error}</p>` : ''}
      <button
        id="user-profile-connect-btn"
        type="button"
        class="w-full px-3 py-2 rounded-lg bg-charcoal-300 text-frosted-mint-500 text-sm font-medium hover:bg-charcoal-400 hover:text-frosted-mint-400 transition-colors border border-grey-600"
      >
        Se connecter avec Steam
      </button>
    </div>
  `;
}

async function renderToContainer(): Promise<void> {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isOpen = document.getElementById('sidebar')?.classList.contains('w-64') ?? true;
  let profile: SteamProfile = null;
  let installation: InstallationResult = { installed: false, path: null };

  try {
    if (window.api?.steamGetProfile) {
      profile = await window.api.steamGetProfile();
    }
    if (window.api?.steamCheckInstallation) {
      installation = await window.api.steamCheckInstallation();
    }
  } catch {
    // keep defaults
  }

  container.innerHTML = renderContent(profile, installation, isOpen);

  const connectBtn = document.getElementById('user-profile-connect-btn');
  if (connectBtn) {
    connectBtn.addEventListener('click', async () => {
      if (!window.api?.steamStartAuth) return;
      (connectBtn as HTMLButtonElement).disabled = true;
      try {
        const result = await window.api.steamStartAuth();
        if (result.success) {
          await renderToContainer();
        } else {
          if (!(result as { cancelled?: boolean }).cancelled && result.error) {
            const isAlreadyInProgress = result.error.includes('déjà en cours');
            if (!isAlreadyInProgress) console.error('Steam auth error:', result.error);
          }
          await renderToContainer();
        }
      } finally {
        (connectBtn as HTMLButtonElement).disabled = false;
      }
    });
  }
}

export const UserProfile = {
  containerId,

  mount(): void {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    container.innerHTML = '<div class="text-sm text-grey-500">…</div>';
    renderToContainer();
  },

  refresh(): void {
    renderToContainer();
  },
};
