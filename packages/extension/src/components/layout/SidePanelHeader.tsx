import { Flame, Settings2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";

export type Tab = "home" | "review" | "cosmos";

interface SidePanelHeaderProps {
  activeTab: Tab;
  isOnline: boolean;
  queuedAI: number;
  onTabChange: (tab: Tab) => void;
  onSettingsOpen: () => void;
}

export function SidePanelHeader({
  activeTab,
  isOnline,
  queuedAI,
  onTabChange,
  onSettingsOpen,
}: SidePanelHeaderProps) {
  return (
    <header className="flex h-11 shrink-0 items-center border-b border-border-subtle bg-surface-1 px-3">
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="text-h3 font-semibold text-text-primary">
          NainoForge
        </span>
      </div>

      <nav
        className="mx-auto flex items-center gap-4"
        aria-label="Navigation principale"
      >
        {(["home", "review", "cosmos"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            aria-selected={activeTab === tab}
            role="tab"
            className={cn(
              "caption font-medium transition-colors",
              activeTab === tab
                ? "text-primary underline decoration-2 underline-offset-4"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {tab === "home" && "Accueil"}
            {tab === "review" && "Révision"}
            {tab === "cosmos" && "COSMOS"}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {queuedAI > 0 && (
          <Badge variant="count" className="mr-1">
            {queuedAI}
          </Badge>
        )}
        <span className="relative flex h-2 w-2" aria-label={isOnline ? "En ligne" : "Hors ligne"}>
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75",
              isOnline ? "bg-state-forged" : "bg-state-leech"
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              isOnline ? "bg-state-forged" : "bg-state-leech"
            )}
          />
        </span>
        <button
          onClick={onSettingsOpen}
          aria-label="Paramètres"
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
