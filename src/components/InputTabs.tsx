import { Settings, TestCases } from "../types";
import { GraphInput } from "./GraphInput";
import { InputTab } from "./InputTab";
import { getDefaultGraph } from "./utils";

import { useEffect } from "react";

interface Props {
  settings: Settings;
  tabs: number[];
  setTabs: React.Dispatch<React.SetStateAction<number[]>>;
  inputs: number[];
  setInputs: React.Dispatch<React.SetStateAction<number[]>>;
  testCases: TestCases;
  setTestCases: React.Dispatch<React.SetStateAction<TestCases>>;
  testCaseNumber: number;
  setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>;
  currentId: number;
  setCurrentId: React.Dispatch<React.SetStateAction<number>>;
  directed: boolean;
  setDirected: React.Dispatch<React.SetStateAction<boolean>>;
}

export function InputTabs({
  settings,
  tabs,
  setTabs,
  inputs,
  setInputs,
  testCases,
  setTestCases,
  testCaseNumber,
  setTestCaseNumber,
  currentId,
  setCurrentId,
  directed,
  setDirected,
}: Props) {
  useEffect(() => {
    const newInputs: number[] = [];
    testCases.forEach((_, caseNumber) => {
      newInputs.push(caseNumber);
    });
    setInputs(newInputs);
  }, [testCases]);

  return (
    <>
      <div
        className="font-jetbrains flex flex-col m-0 lg:absolute lg:top-1/10
          lg:w-1/4 hover:border-border-hover lg:left-1/24 xl:left-5/200 xl:w-1/5
          space-y-3 z-10 sm:ml-1/16 sm:mt-1/8 sm:mr-1/16 lg:m-0"
      >
        <div className="no-scrollbar overflow-scroll">
          <div className="h-8"></div>
          <div className="flex space-x-3">
            {tabs.map((tab, idx) => (
              <InputTab
                key={tab}
                tabId={tab}
                positionIdx={idx}
                currentId={currentId}
                tabs={tabs}
                setTabs={setTabs}
                setCurrentId={setCurrentId}
                setTestCases={setTestCases}
              />
            ))}
            <button
              className="hover:bg-format-ok-hover duration-500 ease-in-out
                transition hover:rounded-3xl bg-format-ok rounded-md px-2 py-1
                w-7 h-7 inline-flex items-center justify-center border-2
                border-format-ok-border active:bg-format-ok-active font-semibold"
              onClick={() => {
                const newTabId = testCaseNumber + 1;
                setTestCaseNumber((testCaseNumber) => testCaseNumber + 1);
                setTestCases((testCases) => {
                  const newTestCases = new Map(testCases);
                  newTestCases.set(newTabId, {
                    graphEdges: getDefaultGraph(),
                    graphParChild: getDefaultGraph(),
                    inputFormat: "edges",
                  });
                  return newTestCases;
                });
                setTabs((tabs) => [...tabs, newTabId]);
                setCurrentId(newTabId);
              }}
            >
              +
            </button>
          </div>
        </div>

        <ul>
          {inputs.map((input) => (
            <GraphInput
              settings={settings}
              key={input}
              testCases={testCases}
              setTestCases={setTestCases}
              inputId={input}
              currentId={currentId}
              directed={directed}
              setDirected={setDirected}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
