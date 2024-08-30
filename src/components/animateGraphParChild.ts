import { Graph } from "../types";
import { Settings } from "../types";
import { ColorMap, CutMap, LayerMap, BackedgeMap, BridgeMap } from "../types";

import { buildComponents } from "./graphComponents";
import { buildSCComponents } from "./graphComponents";

import { buildTreeLayers } from "./graphTreeLayers";

import { buildBridges } from "./graphBridges";

interface Vector2D {
  x: number;
  y: number;
}

class Node {
  pos: Vector2D;
  vel: Vector2D = { x: 0, y: 0 };
  constructor(x: number, y: number) {
    this.pos = {
      x,
      y,
    };
  }
  inBounds(): boolean {
    const x = this.pos.x;
    const y = this.pos.y;
    const xOk = x >= nodeRadius && x + nodeRadius <= canvasWidth;
    const yOk = y >= nodeRadius && y + nodeRadius <= canvasHeight;
    return xOk && yOk;
  }
  resetPos(): void {
    this.pos = {
      x: clamp(this.pos.x, nodeRadius, canvasWidth - nodeRadius),
      y: clamp(this.pos.y, nodeRadius, canvasHeight - nodeRadius),
    };
  }
}

function generateRandomCoords(): Vector2D {
  let x = (Math.random() * canvasWidth) / 2 + canvasWidth / 4;
  let y = (Math.random() * canvasHeight) / 2 + canvasHeight / 4;

  let xFailCnt = 0;
  let yFailCnt = 0;

  while (x <= nodeRadius || x >= canvasWidth - nodeRadius) {
    x = (Math.random() * canvasWidth) / 2 + canvasWidth / 4;
    xFailCnt++;
    if (xFailCnt === 10) {
      break;
    }
  }

  while (y <= nodeRadius || y >= canvasHeight - nodeRadius) {
    y = (Math.random() * canvasHeight) / 2 + canvasHeight / 4;
    yFailCnt++;
    if (yFailCnt === 10) {
      break;
    }
  }

  return { x, y };
}

function isInteger(val: string) {
  return parseInt(val, 10).toString() === val;
}

function clamp(val: number, low: number, high: number) {
  return Math.max(low, Math.min(val, high));
}

function euclidDist(u: Vector2D, v: Vector2D): number {
  return Math.hypot(u.x - v.x, u.y - v.y);
}

function drawArrow(ctx: CanvasRenderingContext2D, u: Vector2D, v: Vector2D) {
  const theta = Math.atan2(v.y - u.y, v.x - u.x);

  ctx.lineWidth = 1.5 * nodeBorderWidthHalf;

  ctx.strokeStyle = edgeColor;
  ctx.fillStyle = edgeColor;

  const mx = (u.x + v.x) / 2;
  const my = (u.y + v.y) / 2;

  ctx.beginPath();

  ctx.moveTo(mx, my);
  ctx.lineTo(
    mx - (nodeRadius / 2) * Math.cos(theta - Math.PI / 6),
    my - (nodeRadius / 2) * Math.sin(theta - Math.PI / 6),
  );
  ctx.lineTo(
    mx - (nodeRadius / 2) * Math.cos(theta + Math.PI / 6),
    my - (nodeRadius / 2) * Math.sin(theta + Math.PI / 6),
  );
  ctx.lineTo(mx, my);

  ctx.fill();
  ctx.stroke();
}

