import { getTestCase } from "./utils";
import { Node } from "./animateGraph";

export interface Bounds {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export function buildTestCaseBoundingBoxes(
  nodeMap: Map<string, Node>,
  nodesToConceal: Set<string>,
) {
  const caseMap = new Map<number, Bounds>();

  nodeMap.forEach((node, u) => {
    if (nodesToConceal.has(u)) return;

    const testNumber = getTestCase(u);
    const x = node.pos.x;
    const y = node.pos.y;

    if (caseMap.get(testNumber) === undefined) {
      caseMap.set(testNumber, {
        xMin: x,
        xMax: x,
        yMin: y,
        yMax: y,
      });
    } else {
      caseMap.set(testNumber, {
        xMin: Math.min(caseMap.get(testNumber)!.xMin, x),
        xMax: Math.max(caseMap.get(testNumber)!.xMax, x),
        yMin: Math.min(caseMap.get(testNumber)!.yMin, y),
        yMax: Math.max(caseMap.get(testNumber)!.yMax, y),
      });
    }
  });

  if (caseMap.size <= 1) return undefined;
  return caseMap;
}
