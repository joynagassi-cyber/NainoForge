import type { ReactNode } from "react";
import { AppShell } from "./components/layout/AppShell";
import { HomeSurface } from "./components/layout/HomeSurface";
import { ImprintSurface } from "./components/imprint/ImprintSurface";
import { StudentAISurface } from "./components/student-ai/StudentAISurface";
import { CosmosSurface } from "./components/cosmos/CosmosSurface";
import { ReviewSurface } from "./components/review/ReviewSurface";
import { type Tab } from "./components/layout/SidePanelHeader";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastProvider } from "./contexts/ToastContext";

// Déterminer le mode à partir de l'URL (pour l'app mode)
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode") || "sidebar"; // "sidebar" ou "app"

export function App() {
  const [tab, setTab] = useState<Tab>("home");

  const handleSettings = () => {
    console.log("Settings clicked");
  };

  const handleAppModeToggle = () => {
    const currentUrl = window.location.href;
    const appModeUrl = currentUrl.replace("sidepanel.html", "appMode.html?mode=app");
    chrome.tabs.create({ url: appModeUrl });
  };

  const handleClose = () => {
    // Send message to SW to close the side panel.
    // Chrome doesn't expose a direct API for this, so we close
    // the current tab and reopen without the panel.
    chrome.runtime.sendMessage({ type: "nf:panel:close" }, () => {
      // SW will handle the close via chrome.tabs.reload
    });
  };

  if (mode === "app") {
    // Mode application : afficher une version pleine largeur sans sidebar
    return (
      <ToastProvider>
        <div className="h-screen w-full relative overflow-hidden">
          {/* Bouton fermeture mode app */}
          <button
            onClick={() => window.close()}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-md text-text-muted hover:text-text-primary bg-surface-1/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            title="Fermer le mode application"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLineCap="round"
                strokeLineJoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <AnimatePresence initial={false} mode="wait">
            {tab === "home" && (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <HomeSurface />
              </motion.div>
            )}
            {tab === "review" && (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <ReviewSurface />
              </motion.div>
            )}
            {tab === "cosmos" && (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <CosmosSurface />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToastProvider>
    );
  }

  // Mode par défaut (sidebar/panel)
  return (
    <ToastProvider>
      <AppShell activeTab={tab} onTabChange={setTab} onSettingsOpen={handleSettings} onAppModeToggle={handleAppModeToggle} onClose={handleClose}>
        <div className="relative h-full overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            {tab === "home" && (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <HomeSurface />
              </motion.div>
            )}
            {tab === "review" && (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <ReviewSurface />
              </motion.div>
            )}
            {tab === "cosmos" && (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <CosmosSurface />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AppShell>
    </ToastProvider>
  );
}
