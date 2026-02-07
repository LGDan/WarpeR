import type { EffectFn } from "../types.js";

// Deterministic "hash" for reproducible glitch patterns
function hash(n: number): number {
  return ((n * 31) ^ (n >>> 16)) >>> 0;
}

/** Horizontal slice shift: bands of rows shifted left/right (wrapping) */
export const sliceShift: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const bandHeight = Math.max(4, (height / 16) | 0);
  const maxOffset = Math.max(2, (width / 20) | 0);

  for (let y = 0; y < height; y++) {
    const band = (y / bandHeight) | 0;
    const offset = (hash(band) % (2 * maxOffset + 1)) - maxOffset;
    for (let x = 0; x < width; x++) {
      const sx = (x - offset + width * 2) % width;
      const si = (y * width + sx) * 4;
      const o = (y * width + x) * 4;
      destData[o] = srcData[si]!;
      destData[o + 1] = srcData[si + 1]!;
      destData[o + 2] = srcData[si + 2]!;
      destData[o + 3] = srcData[si + 3]!;
    }
  }
};

/** Scan jitter: every few rows offset horizontally */
export const scanJitter: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const period = 4;
  const jitter = 8;

  for (let y = 0; y < height; y++) {
    const offset = (y % period === 0 ? (hash(y) % (2 * jitter + 1)) - jitter : 0);
    for (let x = 0; x < width; x++) {
      const sx = (x - offset + width * 2) % width;
      const si = (y * width + sx) * 4;
      const o = (y * width + x) * 4;
      destData[o] = srcData[si]!;
      destData[o + 1] = srcData[si + 1]!;
      destData[o + 2] = srcData[si + 2]!;
      destData[o + 3] = srcData[si + 3]!;
    }
  }
};

/** Mirror slices: every other horizontal band is flipped */
export const mirrorSlices: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const bandHeight = Math.max(2, (height / 12) | 0);

  for (let y = 0; y < height; y++) {
    const band = (y / bandHeight) | 0;
    const flip = band % 2 === 1;
    for (let x = 0; x < width; x++) {
      const sx = flip ? width - 1 - x : x;
      const si = (y * width + sx) * 4;
      const o = (y * width + x) * 4;
      destData[o] = srcData[si]!;
      destData[o + 1] = srcData[si + 1]!;
      destData[o + 2] = srcData[si + 2]!;
      destData[o + 3] = srcData[si + 3]!;
    }
  }
};

/** Vertical RGB shift: R up, B down */
export const rgbShiftVertical: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const offset = 6;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      const syR = Math.min(height - 1, Math.max(0, y - offset));
      const syB = Math.min(height - 1, Math.max(0, y + offset));
      destData[o] = srcData[(syR * width + x) * 4]!;
      destData[o + 1] = srcData[(y * width + x) * 4 + 1]!;
      destData[o + 2] = srcData[(syB * width + x) * 4 + 2]!;
      destData[o + 3] = srcData[o + 3]!;
    }
  }
};

/** Noise lines: replace some rows with deterministic RGB noise */
export const noiseLines: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const linePeriod = 8;

  for (let y = 0; y < height; y++) {
    const useNoise = y % linePeriod === 0;
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      if (useNoise) {
        const n = hash(y * width + x);
        destData[o] = (n >> 0) & 0xff;
        destData[o + 1] = (n >> 8) & 0xff;
        destData[o + 2] = (n >> 16) & 0xff;
        destData[o + 3] = 255;
      } else {
        destData[o] = srcData[o]!;
        destData[o + 1] = srcData[o + 1]!;
        destData[o + 2] = srcData[o + 2]!;
        destData[o + 3] = srcData[o + 3]!;
      }
    }
  }
};

/** Block scramble: transpose 8x8 blocks (block at bx,by comes from by,bx) */
export const blockScramble: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  const blockSize = 8;
  const bw = (width / blockSize) | 0;
  const bh = (height / blockSize) | 0;

  for (let by = 0; by < bh; by++) {
    for (let bx = 0; bx < bw; bx++) {
      const srcBx = by < bw ? by : bx;
      const srcBy = bx < bh ? bx : by;
      for (let dy = 0; dy < blockSize; dy++) {
        for (let dx = 0; dx < blockSize; dx++) {
          const sx = srcBx * blockSize + dx;
          const sy = srcBy * blockSize + dy;
          const dx_ = bx * blockSize + dx;
          const dy_ = by * blockSize + dy;
          if (sx < width && sy < height && dx_ < width && dy_ < height) {
            const si = (sy * width + sx) * 4;
            const o = (dy_ * width + dx_) * 4;
            destData[o] = srcData[si]!;
            destData[o + 1] = srcData[si + 1]!;
            destData[o + 2] = srcData[si + 2]!;
            destData[o + 3] = srcData[si + 3]!;
          }
        }
      }
    }
  }
};

/** Data smear: duplicate a horizontal slice downward for a few rows */
export const dataSmear: EffectFn = (src: ImageData, dest: ImageData): void => {
  const { width, height, data: srcData } = src;
  const destData = dest.data;
  destData.set(srcData);

  const stripY = (height * 0.3) | 0;
  const smearRows = Math.min(40, (height / 6) | 0);

  for (let y = stripY; y < Math.min(height, stripY + smearRows); y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      const si = (stripY * width + x) * 4;
      destData[o] = srcData[si]!;
      destData[o + 1] = srcData[si + 1]!;
      destData[o + 2] = srcData[si + 2]!;
      destData[o + 3] = srcData[si + 3]!;
    }
  }
};
