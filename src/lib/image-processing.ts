export const MAX_ARTWORK_FILE_SIZE = 12 * 1024 * 1024;
export const SUPPORTED_ARTWORK_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

export async function compressArtwork(
  file: File,
): Promise<{ blob: Blob; width: number; height: number }> {
  if (!SUPPORTED_ARTWORK_TYPES.includes(file.type)) {
    throw new Error("请选择 PNG、JPG 或 WebP 图片");
  }
  if (file.size > MAX_ARTWORK_FILE_SIZE) {
    throw new Error("画作不能超过 12MB");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("当前浏览器无法处理这张画作");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => (value ? resolve(value) : reject(new Error("压缩失败"))),
      "image/webp",
      0.84,
    );
  });
  return { blob, width, height };
}
