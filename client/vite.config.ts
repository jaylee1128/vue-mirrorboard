import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/googleevents": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/checkgoogleauth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/news": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
