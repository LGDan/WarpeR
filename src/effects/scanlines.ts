import type { EffectFn } from "../types.js";

const SCANLINE_PERIOD = 2;
const DARKEN = 0.6;

export const scanlines: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  for (let y = 0; y < height; y++) {
    const isScanline = y % SCANLINE_PERIOD === 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      destData[i] = srcData[i]!;
      destData[i + 1] = srcData[i + 1]!;
      destData[i + 2] = srcData[i + 2]!;
      destData[i + 3] = srcData[i + 3]!;
      if (isScanline) {
        destData[i] = destData[i]! * DARKEN;
        destData[i + 1] = destData[i + 1]! * DARKEN;
        destData[i + 2] = destData[i + 2]! * DARKEN;
      }
    }
  }
};
