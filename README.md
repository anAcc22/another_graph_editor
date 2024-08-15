# Another Graph Editor

A graph editor inspired by [CS Academy's graph editor](https://csacademy.com/app/graph_editor/),
designed with competitive programming in mind.

Made with React, Typescript, Tailwind CSS, and HTML Canvas.

## Features

- Common input formats:
  - A list of edges `u v [w]`, denoting an edge from node `u` to node `v`, where
  `w` is an optional edge label.
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

> [!NOTE]
> *Tree Mode* and *Bridges* are only available for undirected graphs.

> [!NOTE]
> For directed graphs, **strongly connected components** are displayed.

## Configuration

In addition to the light/dark themes, there are two sliders available
for adjusting the *node radius* and *line thickness* at discrete intervals.

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

In this mode, the *first* node that appears in the input data becomes
the root; therefore, if you require some arbitrary node `u` as the root,
enter `u` at the top of your input data.

What happens if the graph isn't a tree? Well, the **DFS Tree** would be
displayed instead, where *back edges* are displayed as dotted lines.

## Credits

- [CS Academy's Graph Editor](https://csacademy.com/app/graph_editor/)
- [Codeforces](https://codeforces.com/)
- [Atcoder](https://atcoder.jp/)
- [USACO Guide](https://usaco.guide/)
- [-is-this-fft-'s Blog on the DFS Tree](https://codeforces.com/blog/entry/68138)
