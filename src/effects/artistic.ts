import type { EffectFn } from "../types.js";

function clamp(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v)));
}

function luminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/** Sample a multi-stop gradient at t in [0,1]. Stops: array of { t, r, g, b } sorted by t. */
function gradientAt(
  stops: { t: number; r: number; g: number; b: number }[],
  t: number
): { r: number; g: number; b: number } {
  let i = 0;
  while (i < stops.length - 1 && stops[i + 1]!.t <= t) i++;
  if (i >= stops.length - 1) return { r: stops[stops.length - 1]!.r, g: stops[stops.length - 1]!.g, b: stops[stops.length - 1]!.b };
  const a = stops[i]!;
  const b = stops[i + 1]!;
  const u = (t - a.t) / (b.t - a.t);
  return {
    r: a.r + (b.r - a.r) * u,
    g: a.g + (b.g - a.g) * u,
    b: a.b + (b.b - a.b) * u,
  };
}

/** Colorise: grayscale then map luminance through a gradient (hand-tinted / generated colour) */
const COLORISE_STOPS = [
  { t: 0, r: 28, g: 35, b: 52 },
  { t: 0.35, r: 70, g: 95, b: 110 },
  { t: 0.6, r: 140, g: 120, b: 95 },
  { t: 0.85, r: 220, g: 210, b: 190 },
  { t: 1, r: 248, g: 245, b: 238 },
];

export const colorise: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  for (let i = 0; i < srcData.length; i += 4) {
    const gray = luminance(srcData[i]!, srcData[i + 1]!, srcData[i + 2]!) / 255;
    const c = gradientAt(COLORISE_STOPS, gray);
    destData[i] = clamp(c.r);
    destData[i + 1] = clamp(c.g);
    destData[i + 2] = clamp(c.b);
    destData[i + 3] = srcData[i + 3]!;
  }
};

/** Colorise warm: grayscale through a warm (sepia-like) gradient */
const COLORISE_WARM_STOPS = [
  { t: 0, r: 40, g: 32, b: 28 },
  { t: 0.5, r: 120, g: 90, b: 70 },
  { t: 1, r: 245, g: 235, b: 220 },
];

export const coloriseWarm: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  for (let i = 0; i < srcData.length; i += 4) {
    const gray = luminance(srcData[i]!, srcData[i + 1]!, srcData[i + 2]!) / 255;
    const c = gradientAt(COLORISE_WARM_STOPS, gray);
    destData[i] = clamp(c.r);
    destData[i + 1] = clamp(c.g);
    destData[i + 2] = clamp(c.b);
    destData[i + 3] = srcData[i + 3]!;
  }
};

/** Duotone: map luminance to two colors (dark → light) */
export const duotone: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  const dark = { r: 32, g: 32, b: 80 };
  const light = { r: 240, g: 232, b: 200 };

  for (let i = 0; i < srcData.length; i += 4) {
    const t = luminance(srcData[i]!, srcData[i + 1]!, srcData[i + 2]!) / 255;
    destData[i] = clamp(dark.r + (light.r - dark.r) * t);
    destData[i + 1] = clamp(dark.g + (light.g - dark.g) * t);
    destData[i + 2] = clamp(dark.b + (light.b - dark.b) * t);
    destData[i + 3] = srcData[i + 3]!;
  }
};

/** Warm tint: amber/orange cast */
export const warmTint: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  for (let i = 0; i < srcData.length; i += 4) {
    destData[i] = clamp(srcData[i]! * 1.05);
    destData[i + 1] = clamp(srcData[i + 1]! * 0.98);
    destData[i + 2] = clamp(srcData[i + 2]! * 0.82);
    destData[i + 3] = srcData[i + 3]!;
  }
};

/** Cool tint: blue/cyan cast */
export const coolTint: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  for (let i = 0; i < srcData.length; i += 4) {
    destData[i] = clamp(srcData[i]! * 0.9);
    destData[i + 1] = clamp(srcData[i + 1]! * 0.97);
    destData[i + 2] = clamp(srcData[i + 2]! * 1.12);
    destData[i + 3] = srcData[i + 3]!;
  }
};

/** Fade: lift blacks, reduce contrast (faded film) */
export const fade: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  const lift = 18;
  const contrast = 0.88;
  for (let i = 0; i < srcData.length; i += 4) {
    destData[i] = clamp((srcData[i]! - 128) * contrast + 128 + lift);
    destData[i + 1] = clamp((srcData[i + 1]! - 128) * contrast + 128 + lift);
    destData[i + 2] = clamp((srcData[i + 2]! - 128) * contrast + 128 + lift);
    destData[i + 3] = srcData[i + 3]!;
  }
};

/** Deterministic film grain overlay */
function hash(n: number): number {
  return ((n * 31) ^ (n >>> 16)) >>> 0;
}

export const filmGrain: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const amount = 14;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const noise = ((hash(y * width + x) % (2 * amount + 1)) - amount);
      destData[i] = clamp(srcData[i]! + noise);
      destData[i + 1] = clamp(srcData[i + 1]! + noise);
      destData[i + 2] = clamp(srcData[i + 2]! + noise);
      destData[i + 3] = srcData[i + 3]!;
    }
  }
};

