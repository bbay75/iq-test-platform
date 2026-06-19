import { mbtiShareTemplates } from "@/data/mbtiShareTemplates";

type Gender = "female" | "male";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Background image failed"));
    img.src = src;
  });
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }

  lines.push(line);

  lines.forEach((l, i) => {
    ctx.fillText(l, x, y + i * lineHeight);
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

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const image = await loadImage(bg);

  ctx.drawImage(image, 0, 0, 1080, 1350);

  // left dark overlay
  const g1 = ctx.createLinearGradient(0, 0, 720, 0);
  g1.addColorStop(0, "rgba(0,0,0,0.72)");
  g1.addColorStop(0.55, "rgba(0,0,0,0.34)");
  g1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, 720, 1350);

  const accent = template.accent || "#d8b76a";

  // top label
  ctx.textAlign = "center";
  ctx.fillStyle = "#c9a95f";
  ctx.font = "600 18px Arial";
  ctx.fillText("ТАНЫ MBTI ТӨРӨЛ", 332, 146);

  // MBTI type
  ctx.fillStyle = accent;
  ctx.font = "900 224px Georgia";
  ctx.shadowColor = "rgba(255,255,255,0.35)";
  ctx.shadowBlur = 18;
  ctx.fillText(key, 332, 318);
  ctx.shadowBlur = 0;

  // archetype
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font = "700 40px Arial";
  ctx.fillText(template.archetype, 360, 394);

  // rarity
  ctx.textAlign = "left";
  ctx.font = "400 28px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText("Хүмүүсийн дөнгөж ", 72, 515);

  const prefixWidth = ctx.measureText("Хүмүүсийн дөнгөж ").width;
  ctx.fillStyle = accent;
  ctx.font = "900 28px Arial";
  ctx.fillText(template.rarity, 72 + prefixWidth, 515);

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "400 28px Arial";
  ctx.fillText(
    "-д байдаг",
    72 + prefixWidth + ctx.measureText(template.rarity).width,
    515,
  );

  // strengths
  const startY = 660;
  template.strengths.forEach((item, index) => {
    const y = startY + index * 145;

    ctx.beginPath();
    ctx.arc(118, y, 46, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,220,120,0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.font = "700 34px Arial";
    ctx.fillText(["☷", "♢", "◎"][index] ?? "•", 106, y + 12);

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "700 36px Arial";
    ctx.fillText(item, 222, y + 12);
  });

  // quote box
  ctx.fillStyle = "rgba(0,0,0,0.52)";
  ctx.strokeStyle = "rgba(255,220,120,0.45)";
  ctx.lineWidth = 1.5;

  const qx = 72;
  const qy = 1110;
  const qw = 936;
  const qh = 155;
  const r = 32;

  ctx.beginPath();
  ctx.roundRect(qx, qy, qw, qh, r);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#f4eadf";
  ctx.font = "52px cursive";
  drawWrappedText(ctx, `“${template.quote}”`, 540, 1170, 820, 54);

  // brand
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "700 22px Arial";
  ctx.fillText("s e e r . m n", 540, 1310);

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
