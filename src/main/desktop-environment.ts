/**
 * Minimal desktop-environment detection for the main process.
 *
 * The overlay keep-above bypass (see kwin-overlay-rule.ts) is only meaningful on
 * KDE Plasma + Wayland: that is the one environment where Electron's
 * `setAlwaysOnTop` cannot keep a frameless window above a focused borderless
 * game, because the Wayland protocol forbids clients from managing their own
 * stacking. We detect that specific environment from the standard freedesktop
 * session variables set by the login/session manager.
 *
 * Detection inputs:
 *   XDG_SESSION_TYPE     → 'wayland' | 'x11' | 'tty'
 *   XDG_CURRENT_DESKTOP  → ':'-separated desktop list; contains 'KDE' under Plasma
 *   KDE_SESSION_VERSION  → '6' on Plasma 6 — selects the `qdbus6` binary (Plasma 5
 *                          shipped `qdbus`, Plasma 6 ships `qdbus6`)
 */

export interface DesktopEnvironment {
  isLinux: boolean;
  sessionType: 'wayland' | 'x11' | 'unknown';
  /** Raw XDG_CURRENT_DESKTOP, lower-cased (e.g. 'kde', 'hyprland', 'gnome') */
  desktop: string;
  isKde: boolean;
  isWayland: boolean;
  /** The only environment where the KWin keep-above rule applies */
  isKdeWayland: boolean;
  kdeSessionVersion: number | null;
  /** Preferred qdbus binary for this Plasma generation ('qdbus6' on Plasma 6) */
  qdbusBin: 'qdbus6' | 'qdbus';
}

export function detectDesktopEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): DesktopEnvironment {
  const isLinux = process.platform === 'linux';

  const rawSession = (env.XDG_SESSION_TYPE ?? '').toLowerCase();
  const sessionType: DesktopEnvironment['sessionType'] =
    rawSession === 'wayland' ? 'wayland' : rawSession === 'x11' ? 'x11' : 'unknown';

  const desktop = (env.XDG_CURRENT_DESKTOP ?? '').toLowerCase();
  const isKde = /kde/.test(desktop);
  const isWayland = sessionType === 'wayland';

  const parsedVersion = env.KDE_SESSION_VERSION ? Number(env.KDE_SESSION_VERSION) : NaN;
  const kdeSessionVersion = Number.isFinite(parsedVersion) ? parsedVersion : null;

  return {
    isLinux,
    sessionType,
    desktop,
    isKde,
    isWayland,
    isKdeWayland: isLinux && isKde && isWayland,
    kdeSessionVersion,
    qdbusBin: kdeSessionVersion != null && kdeSessionVersion >= 6 ? 'qdbus6' : 'qdbus',
  };
}
