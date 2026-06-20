import { mbtiShareTemplates } from "@/data/mbtiShareTemplates";
import { MBTI_CANVAS, MBTI_FONT, MBTI_LAYOUT } from "@/lib/mbtiCanvasLayout";
import {
  drawCssBackgroundImage,
  drawFittedLetterSpacedText,
  drawLetterSpacedText,
  drawRoundRect,
  getBodyFontFamily,
  getWrappedLines,
  drawLines,
  loadCanvasImage,
} from "@/lib/mbtiCanvasUtils";

type Gender = "female" | "male";
async function loadPhosphorIcon(name: string, color: string) {
  const res = await fetch(`/icons/phosphor/${name}.svg`);

  if (!res.ok) {
    throw new Error(`Missing phosphor icon: ${name}.svg`);
  }

  let svg = await res.text();

  svg = svg.replaceAll("currentColor", color);

  if (!svg.includes("xmlns=")) {
    svg = svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
  }

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load icon: ${name}.svg`));
    };

    img.src = url;
  });
}

function getTraitIconCandidates(strength: string) {
  const map: Record<string, string[]> = {
    "Алсын хараатай": ["eye", "compass"],
    "Логик сэтгэлгээтэй": ["brain", "gear"],
    "Бие даасан": ["shield", "flag"],

    "Задлан шинжээч": ["gear", "brain"],
    Сониуч: ["lightbulb", "eye"],
    "Өөр өнцөгтэй": ["eye", "compass"],
    "Өөр өнцөг хардаг": ["eye", "compass"],

    Шийдэмгий: ["flag", "target"],
    Зорилготой: ["target", "flag"],
    "Стратеги сэтгэлгээтэй": ["compass", "brain"],

    "Эмх цэгцтэй": ["check-circle", "gear"],
    Хариуцлагатай: ["shield", "check-circle"],
    "Үр дүнд төвлөрдөг": ["target", "check-circle"],

    Мэдрэмжтэй: ["heart", "sparkle"],
    "Гүн мэдрэмжтэй": ["heart", "eye"],
    "Зөөлөн сэтгэлтэй": ["hand-heart", "heart"],
    Халамжтай: ["hand-heart", "heart"],
    Бүтээлч: ["palette", "lightbulb"],

    "Гоо зүйтэй": ["palette", "sparkle"],
    "Чөлөөт сэтгэлгээтэй": ["rocket", "flower-lotus"],

    "Зөн совинтой": ["eye", "sparkle"],
    "Утга учир эрэлхийлдэг": ["compass", "eye"],

    "Урам зориг өгдөг": ["sparkle", "sun"],
    "Урам өгдөг": ["sparkle", "lightbulb"],
    "Хүмүүсийг ойлгодог": ["users", "heart"],

    Найдвартай: ["shield", "check-circle"],
    Тууштай: ["target", "shield"],
    Зарчимтай: ["check-circle", "shield"],
    "Итгэл даадаг": ["check-circle", "shield"],

    Нийтэч: ["users", "hand-waving"],
    "Зохион байгуулагч": ["check-circle", "gear"],

    "Эрч хүчтэй": ["lightning", "rocket"],
    Нээлттэй: ["flower-lotus", "users"],

    "Хурдан сэтгэдэг": ["lightning", "brain"],
    Санаачлагч: ["rocket", "lightbulb"],

    "Ажил хэрэгч": ["gear", "check-circle"],
    Шуурхай: ["lightning", "flag"],
    "Эрсдэлд тайван": ["shield", "compass"],

    Зоримог: ["flag", "rocket"],
    "Нөхцөлд дасан зохицдог": ["rocket", "gear"],

    Эерэг: ["smiley", "sparkle"],
    "Амьд мэдрэмжтэй": ["confetti", "sparkle"],
  };

  const candidates = map[strength];

  if (!candidates) {
    throw new Error(`Missing icon mapping for strength: ${strength}`);
  }

  return candidates;
}

function getUniqueTraitIconKeys(strengths: string[]) {
  const used = new Set<string>();

  return strengths.slice(0, 3).map((strength) => {
    const candidates = getTraitIconCandidates(strength);
    const picked = candidates.find((icon) => !used.has(icon));

    if (!picked) {
      throw new Error(`No unique icon left for strength: ${strength}`);
    }

    used.add(picked);
    return picked;
  });
}
export async function generateMbtiShareImage({
  type,
  gender = "female",
}: {
  type: string;
  gender?: Gender;
}) {
  const key = type.toUpperCase();
  const template = mbtiShareTemplates[key] ?? mbtiShareTemplates.INTJ;
  const isMale = gender === "male";

  const bg = isMale && template.maleBg ? template.maleBg : template.bg;

  const bgSize =
    isMale && template.maleBgSize ? template.maleBgSize : template.bgSize;

  const bgPosition =
    isMale && template.maleBgPosition
      ? template.maleBgPosition
      : template.bgPosition;

  const canvas = document.createElement("canvas");
  canvas.width = MBTI_CANVAS.width;
  canvas.height = MBTI_CANVAS.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const bodyFont = getBodyFontFamily();
  const accent = template.accent || "#d8b76a";

  const image = await loadCanvasImage(bg);
  const traitIconNames = getUniqueTraitIconKeys(template.strengths);

  const traitIcons = await Promise.all(
    traitIconNames.map((name) => loadPhosphorIcon(name, accent)),
  );
  await Promise.all([
    document.fonts.load(`226px ${MBTI_FONT.type}`),
    document.fonts.load(`52px ${MBTI_FONT.quote}`),
    document.fonts.ready,
  ]);

  drawCssBackgroundImage(ctx, image, {
    width: MBTI_CANVAS.width,
    height: MBTI_CANVAS.height,
    backgroundSize: bgSize ?? "cover",
    backgroundPosition: bgPosition ?? "center",
  });

  const overlay = ctx.createLinearGradient(0, 0, 780, 0);
  overlay.addColorStop(0, "rgba(0,0,0,0.82)");
  overlay.addColorStop(0.42, "rgba(0,0,0,0.52)");
  overlay.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, MBTI_CANVAS.width, MBTI_CANVAS.height);

  ctx.textBaseline = "alphabetic";

  ctx.save();
  ctx.strokeStyle = "rgba(253,224,71,0.68)";
  ctx.lineWidth = 1.4;
  ctx.shadowColor = `${accent}88`;
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.moveTo(MBTI_LAYOUT.centerX - 238, MBTI_LAYOUT.labelY - 5);
  ctx.lineTo(MBTI_LAYOUT.centerX - 154, MBTI_LAYOUT.labelY - 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(MBTI_LAYOUT.centerX + 154, MBTI_LAYOUT.labelY - 5);
  ctx.lineTo(MBTI_LAYOUT.centerX + 238, MBTI_LAYOUT.labelY - 5);
  ctx.stroke();

  ctx.restore();

  ctx.fillStyle = "#c9a95f";
  ctx.font = `600 18px ${bodyFont}`;
  drawLetterSpacedText(
    ctx,
    "ТАНЫ MBTI ТӨРӨЛ",
    MBTI_LAYOUT.centerX,
    MBTI_LAYOUT.labelY,
    5,
    "center",
  );

  ctx.save();
  ctx.textAlign = "left";
  ctx.fillStyle = accent;
  ctx.font = `900 226px ${MBTI_FONT.type}`;
  ctx.shadowColor = "rgba(255,255,255,0.36)";
  ctx.shadowBlur = 18;
  ctx.fillText(key, MBTI_LAYOUT.typeX, MBTI_LAYOUT.typeY);
  ctx.shadowColor = `${accent}99`;
  ctx.shadowBlur = 54;
  ctx.fillText(key, MBTI_LAYOUT.typeX, MBTI_LAYOUT.typeY);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 12;

  drawFittedLetterSpacedText(
    ctx,
    template.archetype.toUpperCase(),
    MBTI_LAYOUT.left,
    MBTI_LAYOUT.archetypeY,
    MBTI_LAYOUT.contentWidth,
    {
      fontWeight: 500,
      fontSize: 50,
      fontFamily: bodyFont,
      letterSpacing: 2,
      color: "rgba(255,255,255,0.98)",
    },
  );

  ctx.restore();

  const dividerCenterX = MBTI_LAYOUT.left + MBTI_LAYOUT.contentWidth / 2;
  const diamondGap = 38;

  ctx.save();
  ctx.strokeStyle = "rgba(253,224,71,0.38)";
  ctx.lineWidth = 1.4;
  ctx.shadowColor = `${accent}66`;
  ctx.shadowBlur = 6;

  ctx.beginPath();
  ctx.moveTo(MBTI_LAYOUT.left, MBTI_LAYOUT.dividerY);
  ctx.lineTo(dividerCenterX - diamondGap, MBTI_LAYOUT.dividerY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(dividerCenterX + diamondGap, MBTI_LAYOUT.dividerY);
  ctx.lineTo(MBTI_LAYOUT.left + MBTI_LAYOUT.contentWidth, MBTI_LAYOUT.dividerY);
  ctx.stroke();

  ctx.restore();

  ctx.save();
  ctx.translate(dividerCenterX, MBTI_LAYOUT.dividerY);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = accent;
  ctx.strokeStyle = "rgba(253,224,71,0.75)";
  ctx.shadowColor = `${accent}88`;
  ctx.shadowBlur = 10;
  ctx.fillRect(-5.5, -5.5, 11, 11);
  ctx.strokeRect(-5.5, -5.5, 11, 11);
  ctx.restore();

  ctx.save();
  ctx.textAlign = "left";
  ctx.shadowColor = "rgba(0,0,0,0.85)";
  ctx.shadowBlur = 8;

  ctx.fillStyle = "rgba(255,255,255,0.90)";
  ctx.font = `400 28px ${bodyFont}`;
  ctx.fillText("Хүмүүсийн дөнгөж ", MBTI_LAYOUT.left, MBTI_LAYOUT.rarityY);

  const prefixWidth = ctx.measureText("Хүмүүсийн дөнгөж ").width;

  ctx.fillStyle = accent;
  ctx.font = `900 28px ${bodyFont}`;
  ctx.fillText(
    template.rarity,
    MBTI_LAYOUT.left + prefixWidth,
    MBTI_LAYOUT.rarityY,
  );

  const rarityWidth = ctx.measureText(template.rarity).width;

  ctx.fillStyle = "rgba(255,255,255,0.90)";
  ctx.font = `400 28px ${bodyFont}`;
  ctx.fillText(
    "-д байдаг",
    MBTI_LAYOUT.left + prefixWidth + rarityWidth,
    MBTI_LAYOUT.rarityY,
  );

  ctx.restore();

  template.strengths.slice(0, 3).forEach((item, index) => {
    const centerY = MBTI_LAYOUT.traitsTop + index * MBTI_LAYOUT.traitGap;

    const traitIcon = traitIcons[index];
    const iconSize = 48;

    const iconBg = ctx.createRadialGradient(
      MBTI_LAYOUT.iconX - 10,
      centerY - 12,
      4,
      MBTI_LAYOUT.iconX,
      centerY,
      34,
    );

    iconBg.addColorStop(0, "rgba(255,255,255,0.38)");
    iconBg.addColorStop(0.28, `${accent}55`);
    iconBg.addColorStop(0.72, "rgba(20,25,60,0.72)");
    iconBg.addColorStop(1, "rgba(0,0,0,0.78)");

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.75)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    ctx.arc(MBTI_LAYOUT.iconX, centerY, 31, 0, Math.PI * 2);
    ctx.fillStyle = iconBg;
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(MBTI_LAYOUT.iconX, centerY, 31, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(253,224,71,0.55)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(MBTI_LAYOUT.iconX - 7, centerY - 8, 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fill();

    ctx.save();
    ctx.shadowColor = `${accent}cc`;
    ctx.shadowBlur = 16;

    ctx.drawImage(
      traitIcon,
      MBTI_LAYOUT.iconX - iconSize / 2,
      centerY - iconSize / 2,
      iconSize,
      iconSize,
    );

    ctx.restore();

    ctx.fillStyle = "rgba(254,240,138,0.35)";
    ctx.fillRect(MBTI_LAYOUT.traitLineX, centerY - 31, 2, 62);

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = `600 34px ${bodyFont}`;
    ctx.shadowColor = "rgba(0,0,0,0.95)";
    ctx.shadowBlur = 12;
    ctx.fillText(item, MBTI_LAYOUT.traitTextX, centerY + 12);
    ctx.shadowBlur = 0;
  });

  // auto quote - wide, old style
  const quoteFont = `500 54px ${MBTI_FONT.quote}`;
  const quoteMaxWidth = 960;
  const quoteLineHeight = 60;
  const quotePaddingY = 24;
  ctx.textAlign = "center";
  ctx.fillStyle = "#f4eadf";
  ctx.font = quoteFont;

  const quoteLines = getWrappedLines(
    ctx,
    `“${template.quote}”`,
    quoteMaxWidth,
    3,
  );
  const quoteHeight = Math.max(
    138,
    quoteLines.length * quoteLineHeight + quotePaddingY * 2,
  );

  const quoteTop = MBTI_CANVAS.height - 68 - quoteHeight;
  const quoteCenterX = MBTI_LAYOUT.quoteLeft + MBTI_LAYOUT.quoteWidth / 2;
  const quoteTextY = quoteTop + quotePaddingY + 42;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 20;

  drawRoundRect(
    ctx,
    MBTI_LAYOUT.quoteLeft,
    quoteTop,
    MBTI_LAYOUT.quoteWidth,
    quoteHeight,
    32,
  );

  ctx.fillStyle = "rgba(0,0,0,0.56)";
  ctx.fill();
  ctx.restore();

  drawRoundRect(
    ctx,
    MBTI_LAYOUT.quoteLeft,
    quoteTop,
    MBTI_LAYOUT.quoteWidth,
    quoteHeight,
    32,
  );

  ctx.strokeStyle = "rgba(253,224,71,0.40)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.translate(quoteCenterX, quoteTop - 0);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "rgba(253,224,71,0.55)";
  ctx.shadowColor = `${accent}66`;
  ctx.shadowBlur = 18;
  ctx.fillRect(-11, -11, 22, 22);
  ctx.strokeRect(-11, -11, 22, 22);
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = "#f4eadf";
  ctx.font = quoteFont;
  ctx.shadowColor = "rgba(0,0,0,0.95)";
  ctx.shadowBlur = 12;

  drawLines(ctx, quoteLines, quoteCenterX, quoteTextY, quoteLineHeight);

  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.font = `600 22px ${bodyFont}`;
  ctx.textAlign = "center";
  ctx.fillText("seer.mn", quoteCenterX, MBTI_LAYOUT.watermarkY);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image generation failed"));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      0.95,
    );
  });
}
