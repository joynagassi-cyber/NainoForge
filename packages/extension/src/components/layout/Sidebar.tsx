import { Flame, BookOpen, Brain, GitGraph, Settings } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Tab } from "./SidePanelHeader";

const navItems: { id: Tab; label: string; icon: typeof Flame }[] = [
  { id: "home", label: "Accueil", icon: Flame },
  { id: "review", label: "Révision", icon: BookOpen },
  { id: "cosmos", label: "COSMOS", icon: GitGraph },
];

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSettingsOpen: () => void;
}

export function Sidebar({ activeTab, onTabChange, onSettingsOpen }: SidebarProps) {
  return (
    <aside className="flex w-14 flex-col items-center gap-2 border-r border-border-subtle bg-surface-1 py-3">
      <nav className="flex flex-1 flex-col items-center gap-1" aria-label="Navigation latérale">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            aria-label={item.label}
            aria-current={activeTab === item.id ? "page" : undefined}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
              activeTab === item.id
                ? "bg-primary/10 text-primary"
                : "text-text-muted hover:text-text-primary hover:bg-surface-2"
            )}
            title={item.label}
          >
            <item.icon className="h-5 w-5" />
          </button>
        ))}
      </nav>

      <button
        onClick={onSettingsOpen}
        aria-label="Paramètres"
        className="flex h-10 w-10 items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
        title="Paramètres"
      >
        <Settings className="h-5 w-5" />
      </button>
    </aside>
  );
}
