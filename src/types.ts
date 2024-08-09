export interface Graph {
  nodes: string[],
  adj: Map<string, string[]>;
  edges: string[]
}

export interface ParsedGraph {
  status: "OK" | "BAD";
  graph?: Graph;
}
