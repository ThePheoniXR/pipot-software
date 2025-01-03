import { spawn } from "child_process";
import path from "path";

export function runPythonScript(
  fileName: string,
  functionName: string
): Promise<boolean | number | string | undefined> {
  return new Promise((resolve, reject) => {
    const cwdPath = path.join(__dirname, "..", "python");

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
      reject(`Error: ${data.toString().trim()}`);
    });

    pythonProcess.on("error", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(`Python script exited with code ${code}: ${errorOutput}`);
      }
      resolve(parsePython(output.trim()));
    });
  });
}

export function parsePython(
  i: string | undefined
): boolean | number | string | undefined {
  if (i == undefined) return;

  // Boolean check
  if (i === "True") return true;
  if (i === "False") return false;

  // Number check
  const n = Number(i);
  if (!Number.isNaN(n)) return Number(n);

  // String check
  if (Number.isNaN(n)) return i;
}
