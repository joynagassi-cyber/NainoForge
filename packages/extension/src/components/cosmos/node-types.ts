import { ReactNode } from "react";
import {
  Flame,
  Sparkles,
  HelpCircle,
  Book,
  Circle
} from "lucide-react";
import { cn } from "../../lib/utils";

// Props pour un node COSMOS
interface ConceptNodeProps {
  id: string;
  label: string;
  status: "forged" | "partial" | "gap" | "unvisited";
}

// Composant Node conceptuel de base
function ConceptNodeBase({ id, label, status }: ConceptNodeProps) {
  // Déterminer l'icône et la couleur selon le statut
  let icon: ReactNode = <Circle className="w-6 h-6" />;
  let color = "#A5A0B8"; // text-muted (default)

  switch (status) {
    case "forged":
      icon = <Flame className="w-6 h-6 text-white" />;
      color = "#22C55E"; // state-forged
      break;
    case "partial":
      icon = <Sparkles className="w-6 h-6 text-white" />;
      color = "#F59E0B"; // accent-warm
      break;
    case "gap":
      icon = <HelpCircle className="w-6 h-6 text-white" />;
      color = "#EF4444"; // state-leech
      break;
    case "unvisited":
      icon = <Book className="w-6 h-6 text-white" />;
      color = "#A5A0B8"; // text-muted
      break;
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer",
        status === "forged" ? "hover:scale-105" : ""
      )}
      style={{ width: "80px", height: "80px", backgroundColor: color, borderColor: color }}
      title={`${label} - ${status}`}
    >
      {icon}
      <span className="text-xs text-white mt-1 font-medium text-center">{label}</span>
    </div>
  );
}

// Factory functions pour chaque type de node (sans field component - React Flow utilise nodeTypes)
export const createForgedNode = (id: string, label: string) => ({
  id,
  type: "concept" as const,
  position: { x: 0, y: 0 },
  data: { id, label, status: "forged" },
});

export const createPartialNode = (id: string, label: string) => ({
  id,
  type: "concept" as const,
  position: { x: 0, y: 0 },
  data: { id, label, status: "partial" },
});

export const createGapNode = (id: string, label: string) => ({
  id,
  type: "concept" as const,
  position: { x: 0, y: 0 },
  data: { id, label, status: "gap" },
});

export const createUnvisitedNode = (id: string, label: string) => ({
  id,
  type: "concept" as const,
  position: { x: 0, y: 0 },
  data: { id, label, status: "unvisited" },
});

// Export du composant pour utilisation directe dans ReactFlow
export { ConceptNodeBase };
