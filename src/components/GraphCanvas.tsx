import { TestCases } from "../types";
import { Settings } from "../types";
import { useRef } from "react";
import { useEffect } from "react";

import { GraphPalette } from "./GraphPalette";

import { updateDirected } from "./animateGraph";
import { updateSettings } from "./animateGraph";
import { animateGraph } from "./animateGraph";

import { resizeGraph } from "./animateGraph";
import { updateGraph } from "./animateGraph";
import { renderGraphToRenderer } from "./animateGraph";

import { SVGRenderer } from "./drawingTools";
import { CanvasRenderer } from "./drawingTools";

interface Props {
  testCases: TestCases;
  directed: boolean;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

function oversampleCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  factor: number,
) {
  const width = canvas.width;
  const height = canvas.height;
  canvas.width = width * factor;
  canvas.height = height * factor;
  ctx.scale(factor, factor);
}

const OVERSAMPLE_FACTOR = 2.0;

export async function loadFontAsBase64(fontPath: string): Promise<string> {
  try {
    const response = await fetch(fontPath);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Not a String"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to load font:", error);
    return "";
  }
}

export function GraphCanvas({
  testCases,
  directed,
  settings,
  setSettings,
}: Props) {
  let refMain = useRef<HTMLCanvasElement>(null);
  let refAnnotation = useRef<HTMLCanvasElement>(null);
  let refIndicator = useRef<HTMLCanvasElement>(null);

  const downloadImage = (): void => {
    let canvasMain = refMain.current;
    let canvasAnnotation = refAnnotation.current;

    if (canvasMain === null) {
      console.log("Error: `canvas(Main)` is null!");
      return;
    }
    if (canvasAnnotation === null) {
      console.log("Error: `canvas(Annotation)` is null!");
      return;
    }

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    if (ctx === null) {
      console.log("Error: `ctx` is null!");
      return;
    }

    canvas.width = canvasMain.width;
    canvas.height = canvasMain.height;

    ctx.drawImage(canvasMain, 0, 0);
    ctx.drawImage(canvasAnnotation, 0, 0);

    let dataURL = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "graph" + Date.now() + ".png";
    a.click();

    URL.revokeObjectURL(dataURL);
    canvas.remove();
    a.remove();
  };

  const downloadSVG = async (): Promise<void> => {
    let canvasMain = refMain.current;
    if (!canvasMain) {
      console.log("Error: canvas is null!");
      return;
    }

    if (SVGRenderer.fontBase64 === "") {
      SVGRenderer.fontBase64 = await loadFontAsBase64(
        "/another_graph_editor/JetBrainsMono-Bold.ttf",
      );
    }

    const pixelRatio = window.devicePixelRatio || 1;

    const svgRenderer = new SVGRenderer(
      canvasMain.width / pixelRatio,
      canvasMain.height / pixelRatio,
    );

    renderGraphToRenderer(svgRenderer);

    const svgContent = svgRenderer.getImage();
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "graph" + Date.now() + ".svg";
    a.click();

    URL.revokeObjectURL(url);
    a.remove();
  };

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

    const pixelRatio = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();

    const width = pixelRatio * rect.width;
    const height = pixelRatio * rect.height;

    const annotations = ctx.getImageData(0, 0, canvas.width, canvas.height);

    canvas.width = width;
    canvas.height = height;

    ctx.scale(pixelRatio, pixelRatio);

    ctx.putImageData(annotations, 0, 0);
  };

  const resizeCanvasIndicator = (): void => {
    let canvas = refIndicator.current;

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
  };

  const resizeCanvas = (): void => {
    resizeCanvasMain();
    resizeCanvasOverall();
    resizeCanvasIndicator();
  };

  useEffect(() => {
    let font = new FontFace(
      "JB",
      "url(/another_graph_editor/JetBrainsMono-Bold.ttf)",
    );

    font.load();
    document.fonts.add(font);

    let canvasMain = refMain.current;
    let canvasAnnotation = refAnnotation.current;
    let canvasIndicator = refIndicator.current;

    if (
      canvasMain === null ||
      canvasAnnotation === null ||
      canvasIndicator === null
    ) {
      console.log("Error: canvas is null!");
      return;
    }

    let mainRenderer = new CanvasRenderer(canvasMain);
    let indicatorRenderer = new CanvasRenderer(canvasIndicator);

    let ctxMain = canvasMain.getContext("2d");
    let ctxAnnotation = canvasAnnotation.getContext("2d");
    let ctxIndicator = canvasIndicator.getContext("2d");

    if (
      mainRenderer === null ||
      ctxMain === null ||
      ctxAnnotation === null ||
      ctxIndicator === null
    ) {
      console.log("Error: canvas context is null!");
      return;
    }

    resizeCanvas();

    animateGraph(
      canvasMain,
      canvasAnnotation,
      mainRenderer,
      indicatorRenderer,
      ctxAnnotation,
    );

    oversampleCanvas(canvasMain, ctxMain, OVERSAMPLE_FACTOR);
    oversampleCanvas(canvasAnnotation, ctxAnnotation, OVERSAMPLE_FACTOR);
    oversampleCanvas(canvasIndicator, ctxIndicator, OVERSAMPLE_FACTOR);

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
    resizeCanvasIndicator();
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
                    justify-center active:bg-tab-active`
                  : `inline-flex transition duration-500 ease-in-out
                    hover:rounded-3xl border-2 border-border text-center text-lg
                    hover:border-border-hover hover:bg-bg-tab-hover rounded-md
                    w-7 h-7 items-center justify-center active:bg-tab-active`
              }
              title={settings.language == "en" ? "Node" : "节点"}
              onClick={() => {
                setSettings({
                  ...settings,
                  drawMode: "node",
                });
                localStorage.setItem("drawMode", "node");
              }}
            >
              <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-text w-3/4 h-3/4 -rotate-45"
              >
                <path
                  d="M11.0605 2.93203C11.3983 2.68689 11.5672 2.56432 11.7518 2.51696C11.9148 2.47514 12.0858 2.47514 12.2488 2.51696C12.4334 2.56432 12.6023 2.68689 12.9401 2.93203L21.0586 8.82396C21.397 9.06956 21.5663 9.19235 21.6686 9.3535C21.7589 9.49579 21.8119 9.65862 21.8224 9.82684C21.8344 10.0174 21.7697 10.2162 21.6404 10.6138L18.5401 20.1449C18.4109 20.5421 18.3463 20.7407 18.2247 20.8876C18.1173 21.0173 17.979 21.1178 17.8224 21.1798C17.6451 21.25 17.4362 21.25 17.0186 21.25H6.98203C6.56437 21.25 6.35554 21.25 6.17822 21.1798C6.02164 21.1178 5.88325 21.0173 5.77589 20.8876C5.65429 20.7407 5.58969 20.5421 5.4605 20.1449L2.36021 10.6138C2.23086 10.2162 2.16619 10.0174 2.17817 9.82684C2.18874 9.65862 2.24166 9.49579 2.33202 9.3535C2.43434 9.19235 2.60355 9.06956 2.94196 8.82396L11.0605 2.93203Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={
                settings.drawMode === "pen"
                  ? `inline-flex transition-[border] duration-500 ease-in-out
                    hover:rounded-3xl border-2 border-clear-normal
                    bg-clear-hover text-center text-lg hover:border-border-hover
                    hover:bg-clear-active rounded-md w-7 h-7 items-center
                    justify-center active:bg-tab-active`
                  : `inline-flex transition duration-500 ease-in-out
                    hover:rounded-3xl border-2 border-border text-center text-lg
                    hover:border-border-hover hover:bg-bg-tab-hover rounded-md
                    w-7 h-7 items-center justify-center active:bg-tab-active`
              }
              title={settings.language == "en" ? "Pen" : "画笔"}
              onClick={() => {
                setSettings({
                  ...settings,
                  drawMode: "pen",
                });
                localStorage.setItem("drawMode", "pen");
              }}
            >
              <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-text w-4/5 h-4/5"
              >
                <path
                  d="M15.4998 5.49994L18.3282 8.32837M3 20.9997L3.04745 20.6675C3.21536 19.4922 3.29932 18.9045 3.49029 18.3558C3.65975 17.8689 3.89124 17.4059 4.17906 16.9783C4.50341 16.4963 4.92319 16.0765 5.76274 15.237L17.4107 3.58896C18.1918 2.80791 19.4581 2.80791 20.2392 3.58896C21.0202 4.37001 21.0202 5.63634 20.2392 6.41739L8.37744 18.2791C7.61579 19.0408 7.23497 19.4216 6.8012 19.7244C6.41618 19.9932 6.00093 20.2159 5.56398 20.3879C5.07171 20.5817 4.54375 20.6882 3.48793 20.9012L3 20.9997Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
                localStorage.setItem("drawMode", "erase");
              }}
            >
              <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-text w-8/9 h-8/9 mt-1.5"
              >
                <g>
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M14 19h7v2h-9l-3.998.002-6.487-6.487a1 1 0 0 1 0-1.414L12.12 2.494a1 1 0 0 1 1.415 0l7.778 7.778a1 1 0 0 1 0 1.414L14 19zm1.657-4.485l3.535-3.536-6.364-6.364-3.535 3.536 6.364 6.364z" />
                </g>
              </svg>
            </button>
            <button
              className="inline-flex transition-[border] duration-500
                ease-in-out hover:rounded-3xl border-2 border-border text-center
                text-lg hover:border-border-hover rounded-md w-7 h-7
                items-center justify-center active:bg-tab-active pl-[0.45px]
                pt-[0.1px]"
              title={
                settings.language == "en"
                  ? "Clear ALL Annotations"
                  : "清除所有笔迹"
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
              <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-text"
              >
                <path
                  d="M9 9L15 15"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 9L9 15"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="hidden xl:inline-flex"></div>
            <div className="hidden xl:inline-flex"></div>
            <div className="hidden xl:inline-flex"></div>

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
                localStorage.setItem("expandedCanvas", (settings.expandedCanvas ? false : true).toString());
              }}
            >
              {settings.expandedCanvas ? (
                <svg
                  width="800px"
                  height="800px"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-text"
                >
                  <path d="M11.7071 9.70711C11.3166 10.0976 10.6834 10.0976 10.2929 9.70711C9.90237 9.31658 9.90237 8.68342 10.2929 8.29289L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L11.7071 9.70711Z" />
                  <path d="M11 10C10.4477 10 10 9.55228 10 9C10 8.44772 10.4477 8 11 8H15C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10H11Z" />
                  <path d="M12 9C12 9.55228 11.5523 10 11 10C10.4477 10 10 9.55228 10 9V5C10 4.44772 10.4477 4 11 4C11.5523 4 12 4.44772 12 5V9Z" />
                  <path d="M5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L8.29289 10.2929C8.68342 9.90237 9.31658 9.90237 9.70711 10.2929C10.0976 10.6834 10.0976 11.3166 9.70711 11.7071L5.70711 15.7071Z" />
                  <path d="M10 15C10 15.5523 9.55228 16 9 16C8.44772 16 8 15.5523 8 15V11C8 10.4477 8.44772 10 9 10C9.55228 10 10 10.4477 10 11V15Z" />
                  <path d="M5 12C4.44772 12 4 11.5523 4 11C4 10.4477 4.44772 10 5 10H9C9.55228 10 10 10.4477 10 11C10 11.5523 9.55228 12 9 12H5Z" />
                </svg>
              ) : (
                <svg
                  width="800px"
                  height="800px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-text"
                >
                  <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="h-full w-full relative">
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
                ? `active:cursor-pointer border-2 border-transparent
                  pointer-events-none hover:border-border-hover rounded-lg
                  shadow shadow-shadow touch-none top-0 bottom-0 left-0 right-0
                  w-full h-full absolute`
                : settings.drawMode === "pen"
                  ? `border-2 border-border hover:border-border-hover rounded-lg
                    shadow shadow-shadow touch-none top-0 bottom-0 left-0
                    right-0 w-full h-full absolute`
                  : `cursor-cell border-2 border-border
                    hover:border-border-hover rounded-lg shadow shadow-shadow
                    touch-none top-0 bottom-0 left-0 right-0 w-full h-full
                    absolute`
            }
          ></canvas>
          <canvas
            ref={refIndicator}
            className="border-2 border-transparent hover:border-border-hover
              rounded-lg shadow shadow-shadow touch-none top-0 bottom-0 left-0
              right-0 w-full h-full absolute pointer-events-none"
          ></canvas>
        </div>
        <div className="flex justify-end">
          <div
            className="font-jetbrains text-sm mt-3 text-center border-2
              border-border rounded-lg px-2 py-1.5 justify-between items-center
              hover:border-border-hover"
          >
            <div className="inline">
              {settings.language == "en" ? "Download" : "下载"}
            </div>
            <a
              onClick={downloadImage}
              className="text-center inline justify-between items-center ml-2
                bg-clear-normal px-1 py-0.5 rounded-md hover:bg-clear-hover
                hover:cursor-pointer active:bg-clear-active"
            >
              PNG
            </a>
            <a
              onClick={downloadSVG}
              className="text-center inline justify-between items-center ml-2
                bg-randomize px-1 py-0.5 rounded-md hover:bg-randomize-hover
                hover:cursor-pointer active:bg-randomize-active"
            >
              SVG
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
