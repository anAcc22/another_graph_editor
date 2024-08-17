import { ParsedGraph } from "../types";

// function isConvertibleToNum(s: string): boolean {
//   for (const c of s) {
//     if (!(c >= "0" && c <= "9")) {
//       return false;
//     }
//   }
//   return true;
// }

interface LeetcodeParsed {
  status: "ok" | "bad";
  edges: Array<string[]>;
}
function parseLeetcodeStyle(s: string): LeetcodeParsed {
  if (s.length >= 4 && s[0] === "[" && s[1] === "[") {
    if (s[s.length - 1] === "]" && s[s.length - 2] === "]") {
      return {
        status: "ok",
        edges: s
          .substring(2, s.length - 2)
          .split("],[")
          .map((t) => t.split(",")),
      };
    }
  }
  return {
    status: "bad",
    edges: [],
  };
}

export function parseGraphInputParentChild(
  roots: string,
  parent: string,
  child: string,
  labels: string,
  nodeLabels: string,
): ParsedGraph {
  const p = parent
    .trim()
    .split(/\s+/)
    .filter((u) => u.length);

  const c = child
    .trim()
    .split(/\s+/)
    .filter((u) => u.length);

  const l = labels
    .trim()
    .split(/\s+/)
    .filter((u) => u.length);

  const nl = nodeLabels
    .trim()
    .split(/\s+/)
    .filter((u) => u.length);

  const edgeCnt = Math.min(p.length, c.length);

  let nodes = new Array<string>();
  let adj = new Map<string, string[]>();
  let rev = new Map<string, string[]>();
  let edges = new Array<string>();
  let edgeLabels = new Map<string, string>();

  roots
    .trim()
    .split(/\s+/)
    .map((u) => {
      if (u.length && !nodes.includes(u)) {
        nodes.push(u);
        adj.set(u, []);
      }
    });

  for (let i = 0; i < edgeCnt; i++) {
    if (p[i] === c[i] && !nodes.includes(p[i])) {
      nodes.push(p[i]);
      adj.set(p[i], []);
    } else {
      if (!nodes.includes(p[i])) {
        nodes.push(p[i]);
        adj.set(p[i], [c[i]]);
      } else {
        adj.set(p[i], [...adj.get(p[i])!, c[i]]);
      }

      if (!nodes.includes(c[i])) {
        nodes.push(c[i]);
        adj.set(c[i], []);
      }

      if (!edges.includes([p[i], c[i]].join(" "))) {
        edges.push([p[i], c[i]].join(" "));
      }

      if (i < l.length) {
        edgeLabels.set([p[i], c[i]].join(" "), l[i]);
      }
    }
  }

  for (const [u, vs] of adj.entries()) {
    if (!rev.has(u)) {
      rev.set(u, []);
    }
    for (const v of vs) {
      if (rev.has(v)) {
        rev.set(v, [...rev.get(v)!, u]);
      } else {
        rev.set(v, [u]);
      }
    }
  }

  const sortedNodes = [...nodes].sort();

  const len = Math.min(sortedNodes.length, nl.length);

  let mp = new Map<string, string>();

  for (let i = 0; i < len; i++) {
    if (nl[i] !== "_") {
      mp.set(sortedNodes[i], nl[i]);
    }
  }

  return {
    status: "OK",
    graph: {
      nodes,
      adj,
      rev,
      edges,
      edgeLabels,
      nodeLabels: mp,
    },
  };
}

export function parseGraphInputEdges(
  roots: string,
  input: string,
  nodeLabels: string,
): ParsedGraph {
  const leetcodes = new Array<string[]>();

  const raw = input
    .split("\n")
    .map((s) => {
      const sTrimmed = s.trim().split(/\s+/);
      const leet = parseLeetcodeStyle(sTrimmed[0]);
      if (sTrimmed.length == 1 && leet.status === "ok") {
        for (const l of leet.edges) {
          leetcodes.push(l);
        }
        return [""];
      }
      return sTrimmed;
    })
    .filter((nodes) => nodes[0].length);

  for (const s of leetcodes) {
    if (s[0].length) {
      raw.push(s);
    }
  }

  let nodes = new Array<string>();
  let adj = new Map<string, string[]>();
  let rev = new Map<string, string[]>();
  let edges = new Array<string>();
  let edgeLabels = new Map<string, string>();

  roots
    .trim()
    .split(/\s+/)
    .map((u) => {
      if (u.length && !nodes.includes(u)) {
        nodes.push(u);
        adj.set(u, []);
      }
    });

  for (const e of raw) {
    if (e.length == 1) {
      if (!nodes.includes(e[0])) {
        nodes.push(e[0]);
        adj.set(e[0], []);
      }
    } else if (e.length <= 3) {
      if (e[0] === e[1] && !nodes.includes(e[0])) {
        nodes.push(e[0]);
        adj.set(e[0], []);
      } else {
        if (!nodes.includes(e[0])) {
          nodes.push(e[0]);
          adj.set(e[0], [e[1]]);
        } else if (!adj.get(e[0])!.includes(e[1])) {
          adj.set(e[0], [...adj.get(e[0])!, e[1]]);
        }

        if (!nodes.includes(e[1])) {
          nodes.push(e[1]);
          adj.set(e[1], []);
        }

        if (!edges.includes([e[0], e[1]].join(" "))) {
          edges.push([e[0], e[1]].join(" "));
        }

        if (e.length === 3) {
          edgeLabels.set([e[0], e[1]].join(" "), e[2]);
        }
      }
    } else {
      return {
        status: "BAD",
      };
    }
  }

  for (const [u, vs] of adj.entries()) {
    if (!rev.has(u)) {
      rev.set(u, []);
    }
    for (const v of vs) {
      if (rev.has(v)) {
        rev.set(v, [...rev.get(v)!, u]);
      } else {
        rev.set(v, [u]);
      }
    }
  }

  const sortedNodes = [...nodes].sort();

  const nl = nodeLabels
    .trim()
    .split(/\s+/)
    .filter((u) => u.length);

  const len = Math.min(sortedNodes.length, nl.length);

  let mp = new Map<string, string>();

  for (let i = 0; i < len; i++) {
    if (nl[i] !== "_") {
      mp.set(sortedNodes[i], nl[i]);
    }
  }

  return {
    status: "OK",
    graph: {
      nodes,
      adj,
      rev,
      edges,
      edgeLabels,
      nodeLabels: mp,
    },
  };
}
