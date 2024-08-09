import { Graph } from "../types";

interface Vector2D {
  x: number;
  y: number;
}

const FPS = 10;

const STROKE_COLOR = "hsl(0, 0%, 10%)";
const FILL_COLOR = "hsl(0, 0%, 100%)";

const TEXT_COLOR = "hsl(0, 0%, 10%)";
const TEXT_Y_OFFSET = 1;

class Node {
  pos: Vector2D;
  static borderWidthHalf = 1;
  static baseRadius = 18;
  constructor(x: number, y: number) {
    this.pos = {
      x,
      y,
    };
  }
}

class Edge {
  pt1: Vector2D;
  pt2: Vector2D;
  static borderWidthHalf = 1;
  constructor(pt1: Vector2D, pt2: Vector2D) {
    this.pt1 = pt1;
    this.pt2 = pt2;
  }
}

let nodes: string[] = [];
let nodeMap = new Map<string, Node>();

let edges: string[] = [];
let edgeMap = new Map<string, Edge>();

let canvasWidth: number;
let canvasHeight: number;

function updateNodes(graph: Graph): void {
  for (const u of graph.nodes) {
    if (!nodes.includes(u)) {
      let x = Math.random() * canvasWidth;
      let y = Math.random() * canvasHeight;

      while (x <= Node.baseRadius || x >= canvasWidth - Node.baseRadius) {
        x = Math.round(Math.random() * canvasWidth);
      }
      while (y <= Node.baseRadius || y >= canvasHeight - Node.baseRadius) {
        y = Math.round(Math.random() * canvasHeight);
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
      const pt1 = nodeMap.get(e.split(" ")[0])!.pos;
      const pt2 = nodeMap.get(e.split(" ")[1])!.pos;

      edges.push(e);
      edgeMap.set(e, new Edge(pt1, pt2));
    }
  }

  let deletedEdges: string[] = [];

  for (const e of edges) {
    if (!graph.edges.includes(e)) {
      deletedEdges.push(e);
    }
  }

  edges = edges.filter((e) => !deletedEdges.includes(e));

  for (const e of deletedEdges) {
    edgeMap.delete(e);
  }
}

export function updateGraph(graph: Graph) {
  updateNodes(graph);
  updateEdges(graph);
}

function renderNodes(ctx: CanvasRenderingContext2D) {
  for (const u of nodes) {
    const node = nodeMap.get(u);

    ctx.lineWidth = 2 * Node.borderWidthHalf;
    ctx.lineCap = "round";

    ctx.strokeStyle = STROKE_COLOR;
    ctx.fillStyle = FILL_COLOR;

    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.beginPath();
    ctx.arc(
      node!.pos.x,
      node!.pos.y,
      Node.baseRadius - Node.borderWidthHalf,
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
    const pt1 = edgeMap.get(e)!.pt1;
    const pt2 = edgeMap.get(e)!.pt2;

    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineWidth = 2 * Edge.borderWidthHalf;

    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.stroke();
  }
}

export function resizeGraph(width: number, height: number) {
  canvasWidth = width;
  canvasHeight = height;
}

export function animateGraph(ctx: CanvasRenderingContext2D) {
  const animate = () => {
    setTimeout(() => {
      requestAnimationFrame(animate);

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      renderEdges(ctx);
      renderNodes(ctx);
    }, 1000 / FPS);
  };
  animate();
}
