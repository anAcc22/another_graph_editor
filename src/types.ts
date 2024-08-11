export interface Graph {
  nodes: string[];
  adj: Map<string, string[]>;
  rev: Map<string, string[]>;
  edges: string[];
}

export interface Settings {
  showComponents: boolean;
}

export interface ParsedGraph {
  status: "OK" | "BAD";
  graph?: Graph;
}

export type ColorMap = Map<string, number> | undefined;
