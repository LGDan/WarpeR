import type { EffectFn } from "../types.js";

// Emboss kernel: [-2,-1,0; -1,1,1; 0,1,2]
const K = [-2, -1, 0, -1, 1, 1, 0, 1, 2];

function sample(data: Uint8ClampedArray, width: number, height: number, x: number, y: number): number {
  const sx = Math.min(width - 1, Math.max(0, x));
  const sy = Math.min(height - 1, Math.max(0, y));
  const i = (sy * width + sx) * 4;
  return (data[i]! + data[i + 1]! + data[i + 2]!) / 3;
}

export const emboss: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let v = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          v += sample(srcData, width, height, x + dx, y + dy) * K[(dy + 1) * 3 + (dx + 1)]!;
        }
      }
      const out = Math.round(128 + v);
      const clamped = Math.min(255, Math.max(0, out));
      const o = (y * width + x) * 4;
      destData[o] = clamped;
      destData[o + 1] = clamped;
      destData[o + 2] = clamped;
      destData[o + 3] = srcData[o + 3]!;
    }
  }
};
