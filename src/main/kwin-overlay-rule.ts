/**
 * KWin window-rule installer — the "keep overlay above the game" bypass for
 * KDE Plasma + Wayland.
 *
 * Why this exists
 * ---------------
 * On Wayland, a client cannot manage its own stacking order, so Electron's
 * `setAlwaysOnTop` is silently ignored and the overlay drops behind the game
 * window when the game takes focus. The canonical KDE fix is a KWin *window
 * rule* that forces `keepAbove` on the overlay window. KWin reads these rules
 * from `~/.config/kwinrulesrc` and re-applies them on `reconfigure`.
 *
 * Design decisions (see docs/ESP_FINAL/GAME_OVERLAY.md):
 *  - Match on window TITLE ("Deadlock Overlay"), not wmclass/app_id: on Wayland
 *    the app_id is shared by every window in the process, so a class match would
 *    also pin/de-focus the main app window. The title is per-window and distinct
 *    (set in overlay-window.ts).
 *  - Force ONLY `keepAbove`. The plan's `acceptfocus=false`/`fsplevel=4` solve the
 *    opposite (overlay stealing focus) and risk breaking the drag handle / Mid
 *    Boss click path, so they are intentionally omitted.
 *  - Use a FIXED group id ("deadlockhelper-overlay") rather than a random UUID so
 *    install is idempotent and removal is trivial.
 *  - Back up an existing kwinrulesrc once before mutating it; write atomically.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { detectDesktopEnvironment, type DesktopEnvironment } from './desktop-environment';

// ── Rule constants ──────────────────────────────────────────────────────────

// KWin's numeric encodings as written in kwinrulesrc:
//   *match keys (window matching):  0=Unimportant 1=Exact 2=Substring 3=RegExp
//   *rule  keys (rule application):  1=DontAffect 2=Force 3=Apply 4=Remember ...
const MATCH_SUBSTRING = 2;
const FORCE = 2;

/** Window title set on the overlay BrowserWindow (see overlay-window.ts) */
const OVERLAY_TITLE = 'Deadlock Overlay';

/** Deadlock's window class under Proton — Steam sets steam_app_<AppID>; 1422450 = Deadlock */
const GAME_WMCLASS = 'steam_app_1422450';

interface RuleDef {
  /** Stable group id in kwinrulesrc — makes install idempotent and removal trivial */
  id: string;
  /** Ordered key/value pairs written verbatim into the rule's INI group */
  keys: Array<[string, string]>;
}

/**
 * The KWin rules we manage. TWO rules are needed to actually keep the overlay
 * visible over the game:
 *
 *  1. `deadlockhelper-overlay` — force keepAbove on the overlay window (matched
 *     by its unique title), so it floats above normal windows.
 *  2. `deadlockhelper-game` — force the Deadlock window to NOT be fullscreen.
 *     Otherwise, when the game is the *active fullscreen* window, KWin promotes
 *     it to the `Active` stacking layer, which sits ABOVE the `Above` (keepAbove)
 *     layer and hides the overlay. Forcing fullscreen off keeps the game in the
 *     `Normal` layer so the overlay's `Above` layer wins — even when the game is
 *     focused. (Requires Borderless/Windowed; exclusive fullscreen is unsupported
 *     on Wayland.)
 */
const RULES: RuleDef[] = [
  {
    id: 'deadlockhelper-overlay',
    keys: [
      ['Description', 'DeadlockHelper Overlay keep-above (auto-generated)'],
      ['above', 'true'],
      ['aboverule', String(FORCE)],
      ['title', OVERLAY_TITLE],
      ['titlematch', String(MATCH_SUBSTRING)],
    ],
  },
  {
    id: 'deadlockhelper-game',
    keys: [
      ['Description', 'DeadlockHelper — Deadlock windowed, no fullscreen layer (auto-generated)'],
      ['wmclass', GAME_WMCLASS],
      ['wmclassmatch', String(MATCH_SUBSTRING)],
      ['fullscreen', 'false'],
      ['fullscreenrule', String(FORCE)],
    ],
  },
];

