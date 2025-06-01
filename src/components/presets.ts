import { createTestCase } from "./createTestCase";
import { EdgesParams, ParChildParams } from "./createTestCase";
import { TestCase, TestCases } from "../types";

export const initNameMap = new Map<string, string>();
export const initPreviewMap = new Map<number, string>();
export const initBuildMap = new Map<
  number,
  (
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => void
>();

initNameMap.set(0 + "en", "[single] basic (edges)");
initNameMap.set(0 + "cn", "[single] basic (edges)");
initPreviewMap.set(0, "n [...]\nu₁ v₁ [w]\n...\nuₘ vₘ [w]");
initBuildMap.set(
  0,
  (
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setTestCases(new Map<number, TestCase>());
    setTabs([]);
    let edges: EdgesParams = {
      nodeLabels: "",
      roots: "",
      edges: "",
    };
    let edgesInput = "";
    for (let i = 1; i < rows.length; i++) {
      edgesInput += rows[i].join(" ");
      if (i != rows.length - 1) edgesInput += "\n";
    }
    edges["edges"] = edgesInput;
    createTestCase(
      testCaseNumber,
      setTestCaseNumber,
      setTestCases,
      setTabs,
      setCurrentId,
      edges,
      undefined,
    );
  },
);

initNameMap.set(1 + "en", "[single] array (edges)");
initNameMap.set(1 + "cn", "[single] array (edges)");
initPreviewMap.set(1, "n [...]\na₁ ... aₙ\nu₁ v₁ [w]\n...\nuₘ vₘ [w]");
initBuildMap.set(
  1,
  (
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setTestCases(new Map<number, TestCase>());
    setTabs([]);
    let edges: EdgesParams = {
      nodeLabels: "",
      roots: "",
      edges: "",
    };
    let edgesInput = "";
    edges["nodeLabels"] = rows[1].join(" ");
    for (let i = 2; i < rows.length; i++) {
      edgesInput += rows[i].join(" ");
      if (i != rows.length - 1) edgesInput += "\n";
    }
    edges["edges"] = edgesInput;
    createTestCase(
      testCaseNumber,
      setTestCaseNumber,
      setTestCases,
      setTabs,
      setCurrentId,
      edges,
      undefined,
    );
  },
);

initNameMap.set(2 + "en", "[single] basic (parent-child)");
initNameMap.set(2 + "cn", "[single] basic (parent-child)");
initPreviewMap.set(2, "n [...]\np₂ ... pₙ");
initBuildMap.set(
  2,
  (
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setTestCases(new Map<number, TestCase>());
    setTabs([]);
    let parChild: ParChildParams = {
      nodeLabels: "",
      roots: "",
      parent: "",
      child: "",
      edgeLabels: "",
    };
    const n = parseInt(rows[0][0]);
    if (n == 0) return;
    let parRow = "1",
      childRow = "";
    for (let i = 1; i <= n; i++) {
      childRow += i;
      if (i != n) childRow += " ";
    }
    for (const u of rows[1]) {
      parRow += " " + u;
    }
    parChild["parent"] = parRow;
    parChild["child"] = childRow;
    createTestCase(
      testCaseNumber,
      setTestCaseNumber,
      setTestCases,
      setTabs,
      setCurrentId,
      undefined,
      parChild,
    );
  },
);

initNameMap.set(3 + "en", "[single] array (parent-child)");
initNameMap.set(3 + "cn", "[single] array (parent-child)");
initPreviewMap.set(3, "n [...]\na₁ ... aₙ\np₂ ... pₙ");
initBuildMap.set(
  3,
  (
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setTestCases(new Map<number, TestCase>());
    setTabs([]);
    let parChild: ParChildParams = {
      nodeLabels: "",
      roots: "",
      parent: "",
      child: "",
      edgeLabels: "",
    };
    const n = parseInt(rows[0][0]);
    parChild["nodeLabels"] = rows[1].join(" ");
    if (n == 0) return;
    let parRow = "1",
      childRow = "";
    for (let i = 1; i <= n; i++) {
      childRow += i;
      if (i != n) childRow += " ";
    }
    for (const u of rows[2]) {
      parRow += " " + u;
    }
    parChild["parent"] = parRow;
    parChild["child"] = childRow;
    createTestCase(
      testCaseNumber,
      setTestCaseNumber,
      setTestCases,
      setTabs,
      setCurrentId,
      undefined,
      parChild,
    );
  },
);

initNameMap.set(4 + "en", "[multiple] basic (edges)");
initNameMap.set(4 + "cn", "[multiple] basic (edges)");
initPreviewMap.set(
  4,
  "t\nn₁ m₁ [...]\nu₁ v₁ [w]\n...\nu_{m₁} v_{m₁} [w]\n...\nnₜ mₜ [...]\nu₁ v₁ [w]\n...\nu_{mₜ} v_{mₜ} [w]",
);

initNameMap.set(5 + "en", "[multiple] array (edges)");
initNameMap.set(5 + "cn", "[multiple] array (edges)");
initPreviewMap.set(
  5,
  "t\nn₁ m₁ [...]\na₁ ... a_{n₁}\nu₁ v₁ [w]\n...\nu_{m₁} v_{m₁} [w]\n...\nnₜ mₜ [...]\na₁ ... a_{nₜ}\nu₁ v₁ [w]\n...\nu_{mₜ} v_{mₜ} [w]",
);

initNameMap.set(6 + "en", "[multiple] tree (edges)");
initNameMap.set(6 + "cn", "[multiple] tree (edges)");
initPreviewMap.set(
  6,
  "t\nn₁ [...]\nu₁ v₁ [w]\n...\nu_{n₁-1} v_{n₁-1} [w]\n...\nnₜ [...]\nu₁ v₁ [w]\n...\nu_{nₜ-1} v_{nₜ-1} [w]",
);

initNameMap.set(7 + "en", "[multiple] tree w/ array (edges)");
initNameMap.set(7 + "cn", "[multiple] tree w/ array (edges)");
initPreviewMap.set(
  7,
  "t\nn₁ [...]\na₁ ... a_{n₁}\nu₁ v₁ [w]\n...\nu_{n₁-1} v_{n₁-1} [w]\n...\nnₜ [...]\na₁ ... a_{nₜ}\nu₁ v₁ [w]\n...\nu_{nₜ-1} v_{nₜ-1} [w]",
);

initNameMap.set(8 + "en", "[multiple] basic (parent-child)");
initNameMap.set(8 + "cn", "[multiple] basic (parent-child)");
initPreviewMap.set(
  8,
  "t\nn₁ [...]\np₂ ... p_{n₁}\n...\nnₜ [...]\np₂ ... p_{nₜ}",
);

initNameMap.set(9 + "en", "[multiple] array (parent-child)");
initNameMap.set(9 + "cn", "[multiple] basic (parent-child)");
initPreviewMap.set(
  9,
  "t\nn₁ [...]\na₁ ... a_{n₁}\np₂ ... p_{n₁}\n...\nnₜ [...]\na₁ ... a_{nₜ}\np₂ ... p_{nₜ}",
);
