import { runPythonScript } from "./PythonScript";

let prevHumidity = 0,
  prevMoisture = 0;

export async function getMoisture(): Promise<number> {
  try {
    const moisture = (await runPythonScript("main", "get_moisture")) as number;
    const moisturePercentage = 100 * (1 - moisture / 255);
    prevMoisture = moisturePercentage;

    return 100 * (1 - moisture / 255);
  } catch {
    return prevMoisture;
  }
}

export async function getHumidity() {
  try {
    const humidity = (await runPythonScript("main", "get_humidity")) as number;
    prevHumidity = humidity;

    return humidity;
  } catch {
    return prevHumidity;
  }
}
