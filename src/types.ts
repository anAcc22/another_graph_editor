export interface Graph {
  nodes: string[];
  adj: Map<string, string[]>;
  rev: Map<string, string[]>;
  edges: string[];
}

export interface Settings {
  darkMode: boolean;
  showComponents: boolean;
  showBridges: boolean;
  treeMode: boolean;
  lockMode: boolean;
}

export interface ParsedGraph {
  status: "OK" | "BAD";
  graph?: Graph;
}

export type ColorMap = Map<string, number>;

export type CutMap = Map<string, boolean>;

export type Layer = [number, number];

export type LayerMap = Map<string, Layer>;

export type BackedgeMap = Map<string, boolean>;
export type BridgeMap = Map<string, boolean>;
