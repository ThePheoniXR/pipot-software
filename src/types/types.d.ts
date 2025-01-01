import WebSocket from "ws";

interface WebSocketI extends WebSocket {
  isAlive: boolean;
}
