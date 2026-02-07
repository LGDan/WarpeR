import type { EffectFn } from "../types.js";

// 4x4 Bayer matrix (values 0–15), scaled to 0–255
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (v) => (v / 16) * 255
);

export const dither: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = srcData[i]!;
      const g = srcData[i + 1]!;
      const b = srcData[i + 2]!;
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const threshold = BAYER[(y % 4) * 4 + (x % 4)]!;
      const out = gray > threshold ? 255 : 0;
      destData[i] = out;
      destData[i + 1] = out;
      destData[i + 2] = out;
      destData[i + 3] = srcData[i + 3]!;
    }
  }
};
