import { useCosmos } from '../../hooks/use-cosmos.js';
import type { CosmosNode } from '../../hooks/use-cosmos.js';

const STATUS_COLOR: Record<CosmosNode['status'], string> = {
  forged: 'bg-green-500/20 text-green-400',
  partial: 'bg-yellow-500/20 text-yellow-400',
  gap: 'bg-red-500/20 text-red-400',
  'not-visited': 'bg-gray-500/20 text-gray-400',
};

export function CosmosSurface() {
  const { nodes } = useCosmos();

  return (
    <div className="h-full w-full overflow-y-auto">
      {nodes.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-text-muted">Aucun concept forge. Capture un contenu pour commencer.</p>
        </div>
      ) : (
        <div className="grid gap-2 p-4">
          {nodes.map((node) => (
            <div key={node.id} className="rounded-md border border-border-subtle p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{node.label}</span>
                <span className="text-xs text-text-muted">SMI: {node.smi}%</span>
              </div>
              <div className="mt-1 flex gap-2">
                <span className={`inline-block rounded px-1.5 py-0.5 text-xs ${STATUS_COLOR[node.status] ?? STATUS_COLOR['not-visited']}`}>
                  {node.status}
                </span>
                <span className="text-xs text-text-muted">{node.bloom}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
