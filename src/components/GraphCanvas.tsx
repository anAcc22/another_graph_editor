import { Graph, InputFormat } from "../types";
import { Settings } from "../types";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

import { updateDirectedEdges } from "./animateGraphEdges";
import { updateSettingsEdges } from "./animateGraphEdges";
import { animateGraphEdges } from "./animateGraphEdges";

import { resizeGraphEdges } from "./animateGraphEdges";
import { updateGraphEdges } from "./animateGraphEdges";

import { updateDirectedParChild } from "./animateGraphParChild";
import { updateSettingsParChild } from "./animateGraphParChild";
import { animateGraphParChild } from "./animateGraphParChild";

import { resizeGraphParChild } from "./animateGraphParChild";
import { updateGraphParChild } from "./animateGraphParChild";

interface Props {
  graph: Graph;
  inputFormatToRender: string;
  inputFormat: InputFormat;
  directed: boolean;
  settings: Settings;
}

export function GraphCanvas({
  graph,
  inputFormatToRender,
  inputFormat,
  directed,
  settings,
}: Props) {
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

      if (inputFormatToRender === "edges") {
        resizeGraphEdges(
          rect.width - canvasBorderX,
          rect.height - canvasBorderY,
        );
      } else {
        resizeGraphParChild(
          rect.width - canvasBorderX,
          rect.height - canvasBorderY,
        );
      }
    };

    resizeCanvas();

    if (inputFormatToRender === "edges") {
      animateGraphEdges(canvas, ctx, setImage);
    } else {
      animateGraphParChild(canvas, ctx, setImage);
    }

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (inputFormat === "edges") {
      updateGraphEdges(graph);
    } else {
      updateGraphParChild(graph);
    }
  }, [graph]);

  useEffect(() => {
    updateDirectedEdges(directed);
    updateDirectedParChild(directed);
  }, [directed]);

  useEffect(() => {
    updateSettingsEdges(settings);
    updateSettingsParChild(settings);
  }, [settings]);

  return (
    <div
      className={
        inputFormat === inputFormatToRender ? "flex h-screen" : "invisible"
      }
    >
      <div
        className="flex flex-col sm:w-7/8 sm:h-3/4 lg:w-1/3 xl:w-1/2 lg:h-2/3
          m-auto sm:top-1/8 sm:left-1/16 lg:top-1/2 lg:left-1/2
          lg:-translate-x-1/2 lg:-translate-y-1/2 sm:absolute lg:absolute"
      >
        <canvas
          ref={ref}
          className="active:cursor-pointer h-full border-2 border-border
            hover:border-border-hover rounded-lg bg-block shadow shadow-shadow
            touch-none"
        ></canvas>
        <a
          download="graph.png"
          href={image}
          className="font-jetbrains text-sm w-36 mt-2 text-center border-2
            border-border rounded-lg px-2 py-1 justify-between items-center
            hover:border-border-hover hover:cursor-pointer ml-auto"
        >
          Download (PNG)
        </a>
      </div>
    </div>
  );
}
