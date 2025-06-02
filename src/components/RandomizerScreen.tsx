import { Settings, Randomizer } from "../types";
import { useState } from "react";

interface Props {
  settings: Settings;
  setRandomizer: React.Dispatch<React.SetStateAction<boolean>>;
  randomizerConfig: Randomizer;
  setRandomizerConfig: React.Dispatch<React.SetStateAction<Randomizer>>;
}

const handleTextAreaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Escape" || e.key === "Enter") {
    e.currentTarget.blur();
  }
};

export function RandomizerScreen({
  settings,
  setRandomizer,
  randomizerConfig,
  setRandomizerConfig,
}: Props) {
  const [indexing, setIndexing] = useState<number>(1);

  return (
    <>
      <div
        className="absolute w-full h-full bg-ovr-darkened bg-opacity-80 z-50
          flex font-jetbrains"
        onClick={() => setRandomizer(false)}
      >
        <div
          className={`font-jetbrains flex flex-col border-2 rounded-lg bg-block
            shadow-shadow shadow border-border hover:border-border-hover p-3
            space-y-3 w-150 m-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-base font-semibold">
              {settings.language == "en"
                ? "Randomizer Configuration"
                : "Randomizer Configuration"}
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
                {settings.language == "en" ? "0-indexed" : "0-indexed"}
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
                {settings.language == "en" ? "1-indexed" : "1-indexed"}
              </button>
            </div>
          </div>

          <hr className="border-dashed border-border" />

          <div className="flex-col space-y-3">
            <div className="flex justify-between items-center">
              <div>
                {settings.language == "en"
                  ? "Node Count (n)"
                  : "Node Count (n)"}
              </div>
              <input
                type="text"
                id="randomizerNodeCount"
                className="outline-none px-2 py-1 bg-ovr-darkened rounded-md
                  w-12 opacity-50 focus:opacity-100 text-center"
                onKeyDown={handleTextAreaKeyDown}
              ></input>
            </div>

            {randomizerConfig.tree ? (
              <></>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  {settings.language == "en"
                    ? "Edge Count (m)"
                    : "Edge Count (m)"}
                </div>
                <input
                  type="text"
                  id="randomizerEdgeCount"
                  className="outline-none px-2 py-1 bg-ovr-darkened rounded-md
                    w-12 opacity-50 focus:opacity-100 text-center"
                  onKeyDown={handleTextAreaKeyDown}
                ></input>
              </div>
            )}

            {randomizerConfig.tree ? (
              <></>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  {settings.language == "en"
                    ? "Guarantee Connected"
                    : "Guarantee Connected"}
                </div>
                <label className="relative inline w-12">
                  <input
                    type="checkbox"
                    checked={randomizerConfig.connected}
                    id="randomizerConnected"
                    className="peer invisible"
                    onChange={() => {
                      const flipped = !randomizerConfig.connected;
                      setRandomizerConfig({
                        ...randomizerConfig,
                        connected: flipped,
                      });
                    }}
                  />
                  <span
                    className="absolute top-0 left-0 w-12 h-6 cursor-pointer
                      rounded-full bg-toggle-uncheck border-none transition-all
                      duration-75 hover:bg-toggle-hover
                      peer-checked:bg-toggle-check"
                  ></span>
                  <span
                    className="absolute top-0.5 left-0.5 w-5 h-5
                      bg-toggle-circle rounded-full transition-all duration-75
                      cursor-pointer peer-checked:translate-x-6"
                  ></span>
                </label>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div>{settings.language == "en" ? "Tree" : "Tree"}</div>
              <label className="relative inline w-12">
                <input
                  type="checkbox"
                  checked={randomizerConfig.tree}
                  id="randomizerTree"
                  className="peer invisible"
                  onChange={() => {
                    const flipped = !randomizerConfig.tree;
                    setRandomizerConfig({
                      ...randomizerConfig,
                      tree: flipped,
                    });
                  }}
                />
                <span
                  className="absolute top-0 left-0 w-12 h-6 cursor-pointer
                    rounded-full bg-toggle-uncheck border-none transition-all
                    duration-75 hover:bg-toggle-hover
                    peer-checked:bg-toggle-check"
                ></span>
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-toggle-circle
                    rounded-full transition-all duration-75 cursor-pointer
                    peer-checked:translate-x-6"
                ></span>
              </label>
            </div>
          </div>

          <div className="flex justify-around">
            <button
              className={`h-7 border-2 border-format-ok-border bg-block
                rounded-md px-2 py-1 inline-flex items-center justify-center
                hover:bg-format-ok-border hover:bg-opacity-20
                active:bg-opacity-50 font-semibold text-format-ok-border`}
              onClick={() => {
                setRandomizer(false);
              }}
            >
              {settings.language == "en" ? "Exit" : "Exit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
