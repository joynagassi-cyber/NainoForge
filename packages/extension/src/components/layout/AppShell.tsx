import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SidePanelHeader } from "./SidePanelHeader";
import type { Tab } from "./SidePanelHeader";

interface AppShellProps {
  activeTab: Tab;
  children: ReactNode;
  onSettingsOpen: () => void;
}

export function AppShell({ activeTab, children, onSettingsOpen }: AppShellProps) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-surface-base text-text-primary">
      <SidePanelHeader
        activeTab={activeTab}
        isOnline={typeof navigator !== "undefined" ? navigator.onLine : true}
        queuedAI={0}
        onTabChange={() => {}}
        onSettingsOpen={onSettingsOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={() => {}} onSettingsOpen={onSettingsOpen} />
        <main className="flex-1 overflow-y-auto" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
