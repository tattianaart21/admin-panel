import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginStyledComponents } from "@rsbuild/plugin-styled-components";
import { tanstackRouter } from "@tanstack/router-plugin/rspack";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { pluginEslint } from "@rsbuild/plugin-eslint";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [pluginReact(), pluginStyledComponents(), pluginSvgr(), pluginEslint()],
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: "react",
          autoCodeSplitting: true,
        }),
      ],
    },
  },
  source: {
    entry: {
      index: "./src/app/index.tsx",
    },
  },
  output: {
    distPath: {
      root: "dist",
    },
  },
  html: {
    template: "./public/index.html",
    favicon: "./public/favicon_32.svg",
  },
});
