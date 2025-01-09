import { spawn, ChildProcess } from "child_process";
import { globalState } from "./StatesManager";
import { STATES } from "../types/types";
import path from "path";

const cwdPath = path.join(__dirname, "..", "python");

export default class Motor {
  public isActive: boolean = false;
  public lastActive: number | null = null;
  private pythonProcess: ChildProcess | null = null;

  start(): Promise<void> {
    if (this.pythonProcess && this.isActive) {
      return Promise.resolve();
    }

    this.isActive = true;
    this.lastActive = null;

    return this.spawnPythonScript("motor", "start_motor");
  }

  stop(): Promise<void> {
    if (!this.pythonProcess) {
      return Promise.reject("No motor process running");
    }

    this.isActive = false;
    this.lastActive = new Date().getTime();
    if (globalState.get() !== STATES.GRADIENT) {
      this.lastActive = new Date().getTime();
    }

    return this.spawnPythonScript("motor", "stop_motor");
  }

  private spawnPythonScript(
    fileName: string,
    functionName: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.pythonProcess) {
        this.pythonProcess.kill();
      }

      this.pythonProcess = spawn(
        "python",
        ["-u", "-c", `import ${fileName}; ${fileName}.${functionName}()`],
        {
          cwd: cwdPath,
          detached: true,
          stdio: "ignore",
        }
      );

      this.pythonProcess.unref();

      this.pythonProcess.on("error", (error) => {
        reject(error);
      });

      this.pythonProcess.on("exit", () => {
        this.pythonProcess = null;
        resolve();
      });
    });
  }
}

export function spawnPythonScript(
  fileName: string,
  functionName: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(
      "python",
      ["-u", "-c", `import ${fileName}; ${fileName}.${functionName}()`],
      {
        cwd: cwdPath,
        detached: true,
        stdio: "ignore",
      }
    );

    pythonProcess.unref();
    pythonProcess.on("exit", () => {
      resolve();
    });

    pythonProcess.on("error", (error) => {
      reject(error);
    });
  });
}

export const motor = new Motor();
