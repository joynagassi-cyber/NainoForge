import { MvpCosmos } from "./MvpCosmos";

export function CosmosSurface() {
  return (
    <div className="h-full">
      <div className="border-b border-border-subtle px-4 py-3">
        <h2 className="text-h2 font-semibold text-text-primary">COSMOS</h2>
        <p className="text-caption text-text-muted">Carte des concepts et relations</p>
      </div>

      <div className="h-full">
        <MvpCosmos />
      </div>
    </div>
  );
}