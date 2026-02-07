import { registerAll } from "./effects/index.js";
import { get, getName } from "./effects/registry.js";
import * as state from "./state.js";

registerAll();

const dropZone = document.getElementById("drop-zone") as HTMLDivElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const canvasWrap = document.getElementById("canvas-wrap") as HTMLDivElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const inputArea = document.getElementById("input-area") as HTMLDivElement;
const commandDisplay = document.getElementById("command-display") as HTMLDivElement;
const canvasCaption = document.getElementById("canvas-caption") as HTMLDivElement;
const breadcrumbList = document.querySelector("#breadcrumb-bar .breadcrumb-list") as HTMLDivElement;

const MAX_DIGITS = 6;
let typedDigits = "";
let effectHistory: number[] = [];

const ctxOrNull = canvas.getContext("2d");
if (!ctxOrNull) throw new Error("Canvas 2D not available");
const ctx = ctxOrNull;

function showWorkspace(): void {
  dropZone.classList.add("hidden");
  canvasWrap.classList.remove("hidden");
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

function applyEffect(id: number): void {
  const entry = get(id);
  if (!entry) return;
  const current = state.getCurrent();
  if (!current) return;
  state.pushHistory();
  effectHistory.push(id);
  const size = entry.getOutputSize?.(current.width, current.height) ?? { width: current.width, height: current.height };
  const dest = new ImageData(size.width, size.height);
  entry.apply(current, dest);
  state.setCurrent(dest);
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
    const effectId = effectHistory[i]!;
    crumb.textContent = String(effectId);
    crumb.title = getName(effectId);
    breadcrumbList.appendChild(crumb);
  }
}

function syncCommandUI(): void {
  commandDisplay.textContent = typedDigits;
  if (typedDigits.length > 0) {
    inputArea.classList.add("visible");
    const id = parseInt(typedDigits, 10);
    canvasCaption.textContent = getName(id);
  } else {
    inputArea.classList.remove("visible");
    canvasCaption.textContent = "";
  }
}

document.addEventListener("keydown", (e) => {
  if (canvasWrap.classList.contains("hidden")) return;
  const target = e.target as HTMLElement;
  if (target.closest("input") || target.closest("textarea") || target.closest("select")) return;

  if (/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    if (typedDigits.length < MAX_DIGITS) {
      typedDigits += e.key;
      syncCommandUI();
    }
    return;
  }
  if (e.key === "Enter") {
    e.preventDefault();
    if (typedDigits.length === 0) return;
    const id = parseInt(typedDigits, 10);
    if (get(id)) {
      applyEffect(id);
      typedDigits = "";
      syncCommandUI();
    }
    return;
  }
  if (e.key === "Backspace") {
    e.preventDefault();
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
    return;
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
