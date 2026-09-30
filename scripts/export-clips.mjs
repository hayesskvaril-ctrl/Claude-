// Renders every animated clip in js/clips.js to an MP4 file in videos/.
//
//   npm install playwright        (once)
//   node scripts/export-clips.mjs [clip-id ...]
//
// Needs ffmpeg on PATH (or set FFMPEG=/path/to/ffmpeg). Frames are drawn by the same
// draw(ctx, t) functions the website uses, at 1920x1080 and 30 fps, with captions burned in.
import { chromium } from "playwright";
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "videos");
const FPS = 30, SCALE = 1.5, INTRO = 2.2, OUTRO = 1.2;
const ffmpeg = process.env.FFMPEG || "ffmpeg";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage();
// Fetch web fonts with curl so they load even where the browser can't reach them directly.
await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => {
  const url = route.request().url();
  const body = execFileSync("curl", ["-sSL", "-A", "Mozilla/5.0 Chrome/120", url]);
  route.fulfill({ body, contentType: url.includes("googleapis") ? "text/css" : "font/woff2" });
});
await page.goto(pathToFileURL(path.join(root, "index.html")).href);
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => Promise.all(["500 20px Barlow", "600 20px Barlow", "500 20px 'JetBrains Mono'"].map((f) => document.fonts.load(f))));

const all = await page.evaluate(() => Object.keys(Clips.defs));
const ids = process.argv.slice(2).length ? process.argv.slice(2) : all;

for (const id of ids) {
  const duration = await page.evaluate((id) => Clips.defs[id].duration, id);
  const total = Math.round((INTRO + duration + OUTRO) * FPS);
  const file = path.join(outDir, `${id}.mp4`);
  const enc = spawn(ffmpeg, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium", "-movflags", "+faststart", file], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => enc.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`)))));

  const BATCH = 30;
  for (let f = 0; f < total; f += BATCH) {
    const frames = await page.evaluate(({ id, f, n, total, FPS, SCALE, INTRO }) => {
      const c = window.__exportCanvas || (window.__exportCanvas = Object.assign(document.createElement("canvas"), { width: 1920, height: 1080 }));
      const ctx = c.getContext("2d"), d = Clips.defs[id], out = [];
      for (let i = f; i < Math.min(f + n, total); i++) {
        const t = i / FPS;
        if (t < INTRO) Clips.titleCard(ctx, d, t / INTRO, SCALE);
        else Clips.renderFrame(ctx, d, Math.min(t - INTRO, d.duration), true, SCALE);
        out.push(c.toDataURL("image/jpeg", 0.93).split(",")[1]);
      }
      return out;
    }, { id, f, n: BATCH, total, FPS, SCALE, INTRO });
    for (const b64 of frames) if (!enc.stdin.write(Buffer.from(b64, "base64"))) await new Promise((r) => enc.stdin.once("drain", r));
  }
  enc.stdin.end();
  await done;
  console.log(`wrote videos/${id}.mp4 (${(total / FPS).toFixed(1)}s)`);
}
await browser.close();
