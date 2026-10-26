import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// banc d'essai local : dev/*.html, avec le POC (polices, assets, js/data.js) servi à la racine
export default defineConfig({
  root: "dev",
  publicDir: "../..",
  plugins: [react()],
  server: {port: 5174, open: "/coverflow.html"},
});
