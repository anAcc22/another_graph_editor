import { Settings } from "../types";
import { SettingsToggleSection } from "./SettingsToggleSection";

interface Props {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export function GraphSettings({ settings, updateSettings }: Props) {
  return (
    <>
      <div
        className="font-jetbrains flex flex-col border-2 rounded-lg bg-slate-50
          shadow-sm border-slate-100 sm:ml-1/8 sm:mb-1/8 sm:mr-1/8 lg:m-0
          lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-1/4 lg:right-1/24
          xl:right-5/200 xl:w-1/5 p-3 space-y-3"
      >
        <h3 className="font-bold text-lg">Settings</h3>

        <SettingsToggleSection
          title={"Components"}
          leftLabel={"Hide"}
          rightLabel={"Show"}
          toggleID={"settingsComponents"}
          settingsName={"showComponents"}
          settings={settings}
          updateSettings={updateSettings}
        />

        <SettingsToggleSection
          title={"Tree Mode"}
          leftLabel={"Off"}
          rightLabel={"On"}
          toggleID={"settingsTreeMode"}
          settingsName={"treeMode"}
          settings={settings}
          updateSettings={updateSettings}
        />

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
