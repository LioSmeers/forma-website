import { resolve } from "node:path";
import { defineConfig } from "vite";

const pages = [
  "index",
  "pakketten",
  "diensten",
  "portfolio",
  "over-ons",
  "contact",
  "privacy",
  "bedankt",
];

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page, resolve(__dirname, `${page}.html`)]),
      ),
    },
  },
});
