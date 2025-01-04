import { STATES } from "../types/types";
import { spawnPythonScript } from "./PythonScript";
import { globalState } from "./StatesManager";

class Motor {
  public isActive: boolean = false;
  public lastActive: number | null = null;

  start(): Promise<void> {
    this.isActive = true;
    this.lastActive = null;
    return spawnPythonScript("motor", "start_motor");
  }

  stop(): Promise<void> {
    this.isActive = false;

    this.lastActive = new Date().getTime();
    if (globalState.get() !== STATES.GRADIENT) {
      this.lastActive = new Date().getTime();
    }

    return spawnPythonScript("motor", "stop_motor");
  }
}

export const motor = new Motor();
