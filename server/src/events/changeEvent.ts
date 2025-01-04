import { WebSocketServer } from "ws";
import { getHumidity, getMoisture } from "../utils/Scripts";
import { EVENTS, STATES } from "../types/types";
import { checkGradientConditions } from "../utils/StatesManager";
import { broadcastMessage } from "..";
import { motor } from "../utils/Motor";

export async function changeEvent(
  newState: STATES,
  oldState: STATES,
  wss: WebSocketServer
) {
  const humidity = await getHumidity();
  const moisture = await getMoisture();

  const moisturePercentage = moisture / 10.23;

  broadcastMessage({
    type: EVENTS.STATE_CHANGE,
    newState: newState,
    oldState: oldState,
  });

  switch (newState) {
    case STATES.IDLE:
      motor.stop();
      break;
    case STATES.GRADIENT:
      if (
        checkGradientConditions(moisturePercentage, humidity) &&
        oldState == STATES.IDLE
      ) {
        motor.start();
      }
      break;
    case STATES.BUTTON:
      if (oldState == STATES.IDLE) {
        motor.start();
      }
      break;
  }
}
