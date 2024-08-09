import { Graph } from "../types";

interface Vector2D {
  x: number;
  y: number;
}

function clamp(val: number, low: number, high: number) {
  return Math.max(low, Math.min(val, high));
}

function euclidDist(u: Vector2D, v: Vector2D): number {
  return Math.hypot(u.x - v.x, u.y - v.y);
}

function drawArrow(ctx: CanvasRenderingContext2D, u: Vector2D, v: Vector2D) {
  const theta = Math.atan2(v.y - u.y, v.x - u.x);

  ctx.lineWidth = 2 * EDGE_BORDER_WIDTH_HALF;

  ctx.strokeStyle = STROKE_COLOR;
  ctx.fillStyle = STROKE_COLOR;

  const mx = (u.x + v.x) / 2;
  const my = (u.y + v.y) / 2;

  ctx.beginPath();

  ctx.moveTo(mx, my);
  ctx.lineTo(
    mx - ARROW_LENGTH * Math.cos(theta - Math.PI / 6),
    my - ARROW_LENGTH * Math.sin(theta - Math.PI / 6),
  );
  ctx.lineTo(
    mx - ARROW_LENGTH * Math.cos(theta + Math.PI / 6),
    my - ARROW_LENGTH * Math.sin(theta + Math.PI / 6),
  );
  ctx.lineTo(mx, my);

  ctx.fill();
  ctx.stroke();
}

const FPS = 30;

const STROKE_COLOR = "hsl(0, 0%, 10%)";
const FILL_COLOR = "hsl(0, 0%, 100%)";

const TEXT_COLOR = "hsl(0, 0%, 10%)";
const TEXT_Y_OFFSET = 1;

const NODE_BORDER_WIDTH_HALF = 1;
const NODE_RADIUS = 18;

const NODE_DIST = 100;
const NODE_FRICTION = 0.05;

const EDGE_BORDER_WIDTH_HALF = 1;

const ARROW_LENGTH = 10;

let canvasWidth: number;
let canvasHeight: number;

let directed = true;

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
    const xOk = x >= NODE_RADIUS && x + NODE_RADIUS <= canvasWidth;
    const yOk = y >= NODE_RADIUS && y + NODE_RADIUS <= canvasHeight;
    return xOk && yOk;
  }
  resetPos(): void {
    this.pos = {
      x: clamp(this.pos.x, NODE_RADIUS, canvasWidth - NODE_RADIUS),
      y: clamp(this.pos.y, NODE_RADIUS, canvasHeight - NODE_RADIUS),
    };
  }
}

let nodes: string[] = [];
let nodeMap = new Map<string, Node>();

let edges: string[] = [];

function updateNodes(graph: Graph): void {
  for (const u of graph.nodes) {
    if (!nodes.includes(u)) {
      let x = Math.random() * canvasWidth;
      let y = Math.random() * canvasHeight;

      let xFailCnt = 0;
      let yFailCnt = 0;

      while (x <= NODE_RADIUS || x >= canvasWidth - NODE_RADIUS) {
        x = Math.round(Math.random() * canvasWidth);
        xFailCnt++;
        if (xFailCnt === 10) {
          break;
        }
      }
      while (y <= NODE_RADIUS || y >= canvasHeight - NODE_RADIUS) {
        y = Math.round(Math.random() * canvasHeight);
        yFailCnt++;
        if (yFailCnt === 10) {
          break;
        }
      }

      nodes.push(u);
      nodeMap.set(u, new Node(x, y));
    }
  }

  let deletedNodes: string[] = [];

  for (const u of nodes) {
    if (!graph.nodes.includes(u)) {
      deletedNodes.push(u);
    }
  }

  nodes = nodes.filter((u) => !deletedNodes.includes(u));

  for (const u of deletedNodes) {
    nodeMap.delete(u);
  }
}

function updateEdges(graph: Graph): void {
  for (const e of graph.edges) {
    if (!edges.includes(e)) {
      edges.push(e);
    }
  }

  let deletedEdges: string[] = [];

  for (const e of edges) {
    if (!graph.edges.includes(e)) {
      deletedEdges.push(e);
    }
  }

  edges = edges.filter((e) => !deletedEdges.includes(e));
}

export function updateGraph(graph: Graph) {
  updateNodes(graph);
  updateEdges(graph);
}

export function resizeGraph(width: number, height: number) {
  canvasWidth = width;
  canvasHeight = height;
}

export function updateDirected(d: boolean) {
  directed = d;
}

function resetMisplacedNodes() {
  nodes.map((u) => {
    if (!nodeMap.get(u)!.inBounds()) {
      nodeMap.get(u)!.resetPos();
    }
  });
}

function renderNodes(ctx: CanvasRenderingContext2D) {
  for (const u of nodes) {
    const node = nodeMap.get(u);

    ctx.lineWidth = 2 * NODE_BORDER_WIDTH_HALF;
    ctx.lineCap = "round";

    ctx.strokeStyle = STROKE_COLOR;
    ctx.fillStyle = FILL_COLOR;

    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.beginPath();
    ctx.arc(
      node!.pos.x,
      node!.pos.y,
      NODE_RADIUS - NODE_BORDER_WIDTH_HALF,
      0,
      2 * Math.PI,
    );

    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 16px JB";
    ctx.fillStyle = TEXT_COLOR;
    ctx.fillText(u, node!.pos.x, node!.pos.y + TEXT_Y_OFFSET);
  }
}

function renderEdges(ctx: CanvasRenderingContext2D) {
  for (const e of edges) {
    const pt1 = nodeMap.get(e.split(" ")[0])!.pos;
    const pt2 = nodeMap.get(e.split(" ")[1])!.pos;

    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineWidth = 2 * EDGE_BORDER_WIDTH_HALF;

    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.stroke();

    if (directed) {
      drawArrow(ctx, pt1, pt2);
    }
  }
}

function updateVelocities() {
  for (const u of nodes) {
    const uPos = nodeMap.get(u)!.pos;

    for (const v of nodes) {
      if (v !== u) {
        const vPos = nodeMap.get(v)!.pos;

        const dist = euclidDist(uPos, vPos);

        let aMag = 5 / (2 * Math.pow(dist, 2));

        const isEdge =
          edges.includes([u, v].join(" ")) || edges.includes([v, u].join(" "));

        if (isEdge) {
          aMag = Math.pow(Math.abs(dist - NODE_DIST), 1.2) / 100_000;
          if (dist >= NODE_DIST) {
            aMag *= -1;
          }
        }

        const ax = vPos.x - uPos.x;
        const ay = vPos.y - uPos.y;

        const uVel = nodeMap.get(u)!.vel;

        nodeMap.get(u)!.vel = {
          x: (uVel.x - aMag * ax) * (1 - NODE_FRICTION),
          y: (uVel.y - aMag * ay) * (1 - NODE_FRICTION),
        };
      }
    }

    const uVel = nodeMap.get(u)!.vel;

    nodeMap.get(u)!.pos = {
      x: uPos.x + uVel.x,
      y: uPos.y + uVel.y,
    };
  }
}

export function animateGraph(ctx: CanvasRenderingContext2D) {
  const animate = () => {
    setTimeout(() => {
      requestAnimationFrame(animate);

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      resetMisplacedNodes();

      renderEdges(ctx);
      renderNodes(ctx);

      updateVelocities();
    }, 1000 / FPS);
  };
  animate();
}
