import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import commonjs from "vite-plugin-commonjs";
export default defineConfig({
  plugins: [react(), commonjs()],
  /* server: {
    port: 3001,
    host: "10.10.1.158",
  }, */
  server: {
    host: "192.168.1.13",
  },
});
