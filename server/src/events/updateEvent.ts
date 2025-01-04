import { WebSocketServer } from "ws";
import { getHumidity, getMoisture } from "../utils/Scripts";
import { EVENTS, STATES } from "../types/types";
import { checkGradientConditions, globalState } from "../utils/StatesManager";
import { broadcastMessage } from "..";
import { motor } from "../utils/Motor";

export async function updateEvent(wss: WebSocketServer) {
  const humidity = await getHumidity();
  const moisture = await getMoisture();

  const moisturePercentage = moisture / 10.23;

  broadcastMessage({
    type: EVENTS.TICK,
    humidity: Math.round(humidity),
    moisture: Math.round(moisturePercentage),
    state: globalState.get(),
    isActive: motor.isActive,
    lastActive: motor.lastActive,
  });

  if (globalState.get() == STATES.GRADIENT) {
    const conditions = checkGradientConditions(moisturePercentage, humidity);

    if (conditions && !motor.isActive) {
      motor.start();
    } else if (!conditions && motor.isActive) {
      motor.stop();
    }
  }
}
