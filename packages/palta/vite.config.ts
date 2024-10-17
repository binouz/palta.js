import { defineConfig } from "vite";
import { resolve } from "path";

import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "palta",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [dts()],
  resolve: { alias: { "/": resolve("src/") } },
});
