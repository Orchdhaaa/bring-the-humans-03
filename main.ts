import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const video = readFileSync("VIDEO.json", "utf8");
const parsed = JSON.parse(video) as unknown;
if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string" ||
  !/^https:\/\/www\.tiktok\.com\/@[A-Za-z0-9._-]+\/video\/\d+$/.test(
    (parsed as { url: string }).url,
  )
) {
  throw new Error(
    "VIDEO.json must name a real TikTok video URL (https://www.tiktok.com/@<handle>/video/<id>), not a placeholder",
  );
}
writeFileSync(join(outDir, "VIDEO.json"), video);
