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

  const outputPath = path.join(outputDirectory, "estj-raw.png");

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

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const card = page.locator("#mbti-og-card");

  await card.screenshot({
    path: outputPath,
    type: "png",
  });

  await browser.close();

  console.log("✅ ESTJ raw PNG generated");
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
