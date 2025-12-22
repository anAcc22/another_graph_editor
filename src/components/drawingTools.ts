import { Settings } from "../types";

import { clamp } from "./utils";

export interface GraphRenderer {
  // 基础绘制属性
  lineWidth: number;
  strokeStyle: string;
  fillStyle: string;
  textBaseline: CanvasTextBaseline;
  textAlign: CanvasTextAlign;
  font: string;
  lineCap: CanvasLineCap;

  // Canvas全局操作
  clearRect(x: number, y: number, width: number, height: number): void;
  globalCompositeOperation: GlobalCompositeOperation;
  setLineDash(segments: number[]): void;

  // 路径操作
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean,
  ): void;
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number,
  ): void;

  // 绘制操作
  fill(): void;
  stroke(): void;
  fillText(text: string, x: number, y: number, maxWidth?: number): void;

  // 导出方法
  getImage(): string; // 返回数据URL或SVG字符串
}

export class CanvasRenderer implements GraphRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Cannot get 2D context from canvas!");
    this.ctx = context;
    this.ctx.lineCap;
  }

  get lineWidth() {
    return this.ctx.lineWidth;
  }
  set lineWidth(value: number) {
    this.ctx.lineWidth = value;
  }

  get strokeStyle() {
    return this.ctx.strokeStyle.toString();
  }
  set strokeStyle(value: string) {
    this.ctx.strokeStyle = value;
  }

  get fillStyle() {
    return this.ctx.fillStyle.toString();
  }
  set fillStyle(value: string) {
    this.ctx.fillStyle = value;
  }

  get textBaseline() {
    return this.ctx.textBaseline;
  }
  set textBaseline(value: CanvasTextBaseline) {
    this.ctx.textBaseline = value;
  }

  get textAlign() {
    return this.ctx.textAlign;
  }
  set textAlign(value: CanvasTextAlign) {
    this.ctx.textAlign = value;
  }

  get font() {
    return this.ctx.font;
  }
  set font(value: string) {
    this.ctx.font = value;
  }

  get globalCompositeOperation() {
    return this.ctx.globalCompositeOperation;
  }
  set globalCompositeOperation(value: GlobalCompositeOperation) {
    this.ctx.globalCompositeOperation = value;
  }

  get lineCap() {
    return this.ctx.lineCap;
  }
  set lineCap(value: CanvasLineCap) {
    this.ctx.lineCap = value;
  }

  clearRect(x: number, y: number, width: number, height: number): void {
    this.ctx.clearRect(x, y, width, height);
  }

  setLineDash(segments: number[]): void {
    this.ctx.setLineDash(segments);
  }

  beginPath(): void {
    this.ctx.beginPath();
  }

  closePath(): void {
    this.ctx.closePath();
  }

  moveTo(x: number, y: number): void {
    this.ctx.moveTo(x, y);
  }

  lineTo(x: number, y: number): void {
    this.ctx.lineTo(x, y);
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean,
  ): void {
    this.ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
  }

  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number,
  ): void {
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }

  fill(): void {
    this.ctx.fill();
  }

  stroke(): void {
    this.ctx.stroke();
  }

  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    this.ctx.fillText(text, x, y, maxWidth);
  }

  getImage(): string {
    return this.ctx.canvas.toDataURL("image/png");
  }
}

export class SVGRenderer implements GraphRenderer {
  // SVG属性
  private width: number;
  private height: number;
  private currentContent: string = "";

  static fontBase64: string = "";

  // 暂存路径
  private currentPath: string[] = [];
  private currentPathClosed: boolean = false;
  private currentPoint: { x: number; y: number } | null = null;

  private counter: number = 10000;

