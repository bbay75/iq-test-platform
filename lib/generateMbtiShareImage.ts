export async function generateMbtiShareImage(bg: string) {
  const canvas = document.createElement("canvas");

  canvas.width = 1080;
  canvas.height = 1350;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  const image = new Image();

  image.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Background image failed"));

    image.src = bg;
  });

  ctx.drawImage(image, 0, 0, 1080, 1350);

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
