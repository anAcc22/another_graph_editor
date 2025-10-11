import { VBCCEdgeMap, VBCCColorMap } from "../types";

export function buildVBCC(
  nodes: string[],
  edges: string[],
): [VBCCColorMap, VBCCEdgeMap] {

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

  let cnt = 0;
  let time = 0;

  let dfn = new Map<string, number>();
  let low = new Map<string, number>();
  let stack: string[] = [];

  let bcc = new Map<number, string[]>();

  let nodeparent = new Map<string | null, number | null>();
  let groupparent = new Map<number | null, string | null>();
  nodeparent.set(null, null);
  groupparent.set(null, null);

  for (const u of nodes) {
    nodeparent.set(u, null);
  }

  const dfs = (u: string, parent: string | null): void => {
    time ++;
    dfn.set(u, time);
    low.set(u, time);
    stack.push(u);

    let child_num = 0;

    for (const v of adjFull.get(u)!) {
      if (!dfn.has(v)) {
        dfs(v, u);
        low.set(u, Math.min(low.get(u)!, low.get(v)!));
        if (low.get(v)! >= dfn.get(u)!) {
          cnt ++;
          const component = [];
          let w: string;
          do {
            w = stack.pop()!;
            component.push(w);
            nodeparent.set(w, cnt);
          } while (w !== v);
          component.push(u);
          bcc.set(cnt, component);
          groupparent.set(cnt, u);
        }
        child_num ++;
      } else {
        low.set(u, Math.min(low.get(u)!, dfn.get(v)!));
      }
    }
    if (parent === null && child_num === 0) {
      cnt ++;
      bcc.set(cnt, [u]);
      stack.pop();
    }
  };

  for (const u of nodes) {
    if (!dfn.has(u)) {
      dfs(u, null);
    }
  }

  let colorMap = new Map<string, {edge: string | null, group: number}[]>();
  let edgeMap = new Map<string, number>();

  for (const u of nodes) {
    colorMap.set(u, []);
  }

  for (const e of edges) {
    let u = e.split(" ")[0];
    let v = e.split(" ")[1];
    let belong = -1;
    if (groupparent.get(nodeparent.get(u)!)! == v) {
      belong = nodeparent.get(u)!;
    }
    if (groupparent.get(nodeparent.get(v)!)! == u) {
      belong = nodeparent.get(v)!;
    }
    if (nodeparent.get(u)! == nodeparent.get(v)!) {
      belong = nodeparent.get(u)!;
    }
    edgeMap.set(e, belong);
    colorMap.get(u)!.push({edge: e, group: belong});
    colorMap.get(v)!.push({edge: e, group: belong});
  }

  for (const [idx, nodes] of bcc) {
    if (nodes.length <= 1) {
      colorMap.set(nodes[0], [{edge: null, group: idx}]);
    }
  }

  return [colorMap, edgeMap];
}
