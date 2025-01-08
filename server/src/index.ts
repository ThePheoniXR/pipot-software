import express from "express";

import { WebSocketServer } from "ws";
import {
  EVENTS,
  STATES,
  WebSocketI,
  WebSocketRecievingData,
} from "./types/types";

import { HEARTBEAT_INTREVAL, SERVER_PORT, UPDATE_RATE } from "./constants";

import { globalState } from "./utils/StatesManager";
import { changeEvent } from "./events/changeEvent";

import http from "http";
import cors from "cors";

import { updateEvent } from "./events/updateEvent";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());

app.get("/get_state", (req, res) => {
  res.status(200).json({ state: globalState.get() });
});

app.post("/start_gradientation", (req, res) => {
  globalState.set(STATES.GRADIENT);

  res.sendStatus(201);
});

app.post("/stop_gradientation", (req, res) => {
  globalState.set(STATES.IDLE);

  res.sendStatus(201);
});

wss.on("connection", (ws: WebSocketI) => {
  ws.isAlive = true;
  ws.on("error", console.error);
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (rawData) => {
    const data: WebSocketRecievingData = JSON.parse(rawData.toString());

    if (data.type == EVENTS.BUTTON_CLICK_START) globalState.set(STATES.BUTTON);

    if (data.type == EVENTS.BUTTON_CLICK_STOP) globalState.set(STATES.IDLE);
  });

  setInterval(() => updateEvent(), UPDATE_RATE);
});

export function broadcastMessage(message: WebSocketRecievingData): void {
  wss.clients.forEach((ws) => {
    ws.send(JSON.stringify(message));
  });
}

globalState.subscribe((newState, oldState) =>
  changeEvent(newState, oldState)
);

// Ping message
const heartbeat = setInterval(function ping() {
  wss.clients.forEach((ws: any) => {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, HEARTBEAT_INTREVAL);

wss.on("close", () => {
  clearInterval(heartbeat);
});

wss.on("listening", () => console.log("WebSocket server started."));
server.listen(SERVER_PORT, '0.0.0.0', () =>
  console.log(`Server started on port: ${SERVER_PORT}`)
);