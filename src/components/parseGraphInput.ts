import { ParsedGraph } from "../types";
import { padNode, sortNodes } from "./utils";

/* function isConvertibleToNum(s: string): boolean {
  for (const c of s) {
    if (!(c >= "0" && c <= "9")) {
      return false;
    }
  }
  return true;
} */

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
  testCaseNumber: number,
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
  let edgeToPos = new Map<string, number>();
  let edges = new Array<string>();
  let edgeLabels = new Map<string, string>();

  roots
    .trim()
    .split(/\s+/)
    .map((u) => {
      const pu = padNode(u, testCaseNumber, "parentChild");
      if (u.length && !nodes.includes(pu)) {
        nodes.push(pu);
        adj.set(pu, []);
      }
    });

  for (let i = 0; i < edgeCnt; i++) {
    const pi = padNode(p[i], testCaseNumber, "parentChild");
    const ci = padNode(c[i], testCaseNumber, "parentChild");
    if (pi === ci && !nodes.includes(pi)) {
      nodes.push(pi);
      adj.set(pi, []);
    } else {
      if (!nodes.includes(pi)) {
        nodes.push(pi);
        adj.set(pi, [ci]);
      } else {
        adj.set(pi, [...adj.get(pi)!, ci]);
      }

      if (!nodes.includes(ci)) {
        nodes.push(ci);
        adj.set(ci, []);
      }

      let edgeBase = "";

      if (pi <= ci) {
        edgeBase = [pi, ci].join(" ");
      } else {
        edgeBase = [ci, pi].join(" ");
      }

      if (edgeToPos.get(edgeBase) === undefined) {
        edgeToPos.set(edgeBase, 0);
      } else {
        edgeToPos.set(edgeBase, edgeToPos.get(edgeBase)! + 1);
      }

      edges.push([pi, ci, edgeToPos.get(edgeBase)].join(" "));

      if (i < l.length) {
        edgeLabels.set([pi, ci, edgeToPos.get(edgeBase)].join(" "), l[i]);
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

  const sortedNodes = sortNodes(nodes, false);

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
  testCaseNumber: number,
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
  let edgeToPos = new Map<string, number>();
  let edges = new Array<string>();
  let edgeLabels = new Map<string, string>();

  roots
    .trim()
    .split(/\s+/)
    .map((u) => {
      const pu = padNode(u, testCaseNumber, "edges");
      if (u.length && !nodes.includes(pu)) {
        nodes.push(pu);
        adj.set(pu, []);
      }
    });

  for (const e of raw) {
    if (e.length == 1) {
      const pu = padNode(e[0], testCaseNumber, "edges");
      if (!nodes.includes(pu)) {
        nodes.push(pu);
        adj.set(pu, []);
      }
    } else if (e.length <= 3) {
      const pu = padNode(e[0], testCaseNumber, "edges");
      const pv = padNode(e[1], testCaseNumber, "edges");
      if (pu === pv && !nodes.includes(pu)) {
        nodes.push(pu);
        adj.set(pu, []);
      } else {
        if (!nodes.includes(pu)) {
          nodes.push(pu);
          adj.set(pu, [pv]);
        } else if (!adj.get(pu)!.includes(pv)) {
          adj.set(pu, [...adj.get(pu)!, pv]);
        }

        if (!nodes.includes(pv)) {
          nodes.push(pv);
          adj.set(pv, []);
        }

        let edgeBase = "";

        if (pu <= pv) {
          edgeBase = [pu, pv].join(" ");
        } else {
          edgeBase = [pv, pu].join(" ");
        }

        if (edgeToPos.get(edgeBase) === undefined) {
          edgeToPos.set(edgeBase, 0);
        } else {
          edgeToPos.set(edgeBase, edgeToPos.get(edgeBase)! + 1);
        }

        edges.push([pu, pv, edgeToPos.get(edgeBase)].join(" "));

        if (e.length === 3) {
          edgeLabels.set([pu, pv, edgeToPos.get(edgeBase)].join(" "), e[2]);
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

  const sortedNodes = sortNodes(nodes, false);

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
