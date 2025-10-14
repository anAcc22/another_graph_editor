import { VBCCEdgeMap, VBCCColorMap } from "../types";

function remapColor(
  components: Map<number, string[]>,
  colorNum: number,
): Map<number, number> {
  let colors = new Set<Number>();
  for (let i = 0; i < colorNum; i++) {
    colors.add(i);
  }

  let nodeAdj = new Map<string, number[]>();
  let groupAdj = new Map<number, string[]>();

  let colormap = new Map<number, number>();

  for (const [idx, nodes] of components) {
    if (nodes.length <= 1) {
      let c = colors.values().next().value as number;
      colors.delete(c); colors.add(c + colorNum);
      colormap.set(idx, c);
      continue;
    }
    for (const u of nodes) {
      if (!nodeAdj.has(u)) {
        nodeAdj.set(u, []);
      }
      nodeAdj.get(u)!.push(idx);
    }
    groupAdj.set(idx, nodes);
  }

  let visited = new Set<string>();

  const dfs = (node: string | null, group: number | null, parent: number | string | null): void => {
    if (node !== null) {
      visited.add(node);
      let unusedNum: number = parent === null ? colorNum : colorNum - 1;
      let needNum: number = parent === null ? nodeAdj.get(node)!.length : nodeAdj.get(node)!.length - 1;
      let colorList: number[] = [];
      while (colorList.length < needNum) {
        let c = colors.values().next().value as number;
        colors.delete(c); colors.add(c + colorNum);
        if (unusedNum <= colorNum && parent !== null && c % colorNum === colormap.get(parent as number)! % colorNum) {
          continue;
        }
        colorList.push(c);
      }
      for (const v of nodeAdj.get(node)!) {
        if (v !== parent) {
          colormap.set(v, colorList.pop()!);
          dfs(null, v, node);
        }
      }
    }
    if (group !== null) {
      for (const v of groupAdj.get(group)!) {
        if (v !== parent) {
          dfs(v, null, group);
        }
      }
    }
  };

  for (const [node, group] of nodeAdj) {
    if (!visited.has(node)) {
      dfs(node, null, null);
    }
    let set = new Set<number>();
    for (const g of group) {
      set.add(colormap.get(g)! % colorNum);
    }
    if (set.size < group.length) {
      console.warn("BCC Coloring failed.\n"
        + "Node " + node + " is in Too many components.\n"
        + "Available colors: " + colorNum + ", adjacent components: " + group.length
      );
    }
  }

  return colormap;
}

export function buildVBCC(
  nodes: string[],
  edges: string[],
  colorNum: number,
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

  let remap = remapColor(bcc, colorNum);

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
    belong = remap.get(belong)!;
    edgeMap.set(e, belong);
    colorMap.get(u)!.push({edge: e, group: belong});
    colorMap.get(v)!.push({edge: e, group: belong});
  }

  for (const [idx, nodes] of bcc) {
    if (nodes.length <= 1) {
      colorMap.set(nodes[0], [{edge: null, group: remap.get(idx)!}]);
    }
  }

  return [colorMap, edgeMap];
}
