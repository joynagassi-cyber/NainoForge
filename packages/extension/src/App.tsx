import type { Tab } from "./components/layout/SidePanelHeader";
import { AppShell } from "./components/layout/AppShell";
import { HomeSurface } from "./components/layout/HomeSurface";
import { ImprintSurface } from "./components/imprint/ImprintSurface";
import { StudentAISurface } from "./components/student-ai/StudentAISurface";
import { CosmosSurface } from "./components/cosmos/CosmosSurface";

import { useState } from "react";

export function App() {
  const [tab, setTab] = useState<Tab>("home");

  const handleSettings = () => {
    console.log("Settings clicked");
    // TODO: open settings sheet
  };

  return (
    <AppShell activeTab={tab} onSettingsOpen={handleSettings}>
      {tab === "home" && <HomeSurface />}
      {tab === "review" && <HomeSurface />}
      {tab === "cosmos" && <CosmosSurface />}
      {/*
        IMPRINT et Student AI sont accessibles via les sources :
        - on clic une source -> SourceDetail
        - dans SourceDetail -> IMPRINT editor
        - dans SourceDetail -> Student AI
        TODO: wiring avec event-bus/db
      */}
    </AppShell>
  );
}
