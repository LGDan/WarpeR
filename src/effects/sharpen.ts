import type { EffectFn } from "../types.js";

function clamp(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v)));
}

function sample(data: Uint8ClampedArray, width: number, height: number, x: number, y: number, c: number): number {
  const sx = Math.min(width - 1, Math.max(0, x));
  const sy = Math.min(height - 1, Math.max(0, y));
  return data[(sy * width + sx) * 4 + c]!;
}

// 3x3 sharpen: 0,-1,0; -1,5,-1; 0,-1,0
export const sharpen: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        const v =
          sample(srcData, width, height, x, y - 1, c) * -1 +
          sample(srcData, width, height, x - 1, y, c) * -1 +
          sample(srcData, width, height, x, y, c) * 5 +
          sample(srcData, width, height, x + 1, y, c) * -1 +
          sample(srcData, width, height, x, y + 1, c) * -1;
        destData[o + c] = clamp(v);
      }
      destData[o + 3] = srcData[o + 3]!;
    }
  }
};
