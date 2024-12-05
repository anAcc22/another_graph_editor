import { InputTabs } from "./components/InputTabs";

import { GraphCanvas } from "./components/GraphCanvas";
import { GraphSettings } from "./components/GraphSettings";

import { Settings } from "./types";
import { TestCase, TestCases } from "./types";

import { getDefaultGraph } from "./components/utils";

import { useState } from "react";

function App() {
  const [testCaseNumber, setTestCaseNumber] = useState<number>(0);
  const [currentId, setCurrentId] = useState<number>(0);
  const [testCases, setTestCases] = useState<TestCases>(() => {
    const init = new Map<number, TestCase>();
    init.set(0, {
      graphEdges: getDefaultGraph(),
      graphParChild: getDefaultGraph(),
      inputFormat: "edges",
    });
    return init;
  });

  const [directed, setDirected] = useState<boolean>(false);

  const [tabs, setTabs] = useState<number[]>([0]);
  const [inputs, setInputs] = useState<number[]>([0]);

  const [settings, setSettings] = useState<Settings>({
    labelOffset: 0,
    darkMode:
      localStorage.getItem("darkMode") !== null
        ? localStorage.getItem("darkMode") === "true"
        : false,
    nodeRadius:
      localStorage.getItem("nodeRadius") !== null
        ? Number.parseInt(localStorage.getItem("nodeRadius")!)
        : 16,
    fontSize:
      localStorage.getItem("fontSize") !== null
        ? Number.parseInt(localStorage.getItem("fontSize")!)
        : 10,
    nodeBorderWidthHalf:
      localStorage.getItem("nodeBorderWidthHalf") !== null
        ? Number.parseFloat(localStorage.getItem("nodeBorderWidthHalf")!)
        : 1,
    edgeLength:
      localStorage.getItem("edgeLength") !== null
        ? Number.parseFloat(localStorage.getItem("edgeLength")!)
        : 10,
    edgeLabelSeparation:
      localStorage.getItem("edgeLabelSeparation") !== null
        ? Number.parseFloat(localStorage.getItem("edgeLabelSeparation")!)
        : 10,
    showComponents: false,
    showBridges: false,
    treeMode: false,
    bipartiteMode: false,
    lockMode: false,
    fixedMode: false,
    multiedgeMode: true,
    settingsFormat: "general",
  });

  return (
    <>
      <div
        className={
          settings.darkMode
            ? "dark bg-ovr text-text absolute w-full min-h-200 overflow-scroll"
            : "light bg-ovr text-text absolute w-full min-h-200 overflow-scroll"
        }
      >
        <div
          className="font-jetbrains text-base sm:top-2 lg:top-2 sm:left-2
            lg:left-2 absolute space-x-2 flex border-2 border-border rounded-lg
            px-2 py-1 justify-between items-center hover:border-border-hover
            z-20 bg-block group"
        >
          Changelog
          <div
            className="absolute border-2 text-sm px-2 py-1 border-border-hover
              rounded-lg bg-block left-0 top-8 w-100 invisible
              group-hover:visible max-h-28 no-scrollbar overflow-scroll"
          >
            5 Dec 2024
            <ul className="list-disc list-inside">
              <li>
                Support multiple graphs (aka testcases)
              </li>
              <li>
                Split settings into <b>general</b> and <b>appearance</b>.
              </li>
              <li>
                Add <b>bipartite mode</b>
              </li>
            </ul>
            <hr className="border-dashed border-border" />
            11 Nov 2024
            <ul className="list-disc list-inside">
              <li>
                Add <b>multiedge mode</b> (enabled by default)
              </li>
              <li>
                Add <b>fixed mode</b> (fix/unfix marked nodes)
              </li>
            </ul>
            <hr className="border-dashed border-border" />
            10 Nov 2024
            <ul className="list-disc list-inside">
              <li>Mark/Unmark nodes on click</li>
            </ul>
          </div>
        </div>

        <a
          className="font-jetbrains text-base sm:top-2 lg:top-2 sm:right-2
            lg:right-2 absolute space-x-2 flex border-2 border-border rounded-lg
            px-2 py-1 justify-between items-center hover:border-border-hover
            z-20 bg-block"
          href="https://github.com/anAcc22/another_graph_editor"
        >
          {settings.darkMode ? (
            <img
              width={18}
              src="github-mark/github-mark-white.svg"
              alt="Github Logo"
            />
          ) : (
            <img
              width={18}
              src="github-mark/github-mark.svg"
              alt="Github Logo"
            />
          )}
          <div className="ml-2">Github</div>
        </a>

        <InputTabs
          tabs={tabs}
          setTabs={setTabs}
          inputs={inputs}
          setInputs={setInputs}
          testCases={testCases}
          setTestCases={setTestCases}
          testCaseNumber={testCaseNumber}
          setTestCaseNumber={setTestCaseNumber}
          currentId={currentId}
          setCurrentId={setCurrentId}
          directed={directed}
          setDirected={setDirected}
        />

        <div className="relative z-0">
          <GraphCanvas
            testCases={testCases}
            directed={directed}
            settings={settings}
          />
        </div>

        <GraphSettings
          directed={directed}
          settings={settings}
          setSettings={setSettings}
        />
      </div>
    </>
  );
}

export default App;
