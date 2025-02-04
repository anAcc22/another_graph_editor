import { Settings } from "../types";

const SELECTED_SCALE = 1.25;

interface Vector2D {
  x: number;
  y: number;
}

function euclidDist(u: Vector2D, v: Vector2D): number {
  return Math.hypot(u.x - v.x, u.y - v.y);
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D,
  u: Vector2D,
  sel: boolean,
  nodeBorderWidthHalf: number,
  nodeRadius: number,
  isTransparent: boolean,
) {
  ctx.beginPath();

  const length = nodeRadius - nodeBorderWidthHalf;
  let theta = Math.PI / 6;

  if (isTransparent) {
    ctx.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 7; i++, theta += Math.PI / 3) {
      const x = u.x + length * Math.cos(theta);
      const y = u.y + length * Math.sin(theta);
      ctx.lineTo(x, y);
    }
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  for (let i = 0; i < 7; i++, theta += Math.PI / 3) {
    const x = u.x + length * Math.cos(theta);
    const y = u.y + length * Math.sin(theta);
    ctx.lineTo(x, y);
  }

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
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }
}

export function drawOctagon(
  ctx: CanvasRenderingContext2D,
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
    ctx.lineTo(nx, ny);
  }

  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.font = `${settings.fontSize}px JB`;
  ctx.fillStyle = nodeLabelColor;
  ctx.fillText(label, x, y);
}
