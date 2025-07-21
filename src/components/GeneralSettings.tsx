import { Settings } from "../types";
import { SettingsToggleSection } from "./SettingsToggleSection";
import { SettingsToggleSectionDimmed } from "./SettingsToggleSectionDimmed";

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
        <h4 className="font-semibold">
          {settings.language == "en" ? "Label Offset" : "标签偏移量"}
        </h4>
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
            const newLabelOffset = Number.parseInt(e.target.value);
            setSettings({
              ...settings,
              labelOffset: newLabelOffset,
            });
            localStorage.setItem("labelOffset", newLabelOffset.toString());
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
          title={settings.language == "en" ? "Components" : "连通分量"}
          leftLabel={settings.language == "en" ? "Hide" : "隐藏"}
          rightLabel={settings.language == "en" ? "Show" : "展示"}
          toggleId={"settingsComponents"}
          settingsName={"showComponents"}
          settings={settings}
          setSettings={setSettings}
        />

        {!directed ? (
          <SettingsToggleSection
            title={
              settings.language == "en"
                ? "Bridges and Cut Vertices"
                : "割点和桥"
            }
            leftLabel={settings.language == "en" ? "Hide" : "隐藏"}
            rightLabel={settings.language == "en" ? "Show" : "展示"}
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
            title={
              settings.language == "en"
                ? "Minimum Spanning Tree(s)"
                : "最小生成树（森林）"
            }
            leftLabel={settings.language == "en" ? "Hide" : "隐藏"}
            rightLabel={settings.language == "en" ? "Show" : "展示"}
            toggleId={"settingsShowMSTs"}
            settingsName={"showMSTs"}
            settings={settings}
            setSettings={setSettings}
          />
        ) : !directed ? (
          <SettingsToggleSectionDimmed
            title={
              settings.language == "en"
                ? "Minimum Spanning Tree(s)"
                : "最小生成树（森林）"
            }
            leftLabel={settings.language == "en" ? "Hide" : "隐藏"}
            rightLabel={settings.language == "en" ? "Show" : "展示"}
            toggleId={"settingsShowMSTs"}
            settingsName={"showMSTs"}
            settings={settings}
            setSettings={setSettings}
          />
        ) : (
          <></>
        )}

        {!directed ? (
          <SettingsToggleSection
            title={settings.language == "en" ? "Tree Mode" : "树模式"}
            leftLabel={settings.language == "en" ? "Off" : "关闭"}
            rightLabel={settings.language == "en" ? "On" : "开启"}
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
            title={settings.language == "en" ? "Bipartite Mode" : "二分图模式"}
            leftLabel={settings.language == "en" ? "Off" : "关闭"}
            rightLabel={settings.language == "en" ? "On" : "开启"}
            toggleId={"settingsBipartiteMode"}
            settingsName={"bipartiteMode"}
            settings={settings}
            setSettings={setSettings}
          />
        ) : (
          <SettingsToggleSectionDimmed
            title={settings.language == "en" ? "Bipartite Mode" : "二分图模式"}
            leftLabel={settings.language == "en" ? "Off" : "关闭"}
            rightLabel={settings.language == "en" ? "On" : "开启"}
            toggleId={"settingsBipartiteMode"}
            settingsName={"bipartiteMode"}
            settings={settings}
            setSettings={setSettings}
          />
        )}

        <SettingsToggleSection
          title={settings.language == "en" ? "Grid Mode" : "方格模式"}
          leftLabel={settings.language == "en" ? "Off" : "关闭"}
          rightLabel={settings.language == "en" ? "On" : "开启"}
          toggleId={"gridMode"}
          settingsName={"gridMode"}
          settings={settings}
          setSettings={setSettings}
        />

        <SettingsToggleSection
          title={settings.language == "en" ? "Lock Mode" : "锁定模式"}
          leftLabel={settings.language == "en" ? "Off" : "关闭"}
          rightLabel={settings.language == "en" ? "On" : "开启"}
          toggleId={"settingsLockMode"}
          settingsName={"lockMode"}
          settings={settings}
          setSettings={setSettings}
        />

        <SettingsToggleSection
          title={settings.language == "en" ? "Collision Avoidance" : "碰撞避免"}
          leftLabel={settings.language == "en" ? "Off" : "关闭"}
          rightLabel={settings.language == "en" ? "On" : "开启"}
          toggleId={"settingsCollisionAvoidance"}
          settingsName={"collisionAvoidance"}
          settings={settings}
          setSettings={setSettings}
        />

        <SettingsToggleSection
          title={
            settings.language == "en"
              ? "Mark/Unmark Nodes on Click"
              : "点击时标记节点"
          }
          leftLabel={settings.language == "en" ? "Off" : "关闭"}
          rightLabel={settings.language == "en" ? "On" : "开启"}
          toggleId={"settingsMarkedNodes"}
          settingsName={"markedNodes"}
          settings={settings}
          setSettings={setSettings}
        />

        {settings.markedNodes ? (
          <SettingsToggleSection
            title={settings.language == "en" ? "Fixed Mode" : "固定模式"}
            leftLabel={settings.language == "en" ? "Off" : "关闭"}
            rightLabel={settings.language == "en" ? "On" : "开启"}
            toggleId={"settingsFixedMode"}
            settingsName={"fixedMode"}
            settings={settings}
            setSettings={setSettings}
          />
        ) : (
          <SettingsToggleSectionDimmed
            title={settings.language == "en" ? "Fixed Mode" : "固定模式"}
            leftLabel={settings.language == "en" ? "Off" : "关闭"}
            rightLabel={settings.language == "en" ? "On" : "开启"}
            toggleId={"settingsFixedMode"}
            settingsName={"fixedMode"}
            settings={settings}
            setSettings={setSettings}
          />
        )}

        <SettingsToggleSection
          title={settings.language == "en" ? "Multiedge Mode" : "重边模式"}
          leftLabel={settings.language == "en" ? "Off" : "关闭"}
          rightLabel={settings.language == "en" ? "On" : "开启"}
          toggleId={"settingsMultiedgeMode"}
          settingsName={"multiedgeMode"}
          settings={settings}
          setSettings={setSettings}
        />
      </div>
    </>
  );
}
