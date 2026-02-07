import { register } from "./registry.js";
import * as blur from "./blur.js";
import * as channels from "./channels.js";
import * as deepfry from "./deepfry.js";
import * as saturation from "./saturation.js";
import * as splitFour from "./splitFour.js";
import * as invert from "./invert.js";
import * as grayscale from "./grayscale.js";

export function registerAll(): void {
  register(1, { name: "Blur light", apply: blur.blurLight });
  register(2, { name: "Blur medium", apply: blur.blurMedium });
  register(3, { name: "Blur heavy", apply: blur.blurHeavy });
  register(4, { name: "Red channel only", apply: channels.redOnly });
  register(5, { name: "Green channel only", apply: channels.greenOnly });
  register(6, { name: "Blue channel only", apply: channels.blueOnly });
  register(7, { name: "Swap R–G", apply: channels.swapRG });
  register(8, { name: "Swap G–B", apply: channels.swapGB });
  register(9, { name: "Swap R–B", apply: channels.swapRB });
  register(10, { name: "Deep fry", apply: deepfry.deepfry });
  register(11, { name: "Saturation up", apply: saturation.saturationUp });
  register(12, { name: "Saturation down", apply: saturation.saturationDown });
  register(13, { name: "Split into 4", apply: splitFour.splitFour });
  register(14, { name: "Invert", apply: invert.invert });
  register(15, { name: "Grayscale", apply: grayscale.grayscale });
}
