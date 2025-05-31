import { TestCases } from "../types";
import { getDefaultGraph } from "./utils";

export function create(
  testCaseNumber: number,
  setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
  setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
  setTabs: React.Dispatch<React.SetStateAction<number[]>>,
  setCurrentId: React.Dispatch<React.SetStateAction<number>>,
) {
  const newTabId = testCaseNumber + 1;
  setTestCaseNumber((testCaseNumber) => testCaseNumber + 1);
  setTestCases((testCases) => {
    const newTestCases = new Map(testCases);
    newTestCases.set(newTabId, {
      graphEdges: getDefaultGraph(),
      graphParChild: getDefaultGraph(),
      inputFormat: "edges",
    });
    return newTestCases;
  });
  setTabs((tabs) => [...tabs, newTabId]);
  setCurrentId(newTabId);
}
