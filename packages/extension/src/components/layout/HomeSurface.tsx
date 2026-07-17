import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function HomeSurface() {
  return (
    <div className="space-y-4 px-4 py-3">
      <div>
        <h2 className="text-h2 font-semibold text-text-primary">Forge</h2>
        <p className="text-caption text-text-muted">
          Ton cockpit cognitif du jour
        </p>
      </div>

      <div className="grid gap-3">
        <Card>
          <CardHeader>
            <CardTitle>À réviser</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-text-muted">
              Aucune carte due pour l'instant. Commence par capturer un contenu.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="cognitive-bar">
                <div className="cognitive-bar-fill" style={{ width: "0%" }} data-state="default" />
              </div>
              <p className="text-caption text-text-muted">0 concepts forgés</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières sources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-text-muted">
              Aucune source capturée pour l'instant.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
