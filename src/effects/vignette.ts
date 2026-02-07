import type { EffectFn } from "../types.js";

export const vignette: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const factor = 1 - d * 0.7;
      const o = (y * width + x) * 4;
      const f = Math.max(0, factor);
      destData[o] = Math.min(255, Math.round(srcData[o]! * f));
      destData[o + 1] = Math.min(255, Math.round(srcData[o + 1]! * f));
      destData[o + 2] = Math.min(255, Math.round(srcData[o + 2]! * f));
      destData[o + 3] = srcData[o + 3]!;
    }
  }
};
