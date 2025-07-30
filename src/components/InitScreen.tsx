import { useState } from "react";
import { Settings, TestCases } from "../types";

import { initPreviewMap } from "./presets";
import { initNameMap } from "./presets";
import { initBuildMap } from "./presets";

interface Props {
  settings: Settings;
  setInit: React.Dispatch<React.SetStateAction<boolean>>;
  testCaseNumber: number;
  setTestCaseNumber: React.Dispatch<React.SetStateAction<number>>;
  setTestCases: React.Dispatch<React.SetStateAction<TestCases>>;
  setTabs: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrentId: React.Dispatch<React.SetStateAction<number>>;
}

const options = 10;
const idxs = new Array<number>();

for (let i = 0; i < options; i++) {
  idxs.push(i);
}

export function InitScreen({
  settings,
  setInit,
  testCaseNumber,
  setTestCaseNumber,
  setTestCases,
  setTabs,
  setCurrentId,
}: Props) {
  const [selected, setSelected] = useState<number>(0);
  const [indexing, setIndexing] = useState<number>(1);

  return (
    <>
      <div
        className="fixed w-full h-full bg-ovr-darkened bg-opacity-80 z-50
          flex font-jetbrains overflow-scroll"
        onClick={() => setInit(false)}
      >
        <div
          className="flex-col flex lg:flex-row space-x-0 lg:space-x-16
            space-y-16 lg:space-y-0 m-auto items-start"
        >
          <div
            className={`font-jetbrains flex flex-col border-2 rounded-lg
              bg-block shadow-shadow shadow border-border
              hover:border-border-hover p-3 space-y-3 w-100 max-h-200
              overflow-scroll no-scrollbar`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h4 className="text-base font-semibold">
                {settings.language == "en" ? "Presets" : "预设"}
              </h4>
              <div>
                <button
                  className={
                    indexing === 0
                      ? "px-2 bg-clear-hover rounded-l-md"
                      : `px-2 bg-ovr-darkened bg-opacity-50 hover:bg-clear-hover
                        hover:bg-opacity-50 rounded-l-md`
                  }
                  onClick={() => setIndexing(0)}
                >
                  {settings.language == "en" ? "0-indexed" : "0-索引"}
                </button>
                <button
                  className={
                    indexing === 1
                      ? "px-2 bg-clear-hover rounded-r-md"
                      : `px-2 bg-ovr-darkened bg-opacity-50 rounded-r-md
                        hover:bg-clear-hover hover:bg-opacity-50`
                  }
                  onClick={() => setIndexing(1)}
                >
                  {settings.language == "en" ? "1-indexed" : "1-索引"}
                </button>
              </div>
            </div>
            <div className="flex-col space-y-3">
              {idxs.map((idx: number) => (
                <button
                  key={idx}
                  className={
                    idx === selected
                      ? "w-full bg-clear-hover px-2 py-1 rounded-md"
                      : `w-full bg-ovr-darkened bg-opacity-50 px-2 py-1
                        rounded-md hover:bg-clear-hover hover:bg-opacity-50`
                  }
                  onClick={() => setSelected(idx)}
                >
                  {initNameMap.get(idx + settings.language) ?? ""}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`font-jetbrains flex flex-col border-2 rounded-lg
              bg-block shadow-shadow shadow border-border
              hover:border-border-hover p-3 space-y-3 w-80`}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-base font-semibold">
              {settings.language == "en" ? "Preview" : "示例"}
            </h4>
            <textarea
              wrap="off"
              name="initPreview"
              id={"initPreview"}
              rows={
                initPreviewMap.get([selected, indexing].join(" "))?.split("\n")
                  .length
              }
              value={initPreviewMap.get([selected, indexing].join(" ")) ?? ""}
              readOnly
              className="bg-ovr font-semibold font-jetbrains resize-none
                border-2 rounded-md px-2 py-1 border-single focus:outline-none
                text-lg text-current-nodes border-border w-auto no-scrollbar"
            ></textarea>
          </div>

          <div
            className={`font-jetbrains flex flex-col border-2 rounded-lg
              bg-block shadow-shadow shadow border-border
              hover:border-border-hover p-3 space-y-3 w-80`}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-base font-semibold">
              {settings.language == "en" ? "Input" : "输入"}
            </h4>
            <textarea
              wrap="off"
              name="initInput"
              id={"initInput"}
              rows={20}
              className={`bg-ovr font-semibold font-jetbrains resize-none
                border-2 rounded-md px-2 py-1 border-single focus:outline-none
                text-lg border-border focus:border-border-active w-auto
                no-scrollbar`}
            ></textarea>
            <div className="text-format-bad-border text-sm">
              {settings.language == "en"
                ? "WARN: This will override all data!"
                : "警告: 这会覆盖当前所有数据!"}
            </div>

            <div className="flex justify-between">
              <button
                className={`h-7 border-2 border-format-bad-border bg-block
                  rounded-md px-2 py-1 inline-flex items-center justify-center
                  hover:bg-format-bad-border hover:bg-opacity-20
                  active:bg-opacity-50 font-semibold text-format-bad-border`}
                onClick={() => setInit(false)}
              >
                {settings.language == "en" ? "Cancel" : "取消"}
              </button>
              <button
                className={`h-7 border-2 border-format-ok-border bg-block
                  rounded-md px-2 py-1 inline-flex items-center justify-center
                  hover:bg-format-ok-border hover:bg-opacity-20
                  active:bg-opacity-50 font-semibold text-format-ok-border`}
                onClick={() => {
                  let initInput = (
                    document.getElementById("initInput") as HTMLTextAreaElement
                  ).value
                    .split("\n")
                    .map((row) => row.trim())
                    .filter((row) => row.length >= 1)
                    .map((row) => row.split(/\s+/));
                  initBuildMap.get(selected)!(
                    indexing,
                    initInput,
                    testCaseNumber,
                    setTestCaseNumber,
                    setTestCases,
                    setTabs,
                    setCurrentId,
                  );
                  setInit(false);
                }}
              >
                {settings.language == "en" ? "Confirm" : "确定"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
