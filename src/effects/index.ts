import { register } from "./registry.js";
import * as artistic from "./artistic.js";
import * as blur from "./blur.js";
import * as channels from "./channels.js";
import * as contrast from "./contrast.js";
import * as deepfry from "./deepfry.js";
import * as dither from "./dither.js";
import * as emboss from "./emboss.js";
import * as glitch from "./glitch.js";
import * as grayscale from "./grayscale.js";
import * as invert from "./invert.js";
import * as kaleidoscope from "./kaleidoscope.js";
import * as pixelate from "./pixelate.js";
import * as pixelSort from "./pixelSort.js";
import * as posterize from "./posterize.js";
import * as rgbShift from "./rgbShift.js";
import * as rotation from "./rotation.js";
import * as saturation from "./saturation.js";
import * as scanlines from "./scanlines.js";
import * as sepia from "./sepia.js";
import * as sharpen from "./sharpen.js";
import * as solarize from "./solarize.js";
import * as splitFour from "./splitFour.js";
import * as vignette from "./vignette.js";

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
  register(16, { name: "Pixelate small", apply: pixelate.pixelateSmall });
  register(17, { name: "Pixelate medium", apply: pixelate.pixelateMedium });
  register(18, { name: "Pixelate large", apply: pixelate.pixelateLarge });
  register(19, { name: "Posterize 4 levels", apply: posterize.posterize4 });
  register(20, { name: "Posterize 8 levels", apply: posterize.posterize8 });
  register(21, { name: "Dither", apply: dither.dither });
  register(22, { name: "Scanlines", apply: scanlines.scanlines });
  register(23, { name: "RGB shift", apply: rgbShift.rgbShift });
  register(24, { name: "Pixel sort rows", apply: pixelSort.pixelSortRows });
  register(25, { name: "Sepia", apply: sepia.sepia });
  register(26, { name: "Solarize", apply: solarize.solarize });
  register(27, { name: "Vignette", apply: vignette.vignette });
  register(28, { name: "Kaleidoscope", apply: kaleidoscope.kaleidoscope });
  register(29, { name: "Emboss", apply: emboss.emboss });
  register(30, { name: "Sharpen", apply: sharpen.sharpen });
  register(31, { name: "Contrast up", apply: contrast.contrastUp });
  register(32, { name: "Contrast down", apply: contrast.contrastDown });
  register(33, { name: "Brightness up", apply: contrast.brightnessUp });
  register(34, { name: "Brightness down", apply: contrast.brightnessDown });
  register(35, { name: "Glitch slice shift", apply: glitch.sliceShift });
  register(36, { name: "Glitch scan jitter", apply: glitch.scanJitter });
  register(37, { name: "Glitch mirror slices", apply: glitch.mirrorSlices });
  register(38, { name: "Glitch RGB shift vertical", apply: glitch.rgbShiftVertical });
  register(39, { name: "Glitch noise lines", apply: glitch.noiseLines });
  register(40, { name: "Glitch block scramble", apply: glitch.blockScramble });
  register(41, { name: "Glitch data smear", apply: glitch.dataSmear });
  register(42, { name: "Pixel sort columns", apply: pixelSort.pixelSortColumns });
  register(43, { name: "Duotone", apply: artistic.duotone });
  register(44, { name: "Warm tint", apply: artistic.warmTint });
  register(45, { name: "Cool tint", apply: artistic.coolTint });
  register(46, { name: "Fade", apply: artistic.fade });
  register(47, { name: "Film grain", apply: artistic.filmGrain });
  register(48, { name: "Edge outline", apply: artistic.edgeOutline });
  register(59, { name: "Find edges", apply: artistic.findEdges });
  register(60, { name: "Glowing edges", apply: artistic.glowingEdges });
  register(61, { name: "Colorise", apply: artistic.colorise });
  register(62, { name: "Colorise warm", apply: artistic.coloriseWarm });
  register(49, { name: "High key", apply: artistic.highKey });
  register(50, { name: "Low key", apply: artistic.lowKey });
  register(51, { name: "Lomo", apply: artistic.lomo });
  register(52, { name: "Rotate 180°", apply: rotation.rotate180 });
  register(53, {
    name: "Rotate 90° CW",
    apply: rotation.rotate90CW,
    getOutputSize: (w, h) => ({ width: h, height: w }),
  });
  register(54, {
    name: "Rotate 90° CCW",
    apply: rotation.rotate90CCW,
    getOutputSize: (w, h) => ({ width: h, height: w }),
  });
  register(55, { name: "Rotate 5°", apply: rotation.rotate5 });
  register(56, { name: "Rotate 15°", apply: rotation.rotate15 });
  register(57, { name: "Rotate -5°", apply: rotation.rotateNeg5 });
  register(58, { name: "Rotate -15°", apply: rotation.rotateNeg15 });
}
