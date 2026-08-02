import type { PhotoDraft } from "../domain/adventure";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_UPLOAD_IMAGE_BYTES = 6 * 1024 * 1024;

const acceptedTypes = new Set<string>(ACCEPTED_IMAGE_TYPES);

export function validateSourceImage(file: File) {
  if (!acceptedTypes.has(file.type)) {
    throw new Error(`${file.name}: usa una imagen JPG, PNG o WebP.`);
  }
  if (file.size <= 0) throw new Error(`${file.name}: el archivo está vacío.`);
  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error(`${file.name}: supera el máximo de ${formatMegabytes(MAX_SOURCE_IMAGE_BYTES)} MB.`);
  }
}

export function validatePhotoDraft(draft: PhotoDraft) {
  if (!draft.blob) return;
  if (draft.mimeType !== "image/webp" || draft.blob.type !== "image/webp") {
    throw new Error("Una fotografía no se pudo preparar en formato WebP.");
  }
  if (draft.blob.size <= 0 || draft.width <= 0 || draft.height <= 0) {
    throw new Error("Una fotografía optimizada no es válida.");
  }
  if (draft.blob.size > MAX_UPLOAD_IMAGE_BYTES) {
    throw new Error(`Una fotografía supera el máximo de ${formatMegabytes(MAX_UPLOAD_IMAGE_BYTES)} MB después de optimizarla.`);
  }
}

function formatMegabytes(bytes: number) {
  return Math.round(bytes / 1024 / 1024);
}
