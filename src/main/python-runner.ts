/**
 * Abstraction layer for running Python scripts from the Main process.
 * Centralizes spawn logic, stdout/stderr handling, JSON parsing and optional debug logging.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';

/** Options for running a Python script */
export interface RunPythonOptions {
  /** Full path to the Python script (e.g. data_processor.py) */
  scriptPath: string;
  /** CLI arguments (e.g. ['--query', 'items', '--param', '123']) */
  args: string[];
  /** Working directory for the process (usually app root) */
  cwd: string;
  /** If true, log command, duration, exit code and I/O to console for debugging */
  debug?: boolean;
  /** Python executable (default: 'python') */
  pythonExecutable?: string;
}

/** Successful result: parsed JSON from stdout */
export interface RunPythonSuccess<T = unknown> {
  success: true;
  data: T;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

/** Error payload when the script fails or output is invalid */
export interface RunPythonError {
  success: false;
  error: string;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  durationMs?: number;
  /** Optional hint for the user (e.g. "Make sure Python 3.12 is in PATH") */
  hint?: string;
  scriptPath?: string;
  workingDir?: string;
}

export type RunPythonResult<T = unknown> = RunPythonSuccess<T> | RunPythonError;

const MAX_DEBUG_OUTPUT_LEN = 2000;

/**
 * Run a Python script and return the parsed JSON from stdout.
 * Rejects with a RunPythonError-like object on non-zero exit, spawn failure, or invalid JSON.
 *
 * @param options - script path, args, cwd, optional debug
 * @returns Promise resolving to { success: true, data, stdout, stderr, exitCode, durationMs }
 * @throws Rejects with object { success: false, error, stdout?, stderr?, ... }
 */
export function runPython<T = unknown>(options: RunPythonOptions): Promise<RunPythonSuccess<T>> {
  const {
    scriptPath,
    args,
    cwd,
    debug = false,
    pythonExecutable = 'python',
  } = options;

  const fullArgs = [scriptPath, ...args];
  const startMs = Date.now();

  if (debug) {
    console.log('[Python Runner]', {
      command: `${pythonExecutable} ${scriptPath} ${args.join(' ')}`,
      cwd,
      args: fullArgs,
    });
  }

  return new Promise((resolve, reject) => {
    const proc = spawn(pythonExecutable, fullArgs, {
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
          s.length > MAX_DEBUG_OUTPUT_LEN ? s.slice(0, MAX_DEBUG_OUTPUT_LEN) + '...[truncated]' : s;
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
          error: `Python process exited with code ${code}${signal ? ` (signal ${signal})` : ''}`,
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
      } catch (parseError) {
        reject({
          success: false as const,
          error: 'Failed to parse Python output as JSON',
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
        error: `Failed to start Python process: ${err.message}`,
        stderr: stderr || undefined,
        durationMs,
        hint: 'Make sure Python is installed and available in PATH (e.g. Python 3.12)',
        scriptPath,
        workingDir: cwd,
      } satisfies RunPythonError);
    });
  });
}

/**
 * Resolve the path to the data_processor.py script.
 * When packaged (build), the script is in resources/python (extraResources); otherwise under app root src/python.
 */
export function getDataProcessorScriptPath(appPath: string, isPackaged: boolean): string {
  if (isPackaged) {
    return path.join(process.resourcesPath, 'python', 'data_processor.py');
  }
  return path.join(appPath, 'src', 'python', 'data_processor.py');
}

/**
 * Whether to enable Python runner debug logs (env or dev mode).
 * Set DEBUG_PYTHON=1 or run in development to enable.
 */
export function isPythonDebugEnabled(): boolean {
  return process.env.DEBUG_PYTHON === '1' || process.env.NODE_ENV === 'development';
}
