import type { EffectFn } from "../types.js";

export const invert: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  for (let i = 0; i < srcData.length; i += 4) {
    destData[i] = 255 - srcData[i]!;
    destData[i + 1] = 255 - srcData[i + 1]!;
    destData[i + 2] = 255 - srcData[i + 2]!;
    destData[i + 3] = srcData[i + 3]!;
  }
};
