import { InputTabs } from "./components/InputTabs";

import { GraphCanvas } from "./components/GraphCanvas";
import { GraphSettings } from "./components/GraphSettings";

import { InitScreen } from "./components/InitScreen";
import { RandomizerScreen } from "./components/RandomizerScreen";

import { Settings } from "./types";
import { SettingsFormat } from "./types";
import { TestCase, TestCases } from "./types";
import { Randomizer } from "./types";
import { SettingsFormatList } from "./types";

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
    language:
      localStorage.getItem("language") !== null
        ? (localStorage.getItem("language")! as "en" | "cn")
        : "en",
    drawMode: "node",
    expandedCanvas: false,
    markBorder: "double",
    markColor: 1,
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
    edgeBorderWidthHalf:
      localStorage.getItem("edgeBorderWidthHalf") !== null
        ? Number.parseFloat(localStorage.getItem("edgeBorderWidthHalf")!)
        : 1,
    edgeLength:
      localStorage.getItem("edgeLength") !== null
        ? Number.parseFloat(localStorage.getItem("edgeLength")!)
        : 10,
    edgeLabelSeparation:
      localStorage.getItem("edgeLabelSeparation") !== null
        ? Number.parseFloat(localStorage.getItem("edgeLabelSeparation")!)
        : 10,
    penThickness:
      localStorage.getItem("penThickness") !== null
        ? Number.parseFloat(localStorage.getItem("penThickness")!)
        : 1,
    penTransparency:
      localStorage.getItem("penTransparency") !== null
        ? Number.parseFloat(localStorage.getItem("penTransparency")!)
        : 0,
    eraserRadius:
      localStorage.getItem("eraserRadius") !== null
        ? Number.parseFloat(localStorage.getItem("eraserRadius")!)
        : 10,
    tension:
      localStorage.getItem("tension") !== null
        ? Number.parseFloat(localStorage.getItem("tension")!)
        : 1.6,
    nodeRepulsion:
      localStorage.getItem("nodeRepulsion") !== null
        ? Number.parseFloat(localStorage.getItem("nodeRepulsion")!)
        : 0.0,
    testCaseBoundingBoxes: true,
    showComponents: false,
    showEBCC: false,
    showVBCC: false,
    showBridges: false,
    showMSTs: false,
    treeMode: false,
    bipartiteMode: false,
    lockMode: false,
    markedNodes:
      localStorage.getItem("markedNodes") !== null
        ? localStorage.getItem("markedNodes") == "true"
        : false,
    fixedMode: false,
    multiedgeMode: true,
    settingsFormat:
      localStorage.getItem("settingsFormat") !== null &&
      SettingsFormatList.includes(
        localStorage.getItem("settingsFormat") as string,
      )
        ? (localStorage.getItem("settingsFormat") as SettingsFormat)
        : "modes",
    gridMode: false,
  });

  const [init, setInit] = useState<boolean>(false);
  const [randomizer, setRandomizer] = useState<boolean>(false);

  const [randomizerConfig, setRandomizerConfig] = useState<Randomizer>({
    indexing:
      localStorage.getItem("randomizerIndexing") !== null
        ? parseInt(localStorage.getItem("randomizerIndexing")!)
        : 0,
    nodeCount:
      localStorage.getItem("randomizerNodeCount") !== null
        ? localStorage.getItem("randomizerNodeCount")!
        : "",
    edgeCount:
      localStorage.getItem("randomizerEdgeCount") !== null
        ? localStorage.getItem("randomizerEdgeCount")!
        : "",
    connected:
      localStorage.getItem("randomizerConnected") !== null
        ? localStorage.getItem("randomizerConnected")! == "true"
        : false,
    tree:
      localStorage.getItem("randomizerTree") !== null
        ? localStorage.getItem("randomizerTree")! == "true"
        : false,
    hasNodeLabel:
      localStorage.getItem("randomizerHasNodeLabel") !== null
        ? localStorage.getItem("randomizerHasNodeLabel")! == "true"
        : false,
    nodeLabelMin:
      localStorage.getItem("randomizerNodeLabelMin") !== null
        ? localStorage.getItem("randomizerNodeLabelMin")!
        : "",
    nodeLabelMax:
      localStorage.getItem("randomizerNodeLabelMax") !== null
        ? localStorage.getItem("randomizerNodeLabelMax")!
        : "",
    hasEdgeLabel:
      localStorage.getItem("randomizerHasEdgeLabel") !== null
        ? localStorage.getItem("randomizerHasEdgeLabel")! == "true"
        : false,
    edgeLabelMin:
      localStorage.getItem("randomizerEdgeLabelMin") !== null
        ? localStorage.getItem("randomizerEdgeLabelMin")!
        : "",
    edgeLabelMax:
      localStorage.getItem("randomizerEdgeLabelMax") !== null
        ? localStorage.getItem("randomizerEdgeLabelMax")!
        : "",
  });

  return (
    <>
      <div
        className={
          settings.darkMode
            ? `dark bg-ovr text-text absolute w-full overflow-scroll
              no-scrollbar`
            : `light bg-ovr text-text absolute w-full overflow-scroll
              no-scrollbar`
        }
      >
        <div
          className="font-jetbrains text-base sm:top-2 lg:top-2 sm:left-2
            lg:left-2 absolute space-x-2 flex border-2 border-border rounded-lg
            px-2 py-1 justify-between items-center hover:border-border-hover
            z-20 bg-block group h-9"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
          {settings.language == "en" ? "Changelog" : "更新记录"}
          <div
            className="absolute border-2 text-sm px-2 py-1 border-border-hover
              rounded-lg bg-block -left-2 top-8 w-100 invisible
              group-hover:visible max-h-28 no-scrollbar overflow-scroll"
          >
            <p>15 Aug 2025</p>
            <ul className="list-disc list-inside">
              <li>Support edge coloring</li>
            </ul>
            <hr className="border-dashed border-border" />
            <p>5 June 2025</p>
            <ul className="list-disc list-inside">
              <li>Improve annotation experience</li>
              <li>Add randomizer config</li>
              <li>Add "Init" system</li>
            </ul>
            <hr className="border-dashed border-border" />
            <p>24 Feb 2025</p>
            <ul className="list-disc list-inside">
              <li>Use SVG icons instead</li>
              <li>Adjust layout positioning</li>
            </ul>
            <hr className="border-dashed border-border" />
            <p>8 Feb 2025</p>
            <ul className="list-disc list-inside">
              <li>Add Chinese translations</li>
            </ul>
            <hr className="border-dashed border-border" />
            <p>4 Feb 2025</p>
            <ul className="list-disc list-inside">
              <li>
                Make node background <b>transparent</b> by default
              </li>
              <li>
                Add <b>draw</b> and <b>erase</b> modes
              </li>
            </ul>
            <hr className="border-dashed border-border" />
            <p>9 Dec 2024</p>
            <ul className="list-disc list-inside">
              <li>Add toggle button to expand/shrink canvas</li>
            </ul>
            <hr className="border-dashed border-border" />
            <p>7 Dec 2024</p>
            <ul className="list-disc list-inside">
              <li>
                Add <b>palette</b> to color nodes on click
              </li>
              <li>Allow user to disable marking behavior</li>
            </ul>
            <hr className="border-dashed border-border" />
            <p>6 Dec 2024</p>
            <ul className="list-disc list-inside">
              <li>Add minimum spanning tree(s)</li>
            </ul>
            <hr className="border-dashed border-border" />
            <p>5 Dec 2024</p>
            <ul className="list-disc list-inside">
              <li>Support multiple graphs (aka testcases)</li>
              <li>
                Split settings into <b>general</b> and <b>appearance</b>
              </li>
              <li>
                Add <b>bipartite mode</b>
              </li>
            </ul>
            <hr className="border-dashed border-border" />
            <p>11 Nov 2024</p>
            <ul className="list-disc list-inside">
              <li>
                Add <b>multiedge mode</b> (enabled by default)
              </li>
              <li>
                Add <b>fixed mode</b> (fix/unfix marked nodes)
              </li>
            </ul>
            <hr className="border-dashed border-border" />
            <p>10 Nov 2024</p>
            <ul className="list-disc list-inside">
              <li>Mark/Unmark nodes on click</li>
            </ul>
          </div>
        </div>

        <div
          className="sm:top-2 lg:top-2 sm:right-2 lg:right-2 absolute flex
            space-x-3 font-jetbrains text-base"
        >
          <div
            className="flex space-x-2 border-2 border-border rounded-lg
              justify-between items-center z-20 px-2 h-9"
          >
            <button
              className={
                settings.language == "en" ? "text-selected" : "text-text"
              }
              onClick={() => {
                setSettings({ ...settings, language: "en" });
                localStorage.setItem("language", "en");
              }}
            >
              EN
            </button>
            <div>|</div>
            <button
              className={
                settings.language == "cn" ? "text-selected" : "text-text"
              }
              onClick={() => {
                setSettings({ ...settings, language: "cn" });
                localStorage.setItem("language", "cn");
              }}
            >
              中文
            </button>
          </div>
          <a
            className="space-x-2 flex border-2 border-border rounded-lg px-2
              py-1 justify-between items-center hover:border-border-hover z-20
              bg-block h-9"
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
        </div>

        {init ? (
          <InitScreen
            settings={settings}
            setInit={setInit}
            testCaseNumber={testCaseNumber}
            setTestCaseNumber={setTestCaseNumber}
            setTestCases={setTestCases}
            setTabs={setTabs}
            setCurrentId={setCurrentId}
          />
        ) : (
          <></>
        )}

        {randomizer ? (
          <RandomizerScreen
            settings={settings}
            setRandomizer={setRandomizer}
            randomizerConfig={randomizerConfig}
            setRandomizerConfig={setRandomizerConfig}
          />
        ) : (
          <></>
        )}

        <InputTabs
          settings={settings}
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
          setInit={setInit}
          setRandomizer={setRandomizer}
          randomizerConfig={randomizerConfig}
        />

        <div className="relative z-0">
          <GraphCanvas
            testCases={testCases}
            directed={directed}
            settings={settings}
            setSettings={setSettings}
          />
        </div>

        {settings.expandedCanvas ? (
          <></>
        ) : (
          <GraphSettings
            directed={directed}
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </div>
    </>
  );
}

export default App;
