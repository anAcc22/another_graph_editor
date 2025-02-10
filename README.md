# Another Graph Editor

<p align="center">
  <a href="README_zh.md">简体中文</a> | English
</p>

A graph editor inspired by [CS Academy's graph editor](https://csacademy.com/app/graph_editor/),
designed with competitive programming in mind.

Made with React, Typescript, Tailwind CSS, and HTML Canvas.

<p align="center">
    <img src="screenshots/main.png?" />
</p>

<p align="center">
<em>A Multi-Component Graph</em>
</p>

## Features

- Common input formats:
  - A list of edges `u v [w]`, denoting an edge from node `u` to node `v`, where
  `w` is an optional edge label.
  - Leetcode-style adjacency list strings such as `[[2,4],[1,3],[2,1],[4,3]]`;
  ensure that you do **not** put any spaces inside the string.
  - A parent and child array, where `p[i]` and `c[i]` denote an edge from
  node `p[i]` to `c[i]`.
  - Assuming a nonzero number of nodes, you may also label each node. This
  is useful in scenarios where you are offered an array `a`, where `a[i]`
  corresponds to the value at node `i` (simply copy and paste the given array into
  **node labels**).
- Label offset (to convert a zero-indexed input to one-indexed and vice versa)
- Dark/light themes
- Undirected/directed graphs
- Normal/tree/bipartite modes
- Lock mode (fix marked nodes in place)
- Bridges and cut vertices
- (Strongly-connected) components
- Minimum spanning tree(s)
- Multi-edge support
- Multi-testcase support

<p align="center">
    <img src="screenshots/parentChild.png?" />
</p>

<p align="center">
<em>A Demonstration of the Parent-Child Input Format</em>
</p>

<p align="center">
    <img src="screenshots/leetcode.png?" />
</p>

<p align="center">
<em>Leetcode-Style Adjacency Lists Work as Well Under Edges</em>
</p>

> [!NOTE]
> *Tree Mode* and *Bridges* are only available for undirected graphs.

## Usage

Adjust the input format to your liking and type away!

> [!IMPORTANT]
> If you're coming from a platform like [Codeforces](https://codeforces.com/)
> and the input data contains `n m`, representing the number of vertices and
> edges respectively, please **omit** it when copy-pasting the test case data.
> Similarly, if you have an array `p` where `p[i]` represents the parent of `i`,
> double check that the parent array lines up with the child array.

> [!TIP]
> To enter a single node, enter `u` or `u u`.

> [!TIP]
> When entering node labels, if you want to skip over a particular node,
> use the character '_' as a placeholder.

## Handling Multiple Testcases/Graphs

To add a new testcase, click the green button to add a new "tab". You
may enter each test case into its own separate tab. To delete a tab, hover
over the desired tab for a moment, and a red cross will show up. Click
the red cross to delete it.

> [!CAUTION]
> When you delete a tab, all graph data within that tab will be destroyed,
> so please proceed with caution.

## Node Coloring

Using the palette situated above the main canvas, you may select a color
and upon clicking a node, it'll take on your selected color.

> [!CAUTION]
> Your color will override those produced by *Components* or *Bipartite Mode*.

The top leftmost circle in the palette resets the cursor to normal, while
the red circle just below it erases the color of any colored node.

## Configuration

There are two means of configuration: **General** and **Appearance**, the
former handles the main "modes" while the latter lets you control how
the graph is rendered.

### General

#### Components
This mode reveals the connected components of a graph.

> [!NOTE]
> For directed graphs, **strongly connected components** are displayed.

Components are distinguished via different colors.

#### Bridges and Cut Vertices

A *bridge* is an edge that increases the number of components when removed.
A *cut vertice* (aka articulation point) is defined similarly.

Bridges are represented with two parallel lines, while cut vertices take
on a hexagonal shape.

#### Minimum Spanning Tree(s)

If *all* edge weights are provided and they are of numeric value, this mode
becomes available. MSTs are computed for each component, and edges that
are part of the MSTs are bolded.

<p align="center">
    <img src="screenshots/mst.png?" />
</p>

<p align="center">
<em>A Minimum Spanning Tree</em>
</p>

#### Tree Mode

In this mode, the *first* node that appears in the input data becomes the root.
Nodes are arranged in "layers" according to their position within the tree
hierarchy, allowing for easier visualization.

<p align="center">
    <img src="screenshots/twoRootBefore.png?" />
</p>

<p align="center">
<em>Node 1 is the Original Root</em>
</p>

To set some arbitrary root, say node 2, as the root, under the *Roots*
section, type `2`, and it'll become the root of the tree. In scenarios where
you have multiple trees, simply type a comma-separated list of all the roots.
A caveat is that if you type two nodes that belong to the same tree under
*Roots*, the one that comes first takes precedence, i.e., if you type
`2 1`, then node 2 is the root, but if you type `1 2`, then node 1 is the root.

<p align="center">
    <img src="screenshots/twoRootAfter.png?" />
</p>

<p align="center">
<em>Node 2 is the New Root</em>
</p>

What happens if the graph isn't a tree? Well, the **DFS Tree** would be
displayed instead, where *back edges* are displayed as dotted lines.

<p align="center">
    <img src="screenshots/dfsTree.png?" />
</p>

<p align="center">
<em>A DFS Tree With Bridges and Cut Vertices Shown</em>
</p>

#### Bipartite Mode

Bipartite graphs may also be displayed. Nodes of each disjoint set are
colored (and positioned) differently.

<p align="center">
    <img src="screenshots/bipartite.png?" />
</p>

<p align="center">
<em>A Bipartite Graph</em>
</p>

> [!CAUTION]
> When enabled, both *Tree Mode* and *Components* will be *unset*. This works
> in reverse as well, when either *Tree Mode* or *Components* is set, *Bipartite
> Mode* will be turned off.

> [!TIP]
> If the graph isn't bipartite, this mode becomes unavailable.

#### Lock Mode

By default, the graph is in *Force Mode*, where edges hold everything together
and nodes repel one another, creating a cool space-like effect. To disable
this behavior, simply toggle *Lock Mode*.

#### Mark/Unmark Nodes on Click

When enabled, you may *mark* a node by clicking it. These nodes have a double
border.

> [!TIP]
> If you prefer to color nodes instead, you might want to disable this
> feature.

#### Fixed Mode

If you wish to fix *marked nodes* in place, toggle *Fixed Mode*.

#### Multiedge Mode

This mode allows for multiple edges between two nodes, it's enabled by
default. When disabled, no matter how many times you enter the same edge,
only a single one would be registered.

### Appearance

In addition to the light/dark themes, there are multiple sliders available
for altering parameters like the node radius, font size, etc. Your settings
are saved across refreshes using `localStorage`.

## Credits

- [CS Academy's Graph Editor](https://csacademy.com/app/graph_editor/)
- [Codeforces](https://codeforces.com/)
- [Atcoder](https://atcoder.jp/)
- [USACO Guide](https://usaco.guide/)
- [-is-this-fft-'s Blog on the DFS Tree](https://codeforces.com/blog/entry/68138)
