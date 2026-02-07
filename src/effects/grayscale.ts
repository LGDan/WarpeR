import type { EffectFn } from "../types.js";

export const grayscale: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  for (let i = 0; i < srcData.length; i += 4) {
    const r = srcData[i]!;
    const g = srcData[i + 1]!;
    const b = srcData[i + 2]!;
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    destData[i] = gray;
    destData[i + 1] = gray;
    destData[i + 2] = gray;
    destData[i + 3] = srcData[i + 3]!;
  }
};
