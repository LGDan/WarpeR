import type { EffectFn } from "../types.js";

function channelOnly(keepR: boolean, keepG: boolean, keepB: boolean): EffectFn {
  return (src: ImageData, dest: ImageData): void => {
    const srcData = src.data;
    const destData = dest.data;
    for (let i = 0; i < srcData.length; i += 4) {
      destData[i] = keepR ? srcData[i]! : 0;
      destData[i + 1] = keepG ? srcData[i + 1]! : 0;
      destData[i + 2] = keepB ? srcData[i + 2]! : 0;
      destData[i + 3] = srcData[i + 3]!;
    }
  };
}

function channelSwap(
  rFrom: 0 | 1 | 2,
  gFrom: 0 | 1 | 2,
  bFrom: 0 | 1 | 2
): EffectFn {
  return (src: ImageData, dest: ImageData): void => {
    const srcData = src.data;
    const destData = dest.data;
    for (let i = 0; i < srcData.length; i += 4) {
      const r = srcData[i + rFrom]!;
      const g = srcData[i + gFrom]!;
      const b = srcData[i + bFrom]!;
      destData[i] = r;
      destData[i + 1] = g;
      destData[i + 2] = b;
      destData[i + 3] = srcData[i + 3]!;
    }
  };
}

export const redOnly: EffectFn = channelOnly(true, false, false);
export const greenOnly: EffectFn = channelOnly(false, true, false);
export const blueOnly: EffectFn = channelOnly(false, false, true);
export const swapRG: EffectFn = channelSwap(1, 0, 2);
export const swapGB: EffectFn = channelSwap(0, 2, 1);
export const swapRB: EffectFn = channelSwap(2, 1, 0);
