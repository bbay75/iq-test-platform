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
    "iq-final",
  );

  await fs.mkdir(outputDirectory, {
    recursive: true,
  });

  for (let score = 0; score <= 145; score++) {
    console.log(`Generating IQ ${score}...`);

    const tempPath = path.join(outputDirectory, `${score}-temp.png`);
    const outputPath = path.join(outputDirectory, `${score}.jpg`);

    await page.goto(`http://localhost:3000/internal/og-preview/iq/${score}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
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

    const card = page.locator("div.h-\\[630px\\].w-\\[1200px\\]");

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

    console.log(`✅ IQ ${score}`);
  }

  await browser.close();

  console.log("✅ All IQ share images generated");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
