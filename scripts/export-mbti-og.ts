import { chromium } from "playwright";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

async function main() {
  const outputDirectory = path.join(
    process.cwd(),
    "public",
    "share",
    "mbti-og-card",
    "male",
  );

  await fs.mkdir(outputDirectory, {
    recursive: true,
  });

  const tempPath = path.join(outputDirectory, "estj-temp.png");
  const outputPath = path.join(outputDirectory, "estj-v5.png");

  const browser = await chromium.launch();

  const page = await browser.newPage({
    viewport: {
      width: 1400,
      height: 900,
    },
    deviceScaleFactor: 2,
  });

  await page.goto("http://localhost:3000/internal/og-preview/mbti/male/estj", {
    waitUntil: "networkidle",
  });

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const card = page.locator("#mbti-og-card");

  await card.screenshot({
    path: tempPath,
    type: "png",
  });

  await sharp(tempPath)
    .resize(1200, 630, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({
      sigma: 0.7,
    })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toFile(outputPath);

  await fs.unlink(tempPath);
  await browser.close();

  console.log("✅ ESTJ v5 PNG generated");
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
