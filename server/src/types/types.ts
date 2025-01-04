import WebSocket from "ws";

export interface WebSocketI extends WebSocket {
  isAlive: boolean;
}

export enum STATES {
  GRADIENT = "gradient",
  BUTTON = "button",
  IDLE = "idle",
}

export enum EVENTS {
  BUTTON_CLICK_START = "BUTTON_CLICK_START",
  BUTTON_CLICK_STOP = "BUTTON_CLICK_STOP",
  TICK = "TICK",
  STATE_CHANGE = "STATE_CHANGE",
}

export interface WebSocketRecievingData {
  type: EVENTS;
  [key: string]: any;
}
