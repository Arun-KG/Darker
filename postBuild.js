import fs from "fs";

fs.copyFileSync("./manifest.json", "./dist/manifest.json");
fs.copyFileSync("./src/darken.css", "./dist/darken.css");

console.log("manifest and style files copied to dist directory");
