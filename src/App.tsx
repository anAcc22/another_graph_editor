import { GraphInput } from "./components/GraphInput";
import { GraphCanvas } from "./components/GraphCanvas";
import { GraphSettings } from "./components/GraphSettings";

import { Settings } from "./types";
import { Graph } from "./types";

import { useState } from "react";

function App() {
  const [graph, setGraph] = useState<Graph>({
    nodes: new Array<string>(),
    adj: new Map<string, string[]>(),
    rev: new Map<string, string[]>(),
    edges: new Array<string>(),
  });
  const [directed, setDirected] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>({
    showComponents: false,
    treeMode: false,
    lockMode: false,
  });

  const updateGraph = (graph: Graph) => setGraph(graph);
  const updateDirected = (directed: boolean) => setDirected(directed);
  const updateSettings = (settings: Settings) => setSettings(settings);

  return (
    <>
      <GraphInput
        updateGraph={updateGraph}
        directed={directed}
        updateDirected={updateDirected}
      />
      <GraphCanvas graph={graph} directed={directed} settings={settings} />
      <GraphSettings settings={settings} updateSettings={updateSettings} />
    </>
  );
}

export default App;
