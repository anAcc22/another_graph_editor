import { Settings } from "../types";

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

        <h4 className="font-normal">Components</h4>
        <div className="flex font-light text-sm justify-between">
          <span>
            <span>
              {!settings.showComponents ? (
                <span className="text-amber-700 p-0 hover:cursor-pointer">
                  Hide
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    updateSettings({
                      ...settings,
                      showComponents: false,
                    });
                    let directedCheckbox = document.getElementById(
                      "inputSettingsComponents",
                    ) as HTMLInputElement;
                    directedCheckbox.checked = false;
                  }}
                >
                  Hide
                </span>
              )}
            </span>
            <span> | </span>
            <span>
              {settings.showComponents ? (
                <span className="text-amber-700 p-0 hover:cursor-pointer">
                  Show
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    updateSettings({
                      ...settings,
                      showComponents: true,
                    });
                    let directedCheckbox = document.getElementById(
                      "inputSettingsComponents",
                    ) as HTMLInputElement;
                    directedCheckbox.checked = true;
                  }}
                >
                  Show
                </span>
              )}
            </span>
          </span>
          <label className="relative inline w-9">
            <input
              onClick={() =>
                updateSettings({
                  ...settings,
                  showComponents: !settings.showComponents,
                })
              }
              type="checkbox"
              id="inputSettingsComponents"
              className="peer invisible"
            />
            <span
              className="absolute top-0 left-0 w-9 h-5 cursor-pointer
                rounded-full bg-slate-300 border-none transition-all duration-75
                hover:bg-slate-400 peer-checked:bg-slate-600"
            ></span>
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 bg-slate-50
                rounded-full transition-all duration-75 cursor-pointer
                peer-checked:translate-x-4"
            ></span>
          </label>
        </div>

        <h4 className="font-normal">Tree Mode</h4>
        <div className="flex font-light text-sm justify-between">
          <span>
            <span>
              {!settings.treeMode ? (
                <span className="text-amber-700 p-0 hover:cursor-pointer">
                  Off
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    updateSettings({
                      ...settings,
                      treeMode: false,
                    });
                    let directedCheckbox = document.getElementById(
                      "inputSettingsTreeMode",
                    ) as HTMLInputElement;
                    directedCheckbox.checked = false;
                  }}
                >
                  Off
                </span>
              )}
            </span>
            <span> | </span>
            <span>
              {settings.treeMode ? (
                <span className="text-amber-700 p-0 hover:cursor-pointer">
                  On
                </span>
              ) : (
                <span
                  className="p-0 hover:cursor-pointer"
                  onClick={() => {
                    updateSettings({
                      ...settings,
                      treeMode: true,
                    });
                    let directedCheckbox = document.getElementById(
                      "inputSettingsTreeMode",
                    ) as HTMLInputElement;
                    directedCheckbox.checked = true;
                  }}
                >
                  On
                </span>
              )}
            </span>
          </span>
          <label className="relative inline w-9">
            <input
              onClick={() =>
                updateSettings({
                  ...settings,
                  showComponents: !settings.showComponents,
                })
              }
              type="checkbox"
              id="inputSettingsTreeMode"
              className="peer invisible"
            />
            <span
              className="absolute top-0 left-0 w-9 h-5 cursor-pointer
                rounded-full bg-slate-300 border-none transition-all duration-75
                hover:bg-slate-400 peer-checked:bg-slate-600"
            ></span>
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 bg-slate-50
                rounded-full transition-all duration-75 cursor-pointer
                peer-checked:translate-x-4"
            ></span>
          </label>
        </div>
      </div>
    </>
  );
}
