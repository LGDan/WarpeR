import type { EffectFn } from "../types.js";

const OFFSET = 4;

function sample(data: Uint8ClampedArray, width: number, height: number, x: number, y: number, c: number): number {
  const sx = Math.min(width - 1, Math.max(0, x));
  const sy = Math.min(height - 1, Math.max(0, y));
  return data[(sy * width + sx) * 4 + c]!;
}

export const rgbShift: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      destData[o] = sample(srcData, width, height, x - OFFSET, y, 0);
      destData[o + 1] = sample(srcData, width, height, x, y, 1);
      destData[o + 2] = sample(srcData, width, height, x + OFFSET, y, 2);
      destData[o + 3] = srcData[o + 3]!;
    }
  }
};
