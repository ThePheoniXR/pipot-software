import { WebSocketServer } from "ws";
import { getHumidity, getMoisture, isMotorActive, startMotor } from "../python";
import { STATES } from "../types/types";
import { checkGradientConditions, globalState } from "../utils/StatesManager";

export async function updateEvent(wss: WebSocketServer) {
  const humidity = await getHumidity();
  const moisture = await getMoisture();

  const moisturePercentage = moisture / 10.23;

  wss.clients.forEach((ws) => {
    ws.send(
      JSON.stringify({
        type: "TICK",
        humidity: humidity,
        moisture: moisturePercentage,
      })
    );
  });

  if (globalState.get() == STATES.GRADIENT) {
    if (
      checkGradientConditions(moisturePercentage, humidity) &&
      !(await isMotorActive())
    ) {
      startMotor();
    }
  }
}
