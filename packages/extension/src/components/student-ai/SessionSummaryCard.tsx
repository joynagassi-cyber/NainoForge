import { useMemo } from "react";
import { cn } from "../../lib/utils.ts";
import { ConfidenceMarker } from "../ConfidenceMarker.tsx";

// Props pour SessionSummaryCard
interface SessionSummaryCardProps {
  coverage: number; // 0-100
  coherence: number; // 0-1
  depth: number; // 1-5
  cran: number; // 1-5
  iqs: number; // 0-100
  summary?: string; // Résumé textuel optionnel
}

/**
 * SessionSummaryCard — résume les métriques d'une session d'apprentissage.
 *
 * Suit le design system NainoForge :
 * - Surface: surface-1
 * - Border: border-subtle
 * - Elevation sur hover
 */
export function SessionSummaryCard({
  coverage,
  coherence,
  depth,
  cran,
  iqs,
  summary,
}: SessionSummaryCardProps) {
  // Normaliser les valeurs (bounds checking)
  const normCoverage = Math.max(0, Math.min(100, coverage));
  const normCoherence = Math.max(0, Math.min(1, coherence));
  const normDepth = Math.max(1, Math.min(5, depth));
  const normCran = Math.max(1, Math.min(5, cran));
  const normIqs = Math.max(0, Math.min(100, iqs));

  // Calculer la jauge de coverage (barre horizontale)
  const coverageWidth = `${normCoverage}%`;

  // Calculer la jauge de coherence (progression circulaire simplifiée)
  const coherenceProgress = `${normCoherence * 100}%`;

  return (
    <div
      className={cn(
        "session-summary-card bg-surface-1 border border-border-subtle rounded-lg p-4 transition-all duration-normal hover:shadow-lg",
        "mb-6"
      )}
    >
      <h3 className="text-h2 font-semibold text-text-primary mb-4">Résumé de Session</h3>

      {/* Métriques en grille */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Coverage */}
        <div>
          <p className="text-sm text-text-muted mb-1">Couverture (coverage)</p>
          <div className="w-full bg-surface-2 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: coverageWidth }}
            />
          </div>
          <p className="text-sm font-medium text-text-primary mt-1">{normCoverage}%</p>
        </div>

        {/* Coherence */}
        <div>
          <p className="text-sm text-text-muted mb-1">Cohérence</p>
          <div className="w-full bg-surface-2 rounded-full h-2">
            <div
              className="bg-accent-warm h-2 rounded-full transition-all duration-300"
              style={{ width: coherenceProgress }}
            />
          </div>
          <p className="text-sm font-medium text-text-primary mt-1">{(normCoherence * 100).toFixed(0)}</p>
        </div>

        {/* Depth */}
        <div>
          <p className="text-sm text-text-muted mb-1">Profondeur</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={cn(
                  "text-lg",
                  i < normDepth - 1 ? "text-state-forged" : "text-text-muted"
                )}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-sm font-medium text-text-primary mt-1">{normDepth}/5</p>
        </div>
      </div>

      {/* Cran et IQS */}
      <div className="flex items-center justify-between border-t border-border-subtle pt-4">
        <div className="flex items-center gap-3">
          <ConfidenceMarker cran={normCran} size="lg" />
          <div>
            <p className="text-sm text-text-muted">Cran</p>
            <p className="text-lg font-semibold text-text-primary">{normCran}/5</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-muted">IQS</p>
          <p className="text-lg font-semibold text-text-primary">{normIqs}</p>
        </div>
      </div>

      {/* Résumé textuel optionnel */}
      {summary && (
        <div className="mt-4 p-3 bg-surface-2 rounded-md">
          <p className="text-sm text-text-primary">{summary}</p>
        </div>
      )}
    </div>
  );
}