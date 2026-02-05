import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { spawn } from 'node:child_process';
import Store from 'electron-store';
import { setupSteamHandlers } from './steam-logic';
import started from 'electron-squirrel-startup';
import type { ApiHealthStatus, CachedMatchData, MatchData } from '../lib/types';

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
 * Perform health check by calling Python script
 */
async function performHealthCheck(): Promise<void> {
  try {
    const result = await new Promise<any>((resolve, reject) => {
      const appPath = app.getAppPath();
      const pythonScript = path.join(appPath, 'src', 'python', 'data_processor.py');
      const args = ['--health-check'];
      
      const pythonProcess = spawn('python', [pythonScript, ...args], {
        cwd: appPath,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      
      let stdout = '';
      let stderr = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject({
            success: false,
            error: `Python process exited with code ${code}`,
            stderr: stderr,
          });
          return;
        }
        
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (parseError) {
          reject({
            success: false,
            error: 'Failed to parse Python output as JSON',
            stdout: stdout,
            stderr: stderr,
          });
        }
      });
      
      pythonProcess.on('error', (error) => {
        reject({
          success: false,
          error: `Failed to start Python process: ${error.message}`,
        });
      });
    });
    
    // Record result (success if status is not "api_error")
    const success = result.success && result.status !== 'api_error';
    recordApiCall(success);
  } catch (error) {
    // Record failure
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
  // Python script execution handler
  ipcMain.handle('python:execute', async (event, { query, param, mockMode }) => {
    return new Promise(async (resolve, reject) => {
      // Get the application path (works in both dev and production)
      const appPath = app.getAppPath();
      
      // In development, appPath is the project root
      // In production, it might be different, so we check both locations
      let pythonScript = path.join(appPath, 'src', 'python', 'data_processor.py');
      
      // Fallback: if file doesn't exist, try relative to __dirname (for production builds)
      // This is a safety check, but in dev mode appPath should work
      const args = ['--query', query || 'items'];
      
      // Add --mock flag if mockMode is true (from parameter or global state)
      const useMockMode = mockMode !== undefined ? mockMode : mockModeEnabled;
      if (useMockMode) {
        args.push('--mock');
      }
      
      if (param) {
        args.push('--param', param);
      }
      
      // Use appPath as working directory (project root)
      const workingDir = appPath;
      
      // Spawn Python process
      const pythonProcess = spawn('python', [pythonScript, ...args], {
        cwd: workingDir,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      
      let stdout = '';
      let stderr = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          // Record failure
          recordApiCall(false);
          reject({
            success: false,
            error: `Python process exited with code ${code}`,
            stderr: stderr,
            pythonScript: pythonScript,
            workingDir: workingDir,
          });
          return;
        }
        
        try {
          const result = JSON.parse(stdout);
          
          // Check if this is an API error
          const isApiError = result.status === 'api_error' || (!result.success && result.code >= 500);
          
          // Record API call result
          recordApiCall(!isApiError);
          
          // If API error and this is a match query, try cache fallback
          if (isApiError && query === 'match' && param) {
            const cachedMatch = store.get(`matchCache.${param}`);
            if (cachedMatch) {
              // Return cached data with a flag
              resolve({
                ...cachedMatch.data,
                success: true,
                cached: true,
                cached_at: cachedMatch.cached_at,
              });
              return;
            }
          }
          
          // If successful and this is a match query, cache the result
          if (result.success && query === 'match' && param && result.data) {
            const matchInfo = result.data?.match_info || result.data;
            if (matchInfo && matchInfo.match_id) {
              const cachedData: CachedMatchData = {
                match_id: matchInfo.match_id,
                data: result.data,
                cached_at: Date.now(),
              };
              store.set(`matchCache.${param}`, cachedData);
            }
          }
          
          resolve(result);
        } catch (parseError) {
          recordApiCall(false);
          reject({
            success: false,
            error: 'Failed to parse Python output as JSON',
            stdout: stdout,
            stderr: stderr,
          });
        }
      });
      
      pythonProcess.on('error', (error) => {
        recordApiCall(false);
        reject({
          success: false,
          error: `Failed to start Python process: ${error.message}`,
          hint: 'Make sure Python 3.12 is installed and available in PATH',
          pythonScript: pythonScript,
          workingDir: workingDir,
        });
      });
    });
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
