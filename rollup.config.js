import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
import fs from "fs";
import { createBanner } from "./script/banner.js";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));

const isProduction = process.env.NODE_ENV === "production";
const buildTarget = process.env.BUILD_TARGET;

// 主应用配置
const mainConfig = {
  input: "src/index.ts",
  output: {
    file: "public/card_image.js",
    format: "umd",
    name: "card_image",
    sourcemap: isProduction ? false : "inline",
    banner: `${createBanner(pkg.name, pkg.version, pkg.repository?.url || "")}\n// @preserve <nowiki>\n`,
    footer: `\n// @preserve </nowiki>\n`,
  },
  external: ["L", "mediaWiki", "jQuery"],
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      declaration: false,
      noEmit: false,
    }),
    replace({
      preventAssignment: true,
      __MAP_CLASS__: JSON.stringify(isProduction ? ".interactive-map" : ".interactive-map-debug"),
    }),
    copy({
      targets: [{ src: "resource/*", dest: "public" }],
    }),
    isProduction && terser(),
  ].filter(Boolean),
};

export default defineConfig(() => {
  return [mainConfig];
});
