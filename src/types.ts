export interface Graph {
  nodes: string[];
  adj: Map<string, string[]>;
  rev: Map<string, string[]>;
  edges: string[];
  edgeLabels: Map<string, string>;
  nodeLabels: Map<string, string>;
}

export interface TestCase {
  /* NOTE: <<- Summary ->>
   * Each testcase encompasses two graphs internally, the first being
   * the graph parsed from the "edges" input format, and the second being
   * the graph parsed from the "parentChild" input format.
   *
   * Consider implementing an adjacency matrix input format in the future.
   */
  graphEdges: Graph;
  graphParChild: Graph;
  inputFormat: InputFormat;
}

export type TestCases = Map<number, TestCase>;

export interface Settings {
  language: "en" | "cn";
  drawMode: "node" | "pen" | "erase";
  expandedCanvas: boolean;
  markBorder: MarkBorder;
  markColor: number;
  settingsFormat: SettingsFormat;
  labelOffset: number;
  darkMode: boolean;
  nodeRadius: number;
  fontSize: number;
  nodeBorderWidthHalf: number;
  edgeLength: number;
  edgeLabelSeparation: number;
  penThickness: number;
  penTransparency: number;
  eraserRadius: number;
  testCaseBoundingBoxes: boolean;
  showComponents: boolean;
  showBridges: boolean;
  showMSTs: boolean;
  treeMode: boolean;
  bipartiteMode: boolean;
  gridMode: boolean;
  lockMode: boolean;
  markedNodes: boolean;
  fixedMode: boolean;
  multiedgeMode: boolean;
  collisionAvoidance: boolean;
  collisionStrength: number;
  minNodeDistance: number;
}

export interface ParsedGraph {
  status: "OK" | "BAD";
  graph?: Graph;
}

export type InputFormat = "edges" | "parentChild";
export type SettingsFormat = "general" | "appearance";

export type ColorMap = Map<string, number>;

export type CutMap = Map<string, boolean>;

export type Layer = [number, number];

export type LayerMap = Map<string, Layer>;

export type BackedgeMap = Map<string, boolean>;
export type BridgeMap = Map<string, boolean>;

export type MSTMap = Map<string, boolean>;

export type Position = [number, number];
export interface PositionMap {
  positions: Map<string, Position>;
  gridWidth: number;
  gridHeight: number;
}

export type MarkBorder = "single" | "double";

export interface Randomizer {
  indexing: number;
  nodeCount: string;
  edgeCount: string;
  connected: boolean;
  tree: boolean;
  hasNodeLabel: boolean;
  nodeLabelMin: string;
  nodeLabelMax: string;
  hasEdgeLabel: boolean;
  edgeLabelMin: string;
  edgeLabelMax: string;
}
