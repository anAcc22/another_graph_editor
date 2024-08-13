import { Settings } from "../types";

interface Props {
  title: string;
  leftLabel: string;
  rightLabel: string;
  toggleID: string;
  settingsName: keyof Settings;
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export function SettingsToggleSection({
  title,
  leftLabel,
  rightLabel,
  toggleID,
  settingsName,
  settings,
  updateSettings,
}: Props) {
  return (
    <>
      <h4 className="font-normal">{title}</h4>
      <div className="flex font-light text-sm justify-between">
        <span>
          <span>
            {!settings[settingsName] ? (
              <span className="text-amber-700 p-0 hover:cursor-pointer">
                {leftLabel}
              </span>
            ) : (
              <span
                className="p-0 hover:cursor-pointer"
                onClick={() => {
                  updateSettings({
                    ...settings,
                    [settingsName]: false,
                  });
                  let checkbox = document.getElementById(
                    toggleID,
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
              <span className="text-amber-700 p-0 hover:cursor-pointer">
                {rightLabel}
              </span>
            ) : (
              <span
                className="p-0 hover:cursor-pointer"
                onClick={() => {
                  updateSettings({
                    ...settings,
                    [settingsName]: true,
                  });
                  let checkbox = document.getElementById(
                    toggleID,
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
              updateSettings({
                ...settings,
                [settingsName]: !settings[settingsName],
              })
            }
            type="checkbox"
            id={toggleID}
            className="peer invisible"
          />
          <span
            className="absolute top-0 left-0 w-9 h-5 cursor-pointer rounded-full
              bg-slate-300 border-none transition-all duration-75
              hover:bg-slate-400 peer-checked:bg-slate-600"
          ></span>
          <span
            className="absolute top-0.5 left-0.5 w-4 h-4 bg-slate-50
              rounded-full transition-all duration-75 cursor-pointer
              peer-checked:translate-x-4"
          ></span>
        </label>
      </div>
    </>
  );
}
