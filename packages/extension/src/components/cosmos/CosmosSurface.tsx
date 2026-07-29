import { useState, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  type NodeTypes,
  MiniMap,
  Controls,
} from "@xyflow/react";
import { Flame, Sparkles, HelpCircle, Book, Circle } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  ConceptNodeBase,
  createForgedNode,
  createPartialNode,
  createGapNode,
  createUnvisitedNode,
  type ConceptNodeData,
} from "./node-types";

// Définition des types de nœuds
const nodeTypes: NodeTypes = {
  concept: ConceptNodeBase,
};

// Données de demonstration (serait remplacée par use-cosmos dans la vraie app)
const initialNodes: Node<ConceptNodeData>[] = [
  createForgedNode("node1", "Algorithmes"),
  createPartialNode("node2", "Complexité"),
  createGapNode("node3", "Structures de données"),
  createUnvisitedNode("node4", "Réseaux de neurones"),
];

// Positionnement simple pour le demo
initialNodes.forEach((node, i) => {
  node.position = { x: i * 200, y: 0 };
});

const initialEdges: Edge[] = [
  { id: "edge1", source: "node1", target: "node2" },
  { id: "edge2", source: "node1", target: "node3" },
  { id: "edge3", source: "node2", target: "node4" },
  { id: "edge4", source: "node3", target: "node4" },
];

export function CosmosSurface() {
  const [nodes, setNodes] = useState<Node<ConceptNodeData>>(initialNodes);
  const [edges, setEdges] = useState<Edge>(initialEdges);

  return (
    <div className="h-full">
      <div className="border-b border-border-subtle px-4 py-3">
        <h2 className="text-h2 font-semibold text-text-primary">COSMOS</h2>
        <p className="text-caption text-text-muted">Carte des concepts et relations</p>
      </div>

      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => setNodes((nds) => nds)}
          onEdgesChange={() => {}}
          nodeTypes={nodeTypes}
          fitView={true}
          zoomable={true}
          panable={true}
        >
          <Background variant="dots" gap={16} size={1} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}