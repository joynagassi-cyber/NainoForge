import { useSources } from '../../hooks/use-sources.js';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { ConfidenceMarker } from '../components/ConfidenceMarker';
import { Flame } from 'lucide-react';

// Helper pour formater la date (simplifié)
function formatDateString(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/** French plural helper: appends 's' to the last word when n > 1. */
function fr(n: number, phrase: string): string {
  const words = phrase.split(' ');
  if (words.length === 0) return String(n);
  words[words.length - 1] += n > 1 ? 's' : '';
  return `${n} ${words.join(' ')}`;
}

export function HomeSurface() {
  const { sources, loading } = useSources();

  // Données de demo pour l'enrichissement (en production, viendraient de IndexedDB/state)
  const streak = 7; // nombre de jours consécutifs
  const cardsDueToday = 3; // nombre de cartes dues aujourd'hui
  const nextReviewInHours = 2; // prochaines révision dans 2 heures
  const masteryGraph = [
    { concept: "Algorithmes", mastery: 95 },
    { concept: "Complexité", mastery: 65 },
    { concept: "Structures", mastery: 30 },
  ];

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
      {/* En-tête avec streak et cards dues */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-accent-warm" />
              <span className="text-2xl font-bold text-text-primary">{streak}</span>
              <span className="text-caption text-text-muted">jours</span>
            </div>
            <p className="text-xs text-text-muted mt-1">Chaine continue de révision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cartes dues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary">{cardsDueToday}</div>
            <p className="text-xs text-text-muted mt-1">à réviser aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      {/* Prochaine révision et mini graph */}
      <Card>
        <CardHeader>
          <CardTitle>Prochaine révision</CardHeader>
        </CardHeader>
        <CardContent>
          <p className="text-text-primary">Dans <span className="font-bold">{nextReviewInHours}</span> heure(s)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maîtrise par concept (mini graph)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {masteryGraph.map((item) => (
              <div key={item.concept} className="flex items-center justify-between">
                <span className="text-sm text-text-primary">{item.concept}</span>
                <div className="flex items-center gap-2">
                  <ConfidenceMarker cran={Math.min(5, Math.round(item.mastery / 20))} size="sm" />
                  <span className="text-xs text-text-muted">{item.mastery}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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