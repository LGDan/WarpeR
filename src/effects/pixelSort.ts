import type { EffectFn } from "../types.js";

function luminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export const pixelSortRows: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;

  for (let y = 0; y < height; y++) {
    const rowPixels: { r: number; g: number; b: number; a: number; l: number }[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = srcData[i]!;
      const g = srcData[i + 1]!;
      const b = srcData[i + 2]!;
      const a = srcData[i + 3]!;
      rowPixels.push({ r, g, b, a, l: luminance(r, g, b) });
    }
    rowPixels.sort((a, b) => a.l - b.l);
    for (let x = 0; x < width; x++) {
      const p = rowPixels[x]!;
      const o = (y * width + x) * 4;
      destData[o] = p.r;
      destData[o + 1] = p.g;
      destData[o + 2] = p.b;
      destData[o + 3] = p.a;
    }
  }
};
