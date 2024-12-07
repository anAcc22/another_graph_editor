import { TestCases } from "../types";
import { Settings } from "../types";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

import { GraphPalette } from "./GraphPalette";

import { updateDirected } from "./animateGraph";
import { updateSettings } from "./animateGraph";
import { animateGraph } from "./animateGraph";

import { resizeGraph } from "./animateGraph";
import { updateGraph } from "./animateGraph";

interface Props {
  testCases: TestCases;
  directed: boolean;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

export function GraphCanvas({ testCases, directed, settings, setSettings }: Props) {
  let ref = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<string>();

  useEffect(() => {
    let font = new FontFace(
      "JB",
      "url(/another_graph_editor/JetBrainsMono-Bold.ttf)",
    );

    font.load();
    document.fonts.add(font);

    let canvas = ref.current;

    if (canvas === null) {
      console.log("Error: `canvas` is null!");
      return;
    }

    let ctx = canvas.getContext("2d");

    if (ctx === null) {
      console.log("Error: `ctx` is null!");
      return;
    }

    const resizeCanvas = (): void => {
      const canvasBorderX = canvas.offsetWidth - canvas.clientWidth;
      const canvasBorderY = canvas.offsetHeight - canvas.clientHeight;

      const pixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      const width = pixelRatio * rect.width;
      const height = pixelRatio * rect.height;

      canvas.width = width;
      canvas.height = height;

      ctx.scale(pixelRatio, pixelRatio);

      resizeGraph(rect.width - canvasBorderX, rect.height - canvasBorderY);
    };

    resizeCanvas();

    animateGraph(canvas, ctx, setImage);

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    updateGraph(testCases);
  }, [testCases]);

  useEffect(() => {
    updateDirected(directed);
  }, [directed]);

  useEffect(() => {
    updateSettings(settings);
  }, [settings]);

  return (
    <div className="flex h-screen">
      <div
        className="flex flex-col sm:w-7/8 sm:h-3/4 lg:w-1/3 xl:w-1/2 lg:h-2/3
          m-auto sm:top-1/8 sm:left-1/16 lg:top-1/2 lg:left-1/2
          lg:-translate-x-1/2 lg:-translate-y-1/2 sm:absolute lg:absolute"
      >
        <GraphPalette settings={settings} setSettings={setSettings} />
        <canvas
          ref={ref}
          className="active:cursor-pointer h-full border-2 border-border
            hover:border-border-hover rounded-lg bg-block shadow shadow-shadow
            touch-none"
        ></canvas>
        <a
          download="graph.png"
          href={image}
          className="font-jetbrains text-sm w-36 mt-3 text-center border-2
            border-border rounded-lg px-2 py-1 justify-between items-center
            hover:border-border-hover hover:cursor-pointer ml-auto"
        >
          Download (PNG)
        </a>
      </div>
    </div>
  );
}