function drawBridge(ctx: CanvasRenderingContext2D, u: Vector2D, v: Vector2D) {
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

function drawEdgeLabel(
  ctx: CanvasRenderingContext2D,
  u: Vector2D,
  v: Vector2D,
  label: string,
  putAbove: boolean,
) {
  let px = u.y - v.y;
  let py = v.x - u.x;

  px *= (2 * nodeRadius) / 3 / Math.hypot(px, py);
  py *= (2 * nodeRadius) / 3 / Math.hypot(px, py);

  const mx = (u.x + v.x) / 2;
  const my = (u.y + v.y) / 2;

  ctx.lineWidth = 2 * nodeBorderWidthHalf;

  ctx.beginPath();

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.font = `${nodeRadius - 2}px JB`;
  ctx.fillStyle = edgeLabelColor;

  if (putAbove) {
    if (py <= 0) {
      ctx.fillText(label, mx + px, my + py);
    } else {
      ctx.fillText(label, mx - px, my - py);
    }
  } else {
    if (py <= 0) {
      ctx.fillText(label, mx - px, my - py);
    } else {
      ctx.fillText(label, mx + px, my + py);
    }
  }
}

function drawOctagon(
  ctx: CanvasRenderingContext2D,
  u: Vector2D,
  label: string,
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
  ctx.fillStyle = fillColors[0];

  ctx.beginPath();

  let theta = 0;

  for (let i = 0; i < 9; i++, theta += Math.PI / 4) {
    const nx = x + (length - nodeBorderWidthHalf) * Math.cos(theta);
    const ny = y + (length - nodeBorderWidthHalf) * Math.sin(theta);
    ctx.lineTo(nx, ny);
  }

  ctx.fill();
  ctx.stroke();

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.font = `${nodeRadius - 2}px JB`;
  ctx.fillStyle = nodeLabelColor;
  ctx.fillText(label, x, y);
}

function drawLine(ctx: CanvasRenderingContext2D, u: Vector2D, v: Vector2D) {
  ctx.lineWidth = 2 * nodeBorderWidthHalf;

  ctx.strokeStyle = edgeColor;

  ctx.beginPath();

  ctx.moveTo(u.x, u.y);
  ctx.lineTo(v.x, v.y);

  ctx.fill();
  ctx.stroke();
}

function drawCircle(ctx: CanvasRenderingContext2D, u: Vector2D) {
  ctx.beginPath();

  ctx.arc(u.x, u.y, nodeRadius - nodeBorderWidthHalf, 0, 2 * Math.PI);

  ctx.fill();
  ctx.stroke();
}

function drawHexagon(ctx: CanvasRenderingContext2D, u: Vector2D) {
  ctx.beginPath();

  const length = nodeRadius - nodeBorderWidthHalf;

  let theta = Math.PI / 6;

  for (let i = 0; i < 7; i++, theta += Math.PI / 3) {
    const x = u.x + length * Math.cos(theta);
    const y = u.y + length * Math.sin(theta);
    ctx.lineTo(x, y);
  }

  ctx.fill();
  ctx.stroke();
}

const FPS = 60;

const STROKE_COLOR_LIGHT = "hsl(0, 0%, 10%)";
const TEXT_COLOR_LIGHT = "hsl(0, 0%, 10%)";
const EDGE_COLOR_LIGHT = "hsl(0, 0%, 10%)";
const EDGE_LABEL_LIGHT = "hsl(30, 50%, 40%)";
const NODE_LABEL_LIGHT = "hsl(10, 50%, 40%)";
const NODE_LABEL_OUTLINE_LIGHT = "hsl(10, 10%, 70%)";

const STROKE_COLOR_DARK = "hsl(0, 0%, 90%)";
const TEXT_COLOR_DARK = "hsl(0, 0%, 90%)";
const EDGE_COLOR_DARK = "hsl(0, 0%, 90%)";
const EDGE_LABEL_DARK = "hsl(30, 70%, 60%)";
const NODE_LABEL_DARK = "hsl(10, 70%, 60%)";
const NODE_LABEL_OUTLINE_DARK = "hsl(10, 10%, 30%)";

const TEXT_Y_OFFSET = 1;

const NODE_FRICTION = 0.05;

const CANVAS_FIELD_DIST = 50;

const FILL_COLORS_LIGHT = [
  "#dedede",
  "#dd7878",
  "#7287ed",
  "#dfae5d",
  "#70b05b",
  "#dc8a68",
  "#309fc5",
  "#37c2b9",
  "#ea76cb",
  "#a879ef",
];

const FILL_COLORS_DARK = [
  "#232323",
  "#7d3838",
  "#42479d",
  "#7f5e0d",
  "#40603b",
  "#8c3a28",
  "#104f85",
  "#176249",
  "#7a366b",
  "#58398f",
];

const FILL_COLORS_LENGTH = 10;

let currentTime = 0;

let nodeRadius = 16;
let nodeBorderWidthHalf = 1;

let nodeLabelColor = NODE_LABEL_LIGHT;
let nodeLabelOutlineColor = NODE_LABEL_OUTLINE_LIGHT;

let strokeColor = STROKE_COLOR_LIGHT;
let textColor = TEXT_COLOR_LIGHT;

let edgeColor = EDGE_COLOR_LIGHT;
let edgeLabelColor = EDGE_LABEL_LIGHT;

let fillColors = FILL_COLORS_LIGHT;

let canvasWidth: number;
let canvasHeight: number;

let mousePos: Vector2D = { x: 0, y: 0 };

let oldDirected = false;
let directed = false;

let settings: Settings = {
  labelOffset: 0,
  darkMode: true,
  nodeRadius: 15,
  nodeBorderWidthHalf: 15,
  edgeLength: 10,
  showComponents: false,
  showBridges: false,
  treeMode: false,
  lockMode: false,
};

let lastDeletedNodePos: Vector2D = { x: -1, y: -1 };

let nodes: string[] = [];
let nodeMap = new Map<string, Node>();

let nodeDist: number = 40;

let nodeLabels = new Map<string, string>();

let labelOffset = 0;

let draggedNodes: string[] = [];

let edges: string[] = [];

let edgeLabels = new Map<string, string>();

let adj = new Map<string, string[]>();
let rev = new Map<string, string[]>();

let colorMap: ColorMap | undefined = undefined;
let layerMap: LayerMap | undefined = undefined;

let backedgeMap: BackedgeMap | undefined = undefined;

let cutMap: CutMap | undefined = undefined;
let bridgeMap: BridgeMap | undefined = undefined;

function updateNodes(graph: Graph): void {
  let deletedNodes: string[] = [];

  for (const u of nodes) {
    if (!graph.nodes.includes(u)) {
      deletedNodes.push(u);
    }
  }

  nodes = nodes.filter((u) => !deletedNodes.includes(u));

  for (const u of deletedNodes) {
    lastDeletedNodePos = nodeMap.get(u)!.pos;
    nodeMap.delete(u);
  }

  for (let i = 0; i < graph.nodes.length; i++) {
    const u = graph.nodes[i];

    if (!nodes.includes(u)) {
      let coords = generateRandomCoords();

      if (lastDeletedNodePos.x !== -1) {
        coords = lastDeletedNodePos;
        lastDeletedNodePos = { x: -1, y: -1 };
      }

      nodes.push(u);

      nodeMap.set(u, new Node(coords.x, coords.y));
    }
  }

  nodes = graph.nodes;
}

function updateEdges(graph: Graph): void {
  edges = graph.edges;
}

function updateVelocities() {
  for (const u of nodes) {
    const uPos = nodeMap.get(u)!.pos;

    for (const v of nodes) {
      if (v !== u) {
        const vPos = nodeMap.get(v)!.pos;

        const dist = Math.max(euclidDist(uPos, vPos), 10);

        let aMag = 150_000 / (2 * Math.pow(dist, 4.5));

        const isEdge =
          edges.includes([u, v].join(" ")) || edges.includes([v, u].join(" "));

        if (isEdge) {
          aMag = Math.pow(Math.abs(dist - nodeDist), 1.6) / 100_000;
          if (dist >= nodeDist) {
            aMag *= -1;
          }
        }

        const ax = vPos.x - uPos.x;
        const ay = vPos.y - uPos.y;

        const uVel = nodeMap.get(u)!.vel;

        nodeMap.get(u)!.vel = {
          x: clamp((uVel.x - aMag * ax) * (1 - NODE_FRICTION), -100, 100),
          y: clamp((uVel.y - aMag * ay) * (1 - NODE_FRICTION), -100, 100),
        };
      }
    }

    const axSign = canvasWidth / 2 - uPos.x >= 0 ? 1 : -1;
    const aySign = canvasHeight / 2 - uPos.y >= 0 ? 1 : -1;

    let axB = 0;
    let ayB = 0;

    if (Math.min(uPos.x, canvasWidth - uPos.x) <= CANVAS_FIELD_DIST) {
      axB = Math.pow(canvasWidth / 2 - uPos.x, 2) * axSign;
      axB /= 500_000;
    }

    if (Math.min(uPos.y, canvasHeight - uPos.y) <= CANVAS_FIELD_DIST) {
      ayB = Math.pow(canvasHeight / 2 - uPos.y, 2) * aySign;
      ayB /= 500_000;
    }

    nodeMap.get(u)!.vel = {
      x: clamp((nodeMap.get(u)!.vel.x + axB) * (1 - NODE_FRICTION), -100, 100),
      y: clamp((nodeMap.get(u)!.vel.y + ayB) * (1 - NODE_FRICTION), -100, 100),
    };

    if (settings.treeMode && layerMap !== undefined) {
      const depth = layerMap.get(u)![0];
      const maxDepth = layerMap.get(u)![1];

      let layerHeight = (nodeDist * 4) / 5;

      if (maxDepth * layerHeight >= canvasHeight - 2 * CANVAS_FIELD_DIST) {
        layerHeight = (canvasHeight - 2 * CANVAS_FIELD_DIST) / maxDepth;
      }

      const yTarget = CANVAS_FIELD_DIST + (depth - 0.5) * layerHeight;
      const y = nodeMap.get(u)!.pos.y;

      let ay = Math.pow(Math.abs(y - yTarget), 1.75) / 100;

      if (y > yTarget) {
        ay *= -1;
      }

      nodeMap.get(u)!.vel = {
        x: nodeMap.get(u)!.vel.x,
        y: clamp((nodeMap.get(u)!.vel.y + ay) * (1 - NODE_FRICTION), -100, 100),
      };
    }

    const uVel = nodeMap.get(u)!.vel;

    nodeMap.get(u)!.pos = {
      x: uPos.x + uVel.x,
      y: uPos.y + uVel.y,
    };
  }
}

function buildSettings(): void {
  if (settings.darkMode) {
    strokeColor = STROKE_COLOR_DARK;
    textColor = TEXT_COLOR_DARK;
    fillColors = FILL_COLORS_DARK;
    edgeColor = EDGE_COLOR_DARK;
    nodeLabelColor = NODE_LABEL_DARK;
    nodeLabelOutlineColor = NODE_LABEL_OUTLINE_DARK;
    edgeLabelColor = EDGE_LABEL_DARK;
  } else {
    strokeColor = STROKE_COLOR_LIGHT;
    textColor = TEXT_COLOR_LIGHT;
    fillColors = FILL_COLORS_LIGHT;
    edgeColor = EDGE_COLOR_LIGHT;
    nodeLabelColor = NODE_LABEL_LIGHT;
    nodeLabelOutlineColor = NODE_LABEL_OUTLINE_LIGHT;
    edgeLabelColor = EDGE_LABEL_LIGHT;
  }

  nodeRadius = settings.nodeRadius;
  nodeBorderWidthHalf = settings.nodeBorderWidthHalf;
  nodeDist = settings.edgeLength + 2 * nodeRadius;

  labelOffset = settings.labelOffset;

  if (directed) {
    if (settings.showComponents) {
      colorMap = buildSCComponents(nodes, adj, rev);
    } else {
      colorMap = undefined;
    }
    layerMap = undefined;
    backedgeMap = undefined;
    cutMap = undefined;
    bridgeMap = undefined;
  } else {
    if (settings.showComponents) {
      colorMap = buildComponents(nodes, adj, rev);
    } else {
      colorMap = undefined;
    }
    if (settings.treeMode) {
      [layerMap, backedgeMap] = buildTreeLayers(nodes, adj, rev);
    } else {
      layerMap = undefined;
      backedgeMap = undefined;
    }
    if (settings.showBridges) {
      [cutMap, bridgeMap] = buildBridges(nodes, adj, rev);
    } else {
      cutMap = undefined;
      bridgeMap = undefined;
    }
  }
}

export function updateGraphParChild(graph: Graph) {
  updateNodes(graph);
  updateEdges(graph);

  adj = graph.adj;
  rev = graph.rev;

  nodeLabels = graph.nodeLabels;
  edgeLabels = graph.edgeLabels;

  buildSettings();
}

export function resizeGraphParChild(width: number, height: number) {
  canvasWidth = width;
  canvasHeight = height;
}

export function updateDirectedParChild(d: boolean) {
  directed = d;
}

export function updateSettingsParChild(s: Settings) {
  settings = s;
  buildSettings();
}

function resetMisplacedNodes() {
  nodes.map((u) => {
    if (!nodeMap.get(u)!.inBounds()) {
      nodeMap.get(u)!.resetPos();
    }
  });
}

function renderNodes(ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < nodes.length; i++) {
    const u = nodes[i];

    const node = nodeMap.get(u)!;

    ctx.lineWidth = 2 * nodeBorderWidthHalf;
    ctx.lineCap = "round";

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle =
      fillColors[
        colorMap === undefined
          ? 0
          : colorMap.get(nodes[i])! % FILL_COLORS_LENGTH
      ];

    if (settings.showBridges && cutMap !== undefined && cutMap.get(u)) {
      drawHexagon(ctx, node.pos);
    } else {
      drawCircle(ctx, node.pos);
    }

    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.font = `${nodeRadius}px JB`;
    ctx.fillStyle = textColor;
    ctx.fillText(
      isInteger(u) ? (parseInt(u, 10) + labelOffset).toString() : u,
      node!.pos.x,
      node!.pos.y + TEXT_Y_OFFSET,
    );

    if (nodeLabels.has(nodes[i])) {
      drawOctagon(ctx, node.pos, nodeLabels.get(nodes[i])!);
    }
  }
}

