import { Layer, ColorMap, LayerMap } from "../types";

export function buildBipartite(
  nodes: string[],
  adj: Map<string, string[]>,
): [boolean, ColorMap, LayerMap] {
  let colorMap: ColorMap = new Map<string, number>();
  let layerMap: LayerMap = new Map<string, Layer>();
  
  const adjFull = new Map<string, string[]>();

  for (const u of nodes) {
    adjFull.set(u, []);
  }

  for (const u of nodes) {
    for (const v of adj.get(u)!) {
      adjFull.set(u, [...adjFull.get(u)!, v]);
      adjFull.set(v, [...adjFull.get(v)!, u]);
    }
  }

  let okay = true;

  const dfs = (u: string): void => {
    for (const v of adjFull.get(u)!) {
      if (!colorMap.has(v)) {
        colorMap.set(v, colorMap.get(u) === 1 ? 2 : 1);
        layerMap.set(v, [layerMap.get(u)![0] === 1 ? 2 : 1, 2]);
        dfs(v);
      } else if (colorMap.get(v) === colorMap.get(u)) {
        okay = false;
      }
    }
  };

  for (const u of nodes) {
    if (!colorMap.has(u)) {
      colorMap.set(u, 1);
      layerMap.set(u, [1, 2]);
      dfs(u);
    }
  }

  return [okay, colorMap, layerMap];
}
