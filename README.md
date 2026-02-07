# WarpeR

Interactive image effect sandbox: load an image, type effect numbers and press Enter to apply, Backspace to undo. Add `.5` after a number (e.g. `21.5`) to apply that effect only to the left half of the image. Type `S` then a seed number (e.g. `S42`) and Enter to run a deterministic random sequence of effects.

## Beware!

> [!WARNING]
> 🤖 This project is vibe-coded with minimal edits. 


## Effects

| # | Effect |
|---|--------|
| 1 | Blur light |
| 2 | Blur medium |
| 3 | Blur heavy |
| 4 | Sharpen |
| 5 | Emboss |
| 6 | Red channel only |
| 7 | Green channel only |
| 8 | Blue channel only |
| 9 | Swap R–G |
| 10 | Swap G–B |
| 11 | Swap R–B |
| 12 | RGB shift |
| 13 | RGB shift vertical |
| 14 | Contrast up |
| 15 | Contrast down |
| 16 | Brightness up |
| 17 | Brightness down |
| 18 | Saturation up |
| 19 | Saturation down |
| 20 | Deep fry |
| 21 | Grayscale |
| 22 | Invert |
| 23 | Solarize |
| 24 | Sepia |
| 25 | Warm tint |
| 26 | Cool tint |
| 27 | Fade |
| 28 | Duotone |
| 29 | Colorise |
| 30 | Colorise warm |
| 31 | Film grain |
| 32 | High key |
| 33 | Low key |
| 34 | Lomo |
| 35 | Vignette |
| 36 | Pixelate small |
| 37 | Pixelate medium |
| 38 | Pixelate large |
| 39 | Posterize 4 levels |
| 40 | Posterize 8 levels |
| 41 | Dither |
| 42 | Scanlines |
| 43 | Pixel sort rows |
| 44 | Pixel sort columns |
| 45 | Glitch slice shift |
| 46 | Glitch scan jitter |
| 47 | Glitch mirror slices |
| 48 | Glitch noise lines |
| 49 | Glitch block scramble |
| 50 | Glitch data smear |
| 51 | Edge outline |
| 52 | Find edges |
| 53 | Glowing edges |
| 54 | Split into 4 |
| 55 | Kaleidoscope |
| 56 | Rotate 180° |
| 57 | Rotate 90° CW |
| 58 | Rotate 90° CCW |
| 59 | Rotate 5° |
| 60 | Rotate 15° |
| 61 | Rotate -5° |
| 62 | Rotate -15° |

## Fun Combos

| Effect | Sequence |
|--------|----------|
| WarpeR Logo | 45 - 51 - 13 - 61 - 32 |

## Web

```bash
npm install
npm run dev    # open http://localhost:5173
npm run build  # output in dist/
```

## Desktop (Tauri 2)

Requires [Rust](https://rustup.rs/) and a Cargo toolchain.

```bash
npm install
npm run tauri:dev    # run app in development (Vite + native window)
npm run tauri:build  # build production app and installers
```

After `tauri:build`, installers and bundles are in `src-tauri/target/release/bundle/` (e.g. `.dmg` on macOS, `.msi` on Windows).
