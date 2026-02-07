import { registerAll } from "./effects/index.js";
import { get, getAllIds, getName } from "./effects/registry.js";
import { createRadialKeyboard } from "./radialKeyboard.js";
import * as state from "./state.js";

registerAll();

const dropZone = document.getElementById("drop-zone") as HTMLDivElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const workspace = document.getElementById("workspace") as HTMLDivElement;
const canvasWrap = document.getElementById("canvas-wrap") as HTMLDivElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const inputArea = document.getElementById("input-area") as HTMLDivElement;
const commandDisplay = document.getElementById("command-display") as HTMLDivElement;
const canvasCaption = document.getElementById("canvas-caption") as HTMLDivElement;
const breadcrumbList = document.querySelector("#breadcrumb-bar .breadcrumb-list") as HTMLDivElement;

const MAX_DIGITS = 6;
let typedDigits = "";
interface EffectStep {
  id: number;
  leftHalfOnly: boolean;
}
let effectHistory: EffectStep[] = [];

const ctxOrNull = canvas.getContext("2d");
if (!ctxOrNull) throw new Error("Canvas 2D not available");
const ctx = ctxOrNull;

function showWorkspace(): void {
  dropZone.classList.add("hidden");
  workspace.classList.remove("hidden");
  inputArea.classList.remove("hidden");
  typedDigits = "";
  syncCommandUI();
  canvasWrap.focus();
}

function loadImage(img: HTMLImageElement): void {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);
  state.setCurrent(imageData);
  state.clearHistory();
  effectHistory = [];
  updateBreadcrumb();
  showWorkspace();
}

function redraw(): void {
  const current = state.getCurrent();
  if (!current) return;
  if (canvas.width !== current.width || canvas.height !== current.height) {
    canvas.width = current.width;
    canvas.height = current.height;
  }
  ctx.putImageData(current, 0, 0);
}

function applyEffect(id: number, leftHalfOnly: boolean): void {
  const entry = get(id);
  if (!entry) return;
  const current = state.getCurrent();
  if (!current) return;
  state.pushHistory();
  const size = entry.getOutputSize?.(current.width, current.height) ?? { width: current.width, height: current.height };
  const dest = new ImageData(size.width, size.height);
  entry.apply(current, dest);

  const sameSize = size.width === current.width && size.height === current.height;
  if (leftHalfOnly && sameSize) {
    const composite = new ImageData(current.width, current.height);
    const mid = current.width >>> 1;
    const cd = composite.data;
    const cur = current.data;
    const dst = dest.data;
    for (let y = 0; y < current.height; y++) {
      for (let x = 0; x < current.width; x++) {
        const i = (y * current.width + x) * 4;
        if (x < mid) {
          cd[i] = dst[i]!;
          cd[i + 1] = dst[i + 1]!;
          cd[i + 2] = dst[i + 2]!;
          cd[i + 3] = dst[i + 3]!;
        } else {
          cd[i] = cur[i]!;
          cd[i + 1] = cur[i + 1]!;
          cd[i + 2] = cur[i + 2]!;
          cd[i + 3] = cur[i + 3]!;
        }
      }
    }
    state.setCurrent(composite);
  } else {
    state.setCurrent(dest);
  }
  effectHistory.push({ id, leftHalfOnly: leftHalfOnly && sameSize });
  updateBreadcrumb();
  redraw();
}

function updateBreadcrumb(): void {
  breadcrumbList.textContent = "";
  if (effectHistory.length === 0) {
    const empty = document.createElement("span");
    empty.className = "empty-label";
    empty.textContent = "Original";
    breadcrumbList.appendChild(empty);
    return;
  }
  for (let i = 0; i < effectHistory.length; i++) {
    if (i > 0) {
      const sep = document.createElement("span");
      sep.className = "separator";
      sep.textContent = " → ";
      sep.setAttribute("aria-hidden", "true");
      breadcrumbList.appendChild(sep);
    }
    const crumb = document.createElement("span");
    crumb.className = "crumb";
    const step = effectHistory[i]!;
    crumb.textContent = step.leftHalfOnly ? `${step.id}.5` : String(step.id);
    crumb.title = getName(step.id) + (step.leftHalfOnly ? " (left half)" : "");
    breadcrumbList.appendChild(crumb);
  }
}

