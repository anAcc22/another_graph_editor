import { Settings, Randomizer } from "../types";

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
  return (
    <>
      <div
        className="fixed w-full h-full bg-ovr-darkened bg-opacity-80 z-50
          flex font-jetbrains overflow-scroll"
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
                : "随机化配置"}
            </h4>
            <div>
              <button
                className={
                  randomizerConfig.indexing === 0
                    ? "px-2 bg-clear-hover rounded-l-md"
                    : `px-2 bg-ovr-darkened bg-opacity-50 hover:bg-clear-hover
                      hover:bg-opacity-50 rounded-l-md`
                }
                onClick={() => {
                  setRandomizerConfig({ ...randomizerConfig, indexing: 0 });
                  localStorage.setItem("randomizerIndexing", "0");
                }}
              >
                {settings.language == "en" ? "0-indexed" : "0-索引"}
              </button>
              <button
                className={
                  randomizerConfig.indexing === 1
                    ? "px-2 bg-clear-hover rounded-r-md"
                    : `px-2 bg-ovr-darkened bg-opacity-50 rounded-r-md
                      hover:bg-clear-hover hover:bg-opacity-50`
                }
                onClick={() => {
                  setRandomizerConfig({ ...randomizerConfig, indexing: 1 });
                  localStorage.setItem("randomizerIndexing", "1");
                }}
              >
                {settings.language == "en" ? "1-indexed" : "1-索引"}
              </button>
            </div>
          </div>

          <hr className="border-dashed border-border" />

          <div className="flex-col space-y-3">
            <div className="flex justify-between items-center">
              <div>
                {settings.language == "en"
                  ? "Node Count (n)"
                  : "节点数 (n)"}
              </div>
              <input
                type="text"
                id="randomizerNodeCount"
                defaultValue={randomizerConfig.nodeCount}
                className="outline-none px-2 py-1 bg-ovr-darkened rounded-md
                  w-12 opacity-50 focus:opacity-100 text-center"
                onKeyDown={handleTextAreaKeyDown}
                onChange={(e) => {
                  setRandomizerConfig({
                    ...randomizerConfig,
                    nodeCount: e.target.value,
                  });
                  localStorage.setItem("randomizerNodeCount", e.target.value);
                }}
              ></input>
            </div>

            {randomizerConfig.tree ? (
              <></>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  {settings.language == "en"
                    ? "Edge Count (m)"
                    : "边数 (m)"}
                </div>
                <input
                  type="text"
                  id="randomizerEdgeCount"
                  defaultValue={randomizerConfig.edgeCount}
                  className="outline-none px-2 py-1 bg-ovr-darkened rounded-md
                    w-12 opacity-50 focus:opacity-100 text-center"
                  onKeyDown={handleTextAreaKeyDown}
                  onChange={(e) => {
                    setRandomizerConfig({
                      ...randomizerConfig,
                      edgeCount: e.target.value,
                    });
                    localStorage.setItem("randomizerEdgeCount", e.target.value);
                  }}
                ></input>
              </div>
            )}

            {randomizerConfig.tree ? (
              <></>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  {settings.language == "en" ? "Connected" : "保证联通"}
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
                      localStorage.setItem(
                        "randomizerConnected",
                        flipped ? "true" : "false",
                      );
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
              <div>{settings.language == "en" ? "Tree" : "保证为树"}</div>
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
                    localStorage.setItem(
                      "randomizerTree",
                      flipped ? "true" : "false",
                    );
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

            <div className="flex justify-between items-center">
              <div>
                {settings.language == "en" ? "Node Label" : "生成节点标签"}
              </div>
              <label className="relative inline w-12">
                <input
                  type="checkbox"
                  checked={randomizerConfig.hasNodeLabel}
                  id="randomizerHasNodeLabel"
                  className="peer invisible"
                  onChange={() => {
                    const flipped = !randomizerConfig.hasNodeLabel;
                    setRandomizerConfig({
                      ...randomizerConfig,
                      hasNodeLabel: flipped,
                    });
                    localStorage.setItem(
                      "randomizerHasNodeLabel",
                      flipped ? "true" : "false",
                    );
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

            {!randomizerConfig.hasNodeLabel ? (
              <></>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  {settings.language == "en"
                    ? "Inclusive Range [min, max]"
                    : "闭区间 [min, max]"}
                </div>
                <div className="flex space-x-3 items-center">
                  <input
                    type="text"
                    id="randomizerNodeLabelMin"
                    defaultValue={randomizerConfig.nodeLabelMin}
                    className="outline-none px-2 py-1 bg-ovr-darkened rounded-md
                      w-12 opacity-50 focus:opacity-100 text-center"
                    onKeyDown={handleTextAreaKeyDown}
                    onChange={(e) => {
                      setRandomizerConfig({
                        ...randomizerConfig,
                        nodeLabelMin: e.target.value,
                      });
                      localStorage.setItem(
                        "randomizerNodeLabelMin",
                        e.target.value,
                      );
                    }}
                  ></input>
                  <div className="font-bold text-toggle-uncheck">{"=>"}</div>
                  <input
                    type="text"
                    id="randomizerNodeLabelMax"
                    defaultValue={randomizerConfig.nodeLabelMax}
                    className="outline-none px-2 py-1 bg-ovr-darkened rounded-md
                      w-12 opacity-50 focus:opacity-100 text-center"
                    onKeyDown={handleTextAreaKeyDown}
                    onChange={(e) => {
                      setRandomizerConfig({
                        ...randomizerConfig,
                        nodeLabelMax: e.target.value,
                      });
                      localStorage.setItem(
                        "randomizerNodeLabelMax",
                        e.target.value,
                      );
                    }}
                  ></input>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div>
                {settings.language == "en" ? "Edge Label" : "生成边标签"}
              </div>
              <label className="relative inline w-12">
                <input
                  type="checkbox"
                  checked={randomizerConfig.hasEdgeLabel}
                  id="randomizerHasEdgeLabel"
                  className="peer invisible"
                  onChange={() => {
                    const flipped = !randomizerConfig.hasEdgeLabel;
                    setRandomizerConfig({
                      ...randomizerConfig,
                      hasEdgeLabel: flipped,
                    });
                    localStorage.setItem(
                      "randomizerHasEdgeLabel",
                      flipped ? "true" : "false",
                    );
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

            {!randomizerConfig.hasEdgeLabel ? (
              <></>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  {settings.language == "en"
                    ? "Inclusive Range [min, max]"
                    : "闭区间 [min, max]"}
                </div>
                <div className="flex space-x-3 items-center">
                  <input
                    type="text"
                    id="randomizerEdgeLabelMin"
                    defaultValue={randomizerConfig.edgeLabelMin}
                    className="outline-none px-2 py-1 bg-ovr-darkened rounded-md
                      w-12 opacity-50 focus:opacity-100 text-center"
                    onKeyDown={handleTextAreaKeyDown}
                    onChange={(e) => {
                      setRandomizerConfig({
                        ...randomizerConfig,
                        edgeLabelMin: e.target.value,
                      });
                      localStorage.setItem(
                        "randomizerEdgeLabelMin",
                        e.target.value,
                      );
                    }}
                  ></input>
                  <div className="font-bold text-toggle-uncheck">{"=>"}</div>
                  <input
                    type="text"
                    id="randomizerEdgeLabelMax"
                    defaultValue={randomizerConfig.edgeLabelMax}
                    className="outline-none px-2 py-1 bg-ovr-darkened rounded-md
                      w-12 opacity-50 focus:opacity-100 text-center"
                    onKeyDown={handleTextAreaKeyDown}
                    onChange={(e) => {
                      setRandomizerConfig({
                        ...randomizerConfig,
                        edgeLabelMax: e.target.value,
                      });
                      localStorage.setItem(
                        "randomizerEdgeLabelMax",
                        e.target.value,
                      );
                    }}
                  ></input>
                </div>
              </div>
            )}
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
              {settings.language == "en" ? "Exit" : "关闭"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
