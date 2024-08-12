import { ColorMap } from "../types";

export function buildComponents(
  nodes: string[],
  adj: Map<string, string[]>,
  rev: Map<string, string[]>,
): ColorMap {
  let colorMap: ColorMap = new Map<string, number>();
  let color = 1;

  const dfs = (u: string): void => {
    colorMap.set(u, color);
    for (const v of adj.get(u)!) {
      if (!colorMap.has(v)) {
        dfs(v);
      }
    }
    for (const v of rev.get(u)!) {
      if (!colorMap.has(v)) {
        dfs(v);
      }
    }
  };

  for (const u of nodes) {
    if (!colorMap.has(u)) {
      dfs(u);
      color++;
    }
  }

  return colorMap;
}

export function buildSCComponents(
  nodes: string[],
  adj: Map<string, string[]>,
  rev: Map<string, string[]>,
): ColorMap {
  let colorMap: ColorMap = new Map<string, number>();
  let color = 1;
  let stack: string[] = [];

  const buildStack = (u: string): void => {
    colorMap.set(u, 0);
    for (const v of adj.get(u)!) {
      if (!colorMap.has(v)) {
        buildStack(v);
      }
    }
    stack.push(u);
  };

  for (const u of nodes) {
    if (!colorMap.has(u)) {
      buildStack(u);
    }
  }

  stack.reverse();

  const dfs = (u: string): void => {
    colorMap.set(u, color);
    for (const v of rev.get(u)!) {
      if (colorMap.get(v)! === 0) {
        dfs(v);
      }
    }
  };

  for (const u of stack) {
    if (colorMap.get(u)! === 0) {
      dfs(u);
      color++;
    }
  }

  return colorMap;
}