/** Deterministic PRNG (mulberry32). Same seed → same sequence. Returns 0–1. */
function createSeededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t = (t ^ (t + Math.imul(t ^ (t >>> 7), t | 61))) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED_SEQUENCE_MIN = 3;
const SEED_SEQUENCE_MAX = 12;
const MAX_SEED_DIGITS = 10;

function applySeedSequence(seed: number): void {
  const effectIds = getAllIds();
  if (effectIds.length === 0) return;
  const rng = createSeededRng(seed);
  const count =
    SEED_SEQUENCE_MIN +
    Math.floor(rng() * (SEED_SEQUENCE_MAX - SEED_SEQUENCE_MIN + 1));
  const sequence: number[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * effectIds.length);
    sequence.push(effectIds[idx]!);
  }
  for (const id of sequence) {
    applyEffect(id, false);
  }
}

function parseTypedEffect(): { id: number; leftHalfOnly: boolean } | null {
  if (typedDigits.length === 0) return null;
  if (typedDigits.startsWith("S")) return null;
  const leftHalfOnly = typedDigits.endsWith(".5");
  const raw = leftHalfOnly ? typedDigits.slice(0, -2) : typedDigits;
  if (raw.length === 0) return null;
  const id = Number.parseInt(raw, 10);
  if (!Number.isFinite(id)) return null;
  return { id, leftHalfOnly };
}

function parseTypedSeed(): number | null {
  if (typedDigits.length < 2 || !typedDigits.startsWith("S")) return null;
  const raw = typedDigits.slice(1);
  if (raw.length === 0 || raw.length > MAX_SEED_DIGITS) return null;
  const seed = Number.parseInt(raw, 10);
  if (!Number.isFinite(seed)) return null;
  return seed;
}

function syncCommandUI(): void {
  commandDisplay.textContent = typedDigits;
  if (typedDigits.length > 0) {
    inputArea.classList.add("visible");
    const seed = parseTypedSeed();
    if (seed !== null) {
      canvasCaption.textContent = `Seed ${seed} (run sequence)`;
    } else {
      const parsed = parseTypedEffect();
      if (parsed && get(parsed.id)) {
        canvasCaption.textContent =
          getName(parsed.id) + (parsed.leftHalfOnly ? " (left half)" : "");
      } else {
        canvasCaption.textContent = "";
      }
    }
  } else {
    inputArea.classList.remove("visible");
    canvasCaption.textContent = "";
  }
}

/** Shared key handler for keyboard and radial input. key: "0"-"9", "S", ".", "Enter", "Backspace". */
function processKey(key: string): void {
  if (key === "S" || key === "s") {
    if (typedDigits.length === 0) {
      typedDigits = "S";
      syncCommandUI();
    }
    return;
  }
  if (key === ".") {
    if (
      !typedDigits.startsWith("S") &&
      !typedDigits.includes(".") &&
      typedDigits.length >= 1 &&
      typedDigits.length <= MAX_DIGITS
    ) {
      typedDigits += ".";
      syncCommandUI();
    }
    return;
  }
  if (key === "5" && typedDigits.endsWith(".")) {
    typedDigits += "5";
    syncCommandUI();
    return;
  }
  if (/^\d$/.test(key)) {
    if (typedDigits.startsWith("S")) {
      if (typedDigits.length < 1 + MAX_SEED_DIGITS) {
        typedDigits += key;
        syncCommandUI();
      }
      return;
    }
    if (typedDigits.endsWith(".")) return;
    if (typedDigits.length < MAX_DIGITS) {
      typedDigits += key;
      syncCommandUI();
    }
    return;
  }
  if (key === "Enter") {
    if (typedDigits.length === 0) {
      const last = effectHistory[effectHistory.length - 1];
      if (last && get(last.id)) {
        applyEffect(last.id, last.leftHalfOnly);
      }
      return;
    }
    const seed = parseTypedSeed();
    if (seed !== null) {
      applySeedSequence(seed);
      typedDigits = "";
      syncCommandUI();
      return;
    }
    const parsed = parseTypedEffect();
    if (!parsed || !get(parsed.id)) return;
    applyEffect(parsed.id, parsed.leftHalfOnly);
    typedDigits = "";
    syncCommandUI();
    return;
  }
  if (key === "Backspace") {
    if (typedDigits.length > 0) {
      typedDigits = typedDigits.slice(0, -1);
      syncCommandUI();
    } else {
      if (state.undo()) {
        effectHistory.pop();
        updateBreadcrumb();
        redraw();
      }
    }
  }
}

