import { defineConfig } from "vite";
import palta from "vite-plugin-palta";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [tailwindcss(), palta()],
});
