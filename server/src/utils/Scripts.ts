import { runPythonScript } from "./PythonScript";

export async function getMoisture(): Promise<number> {
  return (await runPythonScript("main", "get_moisture")) as number;
}

export async function getHumidity() {
  return (await runPythonScript("main", "get_humidity")) as number;
}

// export async function isMotorActive() {
//   return (await runPythonScript("motor", "is_motor_active")) as boolean;
// }