function sampleGray(data: Uint8ClampedArray, width: number, height: number, x: number, y: number): number {
  const sx = Math.min(width - 1, Math.max(0, x));
  const sy = Math.min(height - 1, Math.max(0, y));
  const i = (sy * width + sx) * 4;
  return (data[i]! + data[i + 1]! + data[i + 2]!) / 3;
}

function sobelMagnitude(
  srcData: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  scale: number
): number {
  const gx =
    -sampleGray(srcData, width, height, x - 1, y - 1) - 2 * sampleGray(srcData, width, height, x - 1, y) - sampleGray(srcData, width, height, x - 1, y + 1) +
    sampleGray(srcData, width, height, x + 1, y - 1) + 2 * sampleGray(srcData, width, height, x + 1, y) + sampleGray(srcData, width, height, x + 1, y + 1);
  const gy =
    -sampleGray(srcData, width, height, x - 1, y - 1) - 2 * sampleGray(srcData, width, height, x, y - 1) - sampleGray(srcData, width, height, x + 1, y - 1) +
    sampleGray(srcData, width, height, x - 1, y + 1) + 2 * sampleGray(srcData, width, height, x, y + 1) + sampleGray(srcData, width, height, x + 1, y + 1);
  return Math.min(255, Math.sqrt(gx * gx + gy * gy) * scale);
}

/** Edge outline (Sobel-like), dark edges on light background */
export const edgeOutline: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const mag = sobelMagnitude(srcData, width, height, x, y, 0.6);
      const inv = 255 - mag;
      const o = (y * width + x) * 4;
      destData[o] = inv;
      destData[o + 1] = inv;
      destData[o + 2] = inv;
      destData[o + 3] = srcData[o + 3]!;
    }
  }
};

/** Find Edges (Photoshop-style): light background, edges highlighted in original colors */
export const findEdges: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const mag = sobelMagnitude(srcData, width, height, x, y, 0.5);
      const t = mag / 255;
      const o = (y * width + x) * 4;
      destData[o] = clamp((1 - t) * 255 + t * srcData[o]!);
      destData[o + 1] = clamp((1 - t) * 255 + t * srcData[o + 1]!);
      destData[o + 2] = clamp((1 - t) * 255 + t * srcData[o + 2]!);
      destData[o + 3] = srcData[o + 3]!;
    }
  }
};

/** Glowing Edges (Photoshop-style): dark background, edges bright in original colors */
export const glowingEdges: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const mag = sobelMagnitude(srcData, width, height, x, y, 0.7);
      const t = mag / 255;
      const o = (y * width + x) * 4;
      destData[o] = clamp(t * srcData[o]!);
      destData[o + 1] = clamp(t * srcData[o + 1]!);
      destData[o + 2] = clamp(t * srcData[o + 2]!);
      destData[o + 3] = srcData[o + 3]!;
    }
  }
};

/** High key: push toward lighter, lift shadows */
export const highKey: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  const lift = 35;
  const gamma = 0.92;
  for (let i = 0; i < srcData.length; i += 4) {
    const r = Math.pow(srcData[i]! / 255, gamma) * 255;
    const g = Math.pow(srcData[i + 1]! / 255, gamma) * 255;
    const b = Math.pow(srcData[i + 2]! / 255, gamma) * 255;
    destData[i] = clamp(r + lift);
    destData[i + 1] = clamp(g + lift);
    destData[i + 2] = clamp(b + lift);
    destData[i + 3] = srcData[i + 3]!;
  }
};

/** Low key: push toward darker, deepen shadows */
export const lowKey: EffectFn = (src: ImageData, dest: ImageData): void => {
  const srcData = src.data;
  const destData = dest.data;
  const drop = -28;
  const gamma = 1.12;
  for (let i = 0; i < srcData.length; i += 4) {
    const r = Math.pow(srcData[i]! / 255, gamma) * 255;
    const g = Math.pow(srcData[i + 1]! / 255, gamma) * 255;
    const b = Math.pow(srcData[i + 2]! / 255, gamma) * 255;
    destData[i] = clamp(r + drop);
    destData[i + 1] = clamp(g + drop);
    destData[i + 2] = clamp(b + drop);
    destData[i + 3] = srcData[i + 3]!;
  }
};

/** Lomo-style: strong vignette + slight saturation + contrast */
export const lomo: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const vignetteFactor = Math.max(0.3, 1 - d * 0.95);
      const o = (y * width + x) * 4;
      let r = (srcData[o]! - 128) * 1.15 + 128;
      let g = (srcData[o + 1]! - 128) * 1.15 + 128;
      let b = (srcData[o + 2]! - 128) * 1.15 + 128;
      r = r * vignetteFactor;
      g = g * vignetteFactor;
      b = b * vignetteFactor;
      destData[o] = clamp(r);
      destData[o + 1] = clamp(g);
      destData[o + 2] = clamp(b);
      destData[o + 3] = srcData[o + 3]!;
    }
  }
};
