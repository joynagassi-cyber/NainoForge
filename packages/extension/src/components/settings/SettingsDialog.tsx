import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";

export function SettingsDialog({ onClose }) {
  const [darkMode, setDarkMode] = useState(true); // already enforced in S1

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <h2 className="text-h2 font-semibold text-text-primary mb-4">Paramètres</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-text-primary">Mode sombre</label>
          <Toggle
            pressed={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
            disabled // déjà forcée en S1
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-subtitle text-text-primary">Version</h3>
          <p className="text-caption text-text-muted">v1.0.0 (MVP)</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Fermer</Button>
      </div>
    </Card>
  );
}