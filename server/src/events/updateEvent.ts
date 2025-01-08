import { getHumidity, getMoisture } from "../utils/Scripts";
import { EVENTS, STATES } from "../types/types";
import { checkGradientConditions, globalState } from "../utils/StatesManager";
import { broadcastMessage } from "..";
import { motor } from "../utils/Motor";

export async function updateEvent() {
  const humidity = await getHumidity();
  const moisture = await getMoisture();

  let gradientPercentage: number = 0;

  if (humidity >= 90) {
    gradientPercentage = 100;
  } else {
    if (moisture <= 15) {
        gradientPercentage = 100;
    } else {
        gradientPercentage = Math.round((1 - (moisture / 15)) * 100);
    }
  }

  broadcastMessage({
    type: EVENTS.TICK,
    humidity: Math.round(humidity),
    moisture: Math.round(moisture),
    state: globalState.get(),
    isActive: motor.isActive,
    lastActive: motor.lastActive,
    gradientPercentage
  });

  if (globalState.get() == STATES.GRADIENT) {
    const conditions = checkGradientConditions(moisture, humidity);

    if (conditions && !motor.isActive) {
      motor.start();
    } else if (!conditions && motor.isActive) {
      motor.stop();
    }
  }
}
