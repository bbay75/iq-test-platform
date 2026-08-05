import { chromium } from "playwright";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const TYPES = [
  "intj",
  "intp",
  "entj",
  "entp",
  "infj",
  "infp",
  "enfj",
  "enfp",
  "istj",
  "isfj",
  "estj",
  "esfj",
  "istp",
  "isfp",
  "estp",
  "esfp",
];

const GENDERS = ["female", "male"] as const;

async function main() {
  const browser = await chromium.launch();

  const page = await browser.newPage({
    viewport: {
      width: 1400,
      height: 900,
    },
    deviceScaleFactor: 2,
  });

  for (const gender of GENDERS) {
    const outputDirectory = path.join(
      process.cwd(),
      "public",
      "share",
      "mbti-og-card",
      gender,
    );

    await fs.mkdir(outputDirectory, {
      recursive: true,
    });

    for (const type of TYPES) {
      console.log(`Generating ${gender}/${type}...`);

      const tempPath = path.join(outputDirectory, `${type}-temp.png`);

      const outputPath = path.join(outputDirectory, `${type}-final.jpg`);

      await page.goto(
        `http://localhost:3000/internal/og-preview/mbti/${gender}/${type}`,
        {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        },
      );

      await page.waitForSelector("#mbti-og-card", {
        timeout: 30000,
      });

      await page.evaluate(async () => {
        await document.fonts.ready;

        const images = Array.from(document.images);

        await Promise.all(
          images.map((img) => {
            if (img.complete) return Promise.resolve();

            return new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            });
          }),
        );
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
          sigma: 0.6,
        })
        .jpeg({
          quality: 92,
          chromaSubsampling: "4:4:4",
          mozjpeg: true,
        })
        .toFile(outputPath);

      await fs.unlink(tempPath);

      console.log(`✅ ${gender}/${type}`);
    }
  }

  await browser.close();

  console.log("✅ All 32 MBTI OG images generated");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
