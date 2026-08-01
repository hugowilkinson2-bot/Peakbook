export type OptimizedImage = {
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
  mimeType: "image/webp";
};

const MAX_EDGE = 2048;
const QUALITY = 0.82;

export async function optimizeImage(file: File): Promise<OptimizedImage> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} no es una imagen compatible.`);
  const source = await decodeImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("El navegador no pudo preparar la fotografía.");
  context.drawImage(source.image, 0, 0, width, height);
  source.close();
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", QUALITY));
  if (!blob) throw new Error(`No se pudo optimizar ${file.name}.`);
  return { blob, width, height, bytes: blob.size, mimeType: "image/webp" };
}

async function decodeImage(file: File): Promise<{ image: CanvasImageSource; width: number; height: number; close: () => void }> {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { image: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
  }
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  await image.decode();
  return { image, width: image.naturalWidth, height: image.naturalHeight, close: () => URL.revokeObjectURL(url) };
}
