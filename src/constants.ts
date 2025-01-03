import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const HEARTBEAT_INTREVAL =
  Number(process.env.HEARTBEAT_INTREVAL) || 30000;
export const UPDATE_RATE = Number(process.env.UPDATE_RATE) || 3000;
