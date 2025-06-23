import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import postcss from "rollup-plugin-postcss";
import fs from "fs";
import { createBanner } from "../script/banner.js";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));

const isProduction = process.env.NODE_ENV === "production";

console.log(`path env = ${process.env.INIT_CWD}`);

const destDir = `${process.env.INIT_CWD}/public`.replace(/\\/g, "/");
const filename = `${pkg.name.replace(/-/g, "_")}.js`;
const loaderFilename = `${pkg.name.replace(/-/g, "_")}.user.js`;

// 主应用配置
const mainConfig = {
  input: "src/index.ts",
  output: {
    file: `${destDir}/${filename}`,
    format: "umd",
    sourcemap: isProduction ? false : "inline",
    banner: `${createBanner(pkg.name, pkg.version, pkg.repository?.url || "")}\n// @preserve <nowiki>\n`,
    footer: `\n// @preserve </nowiki>\n`,
  },
  external: ["L", "mediaWiki", "jQuery"],
  plugins: [
    postcss({
      minimize: true,
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      declaration: false,
      noEmit: false,
      target: "es2015",
    }),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".ts"],
      presets: [["@babel/preset-env"]],
    }),
    copy({
      targets: [
        {
          src: `loader.user.js`,
          dest: destDir,
          rename: loaderFilename,
          transform: (content) => {
            return content.toString().replaceAll("__OUTPUT__", filename);
          },
        },
      ],
    }),
    isProduction && terser(),
  ].filter(Boolean),
};

export default defineConfig(() => {
  return [mainConfig];
});
