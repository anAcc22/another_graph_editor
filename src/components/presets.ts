import { createTestCase } from "./createTestCase";
import { EdgesParams, ParChildParams } from "./createTestCase";
import { TestCase, TestCases } from "../types";

export const initNameMap = new Map<string, string>();
export const initPreviewMap = new Map<string, string>();
export const initBuildMap = new Map<
  number,
  (
    indexing: number,
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => void
>();

initNameMap.set(0 + "en", "[single] basic (edges)");
initNameMap.set(0 + "cn", "[单组] 基本 (边集)");
initPreviewMap.set("0 0", "n [...]\nu₁ v₁ [w]\n...\nuₘ vₘ [w]");
initPreviewMap.set("0 1", "n [...]\nu₁ v₁ [w]\n...\nuₘ vₘ [w]");
initBuildMap.set(
  0,
  (
    indexing: number,
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
    const n = parseInt(rows[0][0]);
    for (let u = 0; u < n; u++) {
      edgesInput += u + indexing + "\n";
    }
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
initNameMap.set(1 + "cn", "[单组] 带点权 (边集)");
initPreviewMap.set("1 0", "n [...]\na₀ ... aₙ₋₁\nu₁ v₁ [w]\n...\nuₘ vₘ [w]");
initPreviewMap.set("1 1", "n [...]\na₁ ... aₙ\nu₁ v₁ [w]\n...\nuₘ vₘ [w]");
initBuildMap.set(
  1,
  (
    indexing: number,
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
    const n = parseInt(rows[0][0]);
    for (let u = 0; u < n; u++) {
      edgesInput += u + indexing + "\n";
    }
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
initNameMap.set(2 + "cn", "[单组] 基本 (父-子节点)");
initPreviewMap.set("2 0", "n [...]\np₁ ... pₙ₋₁");
initPreviewMap.set("2 1", "n [...]\np₂ ... pₙ");
initBuildMap.set(
  2,
  (
    indexing: number,
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
    let parRow = indexing.toString();
    let childRow = "";
    for (let i = 0; i < n; i++) {
      childRow += i + indexing;
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
initNameMap.set(3 + "cn", "[单组] 带点权 (父-子节点)");
initPreviewMap.set("3 0", "n [...]\na₀ ... aₙ₋₁\np₁ ... pₙ₋₁");
initPreviewMap.set("3 1", "n [...]\na₁ ... aₙ\np₂ ... pₙ");
initBuildMap.set(
  3,
  (
    indexing: number,
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
    let parRow = indexing.toString();
    let childRow = "";
    for (let i = 0; i < n; i++) {
      childRow += i + indexing;
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
initNameMap.set(4 + "cn", "[多组] 基本 (边集)");
initPreviewMap.set(
  "4 0",
  "t\nn₁ m₁ [...]\nu₁ v₁ [w]\n...\nu_{m₁} v_{m₁} [w]\n...\nnₜ mₜ [...]\nu₁ v₁ [w]\n...\nu_{mₜ} v_{mₜ} [w]",
);
initPreviewMap.set(
  "4 1",
  "t\nn₁ m₁ [...]\nu₁ v₁ [w]\n...\nu_{m₁} v_{m₁} [w]\n...\nnₜ mₜ [...]\nu₁ v₁ [w]\n...\nu_{mₜ} v_{mₜ} [w]",
);
initBuildMap.set(
  4,
  (
    indexing: number,
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    let rowIdx = 0;
    let tc = parseInt(rows[rowIdx++][0]);
    if (tc == 0) return;
    setTestCases(new Map<number, TestCase>());
    setTabs([]);
    for (let i = 1; i <= tc; i++) {
      const offset = 50 * i;
      setTimeout(() => {
        const n = parseInt(rows[rowIdx][0]);
        let m = parseInt(rows[rowIdx][1]);
        rowIdx++;
        let edges: EdgesParams = {
          nodeLabels: "",
          roots: "",
          edges: "",
        };
        let edgesInput = "";
        for (let u = 0; u < n; u++) {
          edgesInput += u + indexing + "\n";
        }
        while (m--) {
          edgesInput += rows[rowIdx++].join(" ");
          if (m !== 0) edgesInput += "\n";
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
        testCaseNumber++;
      }, offset);
    }
  },
);

initNameMap.set(5 + "en", "[multiple] array (edges)");
initNameMap.set(5 + "cn", "[多组] 带点权 (边集)");
initPreviewMap.set(
  "5 0",
  "t\nn₁ m₁ [...]\na₀ ... a_{n₁-1}\nu₁ v₁ [w]\n...\nu_{m₁} v_{m₁} [w]\n...\nnₜ mₜ [...]\na₀ ... a_{nₜ-1}\nu₁ v₁ [w]\n...\nu_{mₜ} v_{mₜ} [w]",
);
initPreviewMap.set(
  "5 1",
  "t\nn₁ m₁ [...]\na₁ ... a_{n₁}\nu₁ v₁ [w]\n...\nu_{m₁} v_{m₁} [w]\n...\nnₜ mₜ [...]\na₁ ... a_{nₜ}\nu₁ v₁ [w]\n...\nu_{mₜ} v_{mₜ} [w]",
);
initBuildMap.set(
  5,
  (
    indexing: number,
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    let rowIdx = 0;
    let tc = parseInt(rows[rowIdx++][0]);
    if (tc == 0) return;
    setTestCases(new Map<number, TestCase>());
    setTabs([]);
    for (let i = 1; i <= tc; i++) {
      const offset = 50 * i;
      setTimeout(() => {
        const n = parseInt(rows[rowIdx][0]);
        let m = parseInt(rows[rowIdx][1]);
        rowIdx++;
        let edges: EdgesParams = {
          nodeLabels: "",
          roots: "",
          edges: "",
        };
        edges["nodeLabels"] = rows[rowIdx++].join(" ");
        let edgesInput = "";
        for (let u = 0; u < n; u++) {
          edgesInput += u + indexing + "\n";
        }
        while (m--) {
          edgesInput += rows[rowIdx++].join(" ");
          if (m !== 0) edgesInput += "\n";
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
        testCaseNumber++;
      }, offset);
    }
  },
);

initNameMap.set(6 + "en", "[multiple] tree (edges)");
initNameMap.set(6 + "cn", "[多组] 树 (边集)");
initPreviewMap.set(
  "6 0",
  "t\nn₁ [...]\nu₁ v₁ [w]\n...\nu_{n₁-1} v_{n₁-1} [w]\n...\nnₜ [...]\nu₁ v₁ [w]\n...\nu_{nₜ-1} v_{nₜ-1} [w]",
);
initPreviewMap.set(
  "6 1",
  "t\nn₁ [...]\nu₁ v₁ [w]\n...\nu_{n₁-1} v_{n₁-1} [w]\n...\nnₜ [...]\nu₁ v₁ [w]\n...\nu_{nₜ-1} v_{nₜ-1} [w]",
);
initBuildMap.set(
  6,
  (
    indexing: number,
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    let rowIdx = 0;
    let tc = parseInt(rows[rowIdx++][0]);
    if (tc == 0) return;
    setTestCases(new Map<number, TestCase>());
    setTabs([]);
    for (let i = 1; i <= tc; i++) {
      const offset = 50 * i;
      setTimeout(() => {
        const n = parseInt(rows[rowIdx][0]);
        let m = n - 1;
        rowIdx++;
        let edges: EdgesParams = {
          nodeLabels: "",
          roots: "",
          edges: "",
        };
        let edgesInput = "";
        for (let u = 0; u < n; u++) {
          edgesInput += u + indexing + "\n";
        }
        while (m--) {
          edgesInput += rows[rowIdx++].join(" ");
          if (m !== 0) edgesInput += "\n";
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
        testCaseNumber++;
      }, offset);
    }
  },
);

initNameMap.set(7 + "en", "[multiple] tree w/ array (edges)");
initNameMap.set(7 + "cn", "[多组] 树 边权和点权 (边集)");
initPreviewMap.set(
  "7 0",
  "t\nn₁ [...]\na₀ ... a_{n₁-1}\nu₁ v₁ [w]\n...\nu_{n₁-1} v_{n₁-1} [w]\n...\nnₜ [...]\na₀ ... a_{nₜ-1}\nu₁ v₁ [w]\n...\nu_{nₜ-1} v_{nₜ-1} [w]",
);
initPreviewMap.set(
  "7 1",
  "t\nn₁ [...]\na₁ ... a_{n₁}\nu₁ v₁ [w]\n...\nu_{n₁-1} v_{n₁-1} [w]\n...\nnₜ [...]\na₁ ... a_{nₜ}\nu₁ v₁ [w]\n...\nu_{nₜ-1} v_{nₜ-1} [w]",
);
initBuildMap.set(
  7,
  (
    indexing: number,
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    let rowIdx = 0;
    let tc = parseInt(rows[rowIdx++][0]);
    if (tc == 0) return;
    setTestCases(new Map<number, TestCase>());
    setTabs([]);
    for (let i = 1; i <= tc; i++) {
      const offset = 50 * i;
      setTimeout(() => {
        const n = parseInt(rows[rowIdx][0]);
        let m = n - 1;
        rowIdx++;
        let edges: EdgesParams = {
          nodeLabels: "",
          roots: "",
          edges: "",
        };
        edges["nodeLabels"] = rows[rowIdx++].join(" ");
        let edgesInput = "";
        for (let u = 0; u < n; u++) {
          edgesInput += u + indexing + "\n";
        }
        while (m--) {
          edgesInput += rows[rowIdx++].join(" ");
          if (m !== 0) edgesInput += "\n";
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
        testCaseNumber++;
      }, offset);
    }
  },
);

initNameMap.set(8 + "en", "[multiple] basic (parent-child)");
initNameMap.set(8 + "cn", "[多组] 基础 (父-子节点)");
initPreviewMap.set(
  "8 0",
  "t\nn₁ [...]\np₁ ... p_{n₁-1}\n...\nnₜ [...]\np₁ ... p_{nₜ-1}",
);
initPreviewMap.set(
  "8 1",
  "t\nn₁ [...]\np₂ ... p_{n₁}\n...\nnₜ [...]\np₂ ... p_{nₜ}",
);
initBuildMap.set(
  8,
  (
    indexing: number,
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    let rowIdx = 0;
    let tc = parseInt(rows[rowIdx++][0]);
    if (tc == 0) return;
    setTestCases(new Map<number, TestCase>());
    setTabs([]);
    for (let i = 1; i <= tc; i++) {
      const offset = 50 * i;
      setTimeout(() => {
        let parChild: ParChildParams = {
          nodeLabels: "",
          roots: "",
          parent: "",
          child: "",
          edgeLabels: "",
        };
        const n = parseInt(rows[rowIdx++][0]);
        let parRow = indexing.toString();
        let childRow = "";
        for (let i = 0; i < n; i++) {
          childRow += i + indexing;
          if (i != n) childRow += " ";
        }
        for (const u of rows[rowIdx]) {
          parRow += " " + u;
        }
        rowIdx++;
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
        testCaseNumber++;
      }, offset);
    }
  },
);

initNameMap.set(9 + "en", "[multiple] array (parent-child)");
initNameMap.set(9 + "cn", "[多组] 带点权 (父-子节点)");
initPreviewMap.set(
  "9 0",
  "t\nn₁ [...]\na₀ ... a_{n₁-1}\np₁ ... p_{n₁-1}\n...\nnₜ [...]\na₀ ... a_{nₜ-1}\np₁ ... p_{nₜ-1}",
);
initPreviewMap.set(
  "9 1",
  "t\nn₁ [...]\na₁ ... a_{n₁}\np₂ ... p_{n₁}\n...\nnₜ [...]\na₁ ... a_{nₜ}\np₂ ... p_{nₜ}",
);
initBuildMap.set(
  9,
  (
    indexing: number,
    rows: string[][],
    testCaseNumber: number,
    setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>,
    setTestCases: React.Dispatch<React.SetStateAction<TestCases>>,
    setTabs: React.Dispatch<React.SetStateAction<number[]>>,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    let rowIdx = 0;
    let tc = parseInt(rows[rowIdx++][0]);
    if (tc == 0) return;
    setTestCases(new Map<number, TestCase>());
    setTabs([]);
    for (let i = 1; i <= tc; i++) {
      const offset = 50 * i;
      setTimeout(() => {
        let parChild: ParChildParams = {
          nodeLabels: "",
          roots: "",
          parent: "",
          child: "",
          edgeLabels: "",
        };
        const n = parseInt(rows[rowIdx++][0]);
        parChild["nodeLabels"] = rows[rowIdx++].join(" ");
        let parRow = indexing.toString();
        let childRow = "";
        for (let i = 0; i < n; i++) {
          childRow += i + indexing;
          if (i != n) childRow += " ";
        }
        for (const u of rows[rowIdx]) {
          parRow += " " + u;
        }
        rowIdx++;
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
        testCaseNumber++;
      }, offset);
    }
  },
);
