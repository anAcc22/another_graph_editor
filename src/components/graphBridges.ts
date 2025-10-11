import { CutMap, BridgeMap } from "../types";

export function buildCuts(
  nodes: string[],
  adj: Map<string, string[]>,
  rev: Map<string, string[]>,
): CutMap {
  let depth = new Map<string, number>();
  let memo = new Map<string, number>();

  let edgeCnt = new Map<string, number>();

  let seen = new Set<string>();

  let coc = new Map<string, string[]>();
  let cutMap = new Map<string, boolean>();

  for (const u of nodes) {
    depth.set(u, 0);
    memo.set(u, 0);
    coc.set(u, []);
    cutMap.set(u, false);
  }

  for (const [u, vs] of adj.entries()) {
    for (const v of vs) {
      const baseEdge = [u, v].sort().join(" ");
      edgeCnt.set(
        baseEdge,
        edgeCnt.get(baseEdge) === undefined ? 1 : edgeCnt.get(baseEdge)! + 1,
      );
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

  let bridgeMap: BridgeMap = new Map<string, boolean>();

  const solveBridges = (u: string, pu: string): void => {
    seen.add(u);

    for (const v of coc.get(u)!) {
      if (v !== pu) {
        if (depth.get(v)! === 0) {
          depth.set(v, depth.get(u)! + 1);
          solveBridges(v, u);
          memo.set(u, memo.get(u)! + memo.get(v)!);
        } else if (depth.get(v)! < depth.get(u)!) {
          memo.set(u, memo.get(u)! + 1);
        } else {
          memo.set(u, memo.get(u)! - 1);
        }
      }
    }

    if (depth.get(u)! !== 1 && memo.get(u)! === 0) {
      const baseEdge = [u, pu].sort().join(" ");
      if (edgeCnt.get(baseEdge)! >= 2) return;
      bridgeMap.set([u, pu].join(" "), true);
      bridgeMap.set([pu, u].join(" "), true);
    }
  };

  for (const u of nodes) {
    if (!seen.has(u)) {
      depth.set(u, 1);
      solveBridges(u, "");
    }
  }

  for (const [u, vs] of coc.entries()) {
    for (const v of vs) {
      if (!bridgeMap.has([u, v].join(" "))) {
        bridgeMap.set([u, v].join(" "), false);
      }
      if (!bridgeMap.has([v, u].join(" "))) {
        bridgeMap.set([v, u].join(" "), false);
      }
    }
  }

  seen.clear();

  for (const u of nodes) {
    depth.set(u, 0);
    memo.set(u, 1_000_000);
    cutMap.set(u, false);
  }

  const solveCuts = (u: string, pu: string): void => {
    seen.add(u);

    let children = 0;

    for (const v of coc.get(u)!) {
      if (v !== pu) {
        if (depth.get(v)! === 0) {
          depth.set(v, depth.get(u)! + 1);
          solveCuts(v, u);
          memo.set(u, Math.min(memo.get(u)!, memo.get(v)!));
          children++;
        } else if (depth.get(v)! < depth.get(u)!) {
          memo.set(u, Math.min(memo.get(u)!, depth.get(v)!));
        } else {
          memo.set(v, Math.min(memo.get(v)!, depth.get(u)!));
        }
      }
    }

    if (pu === "") {
      cutMap.set(u, children >= 2);
    } else if (memo.get(u)! >= depth.get(pu)!) {
      cutMap.set(pu, true);
    }
  };

  for (const u of nodes) {
    if (!seen.has(u)) {
      depth.set(u, 1);
      solveCuts(u, "");
    }
  }

  return cutMap;
}

export function buildBridges(
  nodes: string[],
  edges: string[],
): BridgeMap {

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

  let colorMap = new Map<string, number>();
  
  let color = 0;
  let time = 0;

  let dfn = new Map<string, number>();
  let low = new Map<string, number>();
  let stack: string[] = [];

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
        colorMap.set(w, color);
      } while (w !== u);
      bcc.set(color, component);
    }
  };

  for (const u of nodes) {
    if (!dfn.has(u)) {
      dfs(u, null);
    }
  }

  let bridgeMap: BridgeMap = new Map<string, boolean>();

  for (const e of edges) {
    let u = e.split(" ")[0];
    let v = e.split(" ")[1];
    if (colorMap.get(u) !== colorMap.get(v)) {
      bridgeMap.set([u, v].join(" "), true);
      bridgeMap.set([v, u].join(" "), true);
    } else {
      bridgeMap.set([u, v].join(" "), false);
      bridgeMap.set([v, u].join(" "), false);
    }
  }

  return bridgeMap;
}
