import sharp from "sharp";
import path from "node:path";
import fsp from "node:fs/promises";

import { mbtiShareTemplates } from "../data/mbtiShareTemplates";

const WIDTH = 1200;
const HEIGHT = 630;
const QUOTE_FONT_SIZE = 29;
const QUOTE_WIDTH = 850;

const PROJECT_ROOT = process.cwd();

/**
 * Одоохондоо ESTJ male layout шалгаж байгаа.
 * Дараа нь 32 зурагт loop хийнэ.
 */
const TYPE = "ESTJ";
const GENDER = "male";

const template = mbtiShareTemplates[TYPE];

if (!template) {
  throw new Error(`Template not found for type: ${TYPE}`);
}

const inputPath = path.join(
  PROJECT_ROOT,
  "public",
  "share",
  "mbti-og-bg",
  GENDER,
  `${TYPE.toLowerCase()}.webp`,
);

const outputPath = path.join(
  PROJECT_ROOT,
  "public",
  "share",
  "mbti-og-card",
  GENDER,
  `${TYPE.toLowerCase()}.webp`,
);

const caveatFontPath = path.join(
  PROJECT_ROOT,
  "public",
  "fonts",
  "Caveat-Regular.ttf",
);

/**
 * Зүүн талын нийт text block.
 */
const CONTENT = {
  left: 64,
  right: 540,

  labelTextY: 80,
  labelLineY: 75,

  typeY: 214,
  archetypeY: 289,
  rarityY: 339,

  firstTraitCenterY: 396,
  traitGap: 44,

  quoteY: 565,
} as const;

const contentCenterX = 270;

