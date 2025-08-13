import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
server: {
    proxy: {
      "/api": "http://localhost:4001",
    },
  },
})