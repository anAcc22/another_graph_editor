# Another Graph Editor

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
  corresponds to the value at node `i`.
- Label offset (to convert a zero-indexed input to one-indexed and vice versa)
- Dark/light themes
- Undirected/directed mode
- Normal/tree mode
- Show/hide bridges and cut vertices
- Show/hide components

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

> [!NOTE]
> For directed graphs, **strongly connected components** are displayed.

## Configuration

In addition to the light/dark themes, there are three sliders available
for adjusting the *node radius*, *line thickness*, and *edge length* at discrete
intervals. Your configuration will be preserved across refreshes.

> [!NOTE]
> As the node radius changes, the font size is scaled accordingly to maintain readability.

By default, the graph is in *Force Mode*, where edges hold everything together
and nodes repel one another, creating a cool space-like effect. To disable
this behavior, simply toggle *Lock Mode*.

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

### Tree Mode

In this mode, the *first* node that appears in the input data becomes the root.

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

## Credits

- [CS Academy's Graph Editor](https://csacademy.com/app/graph_editor/)
- [Codeforces](https://codeforces.com/)
- [Atcoder](https://atcoder.jp/)
- [USACO Guide](https://usaco.guide/)
- [-is-this-fft-'s Blog on the DFS Tree](https://codeforces.com/blog/entry/68138)
