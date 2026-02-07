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
import * as splitNine from "./splitNine.js";
import * as vignette from "./vignette.js";
import * as whiteStripes from "./whiteStripes.js";

export function registerAll(): void {
  // 1–5: Blur & sharpen
  register(1, { name: "Blur light", apply: blur.blurLight });
  register(2, { name: "Blur medium", apply: blur.blurMedium });
  register(3, { name: "Blur heavy", apply: blur.blurHeavy });
  register(4, { name: "Sharpen", apply: sharpen.sharpen });
  register(5, { name: "Emboss", apply: emboss.emboss });

  // 6–13: Channels & RGB shift
  register(6, { name: "Red channel only", apply: channels.redOnly });
  register(7, { name: "Green channel only", apply: channels.greenOnly });
  register(8, { name: "Blue channel only", apply: channels.blueOnly });
  register(9, { name: "Swap R–G", apply: channels.swapRG });
  register(10, { name: "Swap G–B", apply: channels.swapGB });
  register(11, { name: "Swap R–B", apply: channels.swapRB });
  register(12, { name: "RGB shift", apply: rgbShift.rgbShift });
  register(13, { name: "RGB shift vertical", apply: glitch.rgbShiftVertical });

  // 14–17: Contrast & brightness
  register(14, { name: "Contrast up", apply: contrast.contrastUp });
  register(15, { name: "Contrast down", apply: contrast.contrastDown });
  register(16, { name: "Brightness up", apply: contrast.brightnessUp });
  register(17, { name: "Brightness down", apply: contrast.brightnessDown });

  // 18–20: Saturation & intensity
  register(18, { name: "Saturation up", apply: saturation.saturationUp });
  register(19, { name: "Saturation down", apply: saturation.saturationDown });
  register(20, { name: "Deep fry", apply: deepfry.deepfry });

  // 21–23: Grayscale & invert
  register(21, { name: "Grayscale", apply: grayscale.grayscale });
  register(22, { name: "Invert", apply: invert.invert });
  register(23, { name: "Solarize", apply: solarize.solarize });

  // 24–35: Color & tint
  register(24, { name: "Sepia", apply: sepia.sepia });
  register(25, { name: "Warm tint", apply: artistic.warmTint });
  register(26, { name: "Cool tint", apply: artistic.coolTint });
  register(27, { name: "Fade", apply: artistic.fade });
  register(28, { name: "Duotone", apply: artistic.duotone });
  register(29, { name: "Colorise", apply: artistic.colorise });
  register(30, { name: "Colorise warm", apply: artistic.coloriseWarm });
  register(31, { name: "Film grain", apply: artistic.filmGrain });
  register(32, { name: "High key", apply: artistic.highKey });
  register(33, { name: "Low key", apply: artistic.lowKey });
  register(34, { name: "Lomo", apply: artistic.lomo });
  register(35, { name: "Vignette", apply: vignette.vignette });

  // 36–43: Pixel & retro
  register(36, { name: "Pixelate small", apply: pixelate.pixelateSmall });
  register(37, { name: "Pixelate medium", apply: pixelate.pixelateMedium });
  register(38, { name: "Pixelate large", apply: pixelate.pixelateLarge });
  register(39, { name: "Posterize 4 levels", apply: posterize.posterize4 });
  register(40, { name: "Posterize 8 levels", apply: posterize.posterize8 });
  register(41, { name: "Dither", apply: dither.dither });
  register(42, { name: "Scanlines", apply: scanlines.scanlines });
  register(43, { name: "Pixel sort rows", apply: pixelSort.pixelSortRows });
  register(44, { name: "Pixel sort columns", apply: pixelSort.pixelSortColumns });

  // 45–51: Glitch
  register(45, { name: "Glitch slice shift", apply: glitch.sliceShift });
  register(46, { name: "Glitch scan jitter", apply: glitch.scanJitter });
  register(47, { name: "Glitch mirror slices", apply: glitch.mirrorSlices });
  register(48, { name: "Glitch noise lines", apply: glitch.noiseLines });
  register(49, { name: "Glitch block scramble", apply: glitch.blockScramble });
  register(50, { name: "Glitch data smear", apply: glitch.dataSmear });

  // 51–53: Edges
  register(51, { name: "Edge outline", apply: artistic.edgeOutline });
  register(52, { name: "Find edges", apply: artistic.findEdges });
  register(53, { name: "Glowing edges", apply: artistic.glowingEdges });

  // 54–62: Transform & layout
  register(54, { name: "Split into 4", apply: splitFour.splitFour });
  register(55, { name: "Split into 9", apply: splitNine.splitNine });
  register(56, { name: "Kaleidoscope", apply: kaleidoscope.kaleidoscope });
  register(57, { name: "Rotate 180°", apply: rotation.rotate180 });
  register(58, {
    name: "Rotate 90° CW",
    apply: rotation.rotate90CW,
    getOutputSize: (w, h) => ({ width: h, height: w }),
  });
  register(59, {
    name: "Rotate 90° CCW",
    apply: rotation.rotate90CCW,
    getOutputSize: (w, h) => ({ width: h, height: w }),
  });
  register(60, { name: "Rotate 5°", apply: rotation.rotate5 });
  register(61, { name: "Rotate 15°", apply: rotation.rotate15 });
  register(62, { name: "Rotate -5°", apply: rotation.rotateNeg5 });
  register(63, { name: "Rotate -15°", apply: rotation.rotateNeg15 });

  // 64–75: White stripes (N/S, E/W, SW/NE, NW/SE × small, medium, large)
  register(64, { name: "White stripes N/S small", apply: whiteStripes.whiteStripesNSSmall });
  register(65, { name: "White stripes N/S medium", apply: whiteStripes.whiteStripesNSMedium });
  register(66, { name: "White stripes N/S large", apply: whiteStripes.whiteStripesNSLarge });
  register(67, { name: "White stripes E/W small", apply: whiteStripes.whiteStripesEWSmall });
  register(68, { name: "White stripes E/W medium", apply: whiteStripes.whiteStripesEWMedium });
  register(69, { name: "White stripes E/W large", apply: whiteStripes.whiteStripesEWLarge });
  register(70, { name: "White stripes SW/NE small", apply: whiteStripes.whiteStripesSWNESmall });
  register(71, { name: "White stripes SW/NE medium", apply: whiteStripes.whiteStripesSWNEMedium });
  register(72, { name: "White stripes SW/NE large", apply: whiteStripes.whiteStripesSWNELarge });
  register(73, { name: "White stripes NW/SE small", apply: whiteStripes.whiteStripesNWSESmall });
  register(74, { name: "White stripes NW/SE medium", apply: whiteStripes.whiteStripesNWSEMedium });
  register(75, { name: "White stripes NW/SE large", apply: whiteStripes.whiteStripesNWSELarge });
}
