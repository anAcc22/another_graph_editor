import { parseGraphInputEdges } from "./parseGraphInput";
import { parseGraphInputParentChild } from "./parseGraphInput";
import { useEffect, useState } from "react";
import { ParsedGraph } from "../types";
import { Graph } from "../types";

interface Props {
  updateGraph: (graph: Graph) => void;
  directed: boolean;
  updateDirected: (directed: boolean) => void;
}

const EMPTY_GRAPH: Graph = {
  nodes: new Array<string>(),
  adj: new Map<string, string[]>(),
  rev: new Map<string, string[]>(),
  edges: new Array<string>(),
};

type InputFormat = "edges" | "parentChild";

export function GraphInput({ updateGraph, directed, updateDirected }: Props) {
  const [inputStatus, setInputStatus] = useState<boolean>(true);
  const [inputFormat, setInputFormat] = useState<InputFormat>("edges");

  const processGraphInput = () => {
    let parsedGraph: ParsedGraph;

    if (inputFormat === "edges") {
      parsedGraph = parseGraphInputEdges(
        (document.getElementById("graphInputEdges") as HTMLTextAreaElement)
          .value,
      );
    } else {
      parsedGraph = parseGraphInputParentChild(
        (document.getElementById("graphInputParent") as HTMLTextAreaElement)
          .value,
        (document.getElementById("graphInputChild") as HTMLTextAreaElement)
          .value,
      );
    }

    if (parsedGraph.status === "BAD") {
      setInputStatus(false);
    } else {
      setInputStatus(true);
      updateGraph(parsedGraph.graph!);
    }
  };

  useEffect(() => {
    processGraphInput();
    window.addEventListener("resize", processGraphInput);
    return () => {
      window.removeEventListener("resize", processGraphInput);
    };
  }, []);

  useEffect(() => {
    updateGraph(EMPTY_GRAPH);
  }, [inputFormat]);

  return (
    <>
      <div
        className="font-jetbrains flex flex-col border-2 rounded-lg bg-slate-50
          shadow-sm border-slate-100 sm:ml-1/8 sm:mt-1/8 sm:mr-1/8 lg:m-0
          lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-1/4 lg:left-1/24
          xl:left-5/200 xl:w-1/5 p-3 space-y-3"
      >
        <h3 className="font-bold text-lg">Graph Data</h3>

        <div className="flex font-light text-sm justify-between">
          <span>
            <span>
              {inputFormat === "edges" ? (
                <span className="text-amber-700 p-0 hover:cursor-pointer">
                  Edges
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    setInputFormat("edges");
                    let checkbox = document.getElementById(
                      "inputFormatCheckbox",
                    ) as HTMLInputElement;
                    checkbox.checked = false;
                  }}
                >
                  Edges
                </span>
              )}
            </span>
            <span> | </span>
            <span>
              {inputFormat === "parentChild" ? (
                <span className="text-amber-700 p-0 hover:cursor-pointer">
                  Parent-Child
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    setInputFormat("parentChild");
                    let checkbox = document.getElementById(
                      "inputFormatCheckbox",
                    ) as HTMLInputElement;
                    checkbox.checked = true;
                  }}
                >
                  Parent-Child
                </span>
              )}
            </span>
          </span>
          <label className="relative inline w-9">
            <input
              onClick={() =>
                setInputFormat(
                  inputFormat === "edges" ? "parentChild" : "edges",
                )
              }
              type="checkbox"
              id="inputFormatCheckbox"
              className="peer invisible"
            />
            <span
              className="absolute top-0 left-0 w-9 h-5 cursor-pointer
                rounded-full bg-slate-300 border-none transition-all duration-75
                hover:bg-slate-400 peer-checked:bg-slate-600"
            ></span>
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 bg-slate-50
                rounded-full transition-all duration-75 cursor-pointer
                peer-checked:translate-x-4"
            ></span>
          </label>
        </div>

        <div className="flex font-light text-sm justify-between">
          <span>
            <span>
              {!directed ? (
                <span className="text-amber-700 p-0 hover:cursor-pointer">
                  Undirected
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    updateDirected(false);
                    let checkbox = document.getElementById(
                      "directedCheckbox",
                    ) as HTMLInputElement;
                    checkbox.checked = false;
                  }}
                >
                  Undirected
                </span>
              )}
            </span>
            <span> | </span>
            <span>
              {directed ? (
                <span className="text-amber-700 p-0 hover:cursor-pointer">
                  Directed
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    updateDirected(true);
                    let checkbox = document.getElementById(
                      "directedCheckbox",
                    ) as HTMLInputElement;
                    checkbox.checked = true;
                  }}
                >
                  Directed
                </span>
              )}
            </span>
          </span>
          <label className="relative inline w-9">
            <input
              onClick={() => updateDirected(!directed)}
              type="checkbox"
              id="directedCheckbox"
              className="peer invisible"
            />
            <span
              className="absolute top-0 left-0 w-9 h-5 cursor-pointer
                rounded-full bg-slate-300 border-none transition-all duration-75
                hover:bg-slate-400 peer-checked:bg-slate-600"
            ></span>
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 bg-slate-50
                rounded-full transition-all duration-75 cursor-pointer
                peer-checked:translate-x-4"
            ></span>
          </label>
        </div>

        {inputFormat === "edges" ? (
          <textarea
            name="graphInputEdges"
            id="graphInputEdges"
            onChange={() => processGraphInput()}
            rows={8}
            className="font-semibold font-jetbrains resize-none border-2
              rounded-md p-2 border-single focus:outline-none text-lg
              border-slate-200 focus:border-slate-400"
          ></textarea>
        ) : (
          <></>
        )}

        {inputFormat === "parentChild" ? (
          <>
            <h4 className="text-base decoration-solid underline">
              Parent Array
            </h4>
            <textarea
              name="graphInputParent"
              id="graphInputParent"
              rows={1}
              onChange={() => processGraphInput()}
              className="font-semibold font-jetbrains resize-none border-2
                rounded-md p-2 border-single focus:outline-none text-lg
                border-slate-200 focus:border-slate-400"
            ></textarea>
            <h4 className="text-base decoration-solid underline">
              Child Array
            </h4>
            <textarea
              name="graphInputChild"
              id="graphInputChild"
              rows={1}
              defaultValue={"1 2 3 4 5 6 7 8 9"}
              onChange={() => processGraphInput()}
              className="font-semibold font-jetbrains resize-none border-2
                rounded-md p-2 border-single focus:outline-none text-lg
                border-slate-200 focus:border-slate-400"
            ></textarea>
          </>
        ) : (
          <></>
        )}

        <div className="flex justify-between">
          <button
            className="bg-amber-500 hover:bg-amber-400 active:bg-amber-300
              inline rounded-md px-2 py-1"
            onClick={() => {
              if (inputFormat === "edges") {
                (
                  document.getElementById(
                    "graphInputEdges",
                  ) as HTMLTextAreaElement
                ).value = "";
              } else {
                (
                  document.getElementById(
                    "graphInputParent",
                  ) as HTMLTextAreaElement
                ).value = "";
              }
              processGraphInput();
            }}
          >
            Clear
          </button>
          {inputStatus ? (
            <span
              className="font-jetbrains bg-emerald-500 rounded-md text-right
                px-2 py-1 inline"
            >
              Format: OK
            </span>
          ) : (
            <span
              className="font-jetbrains bg-rose-500 rounded-md text-right px-2
                py-1 inline"
            >
              Format: BAD
            </span>
          )}
        </div>
      </div>
    </>
  );
}
