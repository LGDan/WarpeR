import type { EffectFn } from "../types.js";

type PhaseFn = (x: number, y: number, width: number, height: number) => number;

function makeWhiteStripes(phaseFn: PhaseFn, stripePercent: number): EffectFn {
  return (src: ImageData, dest: ImageData): void => {
    const { width, height, data: srcData } = src;
    const destData = dest.data;
    const minDim = Math.min(width, height);
    const stripeWidth = Math.max(1, (minDim * stripePercent) / 100);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const phase = phaseFn(x, y, width, height);
        const bandIndex = Math.floor(phase / stripeWidth) % 2;
        const i = (y * width + x) * 4;
        if (bandIndex === 0) {
          destData[i] = 255;
          destData[i + 1] = 255;
          destData[i + 2] = 255;
          destData[i + 3] = 255;
        } else {
          destData[i] = srcData[i]!;
          destData[i + 1] = srcData[i + 1]!;
          destData[i + 2] = srcData[i + 2]!;
          destData[i + 3] = srcData[i + 3]!;
        }
      }
    }
  };
}

// N/S: horizontal bands, phase = y
const phaseNS: PhaseFn = (_x, y) => y;
export const whiteStripesNSSmall = makeWhiteStripes(phaseNS, 2);
export const whiteStripesNSMedium = makeWhiteStripes(phaseNS, 5);
export const whiteStripesNSLarge = makeWhiteStripes(phaseNS, 10);

// E/W: vertical bands, phase = x
const phaseEW: PhaseFn = (x) => x;
export const whiteStripesEWSmall = makeWhiteStripes(phaseEW, 2);
export const whiteStripesEWMedium = makeWhiteStripes(phaseEW, 5);
export const whiteStripesEWLarge = makeWhiteStripes(phaseEW, 10);

// SW/NE: phase = x + y
const phaseSWNE: PhaseFn = (x, y) => x + y;
export const whiteStripesSWNESmall = makeWhiteStripes(phaseSWNE, 2);
export const whiteStripesSWNEMedium = makeWhiteStripes(phaseSWNE, 5);
export const whiteStripesSWNELarge = makeWhiteStripes(phaseSWNE, 10);

// NW/SE: phase = x - y + width (non-negative)
const phaseNWSE: PhaseFn = (x, y, width) => x - y + width;
export const whiteStripesNWSESmall = makeWhiteStripes(phaseNWSE, 2);
export const whiteStripesNWSEMedium = makeWhiteStripes(phaseNWSE, 5);
export const whiteStripesNWSELarge = makeWhiteStripes(phaseNWSE, 10);
