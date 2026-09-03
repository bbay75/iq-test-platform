import fs from "fs/promises";
import path from "path";
import { chromium } from "playwright";
import sharp from "sharp";

const BASE_URL = "http://localhost:3000";

const LIFE_PATHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

async function main() {
  const outputDir = path.join(
    process.cwd(),
    "public",
    "share",
    "numerology-final",
  );

  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1400,
      height: 900,
    },
    deviceScaleFactor: 2,
  });

  for (const lifePath of LIFE_PATHS) {
    console.log(`Generating Numerology ${lifePath}...`);

    await page.goto(`${BASE_URL}/internal/og-preview/numerology/${lifePath}`, {
      waitUntil: "networkidle",
    });

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const card = page.locator("div.h-\\[630px\\].w-\\[1200px\\]").first();

    await card.waitFor({
      state: "visible",
    });

    const tempPath = path.join(outputDir, `temp-${lifePath}.png`);

    const finalPath = path.join(outputDir, `${lifePath}.jpg`);

    await card.screenshot({
      path: tempPath,
      type: "png",
    });

    await sharp(tempPath)
      .resize(1200, 630, {
        fit: "fill",
      })
      .jpeg({
        quality: 92,
        mozjpeg: true,
      })
      .toFile(finalPath);

    await fs.unlink(tempPath);

    console.log(`✅ Numerology ${lifePath}`);
  }

  await browser.close();

  console.log("✅ All Numerology share images generated");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
