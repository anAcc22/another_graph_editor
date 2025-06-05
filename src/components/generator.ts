import { Randomizer } from "../types";
import { isInteger } from "./utils";
import { randInt } from "./utils";

export function generateRandomGraph(
  randomizerConfig: Randomizer,
): Array<number[]> {
  const dsu = new Array<number>();

  const find = (u: number): number => (dsu[u] < 0 ? u : find(dsu[u]));
  const unite = (u: number, v: number): void => {
    dsu[find(u)] = find(v);
    return;
  };
  if (
    !isInteger(randomizerConfig.nodeCount) ||
    parseInt(randomizerConfig.nodeCount) < 0
  ) {
    throw Error(`n must be an integer >= 0!`);
  }

  const n = parseInt(randomizerConfig.nodeCount);
  let edges = new Array<number[]>();

  for (let i = 0; i < n; i++) dsu.push(-1);

  for (let u = 0; u < n; u++) {
    for (let v = u + 1; v < n; v++) {
      edges.push([u, v]);
    }
  }

  edges = edges
    .map((value) => ({ value, key: Math.random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ value }) => value);

  if (randomizerConfig.tree || randomizerConfig.connected) {
    let used = new Array<number[]>();
    let unused = new Array<number[]>();

    for (const e of edges) {
      const u = e[0];
      const v = e[1];

      if (find(u) == find(v)) {
        unused.push(e);
      } else {
        unite(u, v);
        used.push(e);
      }
    }

    edges = used;

    for (const e of unused) {
      edges.push(e);
    }

    if (randomizerConfig.tree) {
      let ans = new Array<number[]>();
      for (let i = 0; i < n - 1; i++) {
        ans.push([
          edges[i][0] + randomizerConfig.indexing,
          edges[i][1] + randomizerConfig.indexing,
        ]);
      }
      return ans;
    }
  }

  if (
    !isInteger(randomizerConfig.edgeCount) ||
    parseInt(randomizerConfig.edgeCount) < 0
  ) {
    throw Error(`m must be an integer >= 0!`);
  }

  let m = parseInt(randomizerConfig.edgeCount);

  if (n <= 1 && m >= 1) {
    throw Error(`too many edges!`);
  }

  let ans = new Array<number[]>();

  if (!randomizerConfig.connected) {
    for (let i = 0; i < m; i++) {
      let u = Math.floor(Math.random() * n);
      let v = Math.floor(Math.random() * n);

      while (u === v) {
        u = Math.floor(Math.random() * n);
        v = Math.floor(Math.random() * n);
      }

      ans.push([u + randomizerConfig.indexing, v + randomizerConfig.indexing]);
    }
    return ans;
  }

  if (randomizerConfig.connected && m < n - 1) {
    throw Error(`insufficient edges!`);
  }

  const mBase = edges.length;
  const extra = Math.max(m - mBase);

  for (let i = 0; i < Math.min(m, mBase); i++) {
    ans.push([
      edges[i][0] + randomizerConfig.indexing,
      edges[i][1] + randomizerConfig.indexing,
    ]);
  }

  for (let i = 0; i < extra; i++) {
    let u = Math.floor(Math.random() * n);
    let v = Math.floor(Math.random() * n);

    while (u === v) {
      u = Math.floor(Math.random() * n);
      v = Math.floor(Math.random() * n);
    }

    ans.push([u + randomizerConfig.indexing, v + randomizerConfig.indexing]);
  }

  return ans;
}

export function generateRandomNodeLabels(
  randomizerConfig: Randomizer,
): string {
  if (
    !isInteger(randomizerConfig.nodeLabelMin) ||
    !isInteger(randomizerConfig.nodeLabelMax)
  ) {
    throw Error(`invalid node label range`);
  }

  const l = parseInt(randomizerConfig.nodeLabelMin);
  const r = parseInt(randomizerConfig.nodeLabelMax);

  if (r < l) {
    throw Error(`invalid node label range`);
  }

  const n = parseInt(randomizerConfig.nodeCount);
  const ans = new Array<number>();

  for (let i = 0; i < n; i++) {
    ans.push(randInt(l, r));
  }

  return ans.join(" ");
}
