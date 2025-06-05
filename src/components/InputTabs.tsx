import { Settings, TestCases } from "../types";
import { GraphInput } from "./GraphInput";
import { InputTab } from "./InputTab";
import { createTestCase } from "./createTestCase";
import { Randomizer } from "../types";

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
  setInit: React.Dispatch<React.SetStateAction<boolean>>;
  setRandomizer: React.Dispatch<React.SetStateAction<boolean>>;
  randomizerConfig: Randomizer;
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
  setInit,
  setRandomizer,
  randomizerConfig,
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
          <div className="flex space-x-3 justify-between">
            <div className="flex space-x-3 overflow-scroll no-scrollbar pt-8">
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
                  border-format-ok-border active:bg-format-ok-active
                  font-semibold"
                onClick={() => {
                  createTestCase(
                    testCaseNumber,
                    setTestCaseNumber,
                    setTestCases,
                    setTabs,
                    setCurrentId,
                    {
                      nodeLabels: "",
                      roots: "",
                      edges: "",
                    },
                    undefined,
                  );
                }}
              >
                +
              </button>
            </div>

            <button
              className={`h-7 border-2 border-border bg-block
                hover:border-border-hover hover:bg-bg-tab-hover rounded-md px-2
                py-1 inline-flex items-center justify-center
                active:bg-tab-active font-semibold mt-8`}
              onClick={() => setInit(true)}
            >
              {settings.language == "en" ? "Init" : "导入"}
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
              setRandomizer={setRandomizer}
              randomizerConfig={randomizerConfig}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
