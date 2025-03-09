import { Settings } from "../types";

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

  static fontBase64: string = '';

  // 暂存路径
  private currentPath: string[] = [];
  private currentPathClosed: boolean = false;

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

  clearRect(): void {
    this.currentContent = "";
    this.currentPath = [];
    this.currentPathClosed = false;
  }

  setLineDash(segments: number[]): void {
    this.lineDash = segments;
  }

  beginPath(): void {
    this.currentPath = [];
    this.currentPathClosed = false;
  }

  closePath(): void {
    if (this.currentPathClosed) return;
    this.currentPath.push("Z");
    this.currentPathClosed = true;
  }

  moveTo(x: number, y: number): void {
    this.currentPath.push(`M${x},${y}`);
  }

  lineTo(x: number, y: number): void {
    if (this.currentPath.length == 0) return this.moveTo(x, y);
    this.currentPath.push(`L${x},${y}`);
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean,
  ): void {
    if (Math.abs(endAngle - startAngle) >= 2 * Math.PI) {
      // 完整的圆
      this.currentPath.push(
        `M${x + radius * Math.cos(startAngle)},${y + radius * Math.sin(startAngle)} ` +
          `A${radius},${radius} 0 1 ${counterclockwise ? 0 : 1} ${x + radius * Math.cos(startAngle + Math.PI)},${y + radius * Math.sin(startAngle + Math.PI)} ` +
          `A${radius},${radius} 0 1 ${counterclockwise ? 0 : 1} ${x + radius * Math.cos(startAngle)},${y + radius * Math.sin(startAngle)}`,
      );
    } else {
      // 圆弧
      const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
      const sweepFlag = counterclockwise ? 0 : 1;
      this.currentPath.push(
        `M${x + radius * Math.cos(startAngle)},${y + radius * Math.sin(startAngle)} ` +
          `A${radius},${radius} 0 ${largeArc} ${sweepFlag} ${x + radius * Math.cos(endAngle)},${y + radius * Math.sin(endAngle)}`,
      );
    }
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
  }

  fill(): void {
    if (this.currentPath.length === 0) return;

    let path = this.currentPath.join(" ");
    if (!this.currentPathClosed) path += " Z";

    // SVG 不太支持 destination-out 这种绘制方式，因此进行特判
    if (this.globalCompositeOperation == "destination-out") {
      this.counter ++;
      this.currentContent = `<mask id="mask-${this.counter}"><rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" /><path d="${path}" fill="#000000" stroke="none" /></mask>\n<g mask="url(#mask-${this.counter})">\n` +
        this.currentContent + `</g>\n`;
    } else {
      this.currentContent += `<path d="${path}" fill="${this.fillStyle}" stroke="none" />\n`;
    }
  }

  stroke(): void {
    if (this.currentPath.length === 0) return;

    const path = this.currentPath.join(" ");
    const dashArray = this.lineDash.length
      ? `stroke-dasharray="${this.lineDash.join(",")}"`
      : "";

    this.currentContent += `<path d="${path}" fill="none" stroke="${this.strokeStyle}" stroke-width="${this.lineWidth}" ${dashArray} />\n`;
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
    this.currentContent += `<text x="${x}" y="${y}" style="${style}">${text}</text>\n`;
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

export function drawLine(
  ctx: GraphRenderer,
  u: Vector2D,
  v: Vector2D,
  r: number,
  nodeBorderWidthHalf: number,
  edgeColor: string,
) {
  let px = u.y - v.y;
  let py = v.x - u.x;

  const toFlip = r % 2 == 0;

  px *= 0.5 * (toFlip ? -1 : 1) * Math.floor((r + 1) / 2);
  py *= 0.5 * (toFlip ? -1 : 1) * Math.floor((r + 1) / 2);

  ctx.lineWidth = 2 * nodeBorderWidthHalf;
  ctx.strokeStyle = edgeColor;

  ctx.beginPath();
  ctx.moveTo(u.x, u.y);
  ctx.bezierCurveTo(u.x + px, u.y + py, v.x + px, v.y + py, v.x, v.y);

  ctx.stroke();
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

  const toFlip = r % 2 == 0;

  px *= 0.375 * (toFlip ? -1 : 1) * Math.floor((r + 1) / 2);
  py *= 0.375 * (toFlip ? -1 : 1) * Math.floor((r + 1) / 2);

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

  const toFlip = r % 2 == 0;
  const bx = px / euclidDist(u, v),
    by = py / euclidDist(u, v);

  px *= 0.37 * (toFlip ? -1 : 1) * Math.floor((r + 1) / 2);
  py *= 0.37 * (toFlip ? -1 : 1) * Math.floor((r + 1) / 2);

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
) {
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

  if (Math.abs(u.y - nodeRadius - 2 * length) <= 5) {
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
