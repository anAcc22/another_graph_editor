import { ParsedGraph } from "../types";

// function isConvertibleToNum(s: string): boolean {
//   for (const c of s) {
//     if (!(c >= "0" && c <= "9")) {
//       return false;
//     }
//   }
//   return true;
// }

export function parseGraphInput(input: string): ParsedGraph {
  const raw = input
    .split("\n")
    .map((s) => s.trim().split(/\s+/))
    .filter((nodes) => nodes[0].length);

  let nodes = new Set<string>();
  let adj = new Map<string, string[]>();
  let edges = new Array<string>();

  for (const e of raw) {
    if (e.length == 1) {
      if (!nodes.has(e[0])) {
        nodes.add(e[0]);
        adj.set(e[0], []);
      }
    } else if (e.length == 2) {
      if (e[0] == e[1]) {
        return {
          status: "BAD",
        };
      }

      if (!nodes.has(e[0])) {
        nodes.add(e[0]);
        adj.set(e[0], [e[1]]);
      } else if (!adj.get(e[0])!.includes(e[1])) {
        adj.set(e[0], [...adj.get(e[0])!, e[1]]);
      }

      if (!nodes.has(e[1])) {
        nodes.add(e[1]);
        adj.set(e[1], []);
      }

      if (!edges.includes([e[0], e[1]].join(" "))) {
        edges.push([e[0], e[1]].join(" "));
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
