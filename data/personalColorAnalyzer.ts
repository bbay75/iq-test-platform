export type PersonalColorAnalysis = {
  season: "Warm Spring" | "Cool Summer" | "Deep Autumn" | "Clear Winter";
  undertone: "Warm" | "Cool" | "Neutral";
  brightness: "Light" | "Medium" | "Deep";
  contrast: "Low" | "Medium" | "High";
  confidence: number;
  skinRgb: { r: number; g: number; b: number };
  bestColors: string[];
  avoidColors: string[];
  jewelry: string;
  makeup: string;
  hair: string;
  style: string;
  advice: string;
};

type Rgb = { r: number; g: number; b: number };

type SeasonProfile = Omit<
  PersonalColorAnalysis,
  "undertone" | "brightness" | "contrast" | "confidence" | "skinRgb"
>;

const seasonProfiles: Record<PersonalColorAnalysis["season"], SeasonProfile> = {
  "Warm Spring": {
    season: "Warm Spring",
    bestColors: ["#FF7F50", "#F4A261", "#E9C46A", "#8AB17D"],
    avoidColors: ["#A8A8B3", "#BCC6E6", "#7A8799", "#D6D6E7"],
    jewelry: "Алтлаг, champagne gold, warm rose gold төрлийн гоёл илүү зохино.",
    makeup: "Peach, coral, honey nude, warm blush төрлийн өнгө илүү зохимжтой.",
    hair: "Honey brown, caramel, warm chestnut, golden brown өнгө илүү тохирно.",
    style:
      "Fresh, bright, lively, natural дулаан palette таны төрхийг амьд харагдуулна.",
    advice:
      "Хэт хүйтэн саарал, мөстэй pastel өнгөнөөс зайлсхийж, дулаан гэрэлтсэн өнгө сонго.",
  },
  "Cool Summer": {
    season: "Cool Summer",
    bestColors: ["#C08497", "#9FB7D9", "#B8A1D9", "#8D99AE"],
    avoidColors: ["#F4A261", "#E9C46A", "#D97706", "#A16207"],
    jewelry:
      "Silver, platinum, white gold төрлийн гоёл илүү зөөлөн, цэвэрхэн зохино.",
    makeup:
      "Rose pink, mauve, berry nude, cool blush төрлийн өнгө илүү тохиромжтой.",
    hair: "Ash brown, cool mocha, soft espresso, cool dark brown өнгө илүү зохино.",
    style:
      "Soft elegance, muted tones, refined cool palette таны төрхийг хамгийн цэвэрхэн болгоно.",
    advice:
      "Хэт шаргал, алтлаг, улбар шарлаг өнгөнөөс зайлсхийвэл арьсны өнгө цайвар, цэвэр харагдана.",
  },
  "Deep Autumn": {
    season: "Deep Autumn",
    bestColors: ["#6B8E23", "#B85C38", "#5C4033", "#2A6F6B"],
    avoidColors: ["#E0E7FF", "#D8B4FE", "#F5F5F5", "#DDE7F0"],
    jewelry: "Gold, bronze, antique gold төрлийн гоёл илүү гүн, тансаг зохино.",
    makeup:
      "Terracotta, cinnamon, brick, warm brown, deep peach төрлийн өнгө илүү тохирно.",
    hair: "Chocolate brown, warm espresso, chestnut, auburn чиглэлийн өнгө илүү зохино.",
    style:
      "Rich, earthy, deep palette нь таны төрхийг илүү тансаг, хүчтэй харагдуулна.",
    advice:
      "Хэт цайвар, мөстэй, цэнхэр туяатай өнгө таны төрхийг сулруулж магадгүй.",
  },
  "Clear Winter": {
    season: "Clear Winter",
    bestColors: ["#111111", "#FFFFFF", "#0077B6", "#D81B60"],
    avoidColors: ["#C2B280", "#C19A6B", "#A3B18A", "#D8C3A5"],
    jewelry:
      "Silver, white gold, platinum, crisp metallic finish илүү хүчтэй зохино.",
    makeup:
      "Berry, plum, cool red, cool pink, defined contrast-той makeup илүү тохиромжтой.",
    hair: "Cool black, blue-black, cool espresso, dark ash brown өнгөнүүд илүү зохино.",
    style:
      "Sharp contrast, crisp colors, clean lines palette нь таны төрхийг хамгийн их тодруулна.",
    advice:
      "Хэт бүдэг, дулаан, шаварлаг өнгөнөөс зайлсхийж, цэвэр тод контраст барь.",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "");
  const intVal = parseInt(clean, 16);
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) =>
    clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function luminance({ r, g, b }: Rgb) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  const d = max - min;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tn = t;
    if (tn < 0) tn += 1;
    if (tn > 1) tn -= 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

function isLikelySkin(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  return (
    r > 95 &&
    g > 40 &&
    b > 20 &&
    max - min > 15 &&
    Math.abs(r - g) > 15 &&
    r > g &&
    r > b
  );
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function createCanvasFromImage(img: HTMLImageElement) {
  const maxWidth = 900;
  const scale = img.width > maxWidth ? maxWidth / img.width : 1;

  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  ctx.drawImage(img, 0, 0, width, height);

  return { canvas, ctx, width, height };
}

function averageRegion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  filter?: (r: number, g: number, b: number) => boolean,
): Rgb | null {
  const imageData = ctx.getImageData(x, y, w, h).data;

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let count = 0;

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const a = imageData[i + 3];

    if (a < 200) continue;
    if (filter && !filter(r, g, b)) continue;

    totalR += r;
    totalG += g;
    totalB += b;
    count += 1;
  }

  if (!count) return null;

  return {
    r: totalR / count,
    g: totalG / count,
    b: totalB / count,
  };
}

