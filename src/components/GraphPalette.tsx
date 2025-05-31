import { Settings } from "../types";

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function GraphPalette({ settings, setSettings }: Props) {
  return (
    <div className="flex-col space-y-1.5 mb-3">
      <div className="flex space-x-1.5">
        <div
          className={`border-[2px] border-text
            ${settings.markColor === 1 ? "hover:border-text" : "hover:border-border-hover"}
            hover:border-border-hover h-4 hover:drop-shadow-sm w-4 rounded-full
            transtion ease-in-out hover:scale-150 duration-100 ${
            settings.markColor === 1 ? "border-solid" : "border-dotted" }`}
          onClick={() => setSettings({ ...settings, markColor: 1 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 3 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-yellow rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 3 ? "border-solid border-text" : "border-palette-yellow"}`}
          onClick={() => setSettings({ ...settings, markColor: 3 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 5 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-lemon rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 5 ? "border-solid border-text" : "border-palette-lemon"}`}
          onClick={() => setSettings({ ...settings, markColor: 5 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 7 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-lime rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 7 ? "border-solid border-text" : "border-palette-lime"}`}
          onClick={() => setSettings({ ...settings, markColor: 7 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 9 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-green rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 9 ? "border-solid border-text" : "border-palette-green"}`}
          onClick={() => setSettings({ ...settings, markColor: 9 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 11 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-wood rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 11 ? "border-solid border-text" : "border-palette-wood"}`}
          onClick={() => setSettings({ ...settings, markColor: 11 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 13 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-teal rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 13 ? "border-solid border-text" : "border-palette-teal"}`}
          onClick={() => setSettings({ ...settings, markColor: 13 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 15 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-azure rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 15 ? "border-solid border-text" : "border-palette-azure"}`}
          onClick={() => setSettings({ ...settings, markColor: 15 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 17 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-sea rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 17 ? "border-solid border-text" : "border-palette-sea"}`}
          onClick={() => setSettings({ ...settings, markColor: 17 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 19 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-blue rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 19 ? "border-solid border-text" : "border-palette-blue"}`}
          onClick={() => setSettings({ ...settings, markColor: 19 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 21 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-flower rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 21 ? "border-solid border-text" : "border-palette-flower"}`}
          onClick={() => setSettings({ ...settings, markColor: 21 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 23 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-purple rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 23 ? "border-solid border-text" : "border-palette-purple"}`}
          onClick={() => setSettings({ ...settings, markColor: 23 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 25 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-violet rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 25 ? "border-solid border-text" : "border-palette-violet"}`}
          onClick={() => setSettings({ ...settings, markColor: 25 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 27 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-grape rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 27 ? "border-solid border-text" : "border-palette-grape"}`}
          onClick={() => setSettings({ ...settings, markColor: 27 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 29 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-pink rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 29 ? "border-solid border-text" : "border-palette-pink"}`}
          onClick={() => setSettings({ ...settings, markColor: 29 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 31 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-sakura rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 31 ? "border-solid border-text" : "border-palette-sakura"}`}
          onClick={() => setSettings({ ...settings, markColor: 31 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 33 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-flesh rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 33 ? "border-solid border-text" : "border-palette-flesh"}`}
          onClick={() => setSettings({ ...settings, markColor: 33 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 35 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-raw rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 35 ? "border-solid border-text" : "border-palette-raw"}`}
          onClick={() => setSettings({ ...settings, markColor: 35 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 37 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-orange rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 37 ? "border-solid border-text" : "border-palette-orange"}`}
          onClick={() => setSettings({ ...settings, markColor: 37 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 39 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-moon rounded-full transtion
            ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 39 ? "border-solid border-text" : "border-palette-moon"}`}
          onClick={() => setSettings({ ...settings, markColor: 39 })}
        ></div>
      </div>

      <div className="flex space-x-1.5">
        <div
          className={`border-[2px] border-format-bad h-4 hover:drop-shadow-sm
            w-4 rounded-full transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 2 ? "border-solid" : "border-dotted"}`}
          onClick={() => setSettings({ ...settings, markColor: 2 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 4 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-yellow-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 4 ? "border-solid border-text" : "border-palette-yellow-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 4 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 6 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-lemon-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 6 ? "border-solid border-text" : "border-palette-lemon-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 6 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 8 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-lime-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 8 ? "border-solid border-text" : "border-palette-lime-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 8 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 10 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-green-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 10 ? "border-solid border-text" : "border-palette-green-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 10 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 12 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-wood-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 12 ? "border-solid border-text" : "border-palette-wood-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 12 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 14 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-teal-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 14 ? "border-solid border-text" : "border-palette-teal-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 14 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 16 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-azure-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 16 ? "border-solid border-text" : "border-palette-azure-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 16 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 18 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-sea-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 18 ? "border-solid border-text" : "border-palette-sea-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 18 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 20 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-blue-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 20 ? "border-solid border-text" : "border-palette-blue-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 20 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 22 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-flower-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 22 ? "border-solid border-text" : "border-palette-flower-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 22 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 24 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-purple-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 24 ? "border-solid border-text" : "border-palette-purple-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 24 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 26 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-violet-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 26 ? "border-solid border-text" : "border-palette-violet-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 26 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 28 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-grape-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 28 ? "border-solid border-text" : "border-palette-grape-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 28 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 30 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-pink-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 30 ? "border-solid border-text" : "border-palette-pink-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 30 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 32 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-sakura-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 32 ? "border-solid border-text" : "border-palette-sakura-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 32 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 34 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-flesh-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 34 ? "border-solid border-text" : "border-palette-flesh-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 34 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 36 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-raw-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 36 ? "border-solid border-text" : "border-palette-raw-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 36 })}
        ></div>
        <div
          className={`border-[2px]
            ${settings.markColor === 38 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-orange-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 38 ? "border-solid border-text" : "border-palette-orange-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 38 })}
        ></div>
        <div
          className={`border-[2px] hidden xl:block
            ${settings.markColor === 40 ? "hover:border-text" : "hover:border-border-hover"}
            h-4 w-4 hover:drop-shadow-sm bg-palette-moon-dull rounded-full
            transtion ease-in-out hover:scale-150 duration-100
            ${settings.markColor === 40 ? "border-solid border-text" : "border-palette-moon-dull"}`}
          onClick={() => setSettings({ ...settings, markColor: 40 })}
        ></div>
      </div>
    </div>
  );
}
