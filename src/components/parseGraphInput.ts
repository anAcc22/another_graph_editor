import { ParsedGraph } from "../types";

// function isConvertibleToNum(s: string): boolean {
//   for (const c of s) {
//     if (!(c >= "0" && c <= "9")) {
//       return false;
//     }
//   }
//   return true;
// }

export function parseGraphInputParentChild(
  parent: string,
  child: string,
): ParsedGraph {
  const p = parent
    .trim()
    .split(/\s+/)
    .filter((u) => u.length);
  const c = child
    .trim()
    .split(/\s+/)
    .filter((u) => u.length);

  const edgeCnt = Math.min(p.length, c.length);

  let nodes = new Set<string>();
  let adj = new Map<string, string[]>();
  let edges = new Array<string>();

  for (let i = 0; i < edgeCnt; i++) {
    if (p[i] === c[i] && !nodes.has(p[i])) {
      nodes.add(p[i]);
      adj.set(p[i], []);
    } else {
      if (!nodes.has(p[i])) {
        nodes.add(p[i]);
        adj.set(p[i], []);
      } else {
        adj.set(p[i], [...adj.get(p[i])!, c[i]]);
      }

      if (!nodes.has(c[i])) {
        nodes.add(c[i]);
        adj.set(c[i], []);
      }

      if (!edges.includes([p[i], c[i]].join(" "))) {
        edges.push([p[i], c[i]].join(" "));
      }
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

export function parseGraphInputEdges(input: string): ParsedGraph {
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
      if (e[0] === e[1] && !nodes.has(e[0])) {
        nodes.add(e[0]);
        adj.set(e[0], []);
      } else {
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
