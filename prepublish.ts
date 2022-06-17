import { buildSync } from "esbuild";
import * as fs from "fs";
import * as path from "path";
import rimraf from "rimraf";

import originalPkg from "./package.json";

const SRC_FILE = path.resolve(__dirname, "src", "index.ts");
const DEST_FILE = path.resolve(__dirname, "dist", "index.js");
const DEST_PKG_JSON = path.resolve(__dirname, "dist", "package.json");

// clean the dist folder
rimraf.sync("dist");

// build the dist file
buildSync({
  entryPoints: [SRC_FILE],
  outfile: DEST_FILE,
  platform: "node",
  bundle: true,
  minify: true,
  legalComments: "none",
});

// create the package.json to be published
const pkgJson = {
  ...originalPkg,
  main: "index.js",
  bin: "index.js",
  scripts: {
    start: "node index.js",
  },
  // remove all deps since esbuild already bundles everything
  dependencies: {},
  devDependencies: {},
};
fs.writeFileSync(DEST_PKG_JSON, JSON.stringify(pkgJson, null, 2));

// copy essential files like the readme
fs.copyFileSync("README.md", "dist/README.md");
