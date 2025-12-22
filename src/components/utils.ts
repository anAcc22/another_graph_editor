import { InputFormat } from "../types";

export function randInt(l: number, r: number) {
  const len = r - l + 1;
  return Math.floor(Math.random() * len) + l;
}

export function clamp(x: number, l: number, r: number) {
  return Math.max(l, Math.min(x, r));
}

export function isInteger(s: string) {
  return parseInt(s).toString() === s;
}

export function padNode(
  u: string,
  testCaseNumber: number,
  inputFormat: InputFormat,
) {
  for (let i = 0; i < testCaseNumber; i++) u = "⋅" + u;
  if (inputFormat === "parentChild") u = "ρ" + u;
  return u;
}

export function stripNode(u: string) {
  while (u.length >= 1 && (u[0] === "ρ" || u[0] === "⋅")) {
    u = u.substring(1);
  }
  return u;
}

export function getHiddenPrefix(u: string) {
  let prefix = "";
  for (let i = 0; i < u.length; i++) {
    if (u[i] === "ρ" || u[i] === "⋅") {
      prefix += u[i];
    }
  }
  return prefix;
}

export function getTestCase(u: string) {
  let toDeduct = 0;
  if (u.length && u[0] == "ρ") toDeduct++;
  return u.length - stripNode(u).length - toDeduct;
}

export function sortNodes(nodes: string[], toStrip: boolean = true) {
  if (nodes.length === 0) return [];

  const hiddenPrefix = getHiddenPrefix(nodes[0]);

  nodes = nodes.map((u) => stripNode(u));

  let ints = nodes.filter((s: string) => isInteger(s));
  let notInts = nodes.filter((s: string) => !isInteger(s));

  ints.sort((x: string, y: string) => parseInt(x) - parseInt(y));
  notInts.sort();

  if (!toStrip) {
    ints = ints.map((u: string) => hiddenPrefix + u);
    notInts = notInts.map((u: string) => hiddenPrefix + u);
  }

  return [...ints, ...notInts];
}

export function getDefaultGraph() {
  return {
    nodes: new Array<string>(),
    adj: new Map<string, string[]>(),
    rev: new Map<string, string[]>(),
    edges: new Array<string>(),
    edgeLabels: new Map<string, string>(),
    nodeLabels: new Map<string, string>(),
  };
}

export function getIdealCurvature(edgeIdx: number) {
  let ans = Math.floor((edgeIdx + 1) / 2);
  if (edgeIdx % 2 == 1) {
    ans *= -1;
  }
  return ans;
}
