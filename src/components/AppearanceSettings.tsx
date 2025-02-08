import { Settings } from "../types";
import { SettingsToggleSection } from "./SettingsToggleSection";

interface Props {
  directed: boolean;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function AppearanceSettings({ settings, setSettings }: Props) {
  return (
    <>
      <div
        className={
          settings.settingsFormat === "appearance"
            ? `font-jetbrains flex flex-col border-2 rounded-lg bg-block
              shadow-shadow shadow border-border hover:border-border-hover p-3
              space-y-3`
            : "hidden"
        }
      >
        <SettingsToggleSection
          title={settings.language == "en" ? "Theme" : "色彩模式"}
          leftLabel={settings.language == "en" ? "Light" : "白天"}
          rightLabel={settings.language == "en" ? "Dark" : "黑夜"}
          toggleId={"settingsTheme"}
          settingsName={"darkMode"}
          settings={settings}
          setSettings={setSettings}
        />

        <hr className="border-dashed border-border" />

        <h4 className="font-semibold">
          {settings.language == "en" ? "Node Radius" : "结点半径"}
        </h4>
        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={settings.nodeRadius - 16}
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
            const newRadius = 16 + Number.parseInt(e.target.value);
            setSettings({
              ...settings,
              nodeRadius: newRadius,
            });
            localStorage.setItem("nodeRadius", newRadius.toString());
          }}
        />

        <h4 className="font-semibold">
          {settings.language == "en" ? "Font Size" : "字体大小"}
        </h4>
        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={settings.fontSize - 10}
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
            const newFontSize = 10 + Number.parseInt(e.target.value);
            setSettings({
              ...settings,
              fontSize: newFontSize,
            });
            localStorage.setItem("fontSize", newFontSize.toString());
          }}
        />

        <h4 className="font-semibold">
          {settings.language == "en" ? "Line Thickness" : "线条粗细"}
        </h4>
        <input
          type="range"
          min={0}
          max={1.5}
          step={0.1}
          value={settings.nodeBorderWidthHalf - 1}
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
            const newBorderWidthHalf = 1 + Number.parseFloat(e.target.value);
            setSettings({
              ...settings,
              nodeBorderWidthHalf: newBorderWidthHalf,
            });
            localStorage.setItem(
              "nodeBorderWidthHalf",
              newBorderWidthHalf.toString(),
            );
          }}
        />

        <h4 className="font-semibold">
          {settings.language == "en" ? "Edge Length" : "边缘长度"}
        </h4>
        <input
          type="range"
          min={0}
          max={75}
          step={5}
          value={settings.edgeLength - 10}
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
            const newEdgeLength = 10 + Number.parseInt(e.target.value);
            setSettings({
              ...settings,
              edgeLength: newEdgeLength,
            });
            localStorage.setItem("edgeLength", newEdgeLength.toString());
          }}
        />

        <h4 className="font-semibold">
          {settings.language == "en" ? "Edge Label Separation" : "边缘标签分隔"}
        </h4>
        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={settings.edgeLabelSeparation - 10}
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
            const newEdgeLabelSeparation = 10 + Number.parseInt(e.target.value);
            setSettings({
              ...settings,
              edgeLabelSeparation: newEdgeLabelSeparation,
            });
            localStorage.setItem(
              "edgeLabelSeparation",
              newEdgeLabelSeparation.toString(),
            );
          }}
        />

        <br />
      </div>
    </>
  );
}
