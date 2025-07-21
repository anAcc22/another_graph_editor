# Another Graph Editor - Project Architecture

## Overview

A sophisticated React-based graph visualization tool designed for competitive programming, built with TypeScript, Tailwind CSS, and HTML Canvas.

**Tech Stack**: React 18.3.1 + TypeScript + Tailwind CSS + Vite + HTML Canvas

## Core Architecture

### Data Layer
- **Graph Representation**: Dual format support (edges + parent-child)
- **State Management**: Centralized in App.tsx with localStorage persistence
- **Algorithm Modules**: Isolated graph algorithms (components, bridges, MST)

### UI Layer
- **Component Hierarchy**: Tab-based interface with modal dialogs
- **Input Processing**: Real-time parsing with validation
- **Settings Management**: General + Appearance configuration panels

### Rendering Layer
- **Canvas-based Visualization**: Physics simulation with force-directed layout
- **Renderer Abstraction**: Canvas/SVG renderer interface
- **Export Capabilities**: PNG and SVG generation

## Data Structures

### Core Types
```typescript
interface Graph {
  nodes: string[];
  adj: Map<string, string[]>;      // Adjacency list
  rev: Map<string, string[]>;      // Reverse adjacency (directed graphs)
  edges: string[];                 // Edge list
  edgeLabels: Map<string, string>; // Edge weights/labels
  nodeLabels: Map<string, string>; // Node labels
}

interface TestCase {
  graphEdges: Graph;      // Graph from edge format
  graphParChild: Graph;   // Graph from parent-child format
  inputFormat: InputFormat;
}

interface Settings {
  language: "en" | "cn";
  drawMode: "node" | "pen" | "erase";
  darkMode: boolean;
  // ... extensive configuration options
}
```

### State Management
- **Centralized State**: All state in App.tsx with prop drilling
- **Multi-Testcase**: `Map<number, TestCase>` for multiple graphs
- **Persistence**: localStorage for settings with fallback defaults
- **Reactive Updates**: Real-time graph updates on input changes

## Component Architecture

### Component Hierarchy
```
App.tsx (Root State Manager)
├── InputTabs (Tab Management)
│   ├── InputTab (Individual Tabs)
│   └── GraphInput (Input Forms)
├── GraphCanvas (Main Visualization)
│   └── GraphPalette (Color Picker)
├── GraphSettings (Configuration)
│   ├── GeneralSettings
│   └── AppearanceSettings
├── InitScreen (Preset Templates)
└── RandomizerScreen (Graph Generation)
```

### Key Components

#### Core Visualization
- **GraphCanvas**: Main canvas rendering with physics simulation
- **GraphPalette**: 16-color palette for node coloring
- **animateGraph**: Physics engine and rendering pipeline

#### Input & Configuration
- **InputTabs**: Multi-testcase tab management
- **GraphInput**: Real-time input parsing and validation
- **GraphSettings**: Split into General/Appearance panels

#### Specialized Screens
- **InitScreen**: Preset template selection
- **RandomizerScreen**: Configurable graph generation

## Algorithm Implementation

### Graph Algorithms
- **Connected Components**: DFS-based component detection
- **Strongly Connected Components**: Kosaraju's algorithm
- **Bridges & Cut Vertices**: Tarjan's algorithm with DFS
- **Minimum Spanning Tree**: Kruskal's algorithm with DSU
- **Bipartite Detection**: BFS-based coloring
- **Tree Layout**: Layer-based hierarchical positioning

### Performance Optimizations
- **Physics Simulation**: Force-directed layout with velocity updates
- **Canvas Oversampling**: 2x oversampling for crisp rendering
- **Efficient Data Structures**: Map-based adjacency lists
- **Lazy Rendering**: Only update changed components

## User Flow Patterns

### Primary User Journey
1. **Initialization**: InitScreen (presets) or RandomizerScreen
2. **Input**: Multiple formats (edges, parent-child, LeetCode style)
3. **Visualization**: Real-time rendering with physics simulation
4. **Analysis**: Toggle modes (components, bridges, MST, bipartite)
5. **Customization**: Color nodes, adjust appearance, export

### Interaction Patterns
- **Tab-based Interface**: Multiple test cases in separate tabs
- **Real-time Parsing**: Input validation and graph construction
- **Interactive Canvas**: Click to mark nodes, drag to reposition
- **Modal Dialogs**: Settings panels and configuration screens

## Input Processing Pipeline

### Supported Formats
1. **Edge List**: `u v [w]` format with optional weights
2. **Parent-Child**: Separate parent and child arrays
3. **LeetCode Style**: `[[2,4],[1,3],[2,1],[4,3]]` adjacency lists

### Processing Flow
```
Raw Text → Parser Functions → Graph Objects → Validation → Visual Updates
```

### Error Handling
- **Input Validation**: Real-time parsing with error indicators
- **Format Detection**: Automatic format recognition
- **Fallback Behavior**: Graceful degradation for invalid input

## Rendering System

