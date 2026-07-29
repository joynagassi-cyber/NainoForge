import { ReactNode } from "react";
import { Circle } from "lucide-react";

interface DensityOverlayProps {
  nodes: Array<{ position: { x: number; y: number } }>
}

export function DensityOverlay({ nodes }: DensityOverlayProps) {
  // Implémentation simplifiée : dessine des cercles de chaleur basés sur la position des nodes
  // Dans une version avancée, on utiliserait un algorithme de densité (kernel density estimation)

  const circles = nodes.map((node, i) => (
    <circle
      key={i}
      cx={node.position.x + 40} // Centre du node (80px / 2)
      cy={node.position.y + 40}
      r={60}
      fill="yellow"
      opacity={0.15}
      stroke="none"
    />
  ));

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {circles}
    </svg>
  );
}