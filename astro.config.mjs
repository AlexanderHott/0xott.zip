// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://0xott.zip",
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    svg: true,
  },
});
