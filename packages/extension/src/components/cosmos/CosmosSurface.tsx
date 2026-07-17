import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export function CosmosSurface() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border-subtle px-4 py-3">
        <h2 className="text-h2 font-semibold text-text-primary">COSMOS</h2>
        <p className="text-caption text-text-muted">
          Cartographie vivante de ta compréhension
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-4 px-4">
          <div className="card space-y-3 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" size="sm">
                Vue globale
              </Button>
              <Button variant="ghost" size="sm">
                Par concept
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {["Forgé", "Partiel", "Lacune"].map((status) => (
              <div key={status} className="card p-3 text-center">
                <div className="text-h3 font-semibold text-text-primary">
                  {status === "Forgé" ? "0" : status === "Partiel" ? "0" : "0"}
                </div>
                <div className="text-caption text-text-muted">{status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
