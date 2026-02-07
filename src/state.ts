const MAX_HISTORY = 50;

let current: ImageData | null = null;
const history: ImageData[] = [];

export function getCurrent(): ImageData | null {
  return current;
}

export function setCurrent(data: ImageData): void {
  current = data;
}

export function pushHistory(): void {
  if (!current) return;
  const snapshot = cloneImageData(current);
  history.push(snapshot);
  if (history.length > MAX_HISTORY) history.shift();
}

export function undo(): boolean {
  if (history.length === 0) return false;
  const prev = history.pop();
  if (prev) current = prev;
  return true;
}

export function clearHistory(): void {
  history.length = 0;
}

export function hasHistory(): boolean {
  return history.length > 0;
}

function cloneImageData(src: ImageData): ImageData {
  const dest = new ImageData(src.width, src.height);
  dest.data.set(src.data);
  return dest;
}
