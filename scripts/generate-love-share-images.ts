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
    deviceScaleFactor: 2,
  });

  const outputDirectory = path.join(
    process.cwd(),
    "public",
    "share",
    "love-final",
  );

  await fs.mkdir(outputDirectory, {
    recursive: true,
  });

  for (let score = 0; score <= 100; score++) {
    console.log(`Generating love ${score}%...`);

    const tempPath = path.join(outputDirectory, `${score}-temp.png`);

    const outputPath = path.join(outputDirectory, `${score}.jpg`);

    await page.goto(`http://localhost:3000/internal/og-preview/love/${score}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForSelector("#love-share-card", {
      timeout: 30000,
    });

    await page.evaluate(async () => {
      await document.fonts.ready;

      const images = Array.from(document.images);

      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();

          return new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), {
              once: true,
            });

            img.addEventListener("error", () => resolve(), {
              once: true,
            });
          });
        }),
      );
    });

    const card = page.locator("#love-share-card");

    await card.screenshot({
      path: tempPath,
      type: "png",
    });

    await sharp(tempPath)
      .resize(1200, 630, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
      })
      .jpeg({
        quality: 92,
        chromaSubsampling: "4:4:4",
        mozjpeg: true,
      })
      .toFile(outputPath);

    await fs.unlink(tempPath);

    console.log(`✅ ${score}%`);
  }

  await browser.close();

  console.log("✅ All 101 Love share images generated");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
