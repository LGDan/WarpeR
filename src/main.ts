import { registerAll } from "./effects/index.js";
import { get, getName } from "./effects/registry.js";
import * as state from "./state.js";

registerAll();

const dropZone = document.getElementById("drop-zone") as HTMLDivElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const canvasWrap = document.getElementById("canvas-wrap") as HTMLDivElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const inputArea = document.getElementById("input-area") as HTMLDivElement;
const commandInput = document.getElementById("command-input") as HTMLInputElement;
const effectNameEl = document.getElementById("effect-name") as HTMLDivElement;

const ctxOrNull = canvas.getContext("2d");
if (!ctxOrNull) throw new Error("Canvas 2D not available");
const ctx = ctxOrNull;

function showWorkspace(): void {
  dropZone.classList.add("hidden");
  canvasWrap.classList.remove("hidden");
  inputArea.classList.remove("hidden");
  commandInput.focus();
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
  showWorkspace();
}

function redraw(): void {
  const current = state.getCurrent();
  if (!current) return;
  ctx.putImageData(current, 0, 0);
}

function applyEffect(id: number): void {
  const entry = get(id);
  if (!entry) return;
  const current = state.getCurrent();
  if (!current) return;
  state.pushHistory();
  const dest = new ImageData(current.width, current.height);
  entry.apply(current, dest);
  state.setCurrent(dest);
  redraw();
}

function updateEffectName(): void {
  const raw = commandInput.value.replace(/\D/g, "");
  const id = raw === "" ? 0 : parseInt(raw, 10);
  effectNameEl.textContent = id ? getName(id) : "";
}

commandInput.addEventListener("input", () => {
  commandInput.value = commandInput.value.replace(/\D/g, "");
  updateEffectName();
});

commandInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const raw = commandInput.value.replace(/\D/g, "");
    if (raw === "") return;
    const id = parseInt(raw, 10);
    if (get(id)) {
      applyEffect(id);
      commandInput.value = "";
      updateEffectName();
    }
    return;
  }
  if (e.key === "Backspace" && commandInput.value === "") {
    e.preventDefault();
    if (state.undo()) redraw();
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
