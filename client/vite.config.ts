import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const exposedEnv = {
  PORT: process.env.SERVER_PORT,
  HEARTBEAT_INTERVAL: process.env.HEARTBEAT_INTERVAL,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": exposedEnv,
  },
});
