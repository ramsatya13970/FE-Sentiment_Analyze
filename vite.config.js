import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Uncomment and point at your API host during local dev if you want to
    // avoid CORS issues by proxying /api requests through Vite.
    // proxy: {
    //   "/api": {
    //     target: "https://your-api-host.example.com",
    //     changeOrigin: true,
    //   },
    // },
  },
});