const RULE_IDS = RULES.map((r) => r.id);

// ── Public API ──────────────────────────────────────────────────────────────

export interface KwinRuleStatus {
  /** True only on KDE Plasma + Wayland — the UI shows the fix only when true */
  applicable: boolean;
  /** True when our rule group is present in kwinrulesrc */
  installed: boolean;
  rulesPath: string;
  /** Human-readable reason when not applicable (shown in the UI) */
  reason?: string;
}

export interface KwinRuleResult {
  success: boolean;
  installed: boolean;
  error?: string;
  backupPath?: string;
}

/** Report whether the fix applies to this machine and whether it is installed. */
export function getKwinOverlayRuleStatus(): KwinRuleStatus {
  const env = detectDesktopEnvironment();
  const rulesPath = kwinrulesrcPath();

  let installed = false;
  try {
    const names = parseIni(fs.readFileSync(rulesPath, 'utf8')).map((s) => s.name);
    installed = RULE_IDS.every((id) => names.includes(id));
  } catch {
    installed = false; // file absent → not installed
  }

  return {
    applicable: env.isKdeWayland,
    installed,
    rulesPath,
    reason: env.isKdeWayland
      ? undefined
      : "Le correctif KWin ne s'applique qu'à KDE Plasma sur Wayland.",
  };
}

/** Install (or refresh) the keep-above rule and ask KWin to reload its config. */
export async function installKwinOverlayRule(): Promise<KwinRuleResult> {
  const env = detectDesktopEnvironment();
  if (!env.isKdeWayland) {
    return { success: false, installed: false, error: 'not-kde-wayland' };
  }

  const rulesPath = kwinrulesrcPath();
  try {
    let sections: IniSection[] = [];
    let existed = false;
    try {
      sections = parseIni(fs.readFileSync(rulesPath, 'utf8'));
      existed = true;
    } catch {
      sections = []; // fresh file
    }

    // Back up an existing config exactly once before we touch it.
    let backupPath: string | undefined;
    if (existed) {
      backupPath = `${rulesPath}.deadlockhelper.bak`;
      try {
        if (!fs.existsSync(backupPath)) fs.copyFileSync(rulesPath, backupPath);
      } catch {
        backupPath = undefined; // non-fatal: proceed without a backup
      }
    }

    // Register our ids in [General] without disturbing any existing rules.
    let general = sections.find((s) => s.name === 'General');
    if (!general) {
      general = { name: 'General', keys: new Map() };
      sections.unshift(general);
    }
    const rules = splitList(general.keys.get('rules'));
    for (const id of RULE_IDS) {
      if (!rules.includes(id)) rules.push(id);
    }
    general.keys.set('rules', rules.join(','));
    general.keys.set('count', String(rules.length));

    // Replace any stale copies of our groups, then (re)add them fresh.
    sections = sections.filter((s) => !RULE_IDS.includes(s.name));
    for (const def of RULES) sections.push(buildRuleSection(def));

    writeAtomic(rulesPath, serializeIni(sections));
    await reconfigureKwin(env);
    return { success: true, installed: true, backupPath };
  } catch (e) {
    return { success: false, installed: false, error: errMessage(e) };
  }
}

/** Remove the keep-above rule and ask KWin to reload its config. */
export async function removeKwinOverlayRule(): Promise<KwinRuleResult> {
  const env = detectDesktopEnvironment();
  const rulesPath = kwinrulesrcPath();

  try {
    let sections: IniSection[];
    try {
      sections = parseIni(fs.readFileSync(rulesPath, 'utf8'));
    } catch {
      return { success: true, installed: false }; // nothing to remove
    }

    sections = sections.filter((s) => !RULE_IDS.includes(s.name));

    const general = sections.find((s) => s.name === 'General');
    if (general) {
      const rules = splitList(general.keys.get('rules')).filter((id) => !RULE_IDS.includes(id));
      if (rules.length) {
        general.keys.set('rules', rules.join(','));
        general.keys.set('count', String(rules.length));
      } else {
        general.keys.delete('rules');
        general.keys.set('count', '0');
      }
    }

    writeAtomic(rulesPath, serializeIni(sections));
    await reconfigureKwin(env);
    return { success: true, installed: false };
  } catch (e) {
    return { success: false, installed: true, error: errMessage(e) };
  }
}

