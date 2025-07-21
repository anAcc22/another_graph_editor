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
          className={
            settings.markColor === 1
              ? `h-4 w-4 hover:drop-shadow-sm rounded-full outline bg-text
                outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-text`
              : `h-4 w-4 hover:drop-shadow-sm rounded-full transition
                ease-in-out hover:scale-150 duration-100 hover:border-text
                border-dotted border-text border-2`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 1 });
                localStorage.setItem("markColor", "1");
              }}
        ></div>
        <div
          className={
            settings.markColor === 3
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-yellow rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-yellow`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-yellow rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 3 });
                localStorage.setItem("markColor", "3");
              }}
        ></div>
        <div
          className={
            settings.markColor === 5
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-lemon rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100 outline-palette-lemon`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-lemon rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 5 });
                localStorage.setItem("markColor", "5");
              }}
        ></div>
        <div
          className={
            settings.markColor === 7
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-lime rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-lime`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-lime rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 7 });
                localStorage.setItem("markColor", "7");
              }}
        ></div>
        <div
          className={
            settings.markColor === 9
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-green rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100 outline-palette-green`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-green rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 9 });
                localStorage.setItem("markColor", "9");
              }}
        ></div>
        <div
          className={
            settings.markColor === 11
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-wood rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-wood`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-wood rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 11 });
                localStorage.setItem("markColor", "11");
              }}
        ></div>
        <div
          className={
            settings.markColor === 13
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-teal rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100 outline-palette-teal`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-teal rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 13 });
                localStorage.setItem("markColor", "13");
              }}
        ></div>
        <div
          className={
            settings.markColor === 15
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-azure rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-azure`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-azure rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 15 });
                localStorage.setItem("markColor", "15");
              }}
        ></div>
        <div
          className={
            settings.markColor === 17
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-sea rounded-full hidden
                xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100 outline-palette-sea`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-sea rounded-full hidden
                xl:block transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 17 });
                localStorage.setItem("markColor", "17");
              }}
        ></div>
        <div
          className={
            settings.markColor === 19
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-blue rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-blue`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-blue rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 19 });
                localStorage.setItem("markColor", "19");
              }}
        ></div>
        <div
          className={
            settings.markColor === 21
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-flower rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100 outline-palette-flower`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-flower rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 21 });
                localStorage.setItem("markColor", "21");
              }}
        ></div>
        <div
          className={
            settings.markColor === 23
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-purple rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-purple`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-purple rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 23 });
                localStorage.setItem("markColor", "23");
              }}
        ></div>
        <div
          className={
            settings.markColor === 25
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-violet rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100 outline-palette-violet`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-violet rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 25 });
                localStorage.setItem("markColor", "25");
              }}
        ></div>
        <div
          className={
            settings.markColor === 27
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-grape rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-grape`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-grape rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 27 });
                localStorage.setItem("markColor", "27");
              }}
        ></div>
        <div
          className={
            settings.markColor === 29
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-pink rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100 outline-palette-pink`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-pink rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 29 });
                localStorage.setItem("markColor", "29");
              }}
        ></div>
        <div
          className={
            settings.markColor === 31
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-sakura rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-sakura`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-sakura rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 31 });
                localStorage.setItem("markColor", "31");
              }}
        ></div>
        <div
          className={
            settings.markColor === 33
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-flesh rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100 outline-palette-flesh`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-flesh rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 33 });
                localStorage.setItem("markColor", "33");
              }}
        ></div>
        <div
          className={
            settings.markColor === 35
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-raw rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-raw`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-raw rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 35 });
                localStorage.setItem("markColor", "35");
              }}
        ></div>
        <div
          className={
            settings.markColor === 37
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-orange rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100 outline-palette-orange`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-orange rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 37 });
                localStorage.setItem("markColor", "37");
              }}
        ></div>
        <div
          className={
            settings.markColor === 39
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-moon rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-moon`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-moon rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 39 });
                localStorage.setItem("markColor", "39");
              }}
        ></div>
      </div>

      <div className="flex space-x-1.5">
        <div
          className={
            settings.markColor === 2
              ? `h-4 w-4 hover:drop-shadow-sm rounded-full outline bg-format-bad
                outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-format-bad`
              : `h-4 w-4 hover:drop-shadow-sm rounded-full transition
                ease-in-out hover:scale-150 duration-100 hover:border-format-bad
                border-dotted border-format-bad border-2`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 2 });
                localStorage.setItem("markColor", "2");
              }}
        ></div>
        <div
          className={
            settings.markColor === 4
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-yellow-dull
                rounded-full outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100
                outline-palette-yellow-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-yellow-dull
                rounded-full transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 4 });
                localStorage.setItem("markColor", "4");
              }}
        ></div>
        <div
          className={
            settings.markColor === 6
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-lemon-dull rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100
                outline-palette-lemon-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-lemon-dull rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 6 });
                localStorage.setItem("markColor", "6");
              }}
        ></div>
        <div
          className={
            settings.markColor === 8
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-lime-dull rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-lime-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-lime-dull rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 8 });
                localStorage.setItem("markColor", "8");
              }}
        ></div>
        <div
          className={
            settings.markColor === 10
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-green-dull rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100
                outline-palette-green-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-green-dull rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 10 });
                localStorage.setItem("markColor", "10");
              }}
        ></div>
        <div
          className={
            settings.markColor === 12
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-wood-dull rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-wood-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-wood-dull rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 12 });
                localStorage.setItem("markColor", "12");
              }}
        ></div>
        <div
          className={
            settings.markColor === 14
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-teal-dull rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100
                outline-palette-teal-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-teal-dull rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 14 });
                localStorage.setItem("markColor", "14");
              }}
        ></div>
        <div
          className={
            settings.markColor === 16
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-azure-dull rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-azure-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-azure-dull rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 16 });
                localStorage.setItem("markColor", "16");
              }}
        ></div>
        <div
          className={
            settings.markColor === 18
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-sea-dull rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100
                outline-palette-sea-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-sea-dull rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 18 });
                localStorage.setItem("markColor", "18");
              }}
        ></div>
        <div
          className={
            settings.markColor === 20
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-blue-dull rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-blue-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-blue-dull rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 20 });
                localStorage.setItem("markColor", "20");
              }}
        ></div>
        <div
          className={
            settings.markColor === 22
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-flower-dull hidden
                xl:block rounded-full outline outline-2 outline-offset-2
                transition ease-in-out hover:scale-150 duration-100
                outline-palette-flower-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-flower-dull hidden
                xl:block rounded-full transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 22 });
                localStorage.setItem("markColor", "22");
              }}
        ></div>
        <div
          className={
            settings.markColor === 24
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-purple-dull
                rounded-full outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100
                outline-palette-purple-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-purple-dull
                rounded-full transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 24 });
                localStorage.setItem("markColor", "24");
              }}
        ></div>
        <div
          className={
            settings.markColor === 26
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-violet-dull hidden
                xl:block rounded-full outline outline-2 outline-offset-2
                transition ease-in-out hover:scale-150 duration-100
                outline-palette-violet-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-violet-dull hidden
                xl:block rounded-full transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 26 });
                localStorage.setItem("markColor", "26");
              }}
        ></div>
        <div
          className={
            settings.markColor === 28
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-grape-dull rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-grape-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-grape-dull rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 28 });
                localStorage.setItem("markColor", "28");
              }}
        ></div>
        <div
          className={
            settings.markColor === 30
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-pink-dull rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100
                outline-palette-pink-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-pink-dull rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 30 });
                localStorage.setItem("markColor", "30");
              }}
        ></div>
        <div
          className={
            settings.markColor === 32
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-sakura-dull
                rounded-full outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100
                outline-palette-sakura-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-sakura-dull
                rounded-full transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 32 });
                localStorage.setItem("markColor", "32");
              }}
        ></div>
        <div
          className={
            settings.markColor === 34
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-flesh-dull rounded-full
                hidden xl:block outline outline-2 outline-offset-2 transition
                ease-in-out hover:scale-150 duration-100
                outline-palette-flesh-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-flesh-dull rounded-full
                hidden xl:block transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 34 });
                localStorage.setItem("markColor", "34");
              }}
        ></div>
        <div
          className={
            settings.markColor === 36
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-raw-dull rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-raw-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-raw-dull rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 36 });
                localStorage.setItem("markColor", "36");
              }}
        ></div>
        <div
          className={
            settings.markColor === 38
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-orange-dull hidden
                xl:block rounded-full outline outline-2 outline-offset-2
                transition ease-in-out hover:scale-150 duration-100
                outline-palette-orange-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-orange-dull hidden
                xl:block rounded-full transition ease-in-out hover:scale-150
                duration-100 hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 38 });
                localStorage.setItem("markColor", "38");
              }}
        ></div>
        <div
          className={
            settings.markColor === 40
              ? `h-4 w-4 hover:drop-shadow-sm bg-palette-moon-dull rounded-full
                outline outline-2 outline-offset-2 transition ease-in-out
                hover:scale-150 duration-100 outline-palette-moon-dull`
              : `h-4 w-4 hover:drop-shadow-sm bg-palette-moon-dull rounded-full
                transition ease-in-out hover:scale-150 duration-100
                hover:border-text`
          }
          onClick={() => {
                setSettings({ ...settings, markColor: 40 });
                localStorage.setItem("markColor", "40");
              }}
        ></div>
      </div>
    </div>
  );
}
