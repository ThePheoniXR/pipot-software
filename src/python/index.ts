import { runPythonScript, spawnPythonScript } from "../utils/PythonScript";

export async function getMoisture(): Promise<number> {
  return (await runPythonScript("main", "get_moisture_analog")) as number;
}

export async function getHumidity() {
  return (await runPythonScript("main", "get_humidity")) as number;
}

export function startMotor() {
  return spawnPythonScript("motor", "start_motor");
}

export function stopMotor() {
  return spawnPythonScript("motor", "stop_motor");
}

export async function isMotorActive() {
  return (await runPythonScript("motor", "is_motor_active")) as boolean;
}
