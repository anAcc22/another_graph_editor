import { TestCases } from "../types";
import { useState } from "react";

interface Props {
  key: number;
  tabId: number;
  positionIdx: number;
  currentId: number;
  tabs: number[];
  setTabs: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrentId: React.Dispatch<React.SetStateAction<number>>;
  setTestCases: React.Dispatch<React.SetStateAction<TestCases>>;
}

export function InputTab({
  tabId,
  positionIdx,
  currentId,
  tabs,
  setTabs,
  setCurrentId,
  setTestCases,
}: Props) {
  const [isHoveredMain, setIsHoveredMain] = useState<boolean>(false);
  const [isHoveredSide, setIsHoveredSide] = useState<boolean>(false);

  return (
    <div>
      <button
        className={
          currentId === tabId
            ? `w-7 h-7 border-2 border-clear-normal duration-500 ease-in-out
              transition hover:rounded-3xl bg-clear-hover hover:bg-clear-active
              rounded-md px-2 py-1 inline-flex items-center justify-center
              active:bg-tab-active font-semibold`
            : `w-7 h-7 border-2 border-border duration-500 ease-in-out
              transition hover:rounded-3xl bg-block hover:border-border-hover
              hover:bg-bg-tab-hover rounded-md px-2 py-1 inline-flex
              items-center justify-center active:bg-tab-active font-semibold`
        }
        id={tabId.toString()}
        onClick={() => {
          setCurrentId(tabId);
        }}
        onPointerOver={() => setTimeout(() => setIsHoveredMain(true), 400)}
        onPointerOut={() => setTimeout(() => setIsHoveredMain(false), 400)}
      >
        {positionIdx + 1}
      </button>
      {tabs.length >= 2 ? (
        <div className="relative">
          <button
            className={`transition duration-500 absolute border-2 text-sm px-0
              ease-in-out py-0 rounded-3xl text-format-bad border-dotted
              hover:text-format-bad-border hover:border-format-bad-border
              hover:bg-format-bad hover:bg-opacity-50 border-format-bad left-0
              active:text-format-bad-active active:border-format-bad-active
              -top-[60px] w-7 h-7 inline-flex items-center justify-center ${
              isHoveredMain || isHoveredSide
                  ? "visible opacity-100"
                  : "hover:visible hover:opacity-100 invisible opacity-0"
              }`}
            onPointerOver={() => setIsHoveredSide(true)}
            onPointerOut={() => setIsHoveredSide(false)}
            onClick={() => {
              setTabs((tabs) => {
                const curIdx = tabs.indexOf(tabId);
                setCurrentId(
                  curIdx === 0 ? tabs[curIdx + 1] : tabs[curIdx - 1],
                );
                return [...tabs].filter((u) => u != tabId);
              });
              setTestCases((testCases) => {
                const newTestCases = new Map(testCases);
                newTestCases.delete(tabId);
                return newTestCases;
              });
            }}
          >
            𝖷
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
