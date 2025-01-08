import { WebSocketServer } from "ws";
import { getHumidity, getMoisture } from "../utils/Scripts";
import { EVENTS, STATES } from "../types/types";
import { checkGradientConditions } from "../utils/StatesManager";
import { broadcastMessage } from "..";
import { motor } from "../utils/Motor";

export async function changeEvent(
  newState: STATES,
  oldState: STATES,
) {
  const humidity = await getHumidity();
  const moisture = await getMoisture();

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
        checkGradientConditions(moisture, humidity) &&
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
