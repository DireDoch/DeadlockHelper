import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import Store from 'electron-store';
import { setupSteamHandlers } from './steam-logic';
import { runPython, getDataProcessorScriptPath, isPythonDebugEnabled } from './python-runner';
import started from 'electron-squirrel-startup';
import type { ApiHealthStatus, CachedMatchData, MatchData } from '../lib/types';

/** Shape of JSON returned by data_processor.py (success, status, data, etc.) */
interface PythonQueryResult {
  success?: boolean;
  status?: string;
  code?: number;
  data?: any;
  [key: string]: unknown;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Store reference for health alerts
  mainWindow = window;

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  window.webContents.openDevTools();
};

// Mock mode state (in-memory, can be migrated to config file later)
let mockModeEnabled = false;

// Initialize electron-store for health tracking and cache
const store = new Store<{
  apiHealth: {
    requestHistory: boolean[];
    lastCheck: number;
    currentAvailability: number;
  };
  matchCache: Record<string, CachedMatchData>;
}>({
  defaults: {
    apiHealth: {
      requestHistory: [],
      lastCheck: 0,
      currentAvailability: 100,
    },
    matchCache: {},
  },
});

// Heartbeat timer reference
let heartbeatTimer: NodeJS.Timeout | null = null;

// Main window reference for sending health alerts
let mainWindow: BrowserWindow | null = null;

/**
 * Record API call result and update availability
 */
function recordApiCall(success: boolean): void {
  const health = store.get('apiHealth');
  const requestHistory = [...health.requestHistory, success];
  
  // Maintain rolling window of 50 requests (FIFO)
  const MAX_HISTORY = 50;
  const trimmedHistory = requestHistory.length > MAX_HISTORY
    ? requestHistory.slice(-MAX_HISTORY)
    : requestHistory;
  
  // Calculate availability percentage
  const successCount = trimmedHistory.filter(Boolean).length;
  const availability = trimmedHistory.length > 0
    ? Math.round((successCount / trimmedHistory.length) * 100)
    : 100;
  
  // Update store
  store.set('apiHealth', {
    requestHistory: trimmedHistory,
    lastCheck: Date.now(),
    currentAvailability: availability,
  });
  
  // Notify renderer if availability changed
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('api:health-alert', availability);
  }
}

/**
 * Calculate current availability from stored history
 */
function calculateAvailability(): number {
  const health = store.get('apiHealth');
  const history = health.requestHistory;
  
  if (history.length === 0) return 100;
  
  const successCount = history.filter(Boolean).length;
  return Math.round((successCount / history.length) * 100);
}

/**
 * Perform health check by calling Python script (via python-runner abstraction)
 */
async function performHealthCheck(): Promise<void> {
  const appPath = app.getAppPath();
  const scriptPath = getDataProcessorScriptPath(appPath);
  const debug = isPythonDebugEnabled();

  try {
    const { data } = await runPython<{ success?: boolean; status?: string }>({
      scriptPath,
      args: ['--health-check'],
      cwd: appPath,
      debug,
    });
    const success = Boolean(data?.success && data?.status !== 'api_error');
    recordApiCall(success);
  } catch (error) {
    recordApiCall(false);
    console.error('Health check failed:', error);
  }
}

/**
 * Start heartbeat timer (checks every 5 minutes)
 */
function startHeartbeat(): void {
  // Perform initial check
  performHealthCheck();
  
  // Set interval for 5 minutes (300000 ms)
  heartbeatTimer = setInterval(() => {
    performHealthCheck();
  }, 5 * 60 * 1000);
}

/**
 * Stop heartbeat timer
 */
function stopHeartbeat(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

// Setup IPC handlers
function setupIpcHandlers(): void {
  // Python script execution handler (uses python-runner abstraction)
  ipcMain.handle('python:execute', async (event, { query, param, mockMode }) => {
    const appPath = app.getAppPath();
    const scriptPath = getDataProcessorScriptPath(appPath);
    const useMockMode = mockMode !== undefined ? mockMode : mockModeEnabled;
    const args = ['--query', query || 'items'];
    if (useMockMode) args.push('--mock');
    if (param) args.push('--param', param);

    try {
      const { data: result } = await runPython<PythonQueryResult>({
        scriptPath,
        args,
        cwd: appPath,
        debug: isPythonDebugEnabled(),
      });

      const isApiError = result.status === 'api_error' || (!result.success && (result.code ?? 0) >= 500);
      recordApiCall(!isApiError);

      if (isApiError && query === 'match' && param) {
        const cachedMatch = store.get(`matchCache.${param}`);
        if (cachedMatch) {
          return {
            ...cachedMatch.data,
            success: true,
            cached: true,
            cached_at: cachedMatch.cached_at,
          };
        }
      }

      if (result.success && query === 'match' && param && result.data) {
        const matchInfo = result.data?.match_info || result.data;
        if (matchInfo?.match_id) {
          store.set(`matchCache.${param}`, {
            match_id: matchInfo.match_id,
            data: result.data,
            cached_at: Date.now(),
          });
        }
      }

      return result;
    } catch (err: any) {
      recordApiCall(false);
      throw {
        ...err,
        pythonScript: err.scriptPath ?? scriptPath,
        workingDir: err.workingDir ?? appPath,
      };
    }
  });
  
  // Mock mode handlers
  ipcMain.handle('settings:getMockMode', async () => {
    return mockModeEnabled;
  });
  
  ipcMain.handle('settings:setMockMode', async (event, enabled: boolean) => {
    mockModeEnabled = enabled;
    return { success: true, mockMode: mockModeEnabled };
  });
  
  // API Health handlers
  ipcMain.handle('api:health-check', async () => {
    await performHealthCheck();
    return { success: true };
  });
  
  ipcMain.handle('api:get-availability', async () => {
    return calculateAvailability();
  });
  
  ipcMain.handle('api:cache-match', async (event, matchId: string, matchData: MatchData) => {
    if (matchData.match_id) {
      const cachedData: CachedMatchData = {
        match_id: matchData.match_id,
        data: matchData,
        cached_at: Date.now(),
      };
      store.set(`matchCache.${matchId}`, cachedData);
      return { success: true };
    }
    return { success: false, error: 'Invalid match data' };
  });
  
  ipcMain.handle('api:get-cached-match', async (event, matchId: string) => {
    const cachedMatch = store.get(`matchCache.${matchId}`);
    if (cachedMatch) {
      return cachedMatch.data;
    }
    return null;
  });
  
  // Setup Steam handlers
  setupSteamHandlers();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  setupIpcHandlers();
  createWindow();
  startHeartbeat();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  stopHeartbeat();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
