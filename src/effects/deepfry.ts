import type { EffectFn } from "../types.js";

function clamp(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v)));
}

export const deepfry: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  const sat = 1.8;
  const contrast = 1.4;
  const shift = -30;

  for (let i = 0; i < srcData.length; i += 4) {
    let r = srcData[i]!;
    let g = srcData[i + 1]!;
    let b = srcData[i + 2]!;
    const a = srcData[i + 3]!;

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = clamp((r - gray) * sat + gray);
    g = clamp((g - gray) * sat + gray);
    b = clamp((b - gray) * sat + gray);

    r = clamp((r - 128) * contrast + 128 + shift);
    g = clamp((g - 128) * contrast + 128 + shift);
    b = clamp((b - 128) * contrast + 128 + shift);

    destData[i] = r;
    destData[i + 1] = g;
    destData[i + 2] = b;
    destData[i + 3] = a;
  }
};
