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
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function GraphCanvas({
  testCases,
  directed,
  settings,
  setSettings,
}: Props) {
  let refMain = useRef<HTMLCanvasElement>(null);
  let refOverall = useRef<HTMLCanvasElement>(null);
  let refAnnotation = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<string>();

  const resizeCanvasMain = (): void => {
    let canvas = refMain.current;

    if (canvas === null) {
      console.log("Error: `canvas` is null!");
      return;
    }

    let ctx = canvas.getContext("2d");

    if (ctx === null) {
      console.log("Error: `ctx` is null!");
      return;
    }

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

  const resizeCanvasOverall = (): void => {
    let canvas = refOverall.current;

    if (canvas === null) {
      console.log("Error: `canvas` is null!");
      return;
    }

    let ctx = canvas.getContext("2d");

    if (ctx === null) {
      console.log("Error: `ctx` is null!");
      return;
    }

    const pixelRatio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    const width = pixelRatio * rect.width;
    const height = pixelRatio * rect.height;

    canvas.width = width;
    canvas.height = height;

    ctx.scale(pixelRatio, pixelRatio);

    canvas = refAnnotation.current;

    if (canvas === null) {
      console.log("Error: `canvas` is null!");
      return;
    }

    ctx = canvas.getContext("2d");

    if (ctx === null) {
      console.log("Error: `ctx` is null!");
      return;
    }

    const annotations = ctx.getImageData(0, 0, canvas.width, canvas.height);

    canvas.width = width;
    canvas.height = height;

    ctx.scale(pixelRatio, pixelRatio);

    ctx.putImageData(annotations, 0, 0);
  };

  const resizeCanvas = (): void => {
    resizeCanvasMain();
    resizeCanvasOverall();
  };

  useEffect(() => {
    let font = new FontFace(
      "JB",
      "url(/another_graph_editor/JetBrainsMono-Bold.ttf)",
    );

    font.load();
    document.fonts.add(font);

    let canvasMain = refMain.current;
    let canvasOverall = refOverall.current;
    let canvasAnnotation = refAnnotation.current;

    if (
      canvasMain === null ||
      canvasOverall === null ||
      canvasAnnotation === null
    ) {
      console.log("Error: canvas is null!");
      return;
    }

    let ctxMain = canvasMain.getContext("2d");
    let ctxOverall = canvasOverall.getContext("2d");
    let ctxAnnotation = canvasAnnotation.getContext("2d");

    if (ctxMain === null || ctxOverall === null || ctxAnnotation === null) {
      console.log("Error: canvas context is null!");
      return;
    }

    resizeCanvas();

    animateGraph(
      canvasMain,
      canvasOverall,
      canvasAnnotation,
      ctxMain,
      ctxOverall,
      ctxAnnotation,
      setImage,
    );

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

  useEffect(() => {
    resizeCanvasMain();
    resizeCanvasOverall();
  }, [settings.expandedCanvas]);

  return (
    <div className="flex h-screen">
      <div
        className={
          settings.expandedCanvas
            ? `flex flex-col sm:w-7/8 sm:h-3/4 sm:top-1/8 sm:left-1/16 lg:h-4/5
              lg:top-1/2 xl:left-1/4 xl:w-29/40 lg:left-1/3 lg:w-5/8 m-auto
              lg:-translate-y-1/2 sm:absolute lg:absolute`
            : `flex flex-col sm:w-7/8 sm:h-3/4 lg:w-1/3 xl:w-1/2 lg:h-2/3 m-auto
              sm:top-1/8 sm:left-1/16 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2
              lg:-translate-y-1/2 sm:absolute lg:absolute`
        }
      >
        <div className="flex justify-between items-end font-jetbrains">
          <GraphPalette settings={settings} setSettings={setSettings} />
          <div className="flex space-x-3 mb-3">
            <button
              className={
                settings.drawMode === "node"
                  ? `inline-flex transition-[border] duration-500 ease-in-out
                    hover:rounded-3xl border-2 border-clear-normal
                    bg-clear-hover text-center text-lg hover:border-border-hover
                    hover:bg-clear-active rounded-md w-7 h-7 items-center
                    justify-center active:bg-tab-active pl-[3px] pb-1`
                  : `inline-flex transition duration-500 ease-in-out
                    hover:rounded-3xl border-2 border-border text-center text-lg
                    hover:border-border-hover hover:bg-bg-tab-hover rounded-md
                    w-7 h-7 items-center justify-center active:bg-tab-active
                    pl-[3px] pb-1`
              }
              title={settings.language == "en" ? "Node" : "结点"}
              onClick={() => {
                setSettings({
                  ...settings,
                  drawMode: "node",
                });
              }}
            >
              ⭓
            </button>
            <button
              className={
                settings.drawMode === "pen"
                  ? `inline-flex transition-[border] duration-500 ease-in-out
                    hover:rounded-3xl border-2 border-clear-normal
                    bg-clear-hover text-center text-lg hover:border-border-hover
                    hover:bg-clear-active rounded-md w-7 h-7 items-center
                    justify-center active:bg-tab-active pb-0.5`
                  : `inline-flex transition duration-500 ease-in-out
                    hover:rounded-3xl border-2 border-border text-center text-lg
                    hover:border-border-hover hover:bg-bg-tab-hover rounded-md
                    w-7 h-7 items-center justify-center active:bg-tab-active
                    pb-0.5`
              }
              title={settings.language == "en" ? "Pen" : "画笔"}
              onClick={() => {
                setSettings({
                  ...settings,
                  drawMode: "pen",
                });
              }}
            >
              🖋
            </button>
            <button
              className={
                settings.drawMode === "erase"
                  ? `inline-flex transition-[border] duration-500 ease-in-out
                    hover:rounded-3xl border-2 border-clear-normal
                    bg-clear-hover text-center text-lg hover:border-border-hover
                    hover:bg-clear-active rounded-md w-7 h-7 items-center
                    justify-center active:bg-tab-active pb-[5px]`
                  : `inline-flex transition duration-500 ease-in-out
                    hover:rounded-3xl border-2 border-border text-center text-lg
                    hover:border-border-hover hover:bg-bg-tab-hover rounded-md
                    w-7 h-7 items-center justify-center active:bg-tab-active
                    pb-[5px]`
              }
              title={settings.language == "en" ? "Eraser" : "橡皮擦"}
              onClick={() => {
                setSettings({
                  ...settings,
                  drawMode: "erase",
                });
              }}
            >
              ⌫
            </button>
            <button
              className="inline-flex transition-[border] duration-500
                ease-in-out hover:rounded-3xl border-2 border-border text-center
                text-lg hover:border-border-hover rounded-md w-7 h-7
                items-center justify-center active:bg-tab-active pl-[1px]
                pb-[1px]"
              title={
                settings.language == "en"
                  ? "Clear ALL Annotations"
                  : "清除所有图纸"
              }
              onClick={() => {
                let canvas = refAnnotation.current;

                if (canvas === null) {
                  console.log("Error: `canvas` is null!");
                  return;
                }

                let ctx = canvas.getContext("2d");

                if (ctx === null) {
                  console.log("Error: `ctx` is null!");
                  return;
                }

                ctx.clearRect(0, 0, 5000, 5000);
              }}
            >
              ♦
            </button>

            <div className="hidden lg:inline-flex"></div>
            <div className="hidden lg:inline-flex"></div>
            <div className="hidden lg:inline-flex"></div>

            <button
              className="hidden lg:inline-flex transition duration-500
                ease-in-out hover:rounded-3xl border-2 border-border text-center
                text-lg hover:border-border-hover hover:bg-bg-tab-hover
                rounded-md w-7 h-7 items-center justify-center
                active:bg-tab-active pb-0.5"
              title={
                settings.language == "en"
                  ? "Expand/Contract Canvas"
                  : "展开/收缩画布"
              }
              onClick={() => {
                setSettings({
                  ...settings,
                  expandedCanvas: settings.expandedCanvas ? false : true,
                });
              }}
            >
              {settings.expandedCanvas ? "<~" : "~>"}
            </button>
          </div>
        </div>
        <div className="h-full w-full relative">
          <canvas
            ref={refOverall}
            className="active:cursor-pointer border-2 border-border
              hover:border-border-hover rounded-lg shadow shadow-shadow
              touch-none top-0 bottom-0 left-0 right-0 w-full h-full absolute"
          ></canvas>
          <canvas
            ref={refMain}
            className="active:cursor-pointer border-2 border-border
              hover:border-border-hover rounded-lg bg-block shadow shadow-shadow
              touch-none top-0 bottom-0 left-0 right-0 w-full h-full absolute"
          ></canvas>
          <canvas
            ref={refAnnotation}
            className={
              settings.drawMode === "node"
                ? `active:cursor-pointer border-2 border-border
                  pointer-events-none hover:border-border-hover rounded-lg
                  shadow shadow-shadow touch-none top-0 bottom-0 left-0 right-0
                  w-full h-full absolute`
                : settings.drawMode === "pen"
                  ? `cursor-cell border-2 border-border
                    hover:border-border-hover rounded-lg shadow shadow-shadow
                    touch-none top-0 bottom-0 left-0 right-0 w-full h-full
                    absolute`
                  : `cursor-crosshair border-2 border-border
                    hover:border-border-hover rounded-lg shadow shadow-shadow
                    touch-none top-0 bottom-0 left-0 right-0 w-full h-full
                    absolute`
            }
          ></canvas>
        </div>
        <a
          download="graph.png"
          href={image}
          className="font-jetbrains text-sm mt-3 text-center border-2
            border-border rounded-lg px-2 py-1 justify-between items-center
            hover:border-border-hover hover:cursor-pointer ml-auto
            active:bg-tab-active"
        >
          {settings.language == "en" ? "Download (PNG)" : "下载 (PNG)"}
        </a>
      </div>
    </div>
  );
}
