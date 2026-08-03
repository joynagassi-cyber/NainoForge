import { useState } from "react";
import { ReactFlow, Background } from "@xyflow/react";
import { ConceptNodeBase } from "./node-types";
import { DensityOverlay } from "./DensityOverlay";
import { Badge } from "../ui/badge";

// Type pour une entrée de liste
interface ConceptListItem {
  id: string;
  label: string;
  status: "forged" | "partial" | "gap" | "unvisited";
  smi?: number;
}

export function MvpCosmos() {
  const [showList, setShowList] = useState(true);

  // Liste de concepts (données démo)
  const conceptList: ConceptListItem[] = [
    { id: "n1", label: "Algorithmes", status: "forged", smi: 95 },
    { id: "n2", label: "Complexité", status: "partial", smi: 65 },
    { id: "n3", label: "Structures de données", status: "gap", smi: 30 },
    { id: "n4", label: "Réseaux de neurones", status: "unvisited", smi: 15 },
  ];

  // Nodes pour le graphe (réutilisant les node types)
  const nodes = [
    { id: "node1", type: "concept", position: { x: 0, y: 0 }, data: { id: "node1", label: "Algorithmes", status: "forged" } },
    { id: "node2", type: "concept", position: { x: 200, y: -100 }, data: { id: "node2", label: "Complexité", status: "partial" } },
    { id: "node3", type: "concept", position: { x: 200, y: 100 }, data: { id: "node3", label: "Structures de données", status: "gap" } },
    { id: "node4", type: "concept", position: { x: 400, y: 0 }, data: { id: "node4", label: "Réseaux de neurones", status: "unvisited" } },
  ];

  const edges = [
    { id: "edge1", source: "node1", target: "node2" },
    { id: "edge2", source: "node1", target: "node3" },
    { id: "edge3", source: "node2", target: "node4" },
    { id: "edge4", source: "node3", target: "node4" },
  ];

  return (
    <div className="flex h-full">
      {/* Liste des concepts (gauche) */}
      {showList && (
        <div className="w-64 border-b border-border-subtle bg-surface-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-h2 font-semibold text-text-primary mb-4">Concepts</h3>
            <div className="space-y-2">
              {conceptList.map((concept) => (
                <div
                  key={concept.id}
                  className="flex items-center justify-between p-3 rounded hover:bg-surface-2 transition-colors min-h-[48px]"
                >
                  <span className="text-text-primary">{concept.label}</span>
                  <Badge
                    variant={
                      concept.status === "forged"
                        ? "forge"
                        : concept.status === "partial"
                        ? "privacy-personal"
                        : "privacy-public"
                    }
                    className="text-xs"
                  >
                    {concept.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Graphe React Flow (droite) */}
      <div className="flex-1 relative">
        {/* Overlay de densité */}
        <DensityOverlay nodes={nodes} />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ concept: ConceptNodeBase }}
          fitView={true}
          zoomable={true}
          panable={true}
          defaultEdgeOptions={{ type: "prerequisite" }}
        >
          <Background variant="dots" gap={25} size={10} />
        </ReactFlow>
      </div>
    </div>
  );
}
