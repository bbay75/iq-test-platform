export function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image failed: ${src}`));
    img.src = src;
  });
}

export function getBodyFontFamily() {
  if (typeof window === "undefined") return "Arial, sans-serif";

  return (
    window.getComputedStyle(document.body).fontFamily || "Arial, sans-serif"
  );
}

function parsePositionPart(part: string, container: number, image: number) {
  const value = part.trim().toLowerCase();

  if (value === "left" || value === "top") return 0;
  if (value === "center") return (container - image) / 2;
  if (value === "right" || value === "bottom") return container - image;

  if (value.endsWith("%")) {
    const percent = Number(value.replace("%", "")) / 100;
    return (container - image) * percent;
  }

  return (container - image) / 2;
}

export function drawCssBackgroundImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  {
    width,
    height,
    backgroundSize,
    backgroundPosition,
  }: {
    width: number;
    height: number;
    backgroundSize: string;
    backgroundPosition: string;
  },
) {
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;

  const size = backgroundSize.trim().toLowerCase();

  if (size === "cover") {
    if (imageRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * imageRatio;
    } else {
      drawWidth = width;
      drawHeight = width / imageRatio;
    }
  } else if (size === "contain") {
    if (imageRatio > canvasRatio) {
      drawWidth = width;
      drawHeight = width / imageRatio;
    } else {
      drawHeight = height;
      drawWidth = height * imageRatio;
    }
  } else if (size.endsWith("%")) {
    const scale = Number(size.replace("%", "")) / 100;
    drawWidth = width * scale;
    drawHeight = drawWidth / imageRatio;
  }

  const parts = backgroundPosition.trim().split(/\s+/);
  const x = parsePositionPart(parts[0] ?? "center", width, drawWidth);
  const y = parsePositionPart(parts[1] ?? "center", height, drawHeight);

  ctx.drawImage(image, x, y, drawWidth, drawHeight);
}

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function getLetterSpacedWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  letterSpacing: number,
) {
  return (
    text.split("").reduce((sum, char) => sum + ctx.measureText(char).width, 0) +
    Math.max(0, text.length - 1) * letterSpacing
  );
}

export function drawLetterSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number,
  align: "left" | "center" = "left",
) {
  const totalWidth = getLetterSpacedWidth(ctx, text, letterSpacing);
  let currentX = align === "center" ? x - totalWidth / 2 : x;

  ctx.save();
  ctx.textAlign = "left";

  for (const char of text) {
    ctx.fillText(char, currentX, y);
    currentX += ctx.measureText(char).width + letterSpacing;
  }

  ctx.restore();
}

export function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;

    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }

  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((currentLine, index) => {
    ctx.fillText(currentLine, x, y + index * lineHeight);
  });
}

export function drawFittedLetterSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  {
    fontWeight,
    fontSize,
    fontFamily,
    letterSpacing,
    color,
  }: {
    fontWeight: number;
    fontSize: number;
    fontFamily: string;
    letterSpacing: number;
    color: string;
  },
) {
  let size = fontSize;
  let spacing = letterSpacing;

  while (size > 26) {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;

    if (getLetterSpacedWidth(ctx, text, spacing) <= maxWidth) break;

    size -= 2;
    spacing = Math.max(1.5, spacing - 0.2);
  }

  ctx.fillStyle = color;
  drawLetterSpacedText(ctx, text, x, y, spacing, "left");
}
export function getWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 4,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;

    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }

  if (line) lines.push(line);

  return lines.slice(0, maxLines);
}

export function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
) {
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}
