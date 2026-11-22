import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const videoPath = join(botDir, "VIDEO.json");
let raw: string;
try {
  raw = readFileSync(videoPath, "utf8");
} catch (err) {
  console.error(`Failed to read VIDEO.json from bot directory ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}

let data: unknown;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`VIDEO.json in ${botDir} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof data !== "object" || data === null || Array.isArray(data)) {
  console.error(`VIDEO.json in ${botDir} must contain a JSON object with a url field, got: ${String(data)}`);
  process.exit(1);
}

const url = (data as { url?: unknown }).url;
const urlPattern = /^https:\/\/www\.tiktok\.com\/@[A-Za-z0-9._-]+\/video\/\d+$/;
if (typeof url !== "string" || !urlPattern.test(url)) {
  console.error(`VIDEO.json url is not a valid TikTok video address: ${String(url)}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "VIDEO.json"), raw);
console.log(`Copied VIDEO.json to ${join(outDir, "VIDEO.json")}`);
