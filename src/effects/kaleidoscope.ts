import type { EffectFn } from "../types.js";

export const kaleidoscope: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const hw = width >> 1;
  const hh = height >> 1;

  function sample(sx: number, sy: number): { r: number; g: number; b: number; a: number } {
    const x = Math.min(width - 1, Math.max(0, sx));
    const y = Math.min(height - 1, Math.max(0, sy));
    const i = (y * width + x) * 4;
    return {
      r: srcData[i]!,
      g: srcData[i + 1]!,
      b: srcData[i + 2]!,
      a: srcData[i + 3]!,
    };
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sx: number;
      let sy: number;
      if (y < hh && x < hw) {
        sx = x;
        sy = y;
      } else if (y < hh && x >= hw) {
        sx = width - 1 - x;
        sy = y;
      } else if (y >= hh && x < hw) {
        sx = x;
        sy = height - 1 - y;
      } else {
        sx = width - 1 - x;
        sy = height - 1 - y;
      }
      const p = sample(sx, sy);
      const o = (y * width + x) * 4;
      destData[o] = p.r;
      destData[o + 1] = p.g;
      destData[o + 2] = p.b;
      destData[o + 3] = p.a;
    }
  }
};
