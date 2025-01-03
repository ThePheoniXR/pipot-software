import { parsePython, runPythonScript } from "../utils/PythonScript";

/**
 * < 100 means the soil is dry
 * > 100 means the moisture is moist
 */
export async function getMoisture(): Promise<number> {
  return Number(await runPythonScript("main", "get_moisture_analog"));
}

/**
 * > 60 humidity is high
 * < 60 humidity is low
 */
export async function getHumidity() {
  return Number(await runPythonScript("main", "get_humidity"));
}
