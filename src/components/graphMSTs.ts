import { MSTMap } from "../types";

export function buildMSTs(
  nodes: string[],
  edges: string[],
  edgeLabels: Map<string, string>,
): MSTMap {
  const mstMap = new Map<string, boolean>();

  const dsu = new Array<number>();

  for (let i = 0; i < nodes.length; i++) dsu.push(-1);

  const find = (u: number): number => (dsu[u] < 0 ? u : find(dsu[u]));
  const unite = (u: number, v: number): void => {
    dsu[find(u)] = find(v);
    return;
  };

  const sortedEdges = edges.sort((e1, e2) => {
    const v1 = parseInt(edgeLabels.get(e1)!);
    const v2 = parseInt(edgeLabels.get(e2)!);
    return v1 - v2;
  });

  for (const e of sortedEdges) {
    const [u, v] = e.split(" ");
    if (find(nodes.indexOf(u)) != find(nodes.indexOf(v))) {
      mstMap.set(e, true);
      unite(nodes.indexOf(u), nodes.indexOf(v));
    } else {
      mstMap.set(e, false);
    }
  }
  return mstMap;
}
