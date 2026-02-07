import type { EffectFn } from "../types.js";

function pixelateBlock(size: number): EffectFn {
  return (src: ImageData, dest: ImageData): void => {
    const { width, height, data: srcData } = src;
    const destData = dest.data;
    const block = Math.max(1, size);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const bx = Math.min(Math.floor(x / block) * block, width - 1);
        const by = Math.min(Math.floor(y / block) * block, height - 1);
        const i = (by * width + bx) * 4;
        const o = (y * width + x) * 4;
        destData[o] = srcData[i]!;
        destData[o + 1] = srcData[i + 1]!;
        destData[o + 2] = srcData[i + 2]!;
        destData[o + 3] = srcData[i + 3]!;
      }
    }
  };
}

export const pixelateSmall: EffectFn = pixelateBlock(4);
export const pixelateMedium: EffectFn = pixelateBlock(8);
export const pixelateLarge: EffectFn = pixelateBlock(16);