function estimateUndertone(rgb: Rgb): PersonalColorAnalysis["undertone"] {
  const rg = rgb.r - rgb.g;
  const gb = rgb.g - rgb.b;

  if (rg > 18 && gb > 5) return "Warm";
  if (rgb.b > rgb.g - 8 && rgb.r < rgb.g + 28) return "Cool";
  return "Neutral";
}

function estimateBrightness(rgb: Rgb): PersonalColorAnalysis["brightness"] {
  const lum = luminance(rgb);

  if (lum > 185) return "Light";
  if (lum < 125) return "Deep";
  return "Medium";
}

function estimateContrast(
  skin: Rgb,
  hairOrTop: Rgb | null,
): PersonalColorAnalysis["contrast"] {
  if (!hairOrTop) return "Medium";

  const diff = Math.abs(luminance(skin) - luminance(hairOrTop));

  if (diff > 95) return "High";
  if (diff < 45) return "Low";
  return "Medium";
}

function chooseSeason(
  undertone: PersonalColorAnalysis["undertone"],
  brightness: PersonalColorAnalysis["brightness"],
  contrast: PersonalColorAnalysis["contrast"],
): PersonalColorAnalysis["season"] {
  if (undertone === "Warm") {
    return brightness === "Light" || contrast === "Low"
      ? "Warm Spring"
      : "Deep Autumn";
  }

  if (undertone === "Cool") {
    return contrast === "High" || brightness === "Deep"
      ? "Clear Winter"
      : "Cool Summer";
  }

  if (contrast === "High") return "Clear Winter";
  if (brightness === "Deep") return "Deep Autumn";
  return "Cool Summer";
}

function estimateConfidence(
  skin: Rgb | null,
  clothingCandidates: number,
  imageWidth: number,
  imageHeight: number,
) {
  let score = 74;

  if (skin) score += 8;
  if (clothingCandidates > 8000) score += 8;
  if (imageWidth > 500 && imageHeight > 500) score += 6;

  return clamp(score, 70, 92);
}

export async function analyzePersonalColorFromImage(
  dataUrl: string,
): Promise<PersonalColorAnalysis> {
  const img = await loadImage(dataUrl);
  const { ctx, width, height } = createCanvasFromImage(img);

  const skinRegion = averageRegion(
    ctx,
    Math.round(width * 0.28),
    Math.round(height * 0.12),
    Math.round(width * 0.44),
    Math.round(height * 0.26),
    isLikelySkin,
  );

  const fallbackSkin = averageRegion(
    ctx,
    Math.round(width * 0.32),
    Math.round(height * 0.15),
    Math.round(width * 0.36),
    Math.round(height * 0.22),
  );

  const skin = skinRegion || fallbackSkin || { r: 185, g: 145, b: 125 };

  const hairOrTop = averageRegion(
    ctx,
    Math.round(width * 0.28),
    Math.round(height * 0.02),
    Math.round(width * 0.44),
    Math.round(height * 0.15),
  );

  const undertone = estimateUndertone(skin);
  const brightness = estimateBrightness(skin);
  const contrast = estimateContrast(skin, hairOrTop);
  const season = chooseSeason(undertone, brightness, contrast);

  const clothX = Math.round(width * 0.18);
  const clothY = Math.round(height * 0.42);
  const clothW = Math.round(width * 0.64);
  const clothH = Math.round(height * 0.5);
  const clothData = ctx.getImageData(clothX, clothY, clothW, clothH).data;

  let clothingCandidates = 0;
  for (let i = 0; i < clothData.length; i += 4) {
    const r = clothData[i];
    const g = clothData[i + 1];
    const b = clothData[i + 2];
    const a = clothData[i + 3];
    if (a < 200) continue;
    if (isLikelySkin(r, g, b)) continue;

    const { s, l } = rgbToHsl(r, g, b);
    if (s > 0.08 && l > 0.08 && l < 0.92) {
      clothingCandidates += 1;
    }
  }

  const confidence = estimateConfidence(
    skinRegion,
    clothingCandidates,
    width,
    height,
  );

  return {
    ...seasonProfiles[season],
    undertone,
    brightness,
    contrast,
    confidence,
    skinRgb: {
      r: Math.round(skin.r),
      g: Math.round(skin.g),
      b: Math.round(skin.b),
    },
  };
}

export async function recolorClothingPreview(
  dataUrl: string,
  targetHex: string,
): Promise<string> {
  const img = await loadImage(dataUrl);
  const { canvas, ctx, width, height } = createCanvasFromImage(img);

  const targetRgb = hexToRgb(targetHex);
  const targetHsl = rgbToHsl(targetRgb.r, targetRgb.g, targetRgb.b);

  const x = Math.round(width * 0.18);
  const y = Math.round(height * 0.42);
  const w = Math.round(width * 0.64);
  const h = Math.round(height * 0.5);

  const image = ctx.getImageData(x, y, w, h);
  const data = image.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 200) continue;
    if (isLikelySkin(r, g, b)) continue;

    const original = rgbToHsl(r, g, b);

    if (original.l < 0.06 || original.l > 0.95) continue;

    const isLikelyClothing =
      original.s > 0.08 ||
      (Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b)) / 3 > 12;

    if (!isLikelyClothing) continue;

    const blendedH = targetHsl.h;
    const blendedS = clamp(targetHsl.s * 0.85 + original.s * 0.25, 0.18, 0.95);
    const blendedL = clamp(original.l * 0.85 + targetHsl.l * 0.15, 0.08, 0.9);

    const next = hslToRgb(blendedH, blendedS, blendedL);

    data[i] = next.r;
    data[i + 1] = next.g;
    data[i + 2] = next.b;
  }

  ctx.putImageData(image, x, y);
  return canvas.toDataURL("image/jpeg", 0.92);
}
