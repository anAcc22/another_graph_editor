import { InputFormat } from "../types";

export function randInt(l: number, r: number) {
  const len = r - l + 1;
  return Math.floor(Math.random() * len) + l;
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

export function getTestCase(u: string) {
  let toDeduct = 0;
  if (u.length && u[0] == "ρ") toDeduct++;
  return u.length - stripNode(u).length - toDeduct;
}

export function sortNodes(nodes: string[]) {
  nodes = nodes.map((u) => stripNode(u));

  const ints = nodes.filter((s: string) => isInteger(s));
  const notInts = nodes.filter((s: string) => !isInteger(s));

  ints.sort((x: string, y: string) => parseInt(x) - parseInt(y));
  notInts.sort();

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
