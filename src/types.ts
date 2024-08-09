export interface Graph {
  nodes: number[],
  adj: Map<number, number[]>;
  edges: String[]
}

export interface ParsedGraph {
  status: "OK" | "BAD";
  graph?: Graph;
}
