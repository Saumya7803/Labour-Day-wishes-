import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
import { chromium } from "playwright-core";
import ffmpegPath from "ffmpeg-static";

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, "assets");
const framesDir = path.join(outputDir, "demo-frames");
const outputVideo = path.join(outputDir, "labour-day-demo.mp4");
const port = 4173;
const fps = 15;
const durationSeconds = 20;
const totalFrames = fps * durationSeconds;

const chromePaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function clearFrames(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  for (const file of fs.readdirSync(dirPath)) {
    fs.unlinkSync(path.join(dirPath, file));
  }
}

function detectMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=UTF-8";
  if (ext === ".css") return "text/css; charset=UTF-8";
  if (ext === ".js" || ext === ".mjs") return "application/javascript; charset=UTF-8";
  if (ext === ".json") return "application/json; charset=UTF-8";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".mp3") return "audio/mpeg";
  return "application/octet-stream";
}

function createStaticServer(root, serverPort) {
  const server = http.createServer((req, res) => {
    let reqPath = req.url?.split("?")[0] || "/";
    if (reqPath === "/") reqPath = "/index.html";
    const localPath = path.join(root, decodeURIComponent(reqPath));

    if (!localPath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(localPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not Found");
        return;
      }
      res.writeHead(200, { "Content-Type": detectMime(localPath) });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(serverPort, "127.0.0.1", () => resolve(server));
  });
}

function getBrowserExecutablePath() {
  for (const browserPath of chromePaths) {
    if (fs.existsSync(browserPath)) {
      return browserPath;
    }
  }
  throw new Error("No supported Chrome/Edge executable found.");
}

async function captureFrames() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: getBrowserExecutablePath(),
    args: ["--disable-web-security", "--autoplay-policy=no-user-gesture-required"]
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Disable blinking cursor in typed heading to reduce flicker in recording.
  await page.addStyleTag({
    content: ".typed-cursor { visibility: hidden !important; }"
  });

  for (let frame = 0; frame < totalFrames; frame += 1) {
    if (frame === 30) {
      await page.fill("#employee-name", "Saumya");
      await page.fill("#company-name", "Saumya Office Group");
      await page.click("#generate-wish");
    }

    if (frame === 60) {
      await page.click("#mode-toggle");
    }

    if (frame === 90) {
      await page.click('[data-theme="festive"]');
    }

    if (frame === 120) {
      await page.click('[data-theme="dark-elegant"]');
    }

    if (frame === 150) {
      await page.click('[data-theme="corporate"]');
      await page.click("#mode-toggle");
    }

    if (frame === 180) {
      await page.click("#confetti-replay");
    }

    if (frame === 210) {
      await page.locator(".control-panel").scrollIntoViewIfNeeded();
    }

    const framePath = path.join(framesDir, `frame-${String(frame).padStart(4, "0")}.png`);
    await page.screenshot({ path: framePath });
    await page.waitForTimeout(1000 / fps);
  }

  await browser.close();
}

function renderVideo() {
  return new Promise((resolve, reject) => {
    const ffmpegArgs = [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      path.join(framesDir, "frame-%04d.png"),
      "-vf",
      "format=yuv420p",
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outputVideo
    ];

    const ffmpeg = spawn(ffmpegPath, ffmpegArgs, { stdio: "inherit" });
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
}

async function main() {
  ensureDirectory(outputDir);
  ensureDirectory(framesDir);
  clearFrames(framesDir);

  const server = await createStaticServer(projectRoot, port);
  try {
    await captureFrames();
    await renderVideo();
    console.log(`Demo video created: ${outputVideo}`);
  } finally {
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
