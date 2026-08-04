import { chromium } from "playwright";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

async function main() {
  const browser = await chromium.launch();

  const page = await browser.newPage({
    viewport: {
      width: 1400,
      height: 900,
    },
    deviceScaleFactor: 1,
  });

  await page.goto("http://localhost:3000/internal/og-preview/mbti/male/estj", {
    waitUntil: "networkidle",
  });

  await page.evaluate(() => document.fonts.ready);

  const card = page.locator("#mbti-og-card");

  const tempPath = path.join(
    process.cwd(),
    "public",
    "share",
    "mbti-og-card",
    "male",
    "estj-temp.png",
  );

  const outputPath = path.join(
    process.cwd(),
    "public",
    "share",
    "mbti-og-card",
    "male",
    "estj-v3.webp",
  );

  await card.screenshot({
    path: tempPath,
  });

  await sharp(tempPath)
    .resize(1200, 630)
    .webp({
      quality: 92,
    })
    .toFile(outputPath);

  await fs.unlink(tempPath);

  await browser.close();

  console.log("✅ New ESTJ OG image generated");
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
