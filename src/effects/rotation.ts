import type { EffectFn } from "../types.js";

/** Rotate 180° (same dimensions) */
export const rotate180: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sx = width - 1 - x;
      const sy = height - 1 - y;
      const si = (sy * width + sx) * 4;
      const o = (y * width + x) * 4;
      destData[o] = srcData[si]!;
      destData[o + 1] = srcData[si + 1]!;
      destData[o + 2] = srcData[si + 2]!;
      destData[o + 3] = srcData[si + 3]!;
    }
  }
};

/** Rotate 90° clockwise; output is height×width */
export const rotate90CW: EffectFn = (src: ImageData, dest: ImageData): void => {
  const w = src.width;
  const h = src.height;
  const srcData = src.data;
  const destData = dest.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = h - 1 - y;
      const dy = x;
      const si = (y * w + x) * 4;
      const o = (dy * h + dx) * 4;
      destData[o] = srcData[si]!;
      destData[o + 1] = srcData[si + 1]!;
      destData[o + 2] = srcData[si + 2]!;
      destData[o + 3] = srcData[si + 3]!;
    }
  }
};

/** Rotate 90° counter-clockwise; output is height×width */
export const rotate90CCW: EffectFn = (src: ImageData, dest: ImageData): void => {
  const w = src.width;
  const h = src.height;
  const srcData = src.data;
  const destData = dest.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = y;
      const dy = w - 1 - x;
      const si = (y * w + x) * 4;
      const o = (dy * h + dx) * 4;
      destData[o] = srcData[si]!;
      destData[o + 1] = srcData[si + 1]!;
      destData[o + 2] = srcData[si + 2]!;
      destData[o + 3] = srcData[si + 3]!;
    }
  }
};

function sample(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number
): { r: number; g: number; b: number; a: number } {
  const sx = Math.floor(x);
  const sy = Math.floor(y);
  if (sx < 0 || sx >= width || sy < 0 || sy >= height) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  const i = (sy * width + sx) * 4;
  return {
    r: data[i]!,
    g: data[i + 1]!,
    b: data[i + 2]!,
    a: data[i + 3]!,
  };
}

function rotateAngle(angleDeg: number): EffectFn {
  const angle = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return (src: ImageData, dest: ImageData): void => {
    const { width, height, data: srcData } = src;
    const destData = dest.data;
    const cx = width / 2;
    const cy = height / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const sx = dx * cos + dy * sin + cx;
        const sy = -dx * sin + dy * cos + cy;
        const p = sample(srcData, width, height, sx, sy);
        const o = (y * width + x) * 4;
        destData[o] = p.r;
        destData[o + 1] = p.g;
        destData[o + 2] = p.b;
        destData[o + 3] = p.a;
      }
    }
  };
}

export const rotate5: EffectFn = rotateAngle(5);
export const rotate15: EffectFn = rotateAngle(15);
export const rotateNeg5: EffectFn = rotateAngle(-5);
export const rotateNeg15: EffectFn = rotateAngle(-15);
