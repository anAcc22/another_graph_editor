import { CutMap, BridgeMap } from "../types";

export function buildBridges(
  nodes: string[],
  adj: Map<string, string[]>,
  rev: Map<string, string[]>,
): [CutMap, BridgeMap] {
  let depth = new Map<string, number>();
  let memo = new Map<string, number>();

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

  return [cutMap, bridgeMap];
}
