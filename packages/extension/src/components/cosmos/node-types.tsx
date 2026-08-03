import { ReactNode } from "react";
import {
  Flame,
  Sparkles,
  HelpCircle,
  Book,
  Circle
} from "lucide-react";
import { cn } from "../../lib/utils.ts";

// Props pour un node COSMOS
interface ConceptNodeProps {
  id: string;
  label: string;
  status: "forged" | "partial" | "gap" | "unvisited";
}

// Couleurs par statut (tokens design system)
const statusStyles: Record<string, { bg: string; border: string }> = {
  forged: { bg: "var(--color-state-forged)", border: "var(--color-state-forged)" },
  partial: { bg: "var(--color-state-partial)", border: "var(--color-state-partial)" },
  gap: { bg: "var(--color-state-leech)", border: "var(--color-state-leech)" },
  unvisited: { bg: "var(--color-text-muted)", border: "var(--color-text-muted)" },
};

// Composant Node conceptuel de base
export function ConceptNodeBase({ id, label, status }: ConceptNodeProps) {
  const styles = statusStyles[status] ?? statusStyles.unvisited;

  let icon: ReactNode = null;
  switch (status) {
    case "forged":
      icon = <Flame className="w-6 h-6 text-white" />;
      break;
    case "partial":
      icon = <Sparkles className="w-6 h-6 text-white" />;
      break;
    case "gap":
      icon = <HelpCircle className="w-6 h-6 text-white" />;
      break;
    case "unvisited":
      icon = <Book className="w-6 h-6 text-white" />;
      break;
    default:
      icon = <Circle className="w-6 h-6 text-white" />;
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer",
        status === "forged" ? "hover:scale-105" : ""
      )}
      style={{
        width: "80px",
        height: "80px",
        backgroundColor: styles.bg,
        borderColor: styles.border,
      }}
      title={`${label} - ${status}`}
    >
      {icon}
      <span className="text-xs text-white mt-1 font-medium text-center">{label}</span>
    </div>
  );
}

// Factory functions
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
