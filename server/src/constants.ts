import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../..", ".env") });

export const SERVER_PORT = process.env.SERVER_PORT || 8080;
export const HEARTBEAT_INTREVAL =
  Number(process.env.HEARTBEAT_INTREVAL) || 30000;
export const UPDATE_RATE = Number(process.env.UPDATE_RATE) || 3000;
export const FRONTEND_PORT = process.env.FRONTEND_PORT || 5173;
