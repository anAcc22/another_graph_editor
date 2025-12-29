# Another Graph Editor

<p align="center">
  简体中文 | <a href="README.md">English</a>
</p>

这是一个受 [CS Academy 图形编辑器](https://csacademy.com/app/graph_editor/) 启发的图形编辑器，专为 OI 设计。

使用 React、Typescript、Tailwind CSS 和 HTML Canvas 构建。

<p align="center">
    <img src="screenshots/main.png?" />
</p>

<p align="center">
<em>多连通分量的图的示例</em>
</p>

## 功能
- 常见输入格式：
  - 边列表 `u v w`，表示一条从 $u$ 到 $v$，的边，其中边权是 $w$（可选）。
  - Leetcode 风格的边列表 `[[u1,v1(,w1],[u2,v2,w2]]`，表示同上。确保字符串内部**不要**包含空格。
  - 父子数组，其中 `p[i]` 和 `c[i]` 表示从节点 $p_i$ 到 $c_i$ 的边。
  - 在**节点标签**是点权/标签。`a[i]` 表示点 $i$ 的点权/标签为$a_i$。
- 标签偏移（用于将零索引输入转换为一索引，反之亦然）
- 亮/暗色主题
- 无向图/有向图
- 树/二分图模式
- 锁定模式：固定标记的节点的位置
- 桥和割点
- 连通分量
- 最小生成树
- 支持重边
- 支持多组样例

<p align="center">
    <img src="screenshots/parentChild.png?" />
</p>

<p align="center">
<em>父-子输入格式示例</em>
</p>

<p align="center">
    <img src="screenshots/leetcode.png?" />
</p>

<p align="center">
<em>Leetcode 风格的边列表也可用</em>
</p>

> [!NOTE]
> *树模式*和*桥*仅适用于无向图。

## 使用方法

根据需要调整输入格式，然后开始输入。

> [!IMPORTANT]
> 如果你来自像 [Codeforces](https://codeforces.com/) 这样的OJ，且输入数据包含 `n m`，分别表示顶点数和边数，请在复制样例时**删除**这部分内容。
> 同样，如果你有一个数组 $p$，其中 $p_i$ 表示 $i$ 的父节点，请确保父节点数组和子节点数组匹配。

> [!TIP]
> 输入 `u` 表示单个点。

> [!TIP]
> 设置点权/标签时，如果点不需要权/标签，使用 `_` 作为占位符。

## 处理多个样例

点击绿色按钮添加新样例。你可以将样例输入到各各样例中。要删除样例，将鼠标悬停在样例标签上，会显示删除按钮。

> [!CAUTION]
> 删除样例后，该样例内的所有数据将被删除，请小心操作。

## 节点着色

使用主画布上方的调色板选择颜色，并点击点着色。

> [!CAUTION]
> **二分图模式**产生的颜色将覆盖你染颜色。

## 设置

有三个设置面板：**模式**，**算法**，**外观**。分别设置：图与编辑器，显示算法，渲染方式。

### 模式

#### 标签偏移量

字面意思。

#### 树模式

在此模式下，输入数据中的**第一个**节点成为根节点。节点根据它们在树层次中的位置进行排列，以便更易于可视化。

<p align="center">
    <img src="screenshots/twoRootBefore.png?" />
</p>

<p align="center">
<em>节点1是根节点</em>
</p>

要设置某个任意的根节点（例如节点2），在 *根节点* 部分输入 `2`，它就会成为树的根。如果有多个树，只需输入逗号分隔的所有根节点。如果输入的两个节点属于同一棵树，那么输入顺序较前的节点会作为根节点，即若输入 `2 1`，节点2为根；若输入 `1 2`，则节点1为根。

<p align="center">
    <img src="screenshots/twoRootAfter.png?" />
</p>

<p align="center">
<em>节点2是新的根节点</em>
</p>

如果图不是树呢？则会显示 **DFS 树**，其中 *反向边（回边）* 以虚线表示。

<p align="center">
    <img src="screenshots/dfsTree.png?" />
</p>

<p align="center">
<em>显示桥和割点的 DFS 树</em>
</p>

#### 二分图模式（仅对二分图有效）

显示二分图。每个不相交的集合中的节点都会被着色和位置得不同。

<p align="center">
    <img src="screenshots/bipartite.png?" />
</p>

<p align="center">
<em>二分图示例</em>
</p>

> [!CAUTION]
> 启用时，*树模式* 和 *连通分量* 会被*关闭*。反过来也是一样，当启用 *树模式* 或 *分量* 时，*二分图模式* 会关闭。

> [!TIP]
> 如果图不是二分图，则此模式不可用。

#### 方格模式

把图显示为方格。

#### 锁定模式

固定所有点的位置。

#### 点击时标记节点

标记点，这些点会有双重边框。

#### 固定模式（需要与点击时标记节点同时启用）

固定标记的点的位置。

#### 重边模式

允许重边。

#### 边的弯曲效果

允许边弯曲。

### 算法

#### 连通分量

此模式显示图的连通分量，通过不同的颜色进行区分

> [!NOTE]
> 对于有向图，显示**强连通分量**。

#### 边双联通分量

显示边双联通分量，通过不同的颜色进行区分

#### 点双联通分量

显示点双联通分量，通过不同的颜色进行区分

#### 割点和桥

显示割点和桥。

**桥**是指移除后会增加图的连通分量的边。**割点**定义类似。

桥接通过两条平行线表示，而割点则采用六边形形状。

#### 最小生成树（森林）

如果提供了**所有**边权且为数值，则此模式可用。对于每个分量，计算最小生成树，最小生成树中的边会加粗显示。

<p align="center">
    <img src="screenshots/mst.png?" />
</p>

<p align="center">
<em>最小生成树</em>
</p>


#### 重边模式

此模式允许在重边，默认启用。当禁用时，不论输入多少次相同的边，只会显示一条。

### 外观

除了亮/暗色主题，还可以调整节点半径、字体大小等参数。你的设置会在刷新后保存在 `localStorage` 中。

## 部署
- 下载本项目
- 切换到项目根目录
- （可选）默认部署路径为 `/another_graph_editor/`。如果需要可以到 `vite.config.ts` 中修改 `base: "/another_graph_editor/"` 为其他的。
- 安装依赖并构建：
  ```bash
  npm install
  npm run build
  ```
- 构建产物会生成在：`dist/`。


## 致谢

- [CS Academy 的 Graph Editor](https://csacademy.com/app/graph_editor/)
- [Codeforces](https://codeforces.com/)
- [Atcoder](https://atcoder.jp/)
- [USACO Guide](https://usaco.guide/)
- [-is-this-fft- 的 DFS 树博客](https://codeforces.com/blog/entry/68138)
