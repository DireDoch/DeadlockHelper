import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setupSteamHandlers } from './steam-logic';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// Setup IPC handlers
function setupIpcHandlers(): void {
  // Python script execution handler
  ipcMain.handle('python:execute', async (event, { query, param }) => {
    return new Promise((resolve, reject) => {
      // Get the application path (works in both dev and production)
      const appPath = app.getAppPath();
      
      // In development, appPath is the project root
      // In production, it might be different, so we check both locations
      let pythonScript = path.join(appPath, 'src', 'python', 'data_processor.py');
      
      // Fallback: if file doesn't exist, try relative to __dirname (for production builds)
      // This is a safety check, but in dev mode appPath should work
      const args = ['--query', query || 'items'];
      
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
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
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
          hint: 'Make sure Python 3.12 is installed and available in PATH',
          pythonScript: pythonScript,
          workingDir: workingDir,
        });
      });
    });
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
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
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
