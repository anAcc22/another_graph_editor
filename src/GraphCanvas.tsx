import { Graph } from "../types";

interface Props {
  graph: Graph;
}

export default function Canvas({ graph }: Props) {
  return (
    <div className="flex h-screen">
      <canvas
        className="border-2 rounded-lg bg-slate-50 shadow-sm border-slate-100"
      ></canvas>
    </div>
  );
}
