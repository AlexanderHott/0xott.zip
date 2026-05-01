// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import expressiveCode from "astro-expressive-code";

import react from "@astrojs/react";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  site: "https://0xott.zip",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    expressiveCode({
      styleOverrides: {
        codeFontFamily: "GeistMono",
      },
    }),
    mdx(),
    react({ include: "**/react/*" }),
    solidJs({ include: "**/solid/*" }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});

