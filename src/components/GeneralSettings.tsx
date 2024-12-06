import { Settings } from "../types";
import { SettingsToggleSection } from "./SettingsToggleSection";

interface Props {
  directed: boolean;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function GeneralSettings({ directed, settings, setSettings }: Props) {
  return (
    <>
      <div
        className={
          settings.settingsFormat === "general"
            ? `font-jetbrains flex flex-col border-2 rounded-lg bg-block
              shadow-shadow shadow border-border hover:border-border-hover p-3
              space-y-3`
            : "hidden"
        }
      >
        <h4 className="font-semibold">Label Offset</h4>
        <input
          type="range"
          min={-2}
          max={2}
          step={1}
          value={settings.labelOffset}
          className="range appearance-none outline-none bg-slider h-1 w-5/6
            self-center rounded-full cursor-ew-resize
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:border-none
            [&::-webkit-slider-thumb]:bg-slider-thumb
            [&::-webkit-slider-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-slider-thumb [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:border-none
            [&::-moz-range-thumb]:rounded-full"
          onChange={(e) => {
            setSettings({
              ...settings,
              labelOffset: Number.parseInt(e.target.value),
            });
          }}
        />
        <div className="flex justify-between w-5/6 self-center">
          <div className="w-0">-2</div>
          <div className="w-0">-1</div>
          <div className="w-0">0</div>
          <div className="w-0">1</div>
          <div>2</div>
        </div>

        <SettingsToggleSection
          title={"Components"}
          leftLabel={"Hide"}
          rightLabel={"Show"}
          toggleId={"settingsComponents"}
          settingsName={"showComponents"}
          settings={settings}
          setSettings={setSettings}
        />

        {!directed ? (
          <SettingsToggleSection
            title={"Bridges and Cut Vertices"}
            leftLabel={"Hide"}
            rightLabel={"Show"}
            toggleId={"settingsBridges"}
            settingsName={"showBridges"}
            settings={settings}
            setSettings={setSettings}
          />
        ) : (
          <></>
        )}

        {!directed && localStorage.getItem("isEdgeNumeric") === "true" ? (
          <SettingsToggleSection
            title={"Minimum Spanning Tree(s)"}
            leftLabel={"Hide"}
            rightLabel={"Show"}
            toggleId={"settingsShowMSTs"}
            settingsName={"showMSTs"}
            settings={settings}
            setSettings={setSettings}
          />
        ) : !directed ? (
          <h4 className="font-semibold text-border">
            <s>Minimum Spanning Tree(s)</s>
          </h4>
        ) : (
          <></>
        )}

        {!directed ? (
          <SettingsToggleSection
            title={"Tree Mode"}
            leftLabel={"Off"}
            rightLabel={"On"}
            toggleId={"settingsTreeMode"}
            settingsName={"treeMode"}
            settings={settings}
            setSettings={setSettings}
          />
        ) : (
          <></>
        )}

        {localStorage.getItem("isBipartite") === "true" ? (
          <SettingsToggleSection
            title={"Bipartite Mode"}
            leftLabel={"Off"}
            rightLabel={"On"}
            toggleId={"settingsBipartiteMode"}
            settingsName={"bipartiteMode"}
            settings={settings}
            setSettings={setSettings}
          />
        ) : (
          <h4 className="font-semibold text-border">
            <s>Bipartite Mode</s>
          </h4>
        )}

        <SettingsToggleSection
          title={"Lock Mode"}
          leftLabel={"Off"}
          rightLabel={"On"}
          toggleId={"settingsLockMode"}
          settingsName={"lockMode"}
          settings={settings}
          setSettings={setSettings}
        />

        <SettingsToggleSection
          title={"Fixed Mode"}
          leftLabel={"Off"}
          rightLabel={"On"}
          toggleId={"settingsFixedMode"}
          settingsName={"fixedMode"}
          settings={settings}
          setSettings={setSettings}
        />

        <SettingsToggleSection
          title={"Multiedge Mode"}
          leftLabel={"Off"}
          rightLabel={"On"}
          toggleId={"settingsMultiedgeMode"}
          settingsName={"multiedgeMode"}
          settings={settings}
          setSettings={setSettings}
        />
      </div>
    </>
  );
}
