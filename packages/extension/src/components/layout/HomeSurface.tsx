import { useSources } from '../../hooks/use-sources.js';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

/** French plural helper: appends 's' to the last word when n > 1. */
function fr(n: number, phrase: string): string {
  const words = phrase.split(' ');
  if (words.length === 0) return String(n);
  words[words.length - 1] += n > 1 ? 's' : '';
  return `${n} ${words.join(' ')}`;
}

export function HomeSurface() {
  const { sources, loading } = useSources();

  if (loading) {
    return (
      <div className="space-y-4 px-4 py-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 py-3">
      <div>
        <h2 className="text-h2 font-semibold text-text-primary">Forge</h2>
        <p className="text-caption text-text-muted">
          {sources.length === 0
            ? 'Commence par capturer un contenu.'
            : fr(sources.length, 'contenu capturé')}
        </p>
      </div>

      <div className="grid gap-3">
        <Card>
          <CardHeader>
            <CardTitle>A réviser</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-text-muted">
              {sources.length === 0
                ? 'Aucune carte due. Capture un contenu pour commencer.'
                : fr(sources.length, 'contenu prêt') + ' pour révision.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="cognitive-bar flex-1">
                <div
                  className="cognitive-bar-fill"
                  style={{ width: `${Math.min(100, sources.length * 20)}%` }}
                  data-state={sources.length > 0 ? 'partial' : 'default'}
                />
              </div>
              <p className="text-caption text-text-muted">
                {fr(sources.length, 'concept capturé')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières sources</CardTitle>
          </CardHeader>
          <CardContent>
            {sources.length === 0 ? (
              <p className="text-body-sm text-text-muted">Aucune source capturée.</p>
            ) : (
              <ul className="space-y-1">
                {sources.slice(-3).reverse().map((s) => (
                  <li key={s.id} className="text-body-sm">
                    {s.title} ({s.source_type})
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
