import type { EffectFn } from "../types.js";

function clamp(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v)));
}

function saturationEffect(mult: number): EffectFn {
  return (src: ImageData, dest: ImageData): void => {
    const srcData = src.data;
    const destData = dest.data;
    for (let i = 0; i < srcData.length; i += 4) {
      const r = srcData[i]!;
      const g = srcData[i + 1]!;
      const b = srcData[i + 2]!;
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      destData[i] = clamp((r - gray) * mult + gray);
      destData[i + 1] = clamp((g - gray) * mult + gray);
      destData[i + 2] = clamp((b - gray) * mult + gray);
      destData[i + 3] = srcData[i + 3]!;
    }
  };
}

export const saturationUp: EffectFn = saturationEffect(1.8);
export const saturationDown: EffectFn = saturationEffect(0.4);
