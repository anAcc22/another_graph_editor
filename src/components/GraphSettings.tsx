import { Settings } from "../types";
import { SettingsToggleSection } from "./SettingsToggleSection";

interface Props {
  directed: boolean;
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export function GraphSettings({ directed, settings, updateSettings }: Props) {
  return (
    <>
      <div
        className="font-jetbrains flex flex-col border-2 rounded-lg bg-block
          shadow-shadow shadow border-border sm:ml-1/8 sm:mb-1/8 sm:mr-1/8
          lg:m-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-1/4
          hover:border-border-hover lg:right-1/24 xl:right-5/200 xl:w-1/5 p-3
          space-y-3"
      >
        <h3 className="font-bold text-lg">Settings</h3>

        <SettingsToggleSection
          title={"Theme"}
          leftLabel={"Light"}
          rightLabel={"Dark"}
          toggleID={"settingsTheme"}
          settingsName={"darkMode"}
          settings={settings}
          updateSettings={(newSettings) => {
            updateSettings(newSettings);
            localStorage.setItem("darkMode", newSettings.darkMode.toString());
          }}
        />

        <SettingsToggleSection
          title={"Components"}
          leftLabel={"Hide"}
          rightLabel={"Show"}
          toggleID={"settingsComponents"}
          settingsName={"showComponents"}
          settings={settings}
          updateSettings={updateSettings}
        />

        {!directed ? (
          <SettingsToggleSection
            title={"Bridges and Cut Vertices"}
            leftLabel={"Hide"}
            rightLabel={"Show"}
            toggleID={"settingsBridges"}
            settingsName={"showBridges"}
            settings={settings}
            updateSettings={updateSettings}
          />
        ) : (
          <></>
        )}

        {!directed ? (
          <SettingsToggleSection
            title={"Tree Mode"}
            leftLabel={"Off"}
            rightLabel={"On"}
            toggleID={"settingsTreeMode"}
            settingsName={"treeMode"}
            settings={settings}
            updateSettings={updateSettings}
          />
        ) : (
          <></>
        )}

        <SettingsToggleSection
          title={"Lock Mode"}
          leftLabel={"Off"}
          rightLabel={"On"}
          toggleID={"settingsLockMode"}
          settingsName={"lockMode"}
          settings={settings}
          updateSettings={updateSettings}
        />
      </div>
    </>
  );
}
