import { Layer, LayerMap } from "../types";

export function buildTreeLayers(
  nodes: string[],
  adj: Map<string, string[]>,
  rev: Map<string, string[]>,
): LayerMap {
  let layerMap: LayerMap = new Map<string, Layer>();
  let seen = new Set<string>();
  let maxDepth = 0;

  const findMaxDepth = (u: string, depth: number): void => {
    seen.add(u);
    maxDepth = Math.max(maxDepth, depth);
    for (const v of adj.get(u)!) {
      if (!seen.has(v)) {
        findMaxDepth(v, depth + 1);
      }
    }
    for (const v of rev.get(u)!) {
      if (!seen.has(v)) {
        findMaxDepth(v, depth + 1);
      }
    }
  };

  const buildLayers = (u: string, depth: number): void => {
    seen.add(u);
    layerMap.set(u, [depth, maxDepth]);
    for (const v of adj.get(u)!) {
      if (!seen.has(v)) {
        buildLayers(v, depth + 1);
      }
    }
    for (const v of rev.get(u)!) {
      if (!seen.has(v)) {
        buildLayers(v, depth + 1);
      }
    }
  };

  for (const u of nodes) {
    if (!layerMap.has(u)) {
      maxDepth = 0;
      seen.clear();
      findMaxDepth(u, 1);
      seen.clear();
      buildLayers(u, 1);
    }
  }

  return layerMap;
}
