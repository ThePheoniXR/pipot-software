import express from "express";
import { WebSocketServer } from "ws";
import { WebSocketI } from "./types/types";
import path from "path";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;
const HEARTBEAT_INTREVAL = Number(process.env.HEARTBEAT_INTREVAL) || 30000;

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.status(200).render("index");
});

wss.on("connection", (ws: WebSocketI) => {
  console.log("Connected");

  ws.isAlive = true;
  ws.on("error", console.error);
  ws.on("pong", () => {
    ws.isAlive = true;
  });
});

// Ping message
const interval = setInterval(function ping() {
  wss.clients.forEach((ws: any) => {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, HEARTBEAT_INTREVAL);

wss.on("close", () => {
  clearInterval(interval);
});

wss.on("listening", () => console.log("WebSocket server started."));
server.listen(PORT, () => console.log("Server started on port: " + PORT));