const hasTouch =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

let radialKeyboard: ReturnType<typeof createRadialKeyboard> | null = null;
if (hasTouch) {
  const placeholder = document.getElementById("radial-keyboard-placeholder");
  if (placeholder) {
    radialKeyboard = createRadialKeyboard();
    placeholder.appendChild(radialKeyboard.getElement());
  }
}

const LONG_PRESS_MS = 500;
let longPressTimer: ReturnType<typeof setTimeout> | null = null;
let longPressPointerId: number | null = null;
let radialPointerId: number | null = null;

function clearLongPressTimer(): void {
  if (longPressTimer !== null) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  longPressPointerId = null;
}

function onPointerUpOrCancel(e: PointerEvent): void {
  if (e.pointerId !== radialPointerId) return;
  if (radialKeyboard) {
    const key = radialKeyboard.hitTest(e.clientX, e.clientY);
    if (key) processKey(key);
    radialKeyboard.hide();
  }
  radialPointerId = null;
  document.removeEventListener("pointermove", onRadialPointerMove);
  document.removeEventListener("pointerup", onPointerUpOrCancel);
  document.removeEventListener("pointercancel", onPointerUpOrCancel);
}

function onRadialPointerMove(e: PointerEvent): void {
  if (e.pointerId !== radialPointerId || !radialKeyboard) return;
  e.preventDefault();
  const key = radialKeyboard.hitTest(e.clientX, e.clientY);
  radialKeyboard.setHighlight(key);
}

function setupRadialPointerListeners(): void {
  document.addEventListener("pointermove", onRadialPointerMove, { passive: false });
  document.addEventListener("pointerup", onPointerUpOrCancel);
  document.addEventListener("pointercancel", onPointerUpOrCancel);
}

workspace.addEventListener("pointerdown", (e) => {
  if (!hasTouch || e.pointerType !== "touch" || radialKeyboard === null) return;
  if (workspace.classList.contains("hidden")) return;
  if (longPressTimer !== null) return;
  const pointerId = e.pointerId;
  const clientX = e.clientX;
  const clientY = e.clientY;
  longPressPointerId = pointerId;
  longPressTimer = setTimeout(() => {
    longPressTimer = null;
    longPressPointerId = null;
    if (!radialKeyboard) return;
    radialPointerId = pointerId;
    e.preventDefault();
    radialKeyboard.show(clientX, clientY);
    setupRadialPointerListeners();
  }, LONG_PRESS_MS);
});

workspace.addEventListener("pointerup", () => {
  if (longPressPointerId !== null) clearLongPressTimer();
});
workspace.addEventListener("pointercancel", () => {
  if (longPressPointerId !== null) clearLongPressTimer();
});
workspace.addEventListener("pointerleave", () => {
  if (longPressPointerId !== null) clearLongPressTimer();
});

document.addEventListener("keydown", (e) => {
  if (workspace.classList.contains("hidden")) return;
  const target = e.target as HTMLElement;
  if (target.closest("input") || target.closest("textarea") || target.closest("select")) return;

  const key = e.key;
  if (
    key === "S" ||
    key === "s" ||
    key === "." ||
    key === "5" ||
    key === "Enter" ||
    key === "Backspace" ||
    /^\d$/.test(key)
  ) {
    e.preventDefault();
    processKey(key);
  }
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file?.type.startsWith("image/")) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    loadImage(img);
    URL.revokeObjectURL(url);
  };
  img.src = url;
});

dropZone.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).tagName === "INPUT") return;
  fileInput.click();
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer?.files?.[0];
  if (!file?.type.startsWith("image/")) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    loadImage(img);
    URL.revokeObjectURL(url);
  };
  img.src = url;
});