function escapeXml(value: string) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createSvg() {
  const label = escapeXml("ТАНЫ MBTI ТӨРӨЛ");
  const type = escapeXml(TYPE);
  const archetype = escapeXml(template.archetype.toUpperCase());
  const rarity = escapeXml(template.rarity);
  const website = escapeXml("seer.mn");
  const accent = escapeXml(template.accent || "#d7b66f");

  const strengths = template.strengths.slice(0, 3).map(escapeXml);

  const labelInnerGap = 105;
  const labelOuterWidth = 172;

  return Buffer.from(`
    <svg
      width="${WIDTH}"
      height="${HEIGHT}"
      viewBox="0 0 ${WIDTH} ${HEIGHT}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="leftOverlay"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stop-color="#080a0d"
            stop-opacity="0.94"
          />

          <stop
            offset="48%"
            stop-color="#080a0d"
            stop-opacity="0.77"
          />

          <stop
            offset="78%"
            stop-color="#080a0d"
            stop-opacity="0.22"
          />

          <stop
            offset="100%"
            stop-color="#080a0d"
            stop-opacity="0"
          />
        </linearGradient>

        <linearGradient
          id="bottomOverlay"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="#000000"
            stop-opacity="0"
          />

          <stop
            offset="100%"
            stop-color="#000000"
            stop-opacity="0.58"
          />
        </linearGradient>

        <filter
          id="textShadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="4"
            flood-color="#000000"
            flood-opacity="0.55"
          />
        </filter>

        <filter
          id="blurSoft"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur stdDeviation="3.5" />
        </filter>

        <filter
          id="blurWide"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <!-- Background contrast -->
      <rect
        x="0"
        y="0"
        width="${WIDTH}"
        height="${HEIGHT}"
        fill="url(#leftOverlay)"
      />

      <rect
        x="0"
        y="250"
        width="${WIDTH}"
        height="380"
        fill="url(#bottomOverlay)"
      />

      <!-- Top label lines -->
      <line
        x1="${contentCenterX - labelOuterWidth}"
        y1="${CONTENT.labelLineY}"
        x2="${contentCenterX - labelInnerGap}"
        y2="${CONTENT.labelLineY}"
        stroke="rgba(201,169,95,0.42)"
        stroke-width="1.1"
      />

      <line
        x1="${contentCenterX + labelInnerGap}"
        y1="${CONTENT.labelLineY}"
        x2="${contentCenterX + labelOuterWidth}"
        y2="${CONTENT.labelLineY}"
        stroke="rgba(201,169,95,0.42)"
        stroke-width="1.1"
      />

      <!-- Top label -->
      <text
        x="${contentCenterX}"
        y="${CONTENT.labelTextY}"
        text-anchor="middle"
        fill="#c9a95f"
        fill-opacity="0.74"
        font-family="Arial, Helvetica, sans-serif"
        font-size="14"
        font-weight="600"
        letter-spacing="4.2"
      >
        ${label}
      </text>

      <!-- Wide accent glow -->
      <text
        x="${CONTENT.left}"
        y="${CONTENT.typeY}"
        fill="${accent}"
        fill-opacity="0.28"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="154"
        font-weight="700"
        letter-spacing="2"
        filter="url(#blurWide)"
      >
        ${type}
      </text>

      <!-- Soft white glow -->
      <text
        x="${CONTENT.left}"
        y="${CONTENT.typeY}"
        fill="#ffffff"
        fill-opacity="0.18"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="154"
        font-weight="700"
        letter-spacing="2"
        filter="url(#blurSoft)"
      >
        ${type}
      </text>

      <!-- Close accent glow -->
      <text
        x="${CONTENT.left}"
        y="${CONTENT.typeY}"
        fill="${accent}"
        fill-opacity="0.55"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="154"
        font-weight="700"
        letter-spacing="2"
        filter="url(#blurSoft)"
      >
        ${type}
      </text>

      <!-- Main MBTI type -->
      <text
        x="${CONTENT.left}"
        y="${CONTENT.typeY}"
        fill="${accent}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="154"
        font-weight="700"
        letter-spacing="2"
        filter="url(#textShadow)"
      >
        ${type}
      </text>

      <!-- Archetype -->
      <text
        x="${CONTENT.left + 8}"
        y="${CONTENT.archetypeY}"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="29"
        font-weight="700"
        letter-spacing="1.2"
        filter="url(#textShadow)"
      >
        ${archetype}
      </text>

      <!-- Rarity -->
      <text
        x="${CONTENT.left + 8}"
        y="${CONTENT.rarityY}"
        fill="#ffffff"
        fill-opacity="0.90"
        font-family="Arial, Helvetica, sans-serif"
        font-size="21"
        font-weight="400"
      >
        <tspan>Хүмүүсийн дөнгөж </tspan>

        <tspan
          fill="${accent}"
          fill-opacity="1"
          font-weight="800"
        >${rarity}</tspan>

        <tspan
          fill="#ffffff"
          fill-opacity="0.90"
        >-д байдаг</tspan>
      </text>

      ${
        strengths[0]
          ? `
      <circle
        cx="${CONTENT.left + 18}"
        cy="${CONTENT.firstTraitCenterY}"
        r="5"
        fill="${accent}"
      />

      <text
        x="${CONTENT.left + 37}"
        y="${CONTENT.firstTraitCenterY + 8}"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="23"
        font-weight="600"
      >
        ${strengths[0]}
      </text>
      `
          : ""
      }

      ${
        strengths[1]
          ? `
      <circle
        cx="${CONTENT.left + 18}"
        cy="${CONTENT.firstTraitCenterY + CONTENT.traitGap}"
        r="5"
        fill="${accent}"
      />

      <text
        x="${CONTENT.left + 37}"
        y="${CONTENT.firstTraitCenterY + CONTENT.traitGap + 8}"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="23"
        font-weight="600"
      >
        ${strengths[1]}
      </text>
      `
          : ""
      }

      ${
        strengths[2]
          ? `
      <circle
        cx="${CONTENT.left + 18}"
        cy="${CONTENT.firstTraitCenterY + CONTENT.traitGap * 2}"
        r="5"
        fill="${accent}"
      />

      <text
        x="${CONTENT.left + 37}"
        y="${CONTENT.firstTraitCenterY + CONTENT.traitGap * 2 + 8}"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="23"
        font-weight="600"
      >
        ${strengths[2]}
      </text>
      `
          : ""
      }

      <!-- Watermark -->
      <text
        x="1125"
        y="590"
        text-anchor="end"
        fill="#ffffff"
        fill-opacity="0.58"
        font-family="Arial, Helvetica, sans-serif"
        font-size="19"
        font-weight="600"
        letter-spacing="1"
      >
        ${website}
      </text>
    </svg>
  `);
}

async function createQuoteOverlay() {
  const quoteLines = template.quoteLines?.length
    ? template.quoteLines
    : [`“${template.quote}”`];

  const quoteText = escapeXml(quoteLines.join("\n"));

  return sharp({
    text: {
      text: `<span foreground="#f4eadf">${quoteText}</span>`,
      font: `Caveat ${QUOTE_FONT_SIZE}`,
      fontfile: caveatFontPath,
      width: QUOTE_WIDTH,
      align: "left",
      spacing: 7,
      rgba: true,
      wrap: "word",
    },
  })
    .png()
    .toBuffer();
}

async function run() {
  await fsp.access(inputPath);
  await fsp.access(caveatFontPath);

  await fsp.mkdir(path.dirname(outputPath), {
    recursive: true,
  });

  const svgOverlay = createSvg();
  const quoteOverlay = await createQuoteOverlay();

  await sharp(inputPath)
    .resize(WIDTH, HEIGHT, {
      fit: "cover",
      position: "centre",
    })
    .composite([
      {
        input: svgOverlay,
        top: 0,
        left: 0,
      },
      {
        input: quoteOverlay,
        top: template.quoteLines?.length === 2 ? 515 : 530,
        left: CONTENT.left,
      },
    ])
    .webp({
      quality: 90,
      effort: 5,
    })
    .toFile(outputPath);

  console.log("✅ ESTJ male OG card generated");
  console.log(outputPath);
}

run().catch((error: unknown) => {
  console.error("❌ Failed to generate OG image");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});
