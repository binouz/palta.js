import { defineConfig } from "vite";
import { resolve } from "path";

import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "vite-plugin-palta",
      fileName: (format) =>
        format === "es" ? `index.${format}.mjs` : `index.${format}.js`,
    },
    rollupOptions: {
      external: ["vite", "@swc/core"],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [dts()],
  resolve: { alias: { "/": resolve("src/") } },
});
