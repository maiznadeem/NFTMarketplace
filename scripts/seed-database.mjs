// Builds the Realtime Database `NFTData` node from data/nfts.json + data/images and (optionally) writes it.
//
// - NFT artwork is re-encoded as WebP at its largest display size (full screen width, about 1080 px;
//   portrait art is center-cropped to 1080x1350, the tallest area the app shows) and embedded as a
//   data: URI, so images are served by the database behind App Check.
// - Bid avatars stay as keys (e.g. "person02"): the app resolves them to images bundled in the APK.
//
// Usage:
//   node scripts/seed-database.mjs --dry-run [--out file.json]   build only, print sizes
//   node scripts/seed-database.mjs --write                         replace NFTData (needs an owner's gcloud login)
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const DB_URL = "https://nft-marketplace-d54bc-default-rtdb.firebaseio.com";
const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\\/g, "/");
const args = process.argv.slice(2);
const write = args.includes("--write");
const outFile = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;

async function encode(file) {
  const img = sharp(`${root}data/images/${file}`);
  const { width, height } = await img.metadata();
  const portrait = height / width > 1350 / 1080;
  const out = portrait
    ? img.resize(1080, 1350, { fit: "cover", position: "centre" })
    : img.resize(1080, 1120, { fit: "outside", withoutEnlargement: true });
  return out.webp({ quality: 74, effort: 6 }).toBuffer();
}

const items = JSON.parse(readFileSync(`${root}data/nfts.json`, "utf8"));
let imageBytes = 0;
for (const item of items) {
  const buf = await encode(item.image);
  imageBytes += buf.length;
  item.image = `data:image/webp;base64,${buf.toString("base64")}`;
}
const json = JSON.stringify(items);
console.log(`${items.length} items, artwork ${(imageBytes / 1024).toFixed(0)} KB, payload ${(json.length / 1024).toFixed(0)} KB`);
if (outFile) writeFileSync(outFile, json);

if (write) {
  const token = execSync("gcloud auth print-access-token", { encoding: "utf8" }).trim();
  const res = await fetch(`${DB_URL}/NFTData.json`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: json,
  });
  if (!res.ok) throw new Error(`write failed: ${res.status} ${await res.text()}`);
  console.log("NFTData written");
}
