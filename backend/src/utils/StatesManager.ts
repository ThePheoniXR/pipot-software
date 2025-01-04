import { STATES } from "../types/types";

type StateChangeCallback = (newState: STATES, oldState: STATES) => void;

class StateManager {
  private state: STATES = STATES.GRADIENT;
  private subscribers: StateChangeCallback[] = [];

  set(state: STATES) {
    if (this.state !== state) {
      const oldState = this.state;
      this.state = state;
      this.notifySubscribers(state, oldState);
    }
  }

  get() {
    return this.state;
  }

  subscribe(callback: StateChangeCallback) {
    this.subscribers.push(callback);
  }

  private notifySubscribers(newState: STATES, oldState: STATES) {
    this.subscribers.forEach((callback) => callback(newState, oldState));
  }
}

export const globalState = new StateManager();

export function checkGradientConditions(
  moisture: number,
  humidity: number
): boolean {
  if (moisture <= 30) {
    return true;
  }

  if (humidity >= 90) return false;

  if (moisture >= 80) {
    return false;
  } else if (moisture < 80) {
    return true;
  }

  return false;
}
