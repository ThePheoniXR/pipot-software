import { WebSocketServer } from "ws";
import { getHumidity, getMoisture, startMotor, stopMotor } from "../python";
import { STATES } from "../types/types";
import { checkGradientConditions } from "../utils/StatesManager";

export async function changeEvent(
  newState: STATES,
  oldState: STATES,
  wss: WebSocketServer
) {
  const humidity = await getHumidity();
  const moisture = await getMoisture();

  const moisturePercentage = moisture / 10.23;

  wss.clients.forEach((ws) => {
    ws.send(
      JSON.stringify({
        type: "STATE_CHANGE",
        newState: newState,
        oldState: oldState,
      })
    );
  });

  switch (newState) {
    case STATES.IDLE:
      stopMotor();
      break;
    case STATES.GRADIENT:
      if (
        checkGradientConditions(moisturePercentage, humidity) &&
        oldState == STATES.IDLE
      ) {
        startMotor();
      }
      break;
    case STATES.BUTTON:
      if (oldState == STATES.IDLE) {
        startMotor();
      }
      break;
  }
}