  // 样式
  lineWidth: number = 1;
  strokeStyle: string = "black";
  fillStyle: string = "transparent";
  textBaseline: CanvasTextBaseline = "middle";
  textAlign: CanvasTextAlign = "center";
  font: string = "10px JB";
  globalCompositeOperation: GlobalCompositeOperation = "source-over";
  lineCap: CanvasLineCap = "butt";
  private lineDash: number[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  clearRect(x: number, y: number, width: number, height: number): void {
    this.currentPath = [];
    this.currentPathClosed = false;
    this.currentPoint = null;

    if (x <= 0 && y <= 0 && width >= this.width && height >= this.height) {
      this.currentContent = "";
      return;
    }

    if (width <= 0 || height <= 0) return;

    this.counter++;
    const maskId = `mask-${this.counter}`;
    this.currentContent =
      `<mask id="${maskId}"><rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" /><rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#000000" /></mask>\n` +
      `<g mask="url(#${maskId})">\n` +
      this.currentContent +
      `</g>\n`;
  }

  setLineDash(segments: number[]): void {
    this.lineDash = segments;
  }

  beginPath(): void {
    this.currentPath = [];
    this.currentPathClosed = false;
    this.currentPoint = null;
  }

  closePath(): void {
    if (this.currentPathClosed) return;
    this.currentPath.push("Z");
    this.currentPathClosed = true;
    this.currentPoint = null;
  }

  moveTo(x: number, y: number): void {
    this.currentPath.push(`M${x},${y}`);
    this.currentPoint = { x, y };
  }

  lineTo(x: number, y: number): void {
    if (this.currentPath.length === 0) return this.moveTo(x, y);
    this.currentPath.push(`L${x},${y}`);
    this.currentPoint = { x, y };
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean,
  ): void {
    const startX = x + radius * Math.cos(startAngle);
    const startY = y + radius * Math.sin(startAngle);
    const endX = x + radius * Math.cos(endAngle);
    const endY = y + radius * Math.sin(endAngle);

    this.appendMoveOrLine(startX, startY);

    const fullCircle = Math.abs(endAngle - startAngle) >= 2 * Math.PI - 1e-6;
    const sweepFlag = counterclockwise ? 0 : 1;

    if (fullCircle) {
      const midAngle = counterclockwise
        ? startAngle - Math.PI
        : startAngle + Math.PI;
      const midX = x + radius * Math.cos(midAngle);
      const midY = y + radius * Math.sin(midAngle);

      this.currentPath.push(
        `A${radius},${radius} 0 1 ${sweepFlag} ${midX},${midY}`,
      );
      this.currentPath.push(
        `A${radius},${radius} 0 1 ${sweepFlag} ${startX},${startY}`,
      );
      this.currentPoint = { x: startX, y: startY };
      return;
    }

    const delta = counterclockwise
      ? startAngle - endAngle
      : endAngle - startAngle;
    const largeArc =
      Math.abs(((delta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) >
      Math.PI
        ? 1
        : 0;

    this.currentPath.push(
      `A${radius},${radius} 0 ${largeArc} ${sweepFlag} ${endX},${endY}`,
    );
    this.currentPoint = { x: endX, y: endY };
  }

  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number,
  ): void {
    this.currentPath.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`);
    this.currentPoint = { x, y };
  }

  fill(): void {
    if (this.currentPath.length === 0) return;

    let path = this.currentPath.join(" ");
    if (!this.currentPathClosed) path += " Z";

    // SVG 不太支持 destination-out 这种绘制方式，因此进行特判
    if (this.globalCompositeOperation == "destination-out") {
      this.counter++;
      this.currentContent =
        `<mask id="mask-${this.counter}"><rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" /><path d="${path}" fill="#000000" stroke="none" /></mask>\n<g mask="url(#mask-${this.counter})">\n` +
        this.currentContent +
        `</g>\n`;
    } else {
      this.currentContent += `<path d="${path}" fill="${this.fillStyle}" stroke="none" />\n`;
    }
  }

  stroke(): void {
    if (this.currentPath.length === 0) return;

    const path = this.currentPath.join(" ");
    const attributes = [
      `d="${path}"`,
      'fill="none"',
      `stroke="${this.strokeStyle}"`,
      `stroke-width="${this.lineWidth}"`,
      `stroke-linecap="${this.lineCap}"`,
    ];

    if (this.lineDash.length) {
      attributes.push(`stroke-dasharray="${this.lineDash.join(",")}"`);
    }

    this.currentContent += `<path ${attributes.join(" ")} />\n`;
  }

  fillText(text: string, x: number, y: number): void {
    // 文本对齐
    let anchor = "middle";
    if (this.textAlign === "left") anchor = "start";
    if (this.textAlign === "right") anchor = "end";

    // 基线对齐
    let dominantBaseline = "middle";
    if (this.textBaseline === "top") dominantBaseline = "text-before-edge";
    if (this.textBaseline === "bottom") dominantBaseline = "text-after-edge";

    const style = `font: ${this.font}; fill: ${this.fillStyle}; text-anchor: ${anchor}; dominant-baseline: ${dominantBaseline};`;
    const safeText = this.escapeText(text);
    this.currentContent += `<text x="${x}" y="${y}" style="${style}">${safeText}</text>\n`;
  }

  private appendMoveOrLine(x: number, y: number): void {
    if (!this.currentPoint) {
      this.currentPath.push(`M${x},${y}`);
    } else if (!this.pointsEqual(this.currentPoint, { x, y })) {
      this.currentPath.push(`L${x},${y}`);
    }

    this.currentPoint = { x, y };
  }

  private pointsEqual(
    a: { x: number; y: number },
    b: { x: number; y: number },
    epsilon = 1e-6,
  ): boolean {
    return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
  }

  private escapeText(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  getImage(): string {
    let svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
  <defs>
    <style>
      @font-face {
        font-family: 'JB';
        src: url('data:application/font-woff;charset=utf-8;base64,${SVGRenderer.fontBase64}');
      }
    </style>
  </defs>
`;

    svgContent += this.currentContent;

    svgContent += "</svg>\n";
    return svgContent;
  }
}

const SELECTED_SCALE = 1.25;

interface Vector2D {
  x: number;
  y: number;
}

function euclidDist(u: Vector2D, v: Vector2D): number {
  return Math.hypot(u.x - v.x, u.y - v.y);
}

function getMagnitude(u: Vector2D): number {
  return Math.hypot(u.x, u.y);
}

function getPointToLineDist(l1: Vector2D, l2: Vector2D, p: Vector2D): number {
  const ltop: Vector2D = { x: p.x - l1.x, y: p.y - l1.y };
  const d: Vector2D = { x: l2.x - l1.x, y: l2.y - l1.y };

  const proj: number = (ltop.x * d.x + ltop.y * d.y) / (d.x * d.x + d.y * d.y);

  if (proj < 0) return euclidDist(l1, p);
  if (proj > 1) return euclidDist(l2, p);

  const cross: number = ltop.x * d.y - ltop.y * d.x;

  return Math.abs(cross) / getMagnitude(d);
}

function isPointProjOutsideLine(
  l1: Vector2D,
  l2: Vector2D,
  p: Vector2D,
): boolean {
  const ltop: Vector2D = { x: p.x - l1.x, y: p.y - l1.y };
  const d: Vector2D = { x: l2.x - l1.x, y: l2.y - l1.y };

  const proj: number = (ltop.x * d.x + ltop.y * d.y) / (d.x * d.x + d.y * d.y);

  if (proj < 0) return true;
  if (proj > 1) return true;

  return false;
}

export function drawLine(
  ctx: GraphRenderer,
  u: Vector2D,
  v: Vector2D,
  idealR: number,
  edgeStr: string,
  edgeCurvatureMap: Map<string, number>,
  nodePositions: Vector2D[],
  nodeBorderWidthHalf: number,
  edgeColor: string,
  mousePos: Vector2D,
  mouseDetectionThreshold: number = 10,
  ebccEdgeColor: string[] | undefined = undefined,
) {
  const mid = (a: Vector2D, b: Vector2D): Vector2D => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  let r = edgeCurvatureMap.get(edgeStr)!;
  const flexLimit = 1.5;

  let px = u.y - v.y;
  let py = v.x - u.x;

  let toFlip = r < 0;

  px *= 0.5 * (toFlip ? -1 : 1) * Math.abs(r);
  py *= 0.5 * (toFlip ? -1 : 1) * Math.abs(r);

  // NOTE: Split bezier curve into multiple line segments to detect mouse intersection.
  const steps = 10;

  let p0: Vector2D = u;
  let intersect = false;

  const p0c: Vector2D = { x: u.x + px, y: u.y + py };
  const p1c: Vector2D = { x: v.x + px, y: v.y + py };
  const p2: Vector2D = v;

  const nodeContributionMap = new Map<Vector2D, number>();

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const tcom = 1 - t;

    const tcomSquared = tcom * tcom;
    const tSquared = t * t;
    const tcomCubed = tcom * tcom * tcom;
    const tCubed = t * t * t;

    const x =
      tcomCubed * u.x +
      3 * tcomSquared * t * p0c.x +
      3 * tcom * tSquared * p1c.x +
      tCubed * p2.x;
    const y =
      tcomCubed * u.y +
      3 * tcomSquared * t * p0c.y +
      3 * tcom * tSquared * p1c.y +
      tCubed * p2.y;

    const p1 = { x, y };

    // ctx.lineWidth = 2 * nodeBorderWidthHalf; // NOTE: debug line segments if needed
    // ctx.strokeStyle = edgeColor;
    //
    // ctx.beginPath();
    // ctx.moveTo(p0.x, p0.y);
    //
    // ctx.lineTo(p1.x, p1.y);
    // ctx.stroke();

    const midpoint: Vector2D = mid(p0, p1);
    const dbase: Vector2D = { x: p1.x - p0.x, y: p1.y - p0.y };

    if (2 <= i && i <= 9) {
      for (const pos of nodePositions) {
        if (isPointProjOutsideLine(u, v, pos)) continue;

        const dnode: Vector2D = { x: pos.x - p0.x, y: pos.y - p0.y };
        const sign = dbase.x * dnode.y - dbase.y * dnode.x > 0 ? 1 : -1;

        const distMag = euclidDist(pos, midpoint);

        if (
          !nodeContributionMap.has(pos) ||
          distMag < Math.abs(nodeContributionMap.get(pos)!)
        ) {
          nodeContributionMap.set(pos, sign * distMag);
        }
      }
    }

    if (getPointToLineDist(p0, p1, mousePos) <= mouseDetectionThreshold) {
      intersect = true;
    }
    p0 = p1;
  }

  nodeContributionMap.forEach((v, _) => {
    let vMag = 100 / Math.pow(Math.abs(v), 1.9);
    vMag = clamp(vMag, -0.3, 0.3);
    r += (v > 0 ? -1 : 1) * vMag;
  });

  r -= (r - idealR) / 10;

  r = clamp(r, idealR - flexLimit, idealR + flexLimit);

  edgeCurvatureMap.set(edgeStr, r);

  // NOTE: Reset `px` and `py` with the new `r`.
  px = u.y - v.y;
  py = v.x - u.x;

  toFlip = r < 0;

  px *= 0.5 * (toFlip ? -1 : 1) * Math.abs(r);
  py *= 0.5 * (toFlip ? -1 : 1) * Math.abs(r);

  if (ebccEdgeColor !== undefined) {
    ctx.lineWidth = 2 * nodeBorderWidthHalf;

    const P0 = u;
    const P1 = { x: u.x + px, y: u.y + py };
    const P2 = { x: v.x + px, y: v.y + py };
    const P3 = v;

    // De Casteljau at t = 0.5 (all midpoints)
    const A = mid(P0, P1);
    const B = mid(P1, P2);
    const C = mid(P2, P3);
    const D = mid(A, B);
    const E = mid(B, C);
    const F = mid(D, E); // point on curve at t=0.5

    // 第一段 (P0, A, D, F)
    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.bezierCurveTo(A.x, A.y, D.x, D.y, F.x, F.y);
    ctx.strokeStyle = ebccEdgeColor[0];
    ctx.stroke();

    // 第二段 (F, E, C, P3)
    ctx.beginPath();
    ctx.moveTo(F.x, F.y);
    ctx.bezierCurveTo(E.x, E.y, C.x, C.y, P3.x, P3.y);
    ctx.strokeStyle = ebccEdgeColor[1];
    ctx.stroke();
  } else {
    ctx.lineWidth = 2 * nodeBorderWidthHalf;
    ctx.strokeStyle = edgeColor;

    ctx.beginPath();
    ctx.moveTo(u.x, u.y);
    ctx.bezierCurveTo(u.x + px, u.y + py, v.x + px, v.y + py, v.x, v.y);

    ctx.stroke();
  }

  return intersect;
}

export function drawArrow(
  ctx: GraphRenderer,
  u: Vector2D,
  v: Vector2D,
  r: number,
  toReverse: boolean,
  nodeBorderWidthHalf: number,
  nodeRadius: number,
  edgeColor: string,
) {
  const theta = Math.atan2(v.y - u.y, v.x - u.x);

  let px = u.y - v.y;
  let py = v.x - u.x;

  const toFlip = r < 0;

  px *= 0.375 * (toFlip ? -1 : 1) * Math.abs(r);
  py *= 0.375 * (toFlip ? -1 : 1) * Math.abs(r);

  ctx.lineWidth = 1.5 * nodeBorderWidthHalf;

  ctx.strokeStyle = edgeColor;
  ctx.fillStyle = edgeColor;

  const mx = (u.x + v.x) / 2 + px;
  const my = (u.y + v.y) / 2 + py;

  ctx.beginPath();

  const mult = toReverse ? -1 : 1;

  ctx.moveTo(mx, my);
  ctx.lineTo(
    mx - mult * (nodeRadius / 2) * Math.cos(theta - Math.PI / 6),
    my - mult * (nodeRadius / 2) * Math.sin(theta - Math.PI / 6),
  );
  ctx.lineTo(
    mx - mult * (nodeRadius / 2) * Math.cos(theta + Math.PI / 6),
    my - mult * (nodeRadius / 2) * Math.sin(theta + Math.PI / 6),
  );
  ctx.lineTo(mx, my);

  ctx.fill();
  ctx.stroke();
}

export function drawBridge(
  ctx: GraphRenderer,
  u: Vector2D,
  v: Vector2D,
  nodeBorderWidthHalf: number,
  nodeRadius: number,
  edgeColor: string,
  mousePos: Vector2D,
  mouseDetectionThreshold: number = 10,
) {
  let px = u.y - v.y;
  let py = v.x - u.x;

  px *= nodeRadius / 5 / Math.hypot(px, py);
  py *= nodeRadius / 5 / Math.hypot(px, py);

  ctx.lineWidth = 2 * nodeBorderWidthHalf;

  ctx.strokeStyle = edgeColor;

  ctx.beginPath();

  ctx.moveTo(u.x + px, u.y + py);
  ctx.lineTo(v.x + px, v.y + py);

  ctx.moveTo(u.x - px, u.y - py);
  ctx.lineTo(v.x - px, v.y - py);

  ctx.stroke();

  let intersect = false;

  if (getPointToLineDist(u, v, mousePos) <= mouseDetectionThreshold) {
    intersect = true;
  }

  return intersect;
}

export function drawEdgeLabel(
  ctx: GraphRenderer,
  u: Vector2D,
  v: Vector2D,
  r: number,
  label: string,
  toReverse: boolean,
  settings: Settings,
  nodeBorderWidthHalf: number,
  edgeLabelColor: string,
) {
  let px = u.y - v.y;
  let py = v.x - u.x;

  const toFlip = r < 0;
  const bx = px / euclidDist(u, v),
    by = py / euclidDist(u, v);

  px *= 0.37 * (toFlip ? -1 : 1) * Math.abs(r);
  py *= 0.37 * (toFlip ? -1 : 1) * Math.abs(r);

  const mult = toReverse ? -1 : 1;

  px += mult * settings.edgeLabelSeparation * bx;
  py += mult * settings.edgeLabelSeparation * by;

  const mx = (u.x + v.x) / 2;
  const my = (u.y + v.y) / 2;

  ctx.lineWidth = 2 * nodeBorderWidthHalf;

  ctx.beginPath();

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.font = `${settings.fontSize}px JB`;
  ctx.fillStyle = edgeLabelColor;

  ctx.fillText(label, mx + px, my + py);
}

export function drawCircle(
  ctx: GraphRenderer,
  u: Vector2D,
  sel: boolean,
  nodeBorderWidthHalf: number,
  nodeRadius: number,
  isTransparent: boolean,
  vbccFillColor: { range: number[]; color: string }[] | undefined = undefined,
) {
  if (vbccFillColor !== undefined) {
    for (const item of vbccFillColor) {
      const [start, end] = item.range;
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.moveTo(u.x, u.y);
      ctx.arc(u.x, u.y, nodeRadius - nodeBorderWidthHalf, start, end);
      ctx.closePath();
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(u.x, u.y, nodeRadius - nodeBorderWidthHalf, 0, 2 * Math.PI);
    ctx.stroke();
  } else {
    ctx.beginPath();

    if (isTransparent) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.arc(u.x, u.y, nodeRadius - nodeBorderWidthHalf, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.arc(u.x, u.y, nodeRadius - nodeBorderWidthHalf, 0, 2 * Math.PI);

    if (!isTransparent) {
      ctx.fill();
    }

    ctx.stroke();
  }

  if (sel) {
    ctx.beginPath();
    ctx.arc(
      u.x,
      u.y,
      SELECTED_SCALE * (nodeRadius - nodeBorderWidthHalf),
      0,
      2 * Math.PI,
    );
    ctx.stroke();
  }
}

export function drawHexagon(
  ctx: GraphRenderer,
  u: Vector2D,
  sel: boolean,
  nodeBorderWidthHalf: number,
  nodeRadius: number,
  isTransparent: boolean,
) {
  const length = nodeRadius - nodeBorderWidthHalf;
  let theta = Math.PI / 6;

  if (isTransparent) {
    ctx.beginPath();
    ctx.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 7; i++, theta += Math.PI / 3) {
      const x = u.x + length * Math.cos(theta);
      const y = u.y + length * Math.sin(theta);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.beginPath();

  for (let i = 0; i < 7; i++, theta += Math.PI / 3) {
    const x = u.x + length * Math.cos(theta);
    const y = u.y + length * Math.sin(theta);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();

  if (!isTransparent) {
    ctx.fill();
  }

  ctx.stroke();

  if (sel) {
    ctx.beginPath();

    const length = SELECTED_SCALE * (nodeRadius - nodeBorderWidthHalf);

    let theta = Math.PI / 6;

    for (let i = 0; i < 7; i++, theta += Math.PI / 3) {
      const x = u.x + length * Math.cos(theta);
      const y = u.y + length * Math.sin(theta);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.stroke();
  }
}

export function drawOctagon(
  ctx: GraphRenderer,
  u: Vector2D,
  label: string,
  settings: Settings,
  nodeBorderWidthHalf: number,
  nodeRadius: number,
  nodeLabelColor: string,
  nodeLabelOutlineColor: string,
) {
  const length = 14 + (3 * (nodeRadius - 16)) / 2;

  let x = u.x;
  let y = u.y;

  if (u.y - nodeRadius - 2 * length <= 5) {
    y += nodeRadius + length;
  } else {
    y -= nodeRadius + length;
  }

  ctx.lineWidth = 2 * nodeBorderWidthHalf;

  ctx.strokeStyle = nodeLabelOutlineColor;

  ctx.setLineDash([1, 4]);
  ctx.beginPath();

  let theta = 0;

  for (let i = 0; i < 9; i++, theta += Math.PI / 4) {
    const nx = x + (length - nodeBorderWidthHalf) * Math.cos(theta);
    const ny = y + (length - nodeBorderWidthHalf) * Math.sin(theta);
    if (i === 0) {
      ctx.moveTo(nx, ny);
    } else {
      ctx.lineTo(nx, ny);
    }
  }

  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.font = `${settings.fontSize}px JB`;
  ctx.fillStyle = nodeLabelColor;
  ctx.fillText(label, x, y);
}
