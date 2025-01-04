import express from "express";

import { WebSocketServer } from "ws";
import { STATES, WebSocketI, WebSocketRecievingData } from "./types/types";

import { HEARTBEAT_INTREVAL, PORT, UPDATE_RATE } from "./constants";

import { globalState } from "./utils/StatesManager";
import { changeEvent } from "./events/changeEvent";

import http from "http";

import { updateEvent } from "./events/updateEvent";

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

app.get("/get_state", (req, res) => {
  res.status(200).json({ state: globalState.get() });
});

app.post("/stop_gradiation", (req, res) => {
  globalState.set(STATES.IDLE);

  res.sendStatus(201);
});

app.post("/start_gradiation", (req, res) => {
  globalState.set(STATES.GRADIENT);

  res.sendStatus(201);
});

wss.on("connection", (ws: WebSocketI) => {
  console.log("Connected");

  ws.isAlive = true;
  ws.on("error", console.error);
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (data: WebSocketRecievingData) => {
    if (data.type == "BUTTON_CLICK_START") globalState.set(STATES.BUTTON);

    if (data.type == "BUTTON_CLICK_STOP") {
      globalState.set(STATES.IDLE);
    }
  });

  setInterval(() => updateEvent(wss), UPDATE_RATE);
});

globalState.subscribe((newState, oldState) =>
  changeEvent(newState, oldState, wss)
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
server.listen(PORT, () => console.log("Server started on port: " + PORT));
