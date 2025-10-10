import { Settings } from "../types";
import { SettingsToggleSection } from "./SettingsToggleSection";
import { SettingsToggleSectionDimmed } from "./SettingsToggleSectionDimmed";

interface Props {
  directed: boolean;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function AlgorithmSettings({ directed, settings, setSettings }: Props) {
  return (
    <>
      <div
        className={
          settings.settingsFormat === "algos"
            ? `font-jetbrains flex flex-col border-2 rounded-lg bg-block
              shadow-shadow shadow border-border hover:border-border-hover p-3
              space-y-3`
            : "hidden"
        }
      >
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
                ? "Edge-Biconnected Components"
                : "边双联通分量"
            }
            leftLabel={settings.language == "en" ? "Hide" : "隐藏"}
            rightLabel={settings.language == "en" ? "Show" : "展示"}
            toggleId={"settingsEBCC"}
            settingsName={"showEBCC"}
            settings={settings}
            setSettings={setSettings}
          />
        ) : (
          <></>
        )}

        {!directed ? (
          <SettingsToggleSection
            title={
              settings.language == "en"
                ? "Vertex-Biconnected Components"
                : "点双联通分量"
            }
            leftLabel={settings.language == "en" ? "Hide" : "隐藏"}
            rightLabel={settings.language == "en" ? "Show" : "展示"}
            toggleId={"settingsVBCC"}
            settingsName={"showVBCC"}
            settings={settings}
            setSettings={setSettings}
          />
        ) : (
          <></>
        )}

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
      </div>
    </>
  );
}
