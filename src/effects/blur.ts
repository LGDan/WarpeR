import type { EffectFn } from "../types.js";

function boxBlurKernel(radius: number): EffectFn {
  return (src: ImageData, dest: ImageData): void => {
    const { width, height, data: srcData } = src;
    const destData = dest.data;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        let count = 0;
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const sx = Math.min(width - 1, Math.max(0, x + dx));
            const sy = Math.min(height - 1, Math.max(0, y + dy));
            const i = (sy * width + sx) * 4;
            r += srcData[i]!;
            g += srcData[i + 1]!;
            b += srcData[i + 2]!;
            a += srcData[i + 3]!;
            count++;
          }
        }
        const o = (y * width + x) * 4;
        destData[o] = r / count;
        destData[o + 1] = g / count;
        destData[o + 2] = b / count;
        destData[o + 3] = a / count;
      }
    }
  };
}

export const blurLight: EffectFn = boxBlurKernel(2);
export const blurMedium: EffectFn = boxBlurKernel(4);
export const blurHeavy: EffectFn = boxBlurKernel(8);
