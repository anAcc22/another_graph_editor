import { parseGraphInputEdges } from "./parseGraphInput";
import { parseGraphInputParentChild } from "./parseGraphInput";
import { useState, useEffect } from "react";

import { Settings } from "../types";
import { ParsedGraph } from "../types";
import { TestCases } from "../types";
import { Randomizer } from "../types";
import { isInteger, padNode, randInt, sortNodes } from "./utils";

import { generateRandomGraph, generateRandomNodeLabels } from "./generator";

interface Props {
  settings: Settings;
  key: number;
  testCases: TestCases;
  setTestCases: React.Dispatch<React.SetStateAction<TestCases>>;
  inputId: number;
  currentId: number;
  directed: boolean;
  setDirected: React.Dispatch<React.SetStateAction<boolean>>;
  setRandomizer: React.Dispatch<React.SetStateAction<boolean>>;
  randomizerConfig: Randomizer;
}

export function GraphInput({
  settings,
  testCases,
  setTestCases,
  inputId,
  currentId,
  directed,
  setDirected,
  setRandomizer,
  randomizerConfig,
}: Props) {
  const [inputStatus, setInputStatus] = useState<boolean>(true);
  const [randomizerError, setRandomizerError] = useState<string | undefined>(
    undefined,
  );

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

  useEffect(() => {
    setTimeout(() => processGraphInput(), 100);
  }, []);

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
              hover:border-border-hover mb-12`
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
              defaultChecked={
                testCases.get(inputId)?.inputFormat === "parentChild"
              }
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
                    localStorage.setItem("directed", "false");
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
                    localStorage.setItem("directed", "true");
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
              onClick={() => {
                const newDirected = !directed;
                setDirected(newDirected);
                localStorage.setItem("directed", newDirected.toString());
              }}
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
                py-1 flex items-center"
            >
              {settings.language == "en" ? "Format ✓" : "格式 ✓"}
            </span>
          ) : (
            <span
              className="font-jetbrains bg-format-bad rounded-md text-right px-2
                py-1 flex items-center"
            >
              {settings.language == "en" ? "Format 𝗫" : "格式 𝗫"}
            </span>
          )}
          <div
            className="bg-randomize hover:bg-randomize-hover rounded-md px-2
              py-1 flex space-x-1.5 items-center"
          >
            <button
              className="hover:opacity-50 active:text-randomize"
              onClick={() => {
                const inputFormat = testCases.get(inputId)!.inputFormat;
                try {
                  const graphEdges = generateRandomGraph(randomizerConfig);
                  let nodeLabels = "";
                  if (randomizerConfig.hasNodeLabel) {
                    nodeLabels = generateRandomNodeLabels(randomizerConfig);
                  }
                  let edgeL = 0;
                  let edgeR = 0;
                  if (randomizerConfig.hasEdgeLabel) {
                    if (
                      !isInteger(randomizerConfig.edgeLabelMin) ||
                      !isInteger(randomizerConfig.edgeLabelMax)
                    ) {
                      throw Error("invalid edge label range");
                    }
                    edgeL = parseInt(randomizerConfig.edgeLabelMin);
                    edgeR = parseInt(randomizerConfig.edgeLabelMax);
                    if (edgeR < edgeL) {
                      throw Error("invalid edge label range");
                    }
                  }
                  const left = new Set<number>();
                  for (
                    let u = 0;
                    u < parseInt(randomizerConfig.nodeCount);
                    u++
                  ) {
                    left.add(u + randomizerConfig.indexing);
                  }
                  for (const e of graphEdges) {
                    left.delete(e[0]);
                    left.delete(e[1]);
                  }
                  if (inputFormat === "edges") {
                    let edges = document.getElementById(
                      "graphInputEdges" + inputId,
                    ) as HTMLTextAreaElement;
                    let ans = "";
                    for (const u of left) ans += u + "\n";
                    for (let i = 0; i < graphEdges.length; i++) {
                      ans += graphEdges[i].join(" ");
                      if (randomizerConfig.hasEdgeLabel) {
                        ans += " " + randInt(edgeL, edgeR);
                      }
                      if (i != graphEdges.length - 1) ans += "\n";
                    }
                    edges.value = ans;
                    (
                      document.getElementById(
                        "graphInputNodeLabelsEdges" + inputId,
                      ) as HTMLTextAreaElement
                    ).value = nodeLabels;
                  } else {
                    let ps = document.getElementById(
                      "graphInputParent" + inputId,
                    ) as HTMLTextAreaElement;
                    let cs = document.getElementById(
                      "graphInputChild" + inputId,
                    ) as HTMLTextAreaElement;
                    let pAns = "";
                    let cAns = "";
                    let eAns = "";
                    for (let i = 0; i < graphEdges.length; i++) {
                      pAns += graphEdges[i][0];
                      cAns += graphEdges[i][1];
                      if (randomizerConfig.hasEdgeLabel) {
                        eAns += randInt(edgeL, edgeR);
                      }
                      if (i != graphEdges.length - 1) {
                        pAns += " ";
                        cAns += " ";
                        if (randomizerConfig.hasEdgeLabel) {
                          eAns += " ";
                        }
                      }
                    }
                    for (const u of left) {
                      pAns += " " + u;
                      cAns += " " + u;
                    }
                    ps.value = pAns;
                    cs.value = cAns;
                    (
                      document.getElementById(
                        "graphInputNodeLabelsParChild" + inputId,
                      ) as HTMLTextAreaElement
                    ).value = nodeLabels;
                    (
                      document.getElementById(
                        "graphInputEdgeLabels" + inputId,
                      ) as HTMLTextAreaElement
                    ).value = eAns;
                  }
                  setRandomizerError(undefined);
                  processGraphInput();
                } catch (error: any) {
                  console.log(error);
                  if (error.message === `n must be an integer >= 0!`) {
                    setRandomizerError(
                      settings.language === "en"
                        ? `n must be an integer >= 0!`
                        : `n 必须是非负整数!`,
                    );
                  }
                  if (error.message === `m must be an integer >= 0!`) {
                    setRandomizerError(
                      settings.language === "en"
                        ? `m must be an integer >= 0!`
                        : `m 必须是非负整数!`,
                    );
                  }
                  if (error.message === `too many edges!`) {
                    setRandomizerError(
                      settings.language === "en"
                        ? `too many edges!`
                        : `边的数量过多!`,
                    );
                  }
                  if (error.message === `insufficient edges!`) {
                    setRandomizerError(
                      settings.language === "en"
                        ? `insufficient edges!`
                        : `边的数量过少!`,
                    );
                  }
                  if (error.message === `invalid node label range`) {
                    setRandomizerError(
                      settings.language === "en"
                        ? `invalid node label range`
                        : `节点标签的范围不合法`,
                    );
                  }
                  if (error.message === `invalid edge label range`) {
                    setRandomizerError(
                      settings.language === "en"
                        ? `invalid edge label range`
                        : `边的标签的范围不合法`,
                    );
                  }
                }
              }}
            >
              {settings.language == "en" ? "Random" : "随机"}
            </button>
            <svg
              width="22px"
              height="22px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hover:cursor-pointer stroke-text hover:opacity-50
                active:stroke-randomize"
              onClick={() => setRandomizer(true)}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.7 14C10.623 14 9.74999 13.1046 9.74999 12C9.74999 10.8954 10.623 10 11.7 10C12.7769 10 13.65 10.8954 13.65 12C13.65 12.5304 13.4445 13.0391 13.0789 13.4142C12.7132 13.7893 12.2172 14 11.7 14Z"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.8841 16.063V14.721C16.8841 14.3887 17.0128 14.07 17.2419 13.835L18.1672 12.886C18.6443 12.3967 18.6443 11.6033 18.1672 11.114L17.2419 10.165C17.0128 9.93001 16.8841 9.61131 16.8841 9.27899V7.93599C16.8841 7.24398 16.3371 6.68299 15.6624 6.68299H14.353C14.029 6.68299 13.7182 6.55097 13.4891 6.31599L12.5638 5.36699C12.0867 4.87767 11.3132 4.87767 10.8361 5.36699L9.91087 6.31599C9.68176 6.55097 9.37102 6.68299 9.04702 6.68299H7.73759C7.41341 6.68299 7.10253 6.81514 6.87339 7.05034C6.64425 7.28554 6.51566 7.6045 6.51592 7.93699V9.27899C6.51591 9.61131 6.3872 9.93001 6.15809 10.165L5.23282 11.114C4.75573 11.6033 4.75573 12.3967 5.23282 12.886L6.15809 13.835C6.3872 14.07 6.51591 14.3887 6.51592 14.721V16.063C6.51592 16.755 7.06288 17.316 7.73759 17.316H9.04702C9.37102 17.316 9.68176 17.448 9.91087 17.683L10.8361 18.632C11.3132 19.1213 12.0867 19.1213 12.5638 18.632L13.4891 17.683C13.7182 17.448 14.029 17.316 14.353 17.316H15.6614C15.9856 17.3163 16.2966 17.1844 16.5259 16.9493C16.7552 16.7143 16.8841 16.3955 16.8841 16.063Z"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {randomizerError ? (
          <footer className="text-format-bad-border">
            ERROR: {randomizerError}
          </footer>
        ) : (
          <></>
        )}
      </li>
    </>
  );
}
