import type { EffectFn } from "../types.js";

function clamp(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v)));
}

export const sepia: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  for (let i = 0; i < srcData.length; i += 4) {
    const r = srcData[i]!;
    const g = srcData[i + 1]!;
    const b = srcData[i + 2]!;
    destData[i] = clamp(0.393 * r + 0.769 * g + 0.189 * b);
    destData[i + 1] = clamp(0.349 * r + 0.686 * g + 0.168 * b);
    destData[i + 2] = clamp(0.272 * r + 0.534 * g + 0.131 * b);
    destData[i + 3] = srcData[i + 3]!;
  }
};
