import { Graph } from "../types";
import { useRef } from "react";
import { useEffect } from "react";

import { animateGraph } from "./animateGraph";
import { resizeGraph } from "./animateGraph";
import { updateGraph } from "./animateGraph";

interface Props {
  graph: Graph;
}

// const EMPTY_GRAPH: Graph = {
//   nodes: new Array<string>(),
//   adj: new Map<string, string[]>(),
//   edges: new Array<string>(),
// };

export function GraphCanvas({ graph }: Props) {
  let ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let font = new FontFace("JB", "url(/fonts/JetBrainsMono-Bold.ttf)");

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

      resizeGraph(
        rect.width - canvasBorderX,
        rect.height - canvasBorderY,
      );
    };

    resizeCanvas();
    animateGraph(ctx);

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    updateGraph(graph);
  }, [graph.nodes, graph.edges]);

  return (
    <div className="flex h-screen">
      <canvas
        ref={ref}
        className="m-auto w-1/2 h-2/3 border-2 hover:border-slate-300 rounded-lg
          bg-slate-50 shadowborder-slate-100"
      ></canvas>
    </div>
  );
}
