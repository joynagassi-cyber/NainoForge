import { Flame } from "lucide-react";
import { Button } from "../ui/button";
import { Badge, BadgeVariant } from "../ui/badge";

// Types pour ImprintCard
interface ImprintCardProps {
  id: string;
  sourceType: 'web_article' | 'youtube' | 'pdf';
  title: string;
  privacyLevel: 'public' | 'personal' | 'enterprise';
  status: 'captured' | 'summarized' | 'imprinted' | 'gap' | 'forged' | 'leech';
  wordCount?: number;
  capturedAt?: string;
  onForge?: () => void;
  onPreview?: () => void;
  compact?: boolean;
}

/**
 * Carte IMPRINT — affiche une source capturée avec ses métadonnées et actions.
 *
 * Suit le spec SourceCard de DESIGN.md:
 * - Layout 400px width
 * - Header with icon, title, privacy dot
 * - Meta line with source_type, wordCount, captured_at
 * - Actions row: Forge (primary) and Preview (ghost)
 * - Elevation on hover
 */
export function ImprintCard({
  id,
  sourceType,
  title,
  privacyLevel,
  status,
  wordCount,
  capturedAt,
  onForge,
  onPreview,
  compact = false,
}: ImprintCardProps) {
  // Map sourceType to icon (simple implementation)
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'web_article': return '📄';
      case 'youtube': return '▶️';
      case 'pdf': return '📕';
      default: return '📄';
    }
  };

  // Map status to badge variant
  const getBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'forged': return 'forge';
      case 'partial': return 'privacy-personal';
      case 'gap': return 'privacy-public';
      case 'leech': return 'forge'; // leech uses forge color but would need red in future
      default: return 'forge';
    }
  };

  const variant = getBadgeVariant(status);
  const icon = getSourceIcon(sourceType);

  const compactClass = compact ? 'p-2' : 'p-3';

  return (
    <div className={`imprint-card bg-surface-1 border border-border-subtle rounded-md transition-all duration-normal hover:shadow-lg ${compactClass}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">{icon}</span>
          <h3 className="text-h3 font-semibold text-text-primary line-clamp-2">
            {title}
          </h3>
        </div>
        {/* Privacy dot */}
        <Badge variant={variant as any} className="ml-2">
          {privacyLevel}
        </Badge>
      </div>

      {/* Meta line */}
      <div className="text-caption text-text-muted mb-3 line-clamp-1">
        {sourceType} · {wordCount} mots · {capturedAt}
      </div>

      {/* Actions row */}
      <div className="flex gap-2">
        <Button
          variant="forge"
          size={compact ? "sm" : "md"}
          onClick={() => onForge?.()}
          disabled={!status || status === "forged"}
        >
          Forge
        </Button>
        <Button
          variant="ghost"
          size={compact ? "sm" : "md"}
          onClick={() => onPreview?.()}
        >
          Preview
        </Button>
      </div>
    </div>
  );
}
