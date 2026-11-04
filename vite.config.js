import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: "site",
  base: "./",
  publicDir: "public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: resolve("site/src/client.jsx"),
      onwarn(warning, warn) {
        // This is a client bundle, not an RSC build. Base UI's client directives
        // do not need to survive bundling; retain every other build warning.
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes("use client")
        )
          return;
        warn(warning);
      },
    },
  },
  server: { allowedHosts: true },
});
