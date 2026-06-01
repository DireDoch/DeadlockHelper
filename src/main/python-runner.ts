/**
 * Abstraction layer for running Python scripts from the Main process.
 * Centralizes spawn logic, stdout/stderr handling, JSON parsing and optional debug logging.
 *
 * Two execution modes:
 *   - Dev mode    : spawns the system Python interpreter against the .py source file
 *   - Packaged    : spawns the PyInstaller-compiled binary directly (no Python required on the host)
 */

import { spawn } from 'node:child_process';
import path from 'node:path';

/** Options for running a Python script or a compiled PyInstaller executable */
export interface RunPythonOptions {
  /** Full path to the Python script (.py) in dev mode, or to the PyInstaller binary when packaged */
  scriptPath: string;
  /** CLI arguments forwarded to the script / binary (e.g. ['--query', 'items', '--param', '42']) */
  args: string[];
  /** Working directory for the spawned process */
  cwd: string;
  /** If true, emit detailed logs: command, duration, exit code, stdout/stderr preview */
  debug?: boolean;
  /**
   * Direct-executable mode — set to true when scriptPath points to a PyInstaller binary.
   * The binary is self-contained and is spawned directly: <scriptPath> <args>.
   * When false (default, dev mode), the interpreter is prepended: <pythonExecutable> <scriptPath> <args>.
   */
  directExecutable?: boolean;
  /**
   * Python interpreter name. Only used when directExecutable is false.
   * Defaults to 'python3' on Linux/macOS and 'python' on Windows
   * (the Python.org installer on Windows registers 'python', not 'python3').
   */
  pythonExecutable?: string;
}

/** Returned by runPython when the process exits cleanly and stdout is valid JSON */
export interface RunPythonSuccess<T = unknown> {
  success: true;
  data: T;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

/** Returned (as a rejection) when the process crashes, exits non-zero, or produces invalid JSON */
export interface RunPythonError {
  success: false;
  error: string;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  durationMs?: number;
  /** Human-readable hint shown in the renderer error state */
  hint?: string;
  scriptPath?: string;
  workingDir?: string;
}

export type RunPythonResult<T = unknown> = RunPythonSuccess<T> | RunPythonError;

const MAX_DEBUG_OUTPUT_LEN = 2000;

/** Returns the correct Python interpreter name for the current OS */
function getPythonExecutable(): string {
  // Windows: the official Python installer puts 'python.exe' in PATH, not 'python3.exe'
  // Linux/macOS: 'python' often points to Python 2 (or nothing); 'python3' is reliable
  return process.platform === 'win32' ? 'python' : 'python3';
}

/**
 * Spawn a Python script or PyInstaller binary and resolve with the parsed JSON it prints to stdout.
 * Rejects with a RunPythonError-shaped object on non-zero exit, spawn failure, or invalid JSON output.
 */
export function runPython<T = unknown>(options: RunPythonOptions): Promise<RunPythonSuccess<T>> {
  const {
    scriptPath,
    args,
    cwd,
    debug = false,
    directExecutable = false,
    pythonExecutable = getPythonExecutable(),
  } = options;

  // In direct-executable mode the binary is called directly; otherwise we prefix with the interpreter.
  const command  = directExecutable ? scriptPath : pythonExecutable;
  const fullArgs = directExecutable ? args : [scriptPath, ...args];

  const startMs = Date.now();

  if (debug) {
    console.log('[Python Runner]', {
      command: `${command} ${fullArgs.join(' ')}`,
      mode: directExecutable ? 'PyInstaller binary' : 'Python interpreter',
      cwd,
    });
  }

  return new Promise((resolve, reject) => {
    const proc = spawn(command, fullArgs, {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data: Buffer | string) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data: Buffer | string) => {
      stderr += data.toString();
    });

    proc.on('close', (code, signal) => {
      const durationMs = Date.now() - startMs;

      if (debug) {
        const truncate = (s: string) =>
          s.length > MAX_DEBUG_OUTPUT_LEN
            ? s.slice(0, MAX_DEBUG_OUTPUT_LEN) + '...[truncated]'
            : s;
        console.log('[Python Runner]', {
          exitCode: code,
          signal: signal ?? undefined,
          durationMs,
          stdoutLength: stdout.length,
          stderrLength: stderr.length,
          stdoutPreview: truncate(stdout),
          stderrPreview: truncate(stderr),
        });
      }

      if (code !== 0) {
        reject({
          success: false as const,
          error: `Process exited with code ${code}${signal ? ` (signal ${signal})` : ''}`,
          stdout,
          stderr,
          exitCode: code ?? undefined,
          durationMs,
          scriptPath,
          workingDir: cwd,
        } satisfies RunPythonError);
        return;
      }

      let data: T;
      try {
        data = JSON.parse(stdout) as T;
      } catch {
        reject({
          success: false as const,
          error: 'Failed to parse process output as JSON',
          stdout,
          stderr,
          exitCode: code ?? 0,
          durationMs,
          scriptPath,
          workingDir: cwd,
        } satisfies RunPythonError);
        return;
      }

      resolve({
        success: true as const,
        data,
        stdout,
        stderr,
        exitCode: code ?? 0,
        durationMs,
      });
    });

    proc.on('error', (err: NodeJS.ErrnoException) => {
      const durationMs = Date.now() - startMs;
      if (debug) {
        console.error('[Python Runner] spawn error', err.message, err.code);
      }
      reject({
        success: false as const,
        error: `Failed to start process: ${err.message}`,
        stderr: stderr || undefined,
        durationMs,
        // Hint only applies in dev mode — in packaged builds the binary is self-contained
        hint: directExecutable
          ? 'The PyInstaller binary could not be found or executed.'
          : 'Make sure Python 3 is installed and available in PATH.',
        scriptPath,
        workingDir: cwd,
      } satisfies RunPythonError);
    });
  });
}

/**
 * Resolve the path to data_processor and indicate whether it should be run as a direct executable.
 *
 * Dev (isPackaged = false):
 *   Returns the .py source file path — the caller must prefix with a Python interpreter.
 *
 * Packaged (isPackaged = true):
 *   Returns the PyInstaller binary that electron-builder copied into resources/python/.
 *   The binary is self-contained (Python runtime included) — no system Python required.
 *   Name is data_processor.exe on Windows, data_processor on Linux/macOS.
 */
export function getDataProcessorPath(
  appPath: string,
  isPackaged: boolean,
): { scriptPath: string; directExecutable: boolean } {
  if (isPackaged) {
    const binaryName =
      process.platform === 'win32' ? 'data_processor.exe' : 'data_processor';
    return {
      scriptPath: path.join(process.resourcesPath, 'python', binaryName),
      directExecutable: true,
    };
  }

  // Dev mode: .py file interpreted by the system Python
  return {
    scriptPath: path.join(appPath, 'src', 'python', 'data_processor.py'),
    directExecutable: false,
  };
}

/**
 * Whether to enable verbose Python runner logs.
 * Enabled by DEBUG_PYTHON=1 env var or automatically in development mode.
 */
export function isPythonDebugEnabled(): boolean {
  return process.env.DEBUG_PYTHON === '1' || process.env.NODE_ENV === 'development';
}
