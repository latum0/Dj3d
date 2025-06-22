import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Assure-toi que ton serveur tourne bien sur un bon port
  },
});
