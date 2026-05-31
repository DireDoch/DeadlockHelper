/**
 * Awards Store — Main Process
 *
 * Persists award data in a dedicated electron-store ('awards').
 * Handles two IPC channels:
 *   awards:get-all     → returns the full awards record
 *   awards:save-batch  → merges new match occurrences, fires a native notification
 *                        for truly new entries, returns them to the renderer.
 *
 * Native notification on click:
 *   1. Restores/focuses the main window.
 *   2. Sends awards:navigate → renderer navigates to the Awards tab on ProfilPage.
 */

import Store from 'electron-store';
import { Notification } from 'electron';
import type { IpcMain, BrowserWindow } from 'electron';
import { AWARD_DEFINITIONS } from '../lib/awards';
import type { AwardsStoreShape, AwardEntry, NewAwardsResult, AwardId } from '../lib/awards';

// Lazy map of award_id → display name, derived from AWARD_DEFINITIONS.
const AWARD_NAME: Record<string, string> = Object.fromEntries(
  AWARD_DEFINITIONS.map(d => [d.id, d.name]),
);

export const awardsStore = new Store<AwardsStoreShape>({
  name: 'awards',
  defaults: { awards: {} },
});

/**
 * Register IPC handlers for the awards system.
 * Call once from setupIpcHandlers() in main.ts.
 *
 * @param ipcMain       — Electron's ipcMain
 * @param getMainWindow — returns the current main BrowserWindow (may be null)
 */
export function setupAwardsIpcHandlers(
  ipcMain: IpcMain,
  getMainWindow: () => BrowserWindow | null,
): void {
  // awards:get-all → Record<AwardId, AwardEntry>
  ipcMain.handle('awards:get-all', () => {
    return awardsStore.get('awards');
  });

  // awards:save-batch → NewAwardsResult
  // Merges entries into the store; each entry may cover multiple matchIds.
  // Only matchIds not yet recorded fire a notification.
  ipcMain.handle('awards:save-batch', (_, entries: AwardEntry[]): NewAwardsResult => {
    const stored = awardsStore.get('awards');
    const newEntries: NewAwardsResult['newEntries'] = [];

    for (const entry of entries) {
      const current = stored[entry.awardId];
      if (!current) {
        // First time this award is ever earned — record all matchIds
        stored[entry.awardId] = {
          awardId:       entry.awardId,
          matchIds:      [...entry.matchIds],
          firstEarnedAt: entry.firstEarnedAt,
          count:         entry.matchIds.length,
        };
        for (const matchId of entry.matchIds) {
          newEntries.push({ awardId: entry.awardId as AwardId, matchId });
        }
      } else {
        // Award already known — add only unseen matchIds
        for (const matchId of entry.matchIds) {
          if (!current.matchIds.includes(matchId)) {
            current.matchIds.push(matchId);
            current.count = current.matchIds.length;
            newEntries.push({ awardId: entry.awardId as AwardId, matchId });
          }
        }
      }
    }

    awardsStore.set('awards', stored);

    if (newEntries.length > 0) {
      const win = getMainWindow();
      if (win && !win.isDestroyed()) {
        fireAwardsNotification(win, newEntries);
      }
    }

    return { newEntries };
  });
}

// ── Notification ──────────────────────────────────────────────────────────────

function fireAwardsNotification(
  win: BrowserWindow,
  newEntries: NewAwardsResult['newEntries'],
): void {
  if (!Notification.isSupported()) return;

  const count     = newEntries.length;
  const firstName = AWARD_NAME[newEntries[0].awardId] ?? newEntries[0].awardId;

  const title = count === 1
    ? `Award débloqué : ${firstName}`
    : `${count} Awards débloqués !`;

  // Body: single award → generic CTA; multiple → first 3 names + overflow count
  const body = count === 1
    ? 'Cliquez pour voir vos récompenses.'
    : newEntries.slice(0, 3).map(e => AWARD_NAME[e.awardId] ?? e.awardId).join(', ')
      + (count > 3 ? ` +${count - 3}` : '');

  const notif = new Notification({ title, body });

  notif.on('click', () => {
    if (win.isDestroyed()) return;
    // 1. Bring the window to the foreground
    if (win.isMinimized()) win.restore();
    win.focus();
    // 2. Tell the renderer to navigate to the Awards tab on ProfilPage
    win.webContents.send('awards:navigate');
  });

  notif.show();
}
