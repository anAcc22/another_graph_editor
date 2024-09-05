export function isInteger(s: string) {
  return parseInt(s).toString() === s;
}

export function sortNodes(nodes: string[]) {
  const ints = nodes.filter((s: string) => isInteger(s));
  const notInts = nodes.filter((s: string) => !isInteger(s));

  ints.sort((x: string, y: string) => parseInt(x) - parseInt(y));
  notInts.sort();

  return [...ints, ...notInts];
}
