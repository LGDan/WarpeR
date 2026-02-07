import type { EffectFn } from "../types.js";

function clamp(v: number): number {
  return Math.min(255, Math.max(0, Math.round(v)));
}

function contrastEffect(factor: number): EffectFn {
  return (src: ImageData, dest: ImageData): void => {
    const srcData = src.data;
    const destData = dest.data;
    for (let i = 0; i < srcData.length; i += 4) {
      destData[i] = clamp((srcData[i]! - 128) * factor + 128);
      destData[i + 1] = clamp((srcData[i + 1]! - 128) * factor + 128);
      destData[i + 2] = clamp((srcData[i + 2]! - 128) * factor + 128);
      destData[i + 3] = srcData[i + 3]!;
    }
  };
}

function brightnessEffect(delta: number): EffectFn {
  return (src: ImageData, dest: ImageData): void => {
    const srcData = src.data;
    const destData = dest.data;
    for (let i = 0; i < srcData.length; i += 4) {
      destData[i] = clamp(srcData[i]! + delta);
      destData[i + 1] = clamp(srcData[i + 1]! + delta);
      destData[i + 2] = clamp(srcData[i + 2]! + delta);
      destData[i + 3] = srcData[i + 3]!;
    }
  };
}

export const contrastUp: EffectFn = contrastEffect(1.5);
export const contrastDown: EffectFn = contrastEffect(0.65);
export const brightnessUp: EffectFn = brightnessEffect(25);
export const brightnessDown: EffectFn = brightnessEffect(-25);
