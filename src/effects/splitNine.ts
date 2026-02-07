import type { EffectFn } from "../types.js";

/** Zoom out and tile the image in a 3×3 grid (9 copies). Same dimensions as source. */
export const splitNine: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const tw = Math.floor(width / 3);
  const th = Math.floor(height / 3);
  if (tw < 1 || th < 1) {
    destData.set(srcData);
    return;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tx = x % tw;
      const ty = y % th;
      const sx = Math.min(width - 1, Math.floor((tx * width) / tw));
      const sy = Math.min(height - 1, Math.floor((ty * height) / th));
      const si = (sy * width + sx) * 4;
      const o = (y * width + x) * 4;
      destData[o] = srcData[si]!;
      destData[o + 1] = srcData[si + 1]!;
      destData[o + 2] = srcData[si + 2]!;
      destData[o + 3] = srcData[si + 3]!;
    }
  }
};
