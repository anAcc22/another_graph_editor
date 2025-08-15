import { Position, PositionMap } from "../types";

interface Cell {
  i: number,
  j: number,
}

function distance(a: Cell, b: Cell): number {
  return Math.hypot(a.i - b.i, a.j - b.j);
}

const TIME_LIMIT_SECONDS = 0.25;

class RandomTable {
  private table: Array<number>;
  private idx = 0;

  constructor() {
    this.table = [];
    this.idx = 0;
  }

  reset(): void {
    this.idx = 0;
  }

  // return a value in [0, N)
  getNext(N: number): number {
    if (this.idx >= this.table.length) {
      this.table.push(Math.random());
    }
    return Math.floor(this.table[this.idx++] * N);
  }
}

let randomTable: RandomTable = new RandomTable();

export function buildGraphGrid(
  nodes: string[],
  adjMap: Map<string, Set<string>>,
  aspectRatio: number,
): PositionMap {
  let gridWidth = 1;
  let gridHeight = 1;
  while (gridWidth * gridHeight < nodes.length) {
    if (gridWidth / gridHeight < aspectRatio) {
      gridWidth += 1;
    } else {
      gridHeight += 1;
    }
  }

  const nodeIndex = new Map<String, number>();
  for (let i = 0; i < nodes.length; ++i) {
    nodeIndex.set(nodes[i], i);
  }

  const adj = new Array<Array<number>>();
  for (let i = 0; i < nodes.length; ++i) {
    const adjList = new Array<number>();
    for (const node of adjMap.get(nodes[i])!) {
      adjList.push(nodeIndex.get(node)!);
    }
    adj.push(adjList);
  }

  let nodeCell = new Array(gridWidth * gridHeight).fill({i: 0, j: 0});
  // This makes it easier to allow swaps between reals nodes and empty cells later
  while (adj.length < nodeCell.length) {
    adj.push(new Array<number>());
  }

  // Run bfs for every component, place each vertex as close to its parent as possible
  {
    const used = new Array(adj.length).fill(false);
    const usedCells = new Array<Array<boolean>>();
    for (let i = 0; i < gridWidth; ++i) {
      usedCells.push(new Array(gridHeight).fill(false));
    }
    for (let v = 0; v < adj.length; ++v) {
      if (used[v]) {
        continue;
      }
      const queue = new Array<number>();
      queue.push(v);
      used[v] = true;
      {
        let found = false;
        for (let i = 0; i < gridWidth; ++i) {
          for (let j = 0; j < gridHeight; ++j) {
            if (!usedCells[i][j]) {
              usedCells[i][j] = true;
              nodeCell[v] = {i, j};
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }
      let iqueue = 0;
      while (iqueue < queue.length) {
        let v = queue[iqueue];
        ++iqueue;
        const {i, j} = nodeCell[v];
        let minDist = 1;
        for (const u of adj[v]) {
          if (used[u]) {
            continue;
          }
          let found = false;
          // Technically this iterates in the order of increasing Manhattan distance, and later we optimize Euclidean distance, but it's fiiine
          for (; minDist <= gridWidth + gridHeight; ++minDist) {
            for (let di = -minDist; di <= minDist; ++di) {
              if (i + di < 0 || i + di >= gridWidth) {
                continue;
              }
              const djabs = minDist - Math.abs(di);
              for (const dj of [-djabs, djabs]) {
                if (j + dj < 0 || j + dj >= gridHeight) {
                  continue;
                }
                if (!usedCells[i + di][j + dj]) {
                  usedCells[i + di][j + dj] = true;
                  nodeCell[u] = {i: i + di, j: j + dj};
                  found = true;
                  break;
                }
              }
              if (found) {
                break;
              }
            }
            if (found) {
              break;
            }
          }
          queue.push(u);
          used[u] = true;
        }
      }
    }
  }

  let totalDistance = 0;
  for (let u = 0; u < nodes.length; ++u) {
    for (const v of adj[u]) {
      if (u < v) {
        totalDistance += distance(nodeCell[u], nodeCell[v]);
      }
    }
  }

  // Randomly swap nodes if it decreases total edge length

  randomTable.reset();
  if (nodes.length >= 2) {
    const startTime = performance.now();
    for (let it = 0; it < nodes.length * nodes.length * 10; ++it) {
      if ((performance.now() - startTime) / 1000 > TIME_LIMIT_SECONDS) {
        break;
      }
      const u = randomTable.getNext(adj.length);
      let v = u;
      while (u === v) {
        v = randomTable.getNext(adj.length);
      }

      function swapCells() {
        let tmp = nodeCell[u];
        nodeCell[u] = nodeCell[v];
        nodeCell[v] = tmp;
      }

      let diff = 0;
      for (const node of [u, v]) {
        for (const x of adj[node]) {
          if (x !== u && x !== v) {
            diff -= distance(nodeCell[node], nodeCell[x]);
          }
        }
      }
      swapCells();
      for (const node of [u, v]) {
        for (const x of adj[node]) {
          if (x !== u && x !== v) {
            diff += distance(nodeCell[node], nodeCell[x]);
          }
        }
      }

      if (diff <= 0) {
        totalDistance += diff;
      } else {
        swapCells();
      }
    }
  }

  const result = new Map<string, Position>();
  for (let i = 0; i < nodes.length; ++i) {
    result.set(nodes[i], [nodeCell[i].i + 0.5, nodeCell[i].j + 0.5]);
  }

  return {
    positions: result,
    gridWidth,
    gridHeight,
  };
}
