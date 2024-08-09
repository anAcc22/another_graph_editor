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
  const [directed, setDirected] = useState<boolean>(false);

  const updateGraph = (graph: Graph) => setGraph(graph);
  const updateDirected = (directed: boolean) => setDirected(directed);

  return (
    <>
      <GraphInput
        updateGraph={updateGraph}
        directed={directed}
        updateDirected={updateDirected}
      />
      <GraphCanvas graph={graph} directed={directed} />
    </>
  );
}

export default App;
