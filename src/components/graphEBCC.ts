import { ColorMap, EBCCEdgeMap } from "../types";

export function buildEBCC(
  nodes: string[],
  edges: string[],
): [ColorMap, EBCCEdgeMap] {

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

  let colorMap: ColorMap = new Map<string, number>();
  
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

  let edgeMap: EBCCEdgeMap = new Map<string, number[] | undefined>();

  for (const e of edges) {
    let u = e.split(" ")[0];
    let v = e.split(" ")[1];
    edgeMap.set(e, [colorMap.get(u)!, colorMap.get(v)!]);
  }

  return [colorMap, edgeMap];
}


