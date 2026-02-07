/**
 * Radial touch keyboard: 14 sectors (S, 1–5, Enter, ., 6–0, Backspace).
 * 0° = top, angles increase clockwise. Hit-test by angle and radius.
 */

const INNER_R = 40;
const OUTER_R = 140;

/** Sector: key string, angle range [start, end) in degrees (0–360). Non-overlapping. */
const SECTORS: { key: string; start: number; end: number }[] = [
  { key: "S", start: 285, end: 310 },
  { key: "1", start: 310, end: 335 },
  { key: "2", start: 335, end: 360 },
  { key: "3", start: 0, end: 25 },
  { key: "4", start: 25, end: 50 },
  { key: "5", start: 50, end: 75 },
  { key: "Enter", start: 75, end: 105 },
  { key: "6", start: 105, end: 130 },
  { key: "7", start: 130, end: 155 },
  { key: "8", start: 155, end: 180 },
  { key: "9", start: 180, end: 205 },
  { key: "0", start: 205, end: 230 },
  { key: ".", start: 230, end: 255 },
  { key: "Backspace", start: 255, end: 285 },
];

function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a < 0) a += 360;
  return a;
}

/** Convert (dx, dy) from center to angle in degrees (0° = top, clockwise). */
function toAngle(dx: number, dy: number): number {
  const rad = Math.atan2(dx, -dy);
  let deg = (rad * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

function angleInSector(angle: number, start: number, end: number): boolean {
  const a = normalizeAngle(angle);
  if (start <= end) return a >= start && a < end;
  return a >= start || a < end;
}

export interface RadialKeyboardAPI {
  show(x: number, y: number): void;
  hide(): void;
  hitTest(px: number, py: number): string | null;
  setHighlight(key: string | null): void;
  getElement(): HTMLElement;
}

export function createRadialKeyboard(): RadialKeyboardAPI {
  const size = OUTER_R * 2 + 40;
  const center = size / 2;

  const container = document.createElement("div");
  container.id = "radial-keyboard";
  container.setAttribute("aria-hidden", "true");
  container.style.cssText = `
    position: fixed;
    width: ${size}px;
    height: ${size}px;
    pointer-events: none;
    visibility: hidden;
    touch-action: none;
    z-index: 1000;
    left: 0;
    top: 0;
    transform: translate(-50%, -50%);
  `;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.style.display = "block";

  function arcPath(
    startDeg: number,
    endDeg: number,
    r1: number,
    r2: number
  ): string {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const toX = (d: number, r: number) => center + r * Math.sin(toRad(d));
    const toY = (d: number, r: number) => center - r * Math.cos(toRad(d));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    const x1 = toX(startDeg, r2);
    const y1 = toY(startDeg, r2);
    const x2 = toX(endDeg, r2);
    const y2 = toY(endDeg, r2);
    const x3 = toX(endDeg, r1);
    const y3 = toY(endDeg, r1);
    const x4 = toX(startDeg, r1);
    const y4 = toY(startDeg, r1);
    return `M ${x1} ${y1} A ${r2} ${r2} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 ${large} 0 ${x4} ${y4} Z`;
  }

  SECTORS.forEach((s, i) => {
    const start = s.start;
    const end = s.end > start ? s.end : s.end + 360;
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", arcPath(start, end, INNER_R, OUTER_R));
    path.setAttribute("fill", "rgba(40,40,40,0.95)");
    path.setAttribute("stroke", "rgba(255,255,255,0.25)");
    path.setAttribute("stroke-width", "1");
    path.setAttribute("data-key", s.key);
    path.setAttribute("data-sector", String(i));
    svg.appendChild(path);
  });

  SECTORS.forEach((s) => {
    const deg =
      s.end > s.start
        ? (s.start + s.end) / 2
        : ((s.start + s.end + 360) / 2) % 360;
    const rad = (deg * Math.PI) / 180;
    const r = (INNER_R + OUTER_R) / 2;
    const tx = center + r * Math.sin(rad);
    const ty = center - r * Math.cos(rad);
    const label = s.key === "Enter" ? "↵" : s.key === "Backspace" ? "⌫" : s.key;
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", String(tx));
    text.setAttribute("y", String(ty));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "rgba(255,255,255,0.9)");
    text.setAttribute("font-size", "14");
    text.setAttribute("font-family", "system-ui, sans-serif");
    text.textContent = label;
    svg.appendChild(text);
  });

  container.appendChild(svg);

  function getCenter(): { x: number; y: number } {
    const rect = container.getBoundingClientRect();
    return { x: rect.left + center, y: rect.top + center };
  }

  function hitTest(px: number, py: number): string | null {
    const c = getCenter();
    const dx = px - c.x;
    const dy = py - c.y;
    const r = Math.hypot(dx, dy);
    if (r < INNER_R || r > OUTER_R) return null;
    const angle = toAngle(dx, dy);
    for (const s of SECTORS) {
      if (angleInSector(angle, s.start, s.end)) return s.key;
    }
    return null;
  }

  function setHighlight(key: string | null): void {
    const paths = svg.querySelectorAll("path[data-key]");
    paths.forEach((p) => {
      const k = p.getAttribute("data-key");
      (p as SVGElement).style.fill =
        k === key ? "rgba(80,80,80,0.98)" : "rgba(40,40,40,0.95)";
    });
  }

  return {
    getElement() {
      return container;
    },
    show(x: number, y: number) {
      container.style.left = `${x}px`;
      container.style.top = `${y}px`;
      container.style.pointerEvents = "auto";
      container.style.visibility = "visible";
      container.style.opacity = "1";
      setHighlight(null);
    },
    hide() {
      container.style.pointerEvents = "none";
      container.style.visibility = "hidden";
      container.style.opacity = "0";
      setHighlight(null);
    },
    hitTest,
    setHighlight,
  };
}