// ── KWin rule section ───────────────────────────────────────────────────────

function buildRuleSection(def: RuleDef): IniSection {
  return { name: def.id, keys: new Map(def.keys) };
}

// ── KWin reconfigure (apply without logout) ─────────────────────────────────

/**
 * Trigger KWin to reload its configuration so the rule takes effect immediately.
 * Tries the Plasma-6 binary first, then the Plasma-5 name, then busctl as a
 * portable D-Bus fallback. A failure here is non-fatal: the rule is on disk and
 * will apply on the next KWin restart regardless.
 */
function reconfigureKwin(env: DesktopEnvironment): Promise<void> {
  const altQdbus = env.qdbusBin === 'qdbus6' ? 'qdbus' : 'qdbus6';
  const candidates: Array<{ cmd: string; args: string[] }> = [
    { cmd: env.qdbusBin, args: ['org.kde.KWin', '/KWin', 'reconfigure'] },
    { cmd: altQdbus, args: ['org.kde.KWin', '/KWin', 'reconfigure'] },
    { cmd: 'busctl', args: ['--user', 'call', 'org.kde.KWin', '/KWin', 'org.kde.KWin', 'reconfigure'] },
  ];

  return new Promise((resolve) => {
    const tryNext = (i: number): void => {
      if (i >= candidates.length) {
        console.warn('[KWinRule] reconfigure failed — rule applies on next KWin restart');
        resolve();
        return;
      }
      const { cmd, args } = candidates[i];
      const proc = spawn(cmd, args, { stdio: 'ignore' });
      proc.on('error', () => tryNext(i + 1)); // binary not found → next candidate
      proc.on('close', (code) => (code === 0 ? resolve() : tryNext(i + 1)));
    };
    tryNext(0);
  });
}

// ── Paths & helpers ─────────────────────────────────────────────────────────

function kwinrulesrcPath(): string {
  const xdg = process.env.XDG_CONFIG_HOME?.trim();
  const base = xdg && xdg.length ? xdg : path.join(os.homedir(), '.config');
  return path.join(base, 'kwinrulesrc');
}

function writeAtomic(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, content, 'utf8');
  fs.renameSync(tmp, filePath);
}

function splitList(value: string | undefined): string[] {
  return (value ?? '').split(',').map((s) => s.trim()).filter(Boolean);
}

function errMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

// ── Minimal INI model (KDE config files) ────────────────────────────────────
//
// kwinrulesrc is an INI-like file of `[group]` headers with `key=value` lines.
// We preserve every section and its keys in order; comments/blank lines are not
// significant in this file (KWin rewrites it without them itself).

interface IniSection {
  name: string;
  keys: Map<string, string>;
}

function parseIni(text: string): IniSection[] {
  const sections: IniSection[] = [];
  let current: IniSection | null = null;

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const header = trimmed.match(/^\[(.+)\]$/);
    if (header) {
      current = { name: header[1], keys: new Map() };
      sections.push(current);
      continue;
    }

    const eq = line.indexOf('=');
    if (eq === -1 || !current) continue;
    current.keys.set(line.slice(0, eq).trim(), line.slice(eq + 1).trim());
  }

  return sections;
}

function serializeIni(sections: IniSection[]): string {
  const out: string[] = [];
  for (const section of sections) {
    out.push(`[${section.name}]`);
    section.keys.forEach((value, key) => out.push(`${key}=${value}`));
    out.push(''); // blank line between groups for readability
  }
  return out.join('\n').replace(/\n+$/, '\n');
}
