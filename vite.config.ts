import { resolve } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist",
    minify: "terser",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.js"),
        sidebar: resolve(__dirname, "src/sidebar/sidebar.js"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    terserOptions: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/**/*.html",
          dest: ".",
        },
        {
          src: "src/manifest.json",
          dest: ".",
        },
      ],
    }),
  ],
});
