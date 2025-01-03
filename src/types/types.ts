import WebSocket from "ws";

export interface WebSocketI extends WebSocket {
  isAlive: boolean;
}

export enum STATES {
  GRADIENT = "gradient",
  BUTTON = "button",
  IDLE = "idle",
}

export interface WebSocketRecievingData {
  type: "BUTTON_CLICK_START" | "BUTTON_CLICK_STOP";
}
