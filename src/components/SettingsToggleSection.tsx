import { Settings } from "../types";

interface Props {
  title: string;
  leftLabel: string;
  rightLabel: string;
  toggleId: string;
  settingsName: keyof Settings;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

function fixSettingsModes(newSettings: Settings, settingsName: string) {
  if (
    newSettings.bipartiteMode &&
    settingsName === "bipartiteMode"
  ) {
    newSettings["treeMode"] = false;
    newSettings["gridMode"] = false;
    newSettings["showComponents"] = false;
  }
  if (newSettings.treeMode && settingsName === "treeMode") {
    newSettings["bipartiteMode"] = false;
    newSettings["gridMode"] = false;
  }
  if (
    newSettings.showComponents &&
    settingsName === "showComponents"
  ) {
    newSettings["bipartiteMode"] = false;
  }
  if (newSettings.gridMode && settingsName === "gridMode") {
    newSettings["treeMode"] = false;
    newSettings["bipartiteMode"] = false;
  }
}

export function SettingsToggleSection({
  title,
  leftLabel,
  rightLabel,
  toggleId,
  settingsName,
  settings,
  setSettings,
}: Props) {
  return (
    <>
      <h4 className="font-semibold text-base">{title}</h4>
      <div className="flex font-light text-sm justify-between">
        <span>
          <span>
            {!settings[settingsName] ? (
              <span className="text-selected p-0 hover:cursor-pointer">
                {leftLabel}
              </span>
            ) : (
              <span
                className="p-0 hover:cursor-pointer"
                onClick={() => {
                  setSettings((settings) => {
                    const newSettings = {
                      ...settings,
                      [settingsName]: false,
                    };
                    fixSettingsModes(newSettings, settingsName);
                    // Save any setting to localStorage
                    localStorage.setItem(settingsName, newSettings[settingsName].toString());
                    return newSettings;
                  });
                  const checkbox = document.getElementById(
                    toggleId,
                  ) as HTMLInputElement;
                  checkbox.checked = false;
                }}
              >
                {leftLabel}
              </span>
            )}
          </span>
          <span> | </span>
          <span>
            {settings[settingsName] ? (
              <span className="text-selected p-0 hover:cursor-pointer">
                {rightLabel}
              </span>
            ) : (
              <span
                className="p-0 hover:cursor-pointer"
                onClick={() => {
                  setSettings((settings) => {
                    const newSettings = {
                      ...settings,
                      [settingsName]: true,
                    };
                    fixSettingsModes(newSettings, settingsName);
                    // Save any setting to localStorage
                    localStorage.setItem(settingsName, newSettings[settingsName].toString());
                    return newSettings;
                  });
                  const checkbox = document.getElementById(
                    toggleId,
                  ) as HTMLInputElement;
                  checkbox.checked = true;
                }}
              >
                {rightLabel}
              </span>
            )}
          </span>
        </span>
        <label className="relative inline w-9">
          <input
            onClick={() =>
              setSettings((settings) => {
                const newSettings = {
                  ...settings,
                  [settingsName]: !settings[settingsName],
                };
                fixSettingsModes(newSettings, settingsName);
                // Save any setting to localStorage
                localStorage.setItem(settingsName, newSettings[settingsName].toString());
                return newSettings;
              })
            }
            type="checkbox"
            checked={settings[settingsName] as boolean}
            id={toggleId}
            className="peer invisible"
            onChange={() => {}}
          />
          <span
            className="absolute top-0 left-0 w-9 h-5 cursor-pointer rounded-full
              bg-toggle-uncheck border-none transition-all duration-75
              hover:bg-toggle-hover peer-checked:bg-toggle-check"
          ></span>
          <span
            className="absolute top-0.5 left-0.5 w-4 h-4 bg-toggle-circle
              rounded-full transition-all duration-75 cursor-pointer
              peer-checked:translate-x-4"
          ></span>
        </label>
      </div>
    </>
  );
}