### Canvas Rendering Pipeline
1. **Graph Data** → **Physics Simulation** → **Position Updates**
2. **Node Rendering** → **Edge Rendering** → **Labels & Annotations**
3. **Export Options**: PNG download and SVG generation

### Renderer Abstraction
```typescript
interface GraphRenderer {
  // Canvas operations abstraction
  lineWidth: number;
  strokeStyle: string;
  fillStyle: string;
  // ... drawing methods
}
```

### Visual Features
- **Force-directed Layout**: Nodes repel, edges attract
- **Node Shapes**: Circles, hexagons (cut vertices), octagons (labels)
- **Edge Styles**: Solid, dashed (back edges), bold (MST)
- **Color Coding**: Components, bipartite sets, user colors

## Configuration System

### Settings Categories
- **General**: Graph analysis modes and behavior
- **Appearance**: Visual customization and theming

### Persistence Strategy
- **localStorage**: Settings persist across sessions
- **Fallback Defaults**: Sensible defaults for all settings
- **Real-time Updates**: Settings apply immediately

### Theme System
- **Light/Dark Modes**: Complete theme switching
- **Custom Color Palette**: 16 colors with light/dark variants
- **Responsive Design**: Mobile and desktop layouts

## Advanced Features

### Competitive Programming Tools
- **Multi-testcase Support**: Tab-based test case management
- **Input Format Flexibility**: Multiple standard formats
- **Graph Analysis**: Components, bridges, MST, bipartite detection
- **Export Capabilities**: Image and SVG export

### Extensibility Points
- **Algorithm Plugins**: Modular graph algorithm architecture
- **Renderer Abstraction**: Canvas/SVG renderer interface
- **Preset System**: Template-based initialization
- **Randomizer**: Configurable graph generation

## Performance Characteristics

### Scalability
- **Graph Size**: Handles hundreds of nodes efficiently
- **Animation**: 60fps physics simulation
- **Memory**: Efficient data structures and cleanup
- **Cross-platform**: Works on desktop and mobile browsers

### Optimization Strategies
- **Canvas Oversampling**: 2x for crisp rendering
- **Physics Culling**: Only simulate visible nodes
- **Lazy Updates**: Only re-render changed components
- **Efficient Algorithms**: Optimized graph algorithms

## Development Patterns

### Code Organization
- **Feature-based Structure**: Components grouped by functionality
- **Algorithm Isolation**: Separate files for each graph algorithm
- **Type Safety**: Comprehensive TypeScript interfaces
- **Utility Functions**: Shared utilities in utils.ts

### State Management
- **Prop Drilling**: Simple state passing for small app
- **localStorage Integration**: Persistent user preferences
- **Reactive Updates**: Real-time UI updates
- **Error Boundaries**: Graceful error handling

### Testing Considerations
- **Algorithm Testing**: Isolated algorithm modules
- **Component Testing**: React component testing
- **Integration Testing**: End-to-end user flows
- **Performance Testing**: Large graph handling

## File Structure Reference

```
src/
├── App.tsx                    # Root component and state
├── types.ts                   # TypeScript interfaces
├── components/
│   ├── GraphCanvas.tsx        # Main visualization
│   ├── GraphInput.tsx         # Input processing
│   ├── InputTabs.tsx          # Tab management
│   ├── GraphSettings.tsx      # Configuration
│   ├── animateGraph.ts        # Physics and rendering
│   ├── drawingTools.ts        # Canvas rendering
│   ├── parseGraphInput.ts     # Input parsing
│   ├── graphComponents.ts     # Connected components
│   ├── graphBridges.ts        # Bridges and cut vertices
│   ├── graphMSTs.ts          # Minimum spanning tree
│   ├── generator.ts           # Random graph generation
│   ├── presets.ts            # Template system
│   └── utils.ts              # Shared utilities
```

## Key Design Principles

1. **Modularity**: Isolated components and algorithms
2. **Performance**: Efficient rendering and algorithms
3. **Usability**: Intuitive interface for competitive programming
4. **Extensibility**: Easy to add new features and algorithms
5. **Reliability**: Robust error handling and validation
6. **Accessibility**: Keyboard navigation and screen reader support

## Common Development Tasks

### Adding New Graph Algorithms
1. Create algorithm file in `src/components/`
2. Implement algorithm with clear interface
3. Add to `animateGraph.ts` rendering pipeline
4. Add UI controls in `GraphSettings.tsx`

### Adding New Input Formats
1. Extend `parseGraphInput.ts` with new parser
2. Update `GraphInput.tsx` with format detection
3. Add format-specific UI elements
4. Update type definitions in `types.ts`

### Adding New Visualization Features
1. Extend `drawingTools.ts` with new rendering functions
2. Update `animateGraph.ts` rendering pipeline
3. Add configuration options to `Settings` interface
4. Create UI controls in settings components

### Performance Optimization
1. Profile rendering performance
2. Optimize physics simulation
3. Implement lazy rendering
4. Add canvas culling for large graphs

This architecture provides a solid foundation for maintaining and extending the graph editor while ensuring good performance and user experience. 