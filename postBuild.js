import fs from "fs";

fs.copyFileSync("./manifest.json", "./dist/manifest.json");

console.log("manifest file copied to dist directory");
