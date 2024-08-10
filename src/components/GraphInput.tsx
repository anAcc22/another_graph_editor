import { parseGraphInput } from "./parseGraphInput";
import { useEffect, useState } from "react";
import { Graph } from "../types";

interface Props {
  updateGraph: (graph: Graph) => void;
  directed: boolean;
  updateDirected: (directed: boolean) => void;
}

export function GraphInput({ updateGraph, directed, updateDirected }: Props) {
  const [inputStatus, setInputStatus] = useState<boolean>(true);

  const processGraphInput = () => {
    const parsedGraph = parseGraphInput(
      (document.getElementById("graphInput") as HTMLTextAreaElement).value,
    );
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

  return (
    <>
      <div
        className="font-jetbrains flex margin:auto flex-col border-2 rounded-lg
          bg-slate-50 shadow-sm border-slate-100 absolute top-1/2
          -translate-y-1/2 left-16 w-72 p-4 space-y-3"
      >
        <label htmlFor="graphInput" className="font-bold text-lg">
          Graph Data
        </label>

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
                    let directedCheckbox = document.getElementById(
                      "directedCheckbox",
                    ) as HTMLInputElement;
                    directedCheckbox.checked = false;
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
                    let directedCheckbox = document.getElementById(
                      "directedCheckbox",
                    ) as HTMLInputElement;
                    directedCheckbox.checked = true;
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

        <textarea
          name="graphInput"
          id="graphInput"
          onChange={() => processGraphInput()}
          rows={12}
          className="font-semibold font-jetbrains resize-none border-2
            rounded-md p-2 border-single focus:outline-none text-lg
            border-slate-200 focus:border-slate-400"
        ></textarea>

        <div className="flex justify-between">
          <button
            className="bg-amber-500 hover:bg-amber-400 active:bg-amber-300
              inline rounded-md px-2 py-1"
            onClick={() => {
              (
                document.getElementById("graphInput") as HTMLTextAreaElement
              ).value = "";
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