function renderEdges(ctx: CanvasRenderingContext2D) {
  for (const e of edges) {
    const pt1 = nodeMap.get(e.split(" ")[0])!.pos;
    const pt2 = nodeMap.get(e.split(" ")[1])!.pos;

    const eRev = e.split(" ")[1] + " " + e.split(" ")[0];

    if (settings.treeMode && backedgeMap !== undefined && backedgeMap.get(e)) {
      ctx.setLineDash([2, 10]);
    }

    ctx.strokeStyle = strokeColor;

    if (settings.showBridges && bridgeMap !== undefined && bridgeMap.get(e)) {
      drawBridge(ctx, pt1, pt2);
    } else {
      drawLine(ctx, pt1, pt2);
    }

    ctx.setLineDash([]);

    if (directed) {
      drawArrow(ctx, pt1, pt2);
    }

    if (edgeLabels.has(e)) {
      if (!edgeLabels.has(eRev)) {
        drawEdgeLabel(ctx, pt1, pt2, edgeLabels.get(e)!, true);
      } else {
        if (e < eRev) {
          drawEdgeLabel(ctx, pt1, pt2, edgeLabels.get(e)!, true);
        } else {
          drawEdgeLabel(ctx, pt1, pt2, edgeLabels.get(e)!, false);
        }
      }
    }
  }
}

