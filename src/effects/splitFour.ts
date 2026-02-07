import type { EffectFn } from "../types.js";

export const splitFour: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const hw = width >> 1;
  const hh = height >> 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sx = (x % hw) * 2;
      const sy = (y % hh) * 2;
      const si = (sy * width + sx) * 4;
      const o = (y * width + x) * 4;
      destData[o] = srcData[si]!;
      destData[o + 1] = srcData[si + 1]!;
      destData[o + 2] = srcData[si + 2]!;
      destData[o + 3] = srcData[si + 3]!;
    }
  }
};
