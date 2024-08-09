import { ParsedGraph } from "../types";

function isConvertible(s: string): boolean {
  for (const c of s) {
    if (!(c >= "0" && c <= "9")) {
      return false;
    }
  }
  return true;
}

export function parseGraphInput(input: string): ParsedGraph {
  const raw = input
    .split("\n")
    .map((s) => s.trim().split(" "))
    .filter((nodes) => nodes[0].length);

  let nodes = new Set<number>();
  let adj = new Map<number, number[]>();
  let edges = new Array<String>();

  for (const e of raw) {
    if (e.length == 1 && isConvertible(e[0])) {
      let u = Number.parseInt(e[0]);

      if (!nodes.has(u)) {
        nodes.add(u);
        adj.set(u, []);
      }
    } else if (e.length == 2 && isConvertible(e[0]) && isConvertible(e[1])) {
      let u = Number.parseInt(e[0]);
      let v = Number.parseInt(e[1]);

      if (u == v) {
        return {
          status: "BAD",
        };
      }

      if (!nodes.has(u)) {
        nodes.add(u);
        adj.set(u, [v]);
      } else if (!adj.get(u)!.includes(v)) {
        adj.set(u, [...adj.get(u)!, v]);
      }

      if (!nodes.has(v)) {
        nodes.add(v);
        adj.set(v, [u]);
      } else if (!adj.get(v)!.includes(u)) {
        adj.set(v, [...adj.get(v)!, u]);
      }

      if (u > v) [u, v] = [v, u];

      if (!edges.includes([u, v].join(" "))) {
        edges.push([u, v].join(" "));
      }
    } else {
      return {
        status: "BAD",
      };
    }
  }

  return {
    status: "OK",
    graph: {
      nodes: Array.from(nodes),
      adj,
      edges,
    },
  };
}
