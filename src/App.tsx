import { GraphInput } from "./components/GraphInput";
import { GraphCanvas } from "./components/GraphCanvas";
import { Graph } from "./types";
import { useState } from "react";

function App() {
  const [graph, setGraph] = useState<Graph>({
    nodes: new Array<string>(),
    adj: new Map<string, string[]>(),
    edges: new Array<string>(),
  });
  const updateGraph = (graph: Graph) => setGraph(graph);
  return (
    <>
      <GraphInput updateGraph={updateGraph} />
      <GraphCanvas graph={graph} />
    </>
  );
}

export default App;
