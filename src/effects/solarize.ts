import type { EffectFn } from "../types.js";

const THRESHOLD = 128;

export const solarize: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  for (let i = 0; i < srcData.length; i += 4) {
    destData[i] = srcData[i]! > THRESHOLD ? 255 - srcData[i]! : srcData[i]!;
    destData[i + 1] = srcData[i + 1]! > THRESHOLD ? 255 - srcData[i + 1]! : srcData[i + 1]!;
    destData[i + 2] = srcData[i + 2]! > THRESHOLD ? 255 - srcData[i + 2]! : srcData[i + 2]!;
    destData[i + 3] = srcData[i + 3]!;
  }
};
