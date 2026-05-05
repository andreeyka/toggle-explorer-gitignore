const esbuild = require("esbuild");

const isWatch = process.argv.includes("--watch");
const isProduction = process.argv.includes("--production");

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  outfile: "out/extension.js",
  external: ["vscode"],
  format: "cjs",
  platform: "node",
  target: "node18",
  sourcemap: !isProduction,
  minify: isProduction,
};

if (isWatch) {
  esbuild.context(options).then((ctx) => ctx.watch());
} else {
  esbuild.build(options).catch(() => process.exit(1));
}
