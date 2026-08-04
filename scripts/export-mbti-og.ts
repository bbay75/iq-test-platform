import { chromium } from "playwright";
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

  const outputPath = path.join(outputDirectory, "estj-v4.png");

  await card.screenshot({
    path: outputPath,
    type: "png",
  });

  await browser.close();

  console.log("✅ High-quality ESTJ OG image generated");
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
