import { PositionMap, TestCases } from "../types";
import { Settings } from "../types";
import {
  ColorMap,
  CutMap,
  LayerMap,
  BackedgeMap,
  BridgeMap,
  MSTMap,
} from "../types";

import { stripNode } from "./utils";

import { buildComponents } from "./graphComponents";
import { buildSCComponents } from "./graphComponents";

import { buildTreeLayers } from "./graphTreeLayers";
import { buildBipartite } from "./graphBipartite";
import { buildGraphGrid } from "./graphGrid";

import { buildBridges } from "./graphBridges";

import { buildMSTs } from "./graphMSTs";

import { drawLine, drawArrow, drawBridge, drawEdgeLabel } from "./drawingTools";
import { drawCircle, drawHexagon, drawOctagon } from "./drawingTools";
import { GraphRenderer } from "./drawingTools";

import { FILL_PALETTE_LIGHT } from "./palettes";
import { FILL_PALETTE_DARK } from "./palettes";
import { Bounds, buildTestCaseBoundingBoxes } from "./testCaseBoundingBoxes";

interface Vector2D {
  x: number;
  y: number;
}

export class Node {
  pos: Vector2D;
  vel: Vector2D = { x: 0, y: 0 };
  displacement: Vector2D = { x: 0, y: 0 }; // Smooth displacement for collision avoidance
  markColor: number | undefined;
  selected: boolean;
  constructor(x: number, y: number) {
    this.pos = {
      x,
      y,
    };
    this.selected = false;
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
  // Apply smooth displacement for fluid-like collision avoidance
  applySmoothDisplacement(): void {
    if (this.displacement.x !== 0 || this.displacement.y !== 0) {
      // Apply displacement gradually with easing
      const easingFactor = 0.15; // Controls smoothness (0.1 = very smooth, 0.3 = faster)
      this.pos.x += this.displacement.x * easingFactor;
      this.pos.y += this.displacement.y * easingFactor;
      
      // Gradually reduce displacement (damping)
      this.displacement.x *= 0.85;
      this.displacement.y *= 0.85;
      
      // Clear very small displacements to prevent jitter
      if (Math.abs(this.displacement.x) < 0.1) this.displacement.x = 0;
      if (Math.abs(this.displacement.y) < 0.1) this.displacement.y = 0;
    }
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

const FPS = 90;

const STROKE_COLOR_LIGHT = "hsl(0, 0%, 10%)";
const TEXT_COLOR_LIGHT = "hsl(0, 0%, 10%)";
const EDGE_COLOR_LIGHT = "hsl(0, 0%, 10%)";
const EDGE_LABEL_LIGHT = "hsl(30, 50%, 40%)";
const NODE_LABEL_LIGHT = "hsl(30, 80%, 50%)";
const NODE_LABEL_OUTLINE_LIGHT = "hsl(10, 2%, 70%)";

const STROKE_COLOR_DARK = "hsl(0, 0%, 90%)";
const TEXT_COLOR_DARK = "hsl(0, 0%, 90%)";
const EDGE_COLOR_DARK = "hsl(0, 0%, 90%)";
const EDGE_LABEL_DARK = "hsl(30, 70%, 60%)";
const NODE_LABEL_DARK = "hsl(30, 100%, 50%)";
const NODE_LABEL_OUTLINE_DARK = "hsl(10, 2%, 30%)";

const TEXT_Y_OFFSET = 1;

const NODE_FRICTION = 0.05;

const CANVAS_FIELD_DIST = 50;

const FILL_COLORS_LIGHT = [
  "#9ece7e",
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
  "#536333",
  "#7d3838",
  "#42479d",
  "#7f5e0d",
  "#40603b",
  "#8c4a28",
  "#104f85",
  "#176249",
  "#7a366b",
  "#58398f",
];

const FILL_COLORS_LENGTH = 10;

let prevMS = performance.now();

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

let inAnnotation = false;
let toAnnotate = 0;

let annotationSecondLastPos: Vector2D = { x: 0, y: 0 };
let annotationLastPos: Vector2D = { x: 0, y: 0 };

let inErase = false;

let rainbowHue = 0;

let settings: Settings = {
  language: "en",
  drawMode: "node",
  expandedCanvas: false,
  markBorder: "double",
  markColor: 1,
  settingsFormat: "general",
  labelOffset: 0,
  darkMode: true,
  nodeRadius: 15,
  fontSize: 15,
  nodeBorderWidthHalf: 15,
  edgeLength: 10,
  edgeLabelSeparation: 10,
  penThickness: 1,
  penTransparency: 0,
  eraserRadius: 20,
  testCaseBoundingBoxes: true,
  showComponents: false,
  showBridges: false,
  showMSTs: false,
  treeMode: false,
  bipartiteMode: false,
  gridMode: false,
  markedNodes: false,
  lockMode: false,
  fixedMode: false,
  multiedgeMode: true,
  collisionAvoidance: true,
  minNodeDistance: 0.5,
  collisionStrength: 1.0,
};

let lastDeletedNodePos: Vector2D = { x: -1, y: -1 };

let nodes: string[] = [];
let nodesToConceal = new Set<string>();
let nodeMap = new Map<string, Node>();
let testCaseMap = new Map<number, number>();

let nodeDist: number = 40;

let nodeLabels = new Map<string, string>();

let labelOffset = 0;

let draggedNodes: string[] = [];

let edges: string[] = [];
let edgeToPos = new Map<string, number>();
let edgeLabels = new Map<string, string>();

let adj = new Map<string, string[]>();
let rev = new Map<string, string[]>();

let adjSet = new Map<string, Set<string>>(); // PERF: used to compute `isEdge`
let fullAdjSet = new Map<string, Set<string>>();

let colorMap: ColorMap | undefined = undefined;
let layerMap: LayerMap | undefined = undefined;

let backedgeMap: BackedgeMap | undefined = undefined;

let mstMap: MSTMap | undefined = undefined;

let cutMap: CutMap | undefined = undefined;
let bridgeMap: BridgeMap | undefined = undefined;

let positionMap: PositionMap | undefined = undefined;
let testCaseBoundingBoxes: Map<number, Bounds> | undefined = undefined;

function updateNodes(graphNodes: string[]): void {
  let deletedNodes: string[] = [];

  for (const u of nodes) {
    if (!graphNodes.includes(u)) {
      deletedNodes.push(u);
    }
  }

  nodes = nodes.filter((u) => !deletedNodes.includes(u));

  for (const u of deletedNodes) {
    lastDeletedNodePos = nodeMap.get(u)!.pos;
    nodeMap.delete(u);
  }

  for (let i = 0; i < graphNodes.length; i++) {
    const u = graphNodes[i];

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

  nodes = graphNodes;
}

function updateEdges(graphEdges: string[]): void {
  edges = graphEdges;
  edgeToPos.clear();
  for (const e of edges) {
    const [u, v, rStr] = e.split(" ");
    const eBase = [u, v].join(" ");
    const rNum = parseInt(rStr);
    if (edgeToPos.get(eBase) === undefined) {
      edgeToPos.set(eBase, rNum);
    } else {
      edgeToPos.set(eBase, Math.max(rNum, edgeToPos.get(eBase)!));
    }
  }
}

function calculateSmoothCollisionDisplacement(nodeId: string): void {
  if (!settings.collisionAvoidance) {
    return;
  }
  
  const node = nodeMap.get(nodeId)!;
  const minDistance = nodeRadius * settings.minNodeDistance;
  const collisionStrength = settings.collisionStrength * 2; // Much lower strength for smooth movement
  
  for (const otherId of nodes) {
    if (otherId === nodeId || nodesToConceal.has(otherId)) continue;
    
    const otherNode = nodeMap.get(otherId)!;
    const distance = euclidDist(node.pos, otherNode.pos);
    
    // If nodes are too close, calculate smooth displacement
    if (distance < minDistance && distance > 0) {
      const overlap = minDistance - distance;
      const displacementMagnitude = overlap * collisionStrength;
      
      // Calculate displacement direction (away from other node)
      const dx = node.pos.x - otherNode.pos.x;
      const dy = node.pos.y - otherNode.pos.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 0) {
        // Normalize and apply displacement
        const normalizedDx = dx / length;
        const normalizedDy = dy / length;
        
        // Add to existing displacement (accumulative)
        node.displacement.x += normalizedDx * displacementMagnitude;
        node.displacement.y += normalizedDy * displacementMagnitude;
      }
    }
  }
}

function updateVelocities() {
  const bucketSize = Math.sqrt(
    (canvasWidth * canvasHeight) / Math.max(nodes.length, 1),
  );
  const buckets = new Map<number, Set<string>>();
  for (const node of nodes) {
    const bucketX = Math.floor(nodeMap.get(node)!.pos.x / bucketSize);
    const bucketY = Math.floor(nodeMap.get(node)!.pos.y / bucketSize);
    const bucketInd = bucketX * 1000000 + bucketY;
    if (!buckets.has(bucketInd)) {
      buckets.set(bucketInd, new Set<string>());
    }
    buckets.get(bucketInd)!.add(node);
  }
  const nodesToCheck = new Map<string, Set<string>>();
  for (const node of nodes) {
    nodesToCheck.set(node, new Set<string>());
  }
  for (const node of nodes) {
    const i = Math.floor(nodeMap.get(node)!.pos.x / bucketSize);
    const j = Math.floor(nodeMap.get(node)!.pos.y / bucketSize);
    const curNodes = nodesToCheck.get(node)!;
    for (let dist = 0; dist <= 5 && curNodes.size < 50; ++dist) {
      for (let di = -dist; di <= dist; ++di) {
        const djabs = dist - Math.abs(di);
        for (const dj of [-djabs, djabs]) {
          const bucket = buckets.get((i + di) * 1000000 + j + dj);
          if (bucket === undefined) {
            continue;
          }
          for (const v of bucket) {
            if (v !== node) {
              curNodes.add(v);
            }
          }
        }
      }
    }
    for (const v of fullAdjSet.get(node)!) {
      curNodes.add(v);
    }
  }

  for (const u of nodes) {
    if (nodesToConceal.has(u)) continue;
    if (nodeMap.get(u)!.selected && settings.fixedMode) continue;

    const uPos = nodeMap.get(u)!.pos;

    // Calculate smooth collision displacement
    calculateSmoothCollisionDisplacement(u);
    
    // Apply smooth displacement (separate from velocity)
    nodeMap.get(u)!.applySmoothDisplacement();

    // Standard physics forces (repulsion and attraction)
    for (const v of nodesToCheck.get(u)!) {
      if (nodesToConceal.has(v)) continue;
      const vPos = nodeMap.get(v)!.pos;

      const dist = Math.max(euclidDist(uPos, vPos), 10);

      let aMag = 150_000 / (2 * Math.pow(dist, 4.5));

      const isEdge = adjSet.get(u)!.has(v) || adjSet.get(v)!.has(u);

      if (isEdge) {
        aMag = Math.pow(Math.abs(dist - nodeDist), 1.6) / 100_000;
        if (dist >= nodeDist) {
          aMag *= -1;
        }
      }

      const ax = vPos.x - uPos.x;
      const ay = vPos.y - uPos.y;

      const currentVel = nodeMap.get(u)!.vel;

      nodeMap.get(u)!.vel = {
        x: clamp((currentVel.x - aMag * ax) * (1 - NODE_FRICTION), -100, 100),
        y: clamp((currentVel.y - aMag * ay) * (1 - NODE_FRICTION), -100, 100),
      };
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

    if (layerMap !== undefined) {
      nodeMap.get(u)!.vel = {
        x: nodeMap.get(u)!.vel.x,
        y: 0,
      };
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
    } else if (positionMap !== undefined) {
      const cellSide = (nodeDist * 4) / 5;
      const xSize =
        positionMap.gridWidth * cellSide > canvasWidth - 2 * CANVAS_FIELD_DIST
          ? (canvasWidth - 2 * CANVAS_FIELD_DIST) / positionMap.gridWidth
          : cellSide;
      const ySize =
        positionMap.gridHeight * cellSide > canvasHeight - 2 * CANVAS_FIELD_DIST
          ? (canvasHeight - 2 * CANVAS_FIELD_DIST) / positionMap.gridHeight
          : cellSide;

      const xTarget =
        positionMap.positions.get(u)![0] * xSize + CANVAS_FIELD_DIST;
      const yTarget =
        positionMap.positions.get(u)![1] * ySize + CANVAS_FIELD_DIST;

      const x = nodeMap.get(u)!.pos.x;
      const y = nodeMap.get(u)!.pos.y;

      let ax = Math.pow(Math.abs(x - xTarget), 1.75) / 100;
      if (x > xTarget) {
        ax *= -1;
      }
      let ay = Math.pow(Math.abs(y - yTarget), 1.75) / 100;
      if (y > yTarget) {
        ay *= -1;
      }

      nodeMap.get(u)!.vel = {
        x: clamp((nodeMap.get(u)!.vel.x + ax) * (1 - NODE_FRICTION), -100, 100),
        y: clamp((nodeMap.get(u)!.vel.y + ay) * (1 - NODE_FRICTION), -100, 100),
      };
    }

    const finalVel = nodeMap.get(u)!.vel;

    nodeMap.get(u)!.pos = {
      x: uPos.x + finalVel.x,
      y: uPos.y + finalVel.y,
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

  colorMap = undefined;
  layerMap = undefined;
  backedgeMap = undefined;
  cutMap = undefined;
  bridgeMap = undefined;
  mstMap = undefined;
  positionMap = undefined;

  if (settings.bipartiteMode) {
    let isBipartite: boolean;
    [isBipartite, colorMap, layerMap] = buildBipartite(nodes, adj);
    localStorage.setItem("isBipartite", isBipartite.toString());
    if (!isBipartite) {
      colorMap = undefined;
      layerMap = undefined;
    }
  }

  if (directed) {
    if (settings.showComponents) {
      colorMap = buildSCComponents(nodes, adj, rev);
    }
  } else {
    if (settings.showComponents) {
      colorMap = buildComponents(nodes, adj, rev);
    }
    if (settings.treeMode) {
      [layerMap, backedgeMap] = buildTreeLayers(nodes, adj, rev);
    }
    if (settings.gridMode) {
      positionMap = buildGraphGrid(
        nodes,
        fullAdjSet,
        canvasWidth / canvasHeight,
      );
    }
    if (settings.showBridges) {
      [cutMap, bridgeMap] = buildBridges(nodes, adj, rev);
    }
    if (settings.showMSTs) {
      mstMap = buildMSTs(nodes, edges, edgeLabels);
    }
  }
}

export function updateGraph(testCases: TestCases) {
  nodesToConceal.clear();

  let isEdgeNumeric = true;

  let rawNodes: string[] = [];
  let rawEdges: string[] = [];

  let rawAdj = new Map<string, string[]>();
  let rawRev = new Map<string, string[]>();

  let rawEdgeLabels = new Map<string, string>();
  let rawNodeLabels = new Map<string, string>();

  testCases.forEach((testCase, _) => {
    if (testCase.inputFormat === "edges") {
      testCase.graphParChild.nodes.map((u) => nodesToConceal.add(u));
    } else {
      testCase.graphEdges.nodes.map((u) => nodesToConceal.add(u));
    }

    rawNodes = [...rawNodes, ...testCase.graphEdges.nodes];
    rawNodes = [...rawNodes, ...testCase.graphParChild.nodes];

    rawEdges = [...rawEdges, ...testCase.graphEdges.edges];
    rawEdges = [...rawEdges, ...testCase.graphParChild.edges];

    testCase.graphEdges.adj.forEach((v, k) => {
      rawAdj.set(k, v);
    });
    testCase.graphParChild.adj.forEach((v, k) => {
      rawAdj.set(k, v);
    });

    testCase.graphEdges.rev.forEach((v, k) => {
      rawRev.set(k, v);
    });
    testCase.graphParChild.rev.forEach((v, k) => {
      rawRev.set(k, v);
    });

    testCase.graphEdges.edgeLabels.forEach((v, k) => {
      rawEdgeLabels.set(k, v);
    });
    testCase.graphParChild.edgeLabels.forEach((v, k) => {
      rawEdgeLabels.set(k, v);
    });

    testCase.graphEdges.nodeLabels.forEach((v, k) => {
      rawNodeLabels.set(k, v);
    });
    testCase.graphParChild.nodeLabels.forEach((v, k) => {
      rawNodeLabels.set(k, v);
    });
  });

  for (const e of rawEdges) {
    if (
      rawEdgeLabels.get(e) === undefined ||
      !isInteger(rawEdgeLabels.get(e)!)
    ) {
      isEdgeNumeric = false;
      break;
    }
  }

  localStorage.setItem("isEdgeNumeric", isEdgeNumeric.toString());

  updateNodes(rawNodes);
  updateEdges(rawEdges);

  adj = new Map<string, string[]>(rawAdj);
  rev = new Map<string, string[]>(rawRev);

  adjSet = new Map<string, Set<string>>();

  adj.forEach((vs, u) => {
    adjSet.set(u, new Set<string>(vs));
  });

  fullAdjSet = new Map<string, Set<string>>();
  for (const u of nodes) {
    fullAdjSet.set(u, new Set<string>());
  }
  for (const u of nodes) {
    for (const v of adjSet.get(u)!) {
      if (u === v) {
        continue;
      }
      fullAdjSet.get(u)!.add(v);
      fullAdjSet.get(v)!.add(u);
    }
  }

  nodeLabels = new Map<string, string>(rawNodeLabels);
  edgeLabels = new Map<string, string>(rawEdgeLabels);

  let isBipartite: boolean;
  [isBipartite] = buildBipartite(nodes, adj);
  localStorage.setItem("isBipartite", isBipartite.toString());

  let curIdx = 0;
  testCaseMap.clear();

  testCases.forEach((_, rawNumber) => {
    testCaseMap.set(rawNumber, curIdx++);
  });

  buildSettings();
}

export function resizeGraph(width: number, height: number) {
  canvasWidth = width;
  canvasHeight = height;
}

export function updateDirected(d: boolean) {
  directed = d;
}

export function updateSettings(s: Settings) {
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

function renderNodes(renderer: GraphRenderer) {
  for (let i = 0; i < nodes.length; i++) {
    const u = nodes[i];

    if (nodesToConceal.has(u)) continue;

    const node = nodeMap.get(u)!;

    renderer.lineWidth = 2 * nodeBorderWidthHalf;
    renderer.lineCap = "round";

    renderer.strokeStyle = strokeColor;

    let isTransparent = colorMap === undefined;

    renderer.fillStyle =
      fillColors[
        colorMap === undefined
          ? 0
          : colorMap.get(nodes[i])! % FILL_COLORS_LENGTH
      ];

    if (nodeMap.get(nodes[i])!.markColor !== undefined) {
      isTransparent = false;
      const idx = nodeMap.get(nodes[i])!.markColor!;
      const color = settings.darkMode
        ? FILL_PALETTE_DARK[idx]
        : FILL_PALETTE_LIGHT[idx];
      renderer.fillStyle = color;
    }

    if (settings.showBridges && cutMap !== undefined && cutMap.get(u)) {
      drawHexagon(
        renderer,
        node.pos,
        node.selected,
        nodeBorderWidthHalf,
        nodeRadius,
        isTransparent,
      );
    } else {
      drawCircle(
        renderer,
        node.pos,
        node.selected,
        nodeBorderWidthHalf,
        nodeRadius,
        isTransparent,
      );
    }

    renderer.textBaseline = "middle";
    renderer.textAlign = "center";

    const s = stripNode(u);

    renderer.font = `${settings.fontSize + 2}px JB`;
    renderer.fillStyle = textColor;
    renderer.fillText(
      isInteger(s) ? (parseInt(s, 10) + labelOffset).toString() : s,
      node!.pos.x,
      node!.pos.y + TEXT_Y_OFFSET,
    );
  }
  for (let i = 0; i < nodes.length; i++) {
    const u = nodes[i];

    if (nodesToConceal.has(u)) continue;
    const node = nodeMap.get(u)!;

    if (nodeLabels.has(nodes[i])) {
      drawOctagon(
        renderer,
        node.pos,
        nodeLabels.get(nodes[i])!,
        settings,
        nodeBorderWidthHalf,
        nodeRadius,
        nodeLabelColor,
        nodeLabelOutlineColor,
      );
    }
  }
}

function renderEdges(renderer: GraphRenderer) {
  let renderedEdges = [...edges];

  if (!settings.multiedgeMode) {
    renderedEdges = [];
    for (const e of edges) {
      const eBase = [e.split(" ")[0], e.split(" ")[1]].join(" ");
      if (parseInt(e.split(" ")[2]) === edgeToPos.get(eBase)) {
        renderedEdges.push(e);
      }
    }
  }

  for (const e of renderedEdges) {
    if (nodesToConceal.has(e.split(" ")[0])) continue;

    let pt1 = nodeMap.get(e.split(" ")[0])!.pos;
    let pt2 = nodeMap.get(e.split(" ")[1])!.pos;
    let toReverse = false;

    if (e.split(" ")[0] > e.split(" ")[1]) {
      [pt1, pt2] = [pt2, pt1];
      toReverse = true;
    }

    const eBase = [e.split(" ")[0], e.split(" ")[1]].join(" ");
    const edr = settings.multiedgeMode ? parseInt(e.split(" ")[2]) : 0;
    const eRev = e.split(" ")[1] + " " + e.split(" ")[0];
    const edrMax = edgeToPos.get(eBase);

    if (
      settings.treeMode &&
      backedgeMap !== undefined &&
      (edr !== 0 || backedgeMap.get(eBase))
    ) {
      renderer.setLineDash([2, 10]);
    }

    renderer.strokeStyle = strokeColor;

    let thickness = nodeBorderWidthHalf;

    if (
      localStorage.getItem("isEdgeNumeric") === "true" &&
      settings.showMSTs &&
      mstMap !== undefined &&
      mstMap.get(e)
    ) {
      thickness *= 2;
    }

    if (
      settings.showBridges &&
      bridgeMap !== undefined &&
      edrMax === 0 &&
      bridgeMap.get(eBase)
    ) {
      drawBridge(renderer, pt1, pt2, thickness, nodeRadius, edgeColor);
    } else {
      drawLine(renderer, pt1, pt2, edr, thickness, edgeColor);
    }

    renderer.setLineDash([]);

    if (directed) {
      drawArrow(
        renderer,
        pt1,
        pt2,
        edr,
        toReverse,
        thickness,
        nodeRadius,
        edgeColor,
      );
    }

    let labelReverse = false;
    if (!settings.multiedgeMode) labelReverse = toReverse;

    if (edgeLabels.has(e)) {
      if (!edgeLabels.has(eRev)) {
        drawEdgeLabel(
          renderer,
          pt1,
          pt2,
          edr,
          edgeLabels.get(e)!,
          labelReverse,
          settings,
          nodeBorderWidthHalf,
          edgeLabelColor,
        );
      } else {
        if (e < eRev) {
          drawEdgeLabel(
            renderer,
            pt1,
            pt2,
            edr,
            edgeLabels.get(e)!,
            labelReverse,
            settings,
            nodeBorderWidthHalf,
            edgeLabelColor,
          );
        } else {
          drawEdgeLabel(
            renderer,
            pt1,
            pt2,
            edr,
            edgeLabels.get(e)!,
            labelReverse,
            settings,
            nodeBorderWidthHalf,
            edgeLabelColor,
          );
        }
      }
    }
  }
}

function eraseAnnotation(
  ctxAnnotation: CanvasRenderingContext2D,
  mousePos: Vector2D,
) {
  ctxAnnotation.lineCap = "round";

  ctxAnnotation.globalAlpha = 1.0;

  ctxAnnotation.globalCompositeOperation = "destination-out";

  ctxAnnotation.beginPath();
  ctxAnnotation.arc(
    mousePos.x,
    mousePos.y,
    settings.eraserRadius,
    0,
    2 * Math.PI,
  );
  ctxAnnotation.fill();

  ctxAnnotation.globalCompositeOperation = "source-over";
}

function drawAnnotation(
  ctxAnnotation: CanvasRenderingContext2D,
  mousePos: Vector2D,
) {
  const idx = settings.markColor;

  ctxAnnotation.globalAlpha = 1.0 - settings.penTransparency / 100;

  ctxAnnotation.lineCap = "round";
  ctxAnnotation.lineJoin = "round";
  ctxAnnotation.lineWidth = settings.penThickness;

  if (settings.darkMode) {
    if (idx >= 3) {
      ctxAnnotation.strokeStyle = FILL_PALETTE_LIGHT[idx];
    } else if (idx == 2) {
      ctxAnnotation.strokeStyle = `hsl(${rainbowHue}, 70%, 70%)`;
      rainbowHue += Math.floor(Math.random() * 3) + 1;
    } else {
      ctxAnnotation.strokeStyle = EDGE_COLOR_DARK;
    }
  } else {
    if (idx >= 3) {
      ctxAnnotation.strokeStyle = FILL_PALETTE_DARK[idx];
    } else if (idx == 2) {
      ctxAnnotation.strokeStyle = `hsl(${rainbowHue}, 70%, 30%)`;
      rainbowHue += Math.floor(Math.random() * 3) + 1;
    } else {
      ctxAnnotation.strokeStyle = EDGE_COLOR_LIGHT;
    }
  }

  ctxAnnotation.fillStyle = ctxAnnotation.strokeStyle;

  if (toAnnotate % 2 == 0) {
    if (toAnnotate == 0) {
      ctxAnnotation.beginPath();
      ctxAnnotation.moveTo(
        annotationSecondLastPos.x,
        annotationSecondLastPos.y,
      );
      ctxAnnotation.quadraticCurveTo(
        annotationLastPos.x,
        annotationLastPos.y,
        mousePos.x,
        mousePos.y,
      );

      ctxAnnotation.stroke();
      ctxAnnotation.fill();
    }
    annotationSecondLastPos = annotationLastPos;
    annotationLastPos = mousePos;
  }

  toAnnotate++;
  toAnnotate %= 4;
}

function renderEraseIndicator(renderer: GraphRenderer) {
  if (settings.drawMode !== "erase") return;

  let curMS = performance.now() / 350;
  if (!inErase) curMS = 0;

  renderer.lineCap = "round";
  renderer.lineWidth = 2.0;
  renderer.strokeStyle = settings.darkMode ? NODE_LABEL_LIGHT : NODE_LABEL_DARK;

  renderer.setLineDash([2, 10]);

  renderer.beginPath();
  renderer.arc(
    mousePos.x,
    mousePos.y,
    settings.eraserRadius,
    0 + curMS,
    2 * Math.PI + curMS,
  );
  renderer.stroke();

  renderer.setLineDash([]);
}

function renderPenIndicator(renderer: GraphRenderer) {
  if (settings.drawMode !== "pen") return;

  renderer.lineCap = "round";
  renderer.lineWidth = 2.0;
  renderer.strokeStyle = settings.darkMode
    ? NODE_LABEL_OUTLINE_LIGHT
    : NODE_LABEL_OUTLINE_DARK;

  renderer.beginPath();
  renderer.arc(
    mousePos.x,
    mousePos.y,
    settings.penThickness / 2.0,
    0,
    2 * Math.PI,
  );
  renderer.stroke();
}

function renderTestcaseBoundingBoxes(renderer: GraphRenderer) {
  if (testCaseBoundingBoxes === undefined || !settings.testCaseBoundingBoxes)
    return;

  testCaseBoundingBoxes.forEach((bounds: Bounds, caseNumber: number) => {
    const fixedCaseNumber = testCaseMap.get(caseNumber)!;

    renderer.lineCap = "round";
    renderer.lineWidth = 2.0;
    renderer.strokeStyle = settings.darkMode
      ? FILL_COLORS_DARK[fixedCaseNumber % FILL_COLORS_LENGTH]
      : FILL_COLORS_LIGHT[fixedCaseNumber % FILL_COLORS_LENGTH];

    const PAD = 52;
    renderer.setLineDash([2, 4]);

    renderer.textBaseline = "middle";
    renderer.textAlign = "left";

    renderer.font = `${settings.fontSize}px JB`;
    renderer.fillStyle = textColor;

    let yPrint = bounds.yMax + settings.nodeRadius + PAD + settings.fontSize;

    if (bounds.yMin - settings.nodeRadius - PAD - settings.fontSize >= 10) {
      yPrint = bounds.yMin - settings.nodeRadius - PAD - settings.fontSize;
    }

    renderer.fillText(
      "#" + (fixedCaseNumber + 1).toString(),
      bounds.xMin - settings.nodeRadius - PAD,
      yPrint,
    );

    renderer.beginPath();
    renderer.moveTo(
      bounds.xMin - settings.nodeRadius - PAD,
      bounds.yMin - settings.nodeRadius - PAD,
    );
    renderer.lineTo(
      bounds.xMin - settings.nodeRadius - PAD,
      bounds.yMax + settings.nodeRadius + PAD,
    );
    renderer.lineTo(
      bounds.xMax + settings.nodeRadius + PAD,
      bounds.yMax + settings.nodeRadius + PAD,
    );
    renderer.lineTo(
      bounds.xMax + settings.nodeRadius + PAD,
      bounds.yMin - settings.nodeRadius - PAD,
    );
    renderer.lineTo(
      bounds.xMin - settings.nodeRadius - PAD,
      bounds.yMin - settings.nodeRadius - PAD,
    );
    renderer.stroke();

    renderer.setLineDash([]);
  });
}

export function renderGraphToRenderer(renderer: GraphRenderer) {
  renderEdges(renderer);
  renderNodes(renderer);
  renderTestcaseBoundingBoxes(renderer);
}

export function animateGraph(
  canvas: HTMLCanvasElement,
  canvasAnnotation: HTMLCanvasElement,
  mainRenderer: GraphRenderer,
  indicatorRenderer: GraphRenderer,
  ctxAnnotation: CanvasRenderingContext2D,
) {
  generateRandomCoords();

  canvasAnnotation.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    mousePos = {
      x: event.offsetX,
      y: event.offsetY,
    };

    annotationSecondLastPos = mousePos;
    annotationLastPos = mousePos;

    if (settings.drawMode === "pen") {
      inAnnotation = true;
      inErase = false;
      toAnnotate = 0;
      drawAnnotation(ctxAnnotation, mousePos);
    } else if (settings.drawMode === "erase") {
      inErase = true;
      inAnnotation = false;
      eraseAnnotation(ctxAnnotation, mousePos);
    }
  });

  canvasAnnotation.addEventListener("pointerup", (event) => {
    event.preventDefault();
    inAnnotation = false;
    inErase = false;
  });

  canvasAnnotation.addEventListener("pointermove", (event) => {
    event.preventDefault();

    mousePos = {
      x: event.offsetX,
      y: event.offsetY,
    };

    if (settings.drawMode === "pen") {
      if (inAnnotation) drawAnnotation(ctxAnnotation, mousePos);
    } else if (settings.drawMode === "erase") {
      if (inErase) eraseAnnotation(ctxAnnotation, mousePos);
    }
  });

  canvasAnnotation.addEventListener("pointerleave", (event) => {
    event.preventDefault();
    inAnnotation = false;
    inErase = false;
  });

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    if (draggedNodes.length === 0) prevMS = performance.now();

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
    const curMS = performance.now();
    if (curMS - prevMS <= 200 && draggedNodes.length) {
      const u = draggedNodes[0];
      const sel = nodeMap.get(u)!.selected;
      if (settings.markedNodes) nodeMap.get(u)!.selected = !sel;
      if (settings.markColor === 2) {
        nodeMap.get(u)!.markColor = undefined;
      } else if (settings.markColor >= 3) {
        nodeMap.get(u)!.markColor = settings.markColor;
      }
    }
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

      mainRenderer.clearRect(0, 0, canvasWidth + 20, canvasHeight + 20);
      indicatorRenderer.clearRect(0, 0, canvasWidth + 20, canvasHeight + 20);

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

      testCaseBoundingBoxes = buildTestCaseBoundingBoxes(
        nodeMap,
        nodesToConceal,
      );

      renderGraphToRenderer(mainRenderer);
      renderEraseIndicator(indicatorRenderer);
      renderPenIndicator(indicatorRenderer);

      if (!settings.lockMode) {
        updateVelocities();
      }
    }, 1000 / FPS);
  };
  animate();
}
