import { spawn } from "child_process";
import path from "path";

const cwdPath = path.join(__dirname, "..", "python");

export function runPythonScript(
  fileName: string,
  functionName: string
): Promise<boolean | number | string | undefined> {
  return new Promise((resolve, reject) => {
    try {
      const pythonProcess = spawn(
        "python",
        ["-u", "-c", `import ${fileName}; ${fileName}.${functionName}()`],
        { cwd: cwdPath }
      );

      let output = "";
      let errorOutput = "";

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on("error", (err) => {
        reject(`Python process failed to start: ${err.message}`);
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          return reject(`Python script exited with code ${code}: ${errorOutput}`);
        }
        resolve(parsePython(output.trim()));
      });
    } catch (err) {
      reject(`Unexpected error: ${(err as Error).message}`);
    }
  });
}

export function spawnPythonScript(
  fileName: string,
  functionName: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const pythonProcess = spawn(
        "python",
        ["-u", "-c", `import ${fileName}; ${fileName}.${functionName}()`],
        {
          cwd: cwdPath,
          detached: true,
          stdio: "ignore",
        }
      );

      pythonProcess.on("error", (err) => {
        reject(`Python process failed to start: ${err.message}`);
      });

      pythonProcess.unref();
      resolve();
    } catch (err) {
      reject(`Unexpected error: ${(err as Error).message}`);
    }
  });
}

export function parsePython(
  i: string | undefined
): boolean | number | string | undefined {
  if (i === undefined) return;

  // Boolean check
  if (i === "True") return true;
  if (i === "False") return false;

  // Number check
  const n = Number(i);
  if (!Number.isNaN(n)) return n;

  // Return as string if not a boolean or number
  return i;
}