export function animateGraphParChild(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>,
) {
  generateRandomCoords();

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    mousePos = {
      x: event.offsetX,
      y: event.offsetY,
    };

    nodes.map((u) => {
      if (euclidDist(nodeMap.get(u)!.pos, mousePos) <= nodeRadius) {
        draggedNodes.push(u);
      }
    });

    if (draggedNodes.length) {
      draggedNodes = [draggedNodes[draggedNodes.length - 1]];
      canvas.style.cursor = "pointer";
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    event.preventDefault();

    mousePos = {
      x: event.offsetX,
      y: event.offsetY,
    };

    if (draggedNodes.length === 0) {
      let hasNode = false;
      nodes.map((u) => {
        if (euclidDist(nodeMap.get(u)!.pos, mousePos) <= nodeRadius) {
          hasNode = true;
        }
      });
      if (hasNode) {
        canvas.style.cursor = "pointer";
      } else {
        canvas.style.cursor = "default";
      }
    }
  });

  canvas.addEventListener("pointerup", (event) => {
    event.preventDefault();
    draggedNodes = [];
    canvas.style.cursor = "default";
  });

  canvas.addEventListener("pointerleave", (event) => {
    event.preventDefault();
    draggedNodes = [];
    canvas.style.cursor = "default";
  });

  const animate = () => {
    setTimeout(() => {
      requestAnimationFrame(animate);

      ctx.clearRect(0, 0, canvasWidth + 20, canvasHeight + 20);

      resetMisplacedNodes();

      if (directed !== oldDirected) {
        buildSettings();
        oldDirected = directed;
      }

      draggedNodes.map((u) => {
        nodeMap.get(u)!.pos = {
          x: clamp(mousePos.x, nodeRadius, canvasWidth - nodeRadius),
          y: clamp(mousePos.y, nodeRadius, canvasHeight - nodeRadius),
        };
      });

      renderEdges(ctx);
      renderNodes(ctx);

      if (currentTime % 30 === 0) {
        setImage(canvas.toDataURL("image/png"));
        currentTime = 1;
      } else {
        currentTime++;
      }

      if (!settings.lockMode) {
        updateVelocities();
      }
    }, 1000 / FPS);
  };
  animate();
}
