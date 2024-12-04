import { InputFormat } from "../types";

export function isInteger(s: string) {
  return parseInt(s).toString() === s;
}

export function padNode(u: string, testCaseNumber: number, inputFormat: InputFormat) {
  for (let i = 0; i < testCaseNumber; i++) u = '⋅'+u;
  if (inputFormat === "parentChild") u = 'ρ'+u;
  return u;
}

export function stripNode(u: string) {
  while (u.length >= 1 && (u[0] === 'ρ' || u[0] === '⋅')) {
    u = u.substring(1);
  }
  return u;
}

export function sortNodes(nodes: string[]) {
  nodes = nodes.map((u) => stripNode(u));

  const ints = nodes.filter((s: string) => isInteger(s));
  const notInts = nodes.filter((s: string) => !isInteger(s));

  ints.sort((x: string, y: string) => parseInt(x) - parseInt(y));
  notInts.sort();

  return [...ints, ...notInts];
}
