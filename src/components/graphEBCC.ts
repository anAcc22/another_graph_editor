import { ColorMap, EBCCEdgeMap } from "../types";

function remapColor(
  belong: Map<string, number>,
  edges: string[],
  colorNum: number,
): Map<number, number> {
  let colors = new Set<Number>();
  for (let i = 0; i < colorNum; i++) {
    colors.add(i);
  }

  let adj = new Map<number, Set<number>>();
  for (const [_, belongTo] of belong) {
    if (!adj.has(belongTo)) {
      adj.set(belongTo, new Set());
    }
  }

  for (const e of edges) {
    let u = e.split(" ")[0];
    let v = e.split(" ")[1];
    let bu = belong.get(u)!;
    let bv = belong.get(v)!;
    if (bu !== bv) {
      adj.get(bu)!.add(bv);
      adj.get(bv)!.add(bu);
    }
  }

  let colormap = new Map<number, number>();

  let visited = new Set<number>();

  const dfs = (node: number, parent: number | null): void => {
    visited.add(node);
    while (!colormap.has(node)) {
      let c = colors.values().next().value as number;
      colors.delete(c); colors.add(c + colorNum);
      if (parent !== null && c % colorNum === colormap.get(parent!)! % colorNum) {
        continue;
      }
      colormap.set(node, c);
    }
    for (const v of adj.get(node)!) {
      if (v !== parent) {
        dfs(v, node);
      }
    }
  };

  for (const [_, belongTo] of belong) {
    if (!visited.has(belongTo)) {
      dfs(belongTo, null);
    }
  }

  return colormap;
}

export function buildEBCC(
  nodes: string[],
  edges: string[],
  colorNum: number,
): [ColorMap, EBCCEdgeMap] {

  const adjFull = new Map<string, string[]>();

  for (const u of nodes) {
    adjFull.set(u, []);
  }

  for (const e of edges) {
    let u = e.split(" ")[0];
    let v = e.split(" ")[1];
    adjFull.get(u)!.push(v);
    adjFull.get(v)!.push(u);
  }

  
  let color = 0;
  let time = 0;
  
  let dfn = new Map<string, number>();
  let low = new Map<string, number>();
  let stack: string[] = [];
  
  let belong: ColorMap = new Map<string, number>();
  let bcc = new Map<number, string[]>();

  const dfs = (u: string, parent: string | null): void => {
    time++;
    dfn.set(u, time);
    low.set(u, time);
    stack.push(u);

    for (const v of adjFull.get(u)!) {
      if (v === parent) {
        parent = null;
        continue;
      } else if (!dfn.has(v)) {
        dfs(v, u);
        low.set(u, Math.min(low.get(u)!, low.get(v)!));
      } else {
        low.set(u, Math.min(low.get(u)!, dfn.get(v)!));
      }
    }

    if (low.get(u) === dfn.get(u)) {
      color ++;
      const component = [];
      let w: string;
      do {
        w = stack.pop()!;
        component.push(w);
        belong.set(w, color);
      } while (w !== u);
      bcc.set(color, component);
    }
  };

  for (const u of nodes) {
    if (!dfn.has(u)) {
      dfs(u, null);
    }
  }

  let colorMap: ColorMap = new Map<string, number>();
  let edgeMap: EBCCEdgeMap = new Map<string, number[]>();
  let remap = remapColor(belong, edges, colorNum);

  for (const [node, belongTo] of belong) {
    colorMap.set(node, remap.get(belongTo)!);
  }

  for (const e of edges) {
    let u = e.split(" ")[0];
    let v = e.split(" ")[1];
    edgeMap.set(e, [colorMap.get(u)!, colorMap.get(v)!]);
  }

  return [colorMap, edgeMap];
}
