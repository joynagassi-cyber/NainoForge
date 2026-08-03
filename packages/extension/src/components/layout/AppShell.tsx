import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SidePanelHeader } from "./SidePanelHeader";
import type { Tab } from "./SidePanelHeader";

interface AppShellProps {
  activeTab: Tab;
  children: ReactNode;
  onSettingsOpen: () => void;
  onTabChange: (tab: Tab) => void;
  onAppModeToggle: () => void;
  onClose: () => void;
}

export function AppShell({ activeTab, onTabChange, children, onSettingsOpen, onAppModeToggle, onClose }: AppShellProps) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-surface-base text-text-primary">
      <SidePanelHeader
        activeTab={activeTab}
        isOnline={typeof navigator !== "undefined" ? navigator.onLine : true}
        queuedAI={0}
        onTabChange={onTabChange}
        onSettingsOpen={onSettingsOpen}
        onAppModeToggle={onAppModeToggle}
        onClose={onClose}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} onSettingsOpen={onSettingsOpen} />
        <main className="flex-1 overflow-y-auto" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
