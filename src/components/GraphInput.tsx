import { parseGraphInputEdges } from "./parseGraphInput";
import { parseGraphInputParentChild } from "./parseGraphInput";
import { useState } from "react";

import { Settings } from "../types";
import { ParsedGraph } from "../types";
import { TestCases } from "../types";
import { padNode, sortNodes } from "./utils";

interface Props {
  settings: Settings;
  key: number;
  testCases: TestCases;
  setTestCases: React.Dispatch<React.SetStateAction<TestCases>>;
  inputId: number;
  currentId: number;
  directed: boolean;
  setDirected: React.Dispatch<React.SetStateAction<boolean>>;
}

export function GraphInput({
  settings,
  testCases,
  setTestCases,
  inputId,
  currentId,
  directed,
  setDirected,
}: Props) {
  const [inputStatus, setInputStatus] = useState<boolean>(true);

  const processGraphInput = () => {
    if (testCases.get(inputId) === undefined) return;
    const inputFormat = testCases.get(inputId)!.inputFormat;

    let parsedGraph: ParsedGraph;

    let roots = "";

    if (!directed) {
      roots =
        inputFormat === "edges"
          ? (
              document.getElementById(
                "graphInputRootsEdges" + inputId,
              ) as HTMLTextAreaElement
            ).value
          : (
              document.getElementById(
                "graphInputRootsParChild" + inputId,
              ) as HTMLTextAreaElement
            ).value;
    }

    if (inputFormat === "edges") {
      parsedGraph = parseGraphInputEdges(
        roots,
        (
          document.getElementById(
            "graphInputEdges" + inputId,
          ) as HTMLTextAreaElement
        ).value,
        (
          document.getElementById(
            "graphInputNodeLabelsEdges" + inputId,
          ) as HTMLTextAreaElement
        ).value,
        inputId,
      );
      if (parsedGraph.status === "BAD") {
        setInputStatus(false);
      } else {
        setInputStatus(true);
        setTestCases((testCases) => {
          const newTestCases = new Map(testCases);
          newTestCases.set(inputId, {
            graphEdges: parsedGraph.graph!,
            graphParChild: newTestCases.get(inputId)!.graphParChild!,
            inputFormat: "edges",
          });
          return newTestCases;
        });
      }
    } else {
      parsedGraph = parseGraphInputParentChild(
        roots,
        (
          document.getElementById(
            "graphInputParent" + inputId,
          ) as HTMLTextAreaElement
        ).value,
        (
          document.getElementById(
            "graphInputChild" + inputId,
          ) as HTMLTextAreaElement
        ).value,
        (
          document.getElementById(
            "graphInputEdgeLabels" + inputId,
          ) as HTMLTextAreaElement
        ).value,
        (
          document.getElementById(
            "graphInputNodeLabelsParChild" + inputId,
          ) as HTMLTextAreaElement
        ).value,
        inputId,
      );
      if (parsedGraph.status === "BAD") {
        setInputStatus(false);
      } else {
        setInputStatus(true);
        setTestCases((testCases) => {
          const newTestCases = new Map(testCases);
          newTestCases.set(inputId, {
            graphEdges: newTestCases.get(inputId)!.graphEdges!,
            graphParChild: parsedGraph.graph!,
            inputFormat: "parentChild",
          });
          return newTestCases;
        });
      }
    }
  };

  const processNodeLabels = () => {
    if (testCases.get(inputId) === undefined) return;
    const inputFormat = testCases.get(inputId)!.inputFormat;

    let currentNodes = (
      document.getElementById(
        "graphInputCurrentNodes" + inputId,
      ) as HTMLTextAreaElement
    ).value
      .trim()
      .split(/\s+/)
      .filter((u) => u.length);

    currentNodes = sortNodes(currentNodes);
    currentNodes = currentNodes.map((u) => padNode(u, inputId, inputFormat));

    const nodeLabels = (
      inputFormat === "edges"
        ? (document.getElementById(
            "graphInputNodeLabelsEdges" + inputId,
          ) as HTMLTextAreaElement)
        : (document.getElementById(
            "graphInputNodeLabelsParChild" + inputId,
          ) as HTMLTextAreaElement)
    ).value
      .trim()
      .split(/\s+/)
      .filter((u) => u.length);

    const len = Math.min(currentNodes.length, nodeLabels.length);

    let mp = new Map<string, string>();

    for (let i = 0; i < len; i++) {
      if (nodeLabels[i] !== "_") {
        mp.set(currentNodes[i], nodeLabels[i]);
      }
    }

    if (inputFormat === "edges") {
      setTestCases((testCases) => {
        const newTestCases = new Map(testCases);
        newTestCases.set(inputId, {
          graphEdges: {
            ...newTestCases.get(inputId)!.graphEdges!,
            nodeLabels: mp,
          },
          graphParChild: newTestCases.get(inputId)!.graphParChild!,
          inputFormat: "edges",
        });
        return newTestCases;
      });
    } else {
      setTestCases((testCases) => {
        const newTestCases = new Map(testCases);
        newTestCases.set(inputId, {
          graphEdges: newTestCases.get(inputId)!.graphEdges!,
          graphParChild: {
            ...newTestCases.get(inputId)!.graphParChild!,
            nodeLabels: mp,
          },
          inputFormat: "parentChild",
        });
        return newTestCases;
      });
    }
  };

  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  return (
    <>
      <li
        className={
          inputId === currentId
            ? `font-jetbrains flex flex-col border-2 rounded-lg bg-block
              shadow-shadow shadow border-border p-3 space-y-3 list-none
              hover:border-border-hover`
            : "hidden"
        }
      >
        <h4 className="text-base font-semibold">
          {settings.language == "en" ? "Current Nodes" : "节点"}
        </h4>
        <textarea
          wrap="off"
          rows={1}
          name="graphInputCurrentNodes"
          id={"graphInputCurrentNodes" + inputId}
          onChange={processNodeLabels}
          value={
            testCases.get(inputId) === undefined
              ? ""
              : testCases.get(inputId)!.inputFormat === "edges"
                ? sortNodes(testCases.get(inputId)!.graphEdges.nodes).join(" ")
                : sortNodes(testCases.get(inputId)!.graphParChild.nodes).join(
                    " ",
                  )
          }
          readOnly
          className="bg-ovr font-semibold font-jetbrains resize-none border-2
            rounded-md px-2 py-1 border-single focus:outline-none text-lg
            text-current-nodes border-border w-auto no-scrollbar"
        ></textarea>

        <h4 className="text-base font-semibold">
          {settings.language == "en" ? "Node Labels" : "节点标签"}
        </h4>
        <textarea
          wrap="off"
          name="graphInputNodeLabelsEdges"
          id={"graphInputNodeLabelsEdges" + inputId}
          rows={1}
          onChange={processNodeLabels}
          onKeyDown={handleTextAreaKeyDown}
          placeholder={
            settings.language == "en"
              ? "TIP: '_' -> empty label"
              : "提示：'_' -> 空标签"
          }
          className={
            testCases.get(inputId)?.inputFormat === "edges"
              ? `bg-ovr font-semibold font-jetbrains resize-none border-2
                rounded-md px-2 py-1 border-single focus:outline-none text-lg
                border-border focus:border-border-active placeholder-placeholder
                w-auto no-scrollbar`
              : "hidden"
          }
        ></textarea>
        <textarea
          wrap="off"
          name="graphInputNodeLabelsParChild"
          id={"graphInputNodeLabelsParChild" + inputId}
          rows={1}
          onChange={processNodeLabels}
          onKeyDown={handleTextAreaKeyDown}
          placeholder={
            settings.language == "en"
              ? "TIP: '_' -> empty label"
              : "提示：'_' -> 空标签"
          }
          className={
            testCases.get(inputId)?.inputFormat === "parentChild"
              ? `bg-ovr font-semibold font-jetbrains resize-none border-2
                rounded-md px-2 py-1 border-single focus:outline-none text-lg
                border-border focus:border-border-active placeholder-placeholder
                w-auto no-scrollbar`
              : "hidden"
          }
        ></textarea>

        <br />

        <div className="flex font-light text-sm justify-between">
          <span>
            <span>
              {testCases.get(inputId)?.inputFormat === "edges" ? (
                <span className="text-selected p-0 hover:cursor-pointer">
                  {settings.language == "en" ? "Edges" : "边集"}
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    setTestCases((testCases) => {
                      const newTestCases = new Map(testCases);
                      newTestCases.set(inputId, {
                        graphEdges: newTestCases.get(inputId)!.graphEdges,
                        graphParChild:
                          newTestCases.get(inputId)!.graphParChild!,
                        inputFormat: "edges",
                      });
                      return newTestCases;
                    });
                    let checkbox = document.getElementById(
                      "inputFormatCheckbox" + inputId,
                    ) as HTMLInputElement;
                    checkbox.checked = false;
                  }}
                >
                  {settings.language == "en" ? "Edges" : "边集"}
                </span>
              )}
            </span>
            <span> | </span>
            <span>
              {testCases.get(inputId)?.inputFormat === "parentChild" ? (
                <span className="text-selected p-0 hover:cursor-pointer">
                  {settings.language == "en" ? "Parent-Child" : "父亲-子节点"}
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    setTestCases((testCases) => {
                      const newTestCases = new Map(testCases);
                      newTestCases.set(inputId, {
                        graphEdges: newTestCases.get(inputId)!.graphEdges,
                        graphParChild:
                          newTestCases.get(inputId)!.graphParChild!,
                        inputFormat: "parentChild",
                      });
                      return newTestCases;
                    });
                    let checkbox = document.getElementById(
                      "inputFormatCheckbox" + inputId,
                    ) as HTMLInputElement;
                    checkbox.checked = true;
                  }}
                >
                  {settings.language == "en" ? "Parent-Child" : "父亲-子节点"}
                </span>
              )}
            </span>
          </span>
          <label className="relative inline w-9">
            <input
              onClick={() => {
                setTestCases((testCases) => {
                  const newTestCases = new Map(testCases);
                  const oldInputFormat = newTestCases.get(inputId)!.inputFormat;

                  newTestCases.set(inputId, {
                    graphEdges: newTestCases.get(inputId)!.graphEdges,
                    graphParChild: newTestCases.get(inputId)!.graphParChild!,
                    inputFormat:
                      oldInputFormat === "edges" ? "parentChild" : "edges",
                  });
                  return newTestCases;
                });
              }}
              type="checkbox"
              id={"inputFormatCheckbox" + inputId}
              className="peer invisible"
            />
            <span
              className="absolute top-0 left-0 w-9 h-5 cursor-pointer
                rounded-full bg-toggle-uncheck border-none transition-all
                duration-75 hover:bg-toggle-hover peer-checked:bg-toggle-check"
            ></span>
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 bg-toggle-circle
                rounded-full transition-all duration-75 cursor-pointer
                peer-checked:translate-x-4"
            ></span>
          </label>
        </div>

        <div className="flex font-light text-sm justify-between">
          <span>
            <span>
              {!directed ? (
                <span className="text-selected p-0 hover:cursor-pointer">
                  {settings.language == "en" ? "Undirected" : "无向"}
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    setDirected(false);
                    let checkbox = document.getElementById(
                      "directedCheckbox" + inputId,
                    ) as HTMLInputElement;
                    checkbox.checked = false;
                  }}
                >
                  {settings.language == "en" ? "Undirected" : "无向"}
                </span>
              )}
            </span>
            <span> | </span>
            <span>
              {directed ? (
                <span className="text-selected p-0 hover:cursor-pointer">
                  {settings.language == "en" ? "Directed" : "有向"}
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    setDirected(true);
                    let checkbox = document.getElementById(
                      "directedCheckbox" + inputId,
                    ) as HTMLInputElement;
                    checkbox.checked = true;
                  }}
                >
                  {settings.language == "en" ? "Directed" : "有向"}
                </span>
              )}
            </span>
          </span>
          <label className="relative inline w-9">
            <input
              onClick={() => setDirected(!directed)}
              type="checkbox"
              id={"directedCheckbox" + inputId}
              className="peer invisible"
              defaultChecked={directed}
            />
            <span
              className="absolute top-0 left-0 w-9 h-5 cursor-pointer
                rounded-full bg-toggle-uncheck border-none transition-all
                duration-75 hover:bg-toggle-hover peer-checked:bg-toggle-check"
            ></span>
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 bg-toggle-circle
                rounded-full transition-all duration-75 cursor-pointer
                peer-checked:translate-x-4"
            ></span>
          </label>
        </div>

        <br />

        <h4
          className={
            !directed && testCases.get(inputId)?.inputFormat === "edges"
              ? "text-base font-semibold"
              : "hidden"
          }
        >
          {settings.language == "en" ? "Roots" : "根"}
        </h4>
        <textarea
          wrap="off"
          name="graphInputRootsEdges"
          id={"graphInputRootsEdges" + inputId}
          rows={1}
          onChange={processGraphInput}
          onKeyDown={handleTextAreaKeyDown}
          className={
            !directed && testCases.get(inputId)?.inputFormat === "edges"
              ? `bg-ovr font-semibold font-jetbrains resize-none border-2
                rounded-md px-2 py-1 border-single focus:outline-none text-lg
                border-border focus:border-border-active w-auto no-scrollbar`
              : "hidden"
          }
        ></textarea>

        <h4
          className={
            !directed && testCases.get(inputId)?.inputFormat === "parentChild"
              ? "text-base font-semibold"
              : "hidden"
          }
        >
          {settings.language == "en" ? "Roots" : "根"}
        </h4>
        <textarea
          wrap="off"
          name="graphInputRootsParChild"
          id={"graphInputRootsParChild" + inputId}
          rows={1}
          onChange={processGraphInput}
          onKeyDown={handleTextAreaKeyDown}
          className={
            !directed && testCases.get(inputId)?.inputFormat === "parentChild"
              ? `bg-ovr font-semibold font-jetbrains resize-none border-2
                rounded-md px-2 py-1 border-single focus:outline-none text-lg
                border-border focus:border-border-active w-auto no-scrollbar`
              : "hidden"
          }
        ></textarea>

        <h4
          className={
            testCases.get(inputId)?.inputFormat === "edges"
              ? "text-base font-semibold"
              : "hidden"
          }
        >
          {settings.language == "en" ? "Edges" : "边集"}
        </h4>
        <textarea
          wrap="off"
          name="graphInputEdges"
          id={"graphInputEdges" + inputId}
          onChange={processGraphInput}
          onKeyDown={handleTextAreaKeyDown}
          rows={8}
          className={
            testCases.get(inputId)?.inputFormat === "edges"
              ? `font-semibold font-jetbrains resize-none border-2 rounded-md
                px-2 py-1 border-single focus:outline-none text-lg border-border
                focus:border-border-active bg-ovr w-auto no-scrollbar`
              : "hidden"
          }
        ></textarea>

        <h4
          className={
            testCases.get(inputId)?.inputFormat === "parentChild"
              ? "text-base font-semibold"
              : "hidden"
          }
        >
          {settings.language == "en" ? "Parent Array" : "父节点数组"}
        </h4>
        <textarea
          wrap="off"
          name="graphInputParent"
          id={"graphInputParent" + inputId}
          rows={1}
          onChange={processGraphInput}
          onKeyDown={handleTextAreaKeyDown}
          className={
            testCases.get(inputId)?.inputFormat === "parentChild"
              ? `bg-ovr font-semibold font-jetbrains resize-none border-2
                rounded-md px-2 py-1 border-single focus:outline-none text-lg
                border-border focus:border-border-active w-auto no-scrollbar`
              : "hidden"
          }
        ></textarea>

        <h4
          className={
            testCases.get(inputId)?.inputFormat === "parentChild"
              ? "text-base font-semibold"
              : "hidden"
          }
        >
          {settings.language == "en" ? "Child Array" : "子节点数组"}
        </h4>
        <textarea
          wrap="off"
          name="graphInputChild"
          id={"graphInputChild" + inputId}
          rows={1}
          defaultValue={"1 2 3 4 5 6 7 8 9"}
          onChange={processGraphInput}
          onKeyDown={handleTextAreaKeyDown}
          className={
            testCases.get(inputId)?.inputFormat === "parentChild"
              ? `bg-ovr font-semibold font-jetbrains resize-none border-2
                rounded-md px-2 py-1 border-single focus:outline-none text-lg
                border-border focus:border-border-active w-auto no-scrollbar`
              : "hidden"
          }
        ></textarea>

        <h4
          className={
            testCases.get(inputId)?.inputFormat === "parentChild"
              ? "text-base font-semibold"
              : "hidden"
          }
        >
          {settings.language == "en" ? "Edge Labels" : "边标签"}
        </h4>
        <textarea
          wrap="off"
          name="graphInputEdgeLabels"
          id={"graphInputEdgeLabels" + inputId}
          rows={1}
          onChange={processGraphInput}
          onKeyDown={handleTextAreaKeyDown}
          className={
            testCases.get(inputId)?.inputFormat === "parentChild"
              ? `bg-ovr font-semibold font-jetbrains resize-none border-2
                rounded-md px-2 py-1 border-single focus:outline-none text-lg
                border-border focus:border-border-active w-auto no-scrollbar`
              : "hidden"
          }
        ></textarea>

        <div className="flex justify-between">
          <button
            className="bg-clear-normal hover:bg-clear-hover
              active:bg-clear-active inline rounded-md px-2 py-1"
            onClick={() => {
              if (testCases.get(inputId)?.inputFormat === "edges") {
                (
                  document.getElementById(
                    "graphInputEdges" + inputId,
                  ) as HTMLTextAreaElement
                ).value = "";
              } else {
                (
                  document.getElementById(
                    "graphInputParent" + inputId,
                  ) as HTMLTextAreaElement
                ).value = "";
              }
              processGraphInput();
            }}
          >
            {settings.language == "en" ? "Clear" : "清除"}
          </button>
          {inputStatus ? (
            <span
              className="font-jetbrains bg-format-ok rounded-md text-right px-2
                py-1 inline"
            >
              {settings.language == "en" ? "Format: OK" : "格式：良好"}
            </span>
          ) : (
            <span
              className="font-jetbrains bg-format-bad rounded-md text-right px-2
                py-1 inline"
            >
              {settings.language == "en" ? "Format: BAD" : "格式：错误"}
            </span>
          )}
          <button
            className="bg-randomize hover:bg-randomize-hover
              active:bg-randomize-active inline rounded-md px-2 py-1"
            onClick={() => {
              const inputFormat = testCases.get(inputId)!.inputFormat;
              const us = [],
                vs = [];
              const n = 2 + Math.floor(Math.random() * 9);
              for (let i = 0; i < n; i++) {
                let u = 0,
                  v = 0;
                while (u == v) {
                  u = 1 + Math.floor(Math.random() * 9);
                  v = 1 + Math.floor(Math.random() * 9);
                }
                us.push(u);
                vs.push(v);
              }
              if (inputFormat === "edges") {
                let edges = document.getElementById(
                  "graphInputEdges" + inputId,
                ) as HTMLTextAreaElement;
                let s = "";
                for (let i = 0; i < n; i++) {
                  s += us[i].toString() + " " + vs[i].toString();
                  if (i != n - 1) s += "\n";
                }
                edges.value = s;
              } else {
                let ps = document.getElementById(
                  "graphInputParent" + inputId,
                ) as HTMLTextAreaElement;
                let cs = document.getElementById(
                  "graphInputChild" + inputId,
                ) as HTMLTextAreaElement;
                ps.value = us.join(" ");
                cs.value = vs.join(" ");
              }
              processGraphInput();
            }}
          >
            {settings.language == "en" ? "Randomize" : "随机"}
          </button>
        </div>
      </li>
    </>
  );
}
