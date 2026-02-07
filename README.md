# Warper

Interactive image toy: load an image, type effect numbers and press Enter to apply, Backspace to undo.

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
