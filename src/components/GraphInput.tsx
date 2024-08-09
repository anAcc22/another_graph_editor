import { parseGraphInput } from "./parseGraphInput";
import { useState } from "react";
import { Graph } from "../types";

interface Props {
  updateGraph: (graph: Graph) => void;
}

export function GraphInput({ updateGraph }: Props) {
  const [inputStatus, setInputStatus] = useState<boolean>(true);
  return (
    <>
      <div
        className="font-jetbrains flex margin:auto flex-col border-2 rounded-lg
          bg-slate-50 shadow-sm border-slate-100 absolute top-1/2
          -translate-y-1/2 left-16 w-60 p-4 space-y-3"
      >
        <label htmlFor="graphInput" className="font-bold text-lg">
          Graph Data
        </label>
        <textarea
          name="graphInput"
          id="graphInput"
          onChange={(e) => {
            let parsedGraph = parseGraphInput(e.target.value);
            if (parsedGraph.status === "BAD") {
              setInputStatus(false);
            } else {
              setInputStatus(true);
              updateGraph(parsedGraph.graph!);
              // console.log(`Node Count: ${parsedGraph.graph!.nodeCnt}`);
              // parsedGraph.graph!.adj.forEach((vs, u) =>
              //   console.log(`$u: ${u}, neighbors: ${vs}`),
              // );
            }
          }}
          rows={12}
          className="font-jetbrains resize-none border-2 rounded-md p-2
            border-single focus:outline-none text-lg border-slate-200
            focus:border-slate-400"
        ></textarea>
        <div className="flex">
          <button
            className="bg-amber-500 hover:bg-amber-400 active:bg-amber-300
              inline mr-auto rounded-md px-2 py-1"
            onClick={() => {
              (
                document.getElementById("graphInput") as HTMLTextAreaElement
              ).value = "";
              let parsedGraph = parseGraphInput("");
              updateGraph(parsedGraph.graph!);
            }}
          >
            Clear
          </button>
          {inputStatus ? (
            <span
              className="font-jetbrains bg-emerald-500 ml-auto rounded-md
                text-right px-2 py-1 inline"
            >
              Format: OK
            </span>
          ) : (
            <span
              className="font-jetbrains bg-rose-500 ml-auto rounded-md
                text-right px-2 py-1 inline"
            >
              Format: BAD
            </span>
          )}
        </div>
      </div>
    </>
  );
}
