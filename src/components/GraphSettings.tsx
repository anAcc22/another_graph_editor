import { Settings } from "../types";
import { AlgorithmSettings } from "./AlgorithmSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { ModeSettings } from "./ModeSettings";

interface Props {
  directed: boolean;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function GraphSettings({ directed, settings, setSettings }: Props) {
  return (
    <div
      className="font-jetbrains flex flex-col hover:border-border-hover
        xl:right-5/200 space-y-3 z-10 lg:absolute lg:right-1/24 xl:w-1/5
        lg:top-1/8 lg:w-1/4 sm:ml-1/16 sm:mb-1/8 sm:mr-1/16 lg:m-0"
    >
      <div className="no-scrollbar overflow-scroll">
        <div className="flex space-x-3">
          <button
            className={
              settings.settingsFormat === "modes"
                ? `h-7 border-2 border-clear-normal bg-clear-hover
                  hover:bg-clear-active rounded-md px-2 py-1 inline-flex
                  items-center justify-center active:bg-tab-active font-semibold`
                : `h-7 border-2 border-border bg-block hover:border-border-hover
                  hover:bg-bg-tab-hover rounded-md px-2 py-1 inline-flex
                  items-center justify-center active:bg-tab-active font-semibold`
            }
            onClick={() => {
              setSettings({ ...settings, settingsFormat: "modes" });
              localStorage.setItem("settingsFormat", "modes");
            }}
          >
            {settings.language == "en" ? "Modes" : "模式设置"}
          </button>
          <button
            className={
              settings.settingsFormat === "algos"
                ? `h-7 border-2 border-clear-normal bg-clear-hover
                  hover:bg-clear-active rounded-md px-2 py-1 inline-flex
                  items-center justify-center active:bg-tab-active font-semibold`
                : `h-7 border-2 border-border bg-block hover:border-border-hover
                  hover:bg-bg-tab-hover rounded-md px-2 py-1 inline-flex
                  items-center justify-center active:bg-tab-active font-semibold`
            }
            onClick={() => {
              setSettings({ ...settings, settingsFormat: "algos" });
              localStorage.setItem("settingsFormat", "algos");
            }}
          >
            {settings.language == "en" ? "Algos" : "算法设置"}
          </button>
          <button
            className={
              settings.settingsFormat === "appearance"
                ? `h-7 border-2 border-clear-normal bg-clear-hover
                  hover:bg-clear-active rounded-md px-2 py-1 inline-flex
                  items-center justify-center active:bg-tab-active font-semibold`
                : `h-7 border-2 border-border bg-block hover:border-border-hover
                  hover:bg-bg-tab-hover rounded-md px-2 py-1 inline-flex
                  items-center justify-center active:bg-tab-active font-semibold`
            }
            onClick={() => {
              setSettings({ ...settings, settingsFormat: "appearance" });
              localStorage.setItem("settingsFormat", "appearance");
            }}
          >
            {settings.language == "en" ? "Appearance" : "外观设置"}
          </button>
        </div>
      </div>
      <ModeSettings
        directed={directed}
        settings={settings}
        setSettings={setSettings}
      />
      <AlgorithmSettings
        directed={directed}
        settings={settings}
        setSettings={setSettings}
      />
      <AppearanceSettings
        directed={directed}
        settings={settings}
        setSettings={setSettings}
      />
      <div className="h-0 lg:h-12"></div>
    </div>
  );
}
