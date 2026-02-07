import type { EffectFn } from "../types.js";

function clamp(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v)));
}

function posterizeLevels(levels: number): EffectFn {
  const step = 255 / (levels - 1);
  return (src: ImageData, dest: ImageData): void => {
    const srcData = src.data;
    const destData = dest.data;
    for (let i = 0; i < srcData.length; i += 4) {
      destData[i] = clamp(Math.round(srcData[i]! / 255 * (levels - 1)) * step);
      destData[i + 1] = clamp(Math.round(srcData[i + 1]! / 255 * (levels - 1)) * step);
      destData[i + 2] = clamp(Math.round(srcData[i + 2]! / 255 * (levels - 1)) * step);
      destData[i + 3] = srcData[i + 3]!;
    }
  };
}

export const posterize4: EffectFn = posterizeLevels(4);
export const posterize8: EffectFn = posterizeLevels(8);
