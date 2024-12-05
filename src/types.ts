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
  settingsFormat: SettingsFormat;
  labelOffset: number;
  darkMode: boolean;
  nodeRadius: number;
  fontSize: number;
  nodeBorderWidthHalf: number;
  edgeLength: number;
  edgeLabelSeparation: number;
  showComponents: boolean;
  showBridges: boolean;
  treeMode: boolean;
  lockMode: boolean;
  fixedMode: boolean;
  multiedgeMode: boolean;
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
