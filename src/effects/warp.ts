import type { EffectFn } from "../types.js";

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

/** Sample with wrap: coordinates wrap modulo width/height so nothing is lost. */
function sampleWrapped(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number
): { r: number; g: number; b: number; a: number } {
  let u = x % width;
  if (u < 0) u += width;
  let v = y % height;
  if (v < 0) v += height;
  const sx = Math.min(width - 1, Math.floor(u));
  const sy = Math.min(height - 1, Math.floor(v));
  const i = (sy * width + sx) * 4;
  return {
    r: data[i]!,
    g: data[i + 1]!,
    b: data[i + 2]!,
    a: data[i + 3]!,
  };
}

/** Radial blur: blur along the direction from center. Same size. */
export const radialBlur: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const maxR = Math.hypot(cx, cy) || 1;
  const samples = 9;
  const step = 1.5;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);
      const nx = r > 0 ? dx / r : 0;
      const ny = r > 0 ? dy / r : 0;
      const strength = 0.4 * (r / maxR);
      let ar = 0, ag = 0, ab = 0, aa = 0;
      let count = 0;
      for (let i = -samples; i <= samples; i++) {
        const t = i * step * strength;
        const sx = x + nx * t;
        const sy = y + ny * t;
        const p = sample(srcData, width, height, sx, sy);
        ar += p.r;
        ag += p.g;
        ab += p.b;
        aa += p.a;
        count++;
      }
      const o = (y * width + x) * 4;
      destData[o] = Math.round(ar / count);
      destData[o + 1] = Math.round(ag / count);
      destData[o + 2] = Math.round(ab / count);
      destData[o + 3] = Math.round(aa / count);
    }
  }
};

/** Swirl warp around center. Same size. */
export const swirl: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const maxR = Math.hypot(cx, cy) || 1;
  const twist = 1.2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const t = (1 - r / maxR) * twist * Math.PI;
      const sx = cx + r * Math.cos(angle + t);
      const sy = cy + r * Math.sin(angle + t);
      const p = sample(srcData, width, height, sx, sy);
      const o = (y * width + x) * 4;
      destData[o] = p.r;
      destData[o + 1] = p.g;
      destData[o + 2] = p.b;
      destData[o + 3] = p.a;
    }
  }
};

/** Bulge warp: push outward from center. Same size. */
export const bulge: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const maxR = Math.hypot(cx, cy) || 1;
  const k = 0.6;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);
      const n = r / maxR;
      const g = 1 / (1 + k * n * n);
      const sx = cx + dx * g;
      const sy = cy + dy * g;
      const p = sample(srcData, width, height, sx, sy);
      const o = (y * width + x) * 4;
      destData[o] = p.r;
      destData[o + 1] = p.g;
      destData[o + 2] = p.b;
      destData[o + 3] = p.a;
    }
  }
};

/** Pinch warp: pull toward center. Same size. */
export const pinch: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const maxR = Math.hypot(cx, cy) || 1;
  const k = 0.5;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);
      const n = r / maxR;
      const g = 1 + k * n * n;
      const sx = cx + dx * g;
      const sy = cy + dy * g;
      const p = sample(srcData, width, height, sx, sy);
      const o = (y * width + x) * 4;
      destData[o] = p.r;
      destData[o + 1] = p.g;
      destData[o + 2] = p.b;
      destData[o + 3] = p.a;
    }
  }
};

/** Skew transform: horizontal and vertical shear. Same size. */
export const skew: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const skewX = 0.25;
  const skewY = 0.15;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sx = x + skewX * (y - (height - 1) / 2);
      const sy = y + skewY * (x - (width - 1) / 2);
      const p = sample(srcData, width, height, sx, sy);
      const o = (y * width + x) * 4;
      destData[o] = p.r;
      destData[o + 1] = p.g;
      destData[o + 2] = p.b;
      destData[o + 3] = p.a;
    }
  }
};

/**
 * Parallelogram/rhombus skew with wrap: shears the image so it looks like a
 * parallelogram but samples wrap in x and y so no content is lost (tiled).
 * Same size.
 */
export const skewWrap: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const kx = 0.35;
  const ky = 0.2;
  const det = 1 - kx * ky;
  if (Math.abs(det) < 0.01) return;
  const inv = 1 / det;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sx = inv * (x - kx * y);
      const sy = inv * (y - ky * x);
      const p = sampleWrapped(srcData, width, height, sx, sy);
      const o = (y * width + x) * 4;
      destData[o] = p.r;
      destData[o + 1] = p.g;
      destData[o + 2] = p.b;
      destData[o + 3] = p.a;
    }
  }
};
