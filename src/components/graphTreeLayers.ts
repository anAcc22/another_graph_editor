import { Layer, LayerMap, BackedgeMap } from "../types";

export function buildTreeLayers(
  nodes: string[],
  adj: Map<string, string[]>,
  rev: Map<string, string[]>,
): [LayerMap, BackedgeMap] {
  let layerMap: LayerMap = new Map<string, Layer>();
  let backedgeMap: BackedgeMap = new Map<string, boolean>();

  let coc = new Map<string, string[]>();

  let seen = new Set<string>();
  let maxDepth = 0;

  for (const u of nodes) {
    coc.set(u, []);
  }

  for (const [u, vs] of adj.entries()) {
    for (const v of vs) {
      if (!coc.get(u)!.includes(v)) {
        coc.set(u, [...coc.get(u)!, v]);
      }
    }
  }

  for (const [u, vs] of rev.entries()) {
    for (const v of vs) {
      if (!coc.get(u)!.includes(v)) {
        coc.set(u, [...coc.get(u)!, v]);
      }
    }
  }

  const findMaxDepth = (u: string, depth: number): void => {
    seen.add(u);
    maxDepth = Math.max(maxDepth, depth);
    for (const v of coc.get(u)!) {
      if (!seen.has(v)) {
        findMaxDepth(v, depth + 1);
      }
    }
  };

  const buildLayers = (u: string, depth: number): void => {
    seen.add(u);
    layerMap.set(u, [depth, maxDepth]);
    for (const v of coc.get(u)!) {
      const e1 = [u, v].join(" ");
      const e2 = [v, u].join(" ");
      if (!seen.has(v)) {
        buildLayers(v, depth + 1);
        backedgeMap.set(e1, false);
        backedgeMap.set(e2, false);
      } else {
        backedgeMap.set(e1, true);
        backedgeMap.set(e2, true);
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

  return [layerMap, backedgeMap];
}
