import { Badge, BadgeVariant } from "../ui/badge";
import { cn } from "../../lib/utils.ts";

// Statuts de maîtrise
type MasteryStatus = "forged" | "partial" | "lacune" | "leech";

// Props pour StudentCard
interface StudentCardProps {
  conceptName: string;
  status: MasteryStatus;
  progress?: number; // 0-100, optionnel
}

/**
 * StudentCard — affiche un concept avec son statut de maîtrise.
 *
 * Suit le pattern du design system NainoForge:
 * - Surface: surface-1
 * - Border: border-subtle
 * - Elevation sur hover
 * - Badge de statut coloré selon le mastery status
 */
export function StudentCard({ conceptName, status, progress = 0 }: StudentCardProps) {
  // Mapper le statut vers la variante de badge
  const getBadgeVariant = (s: MasteryStatus): BadgeVariant => {
    switch (s) {
      case "forged": return "forge";
      case "partial": return "privacy-personal";
      case "lacune": return "privacy-public";
      case "leech": return "forge";
      default: return "forge";
    }
  };

  // Calculer la couleur du texte du badge
  const getTextColor = (s: MasteryStatus) => {
    return s === "forged" || s === "partial" ? "surface-base" : "text-primary";
  };

  const variant = getBadgeVariant(status);
  const textColor = getTextColor(status);

  return (
    <div
      className={cn(
        "student-card bg-surface-1 border border-border-subtle rounded-md p-4 transition-all duration-normal hover:shadow-lg",
        progress > 0 && "relative"
      )}
    >
      {/* Header avec nom du concept */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-h3 font-semibold text-text-primary">
          {conceptName}
        </h3>
        <Badge
          variant={variant}
          size="sm"
          className={cn(
            textColor === "surface-base"
              ? "text-surface-base"
              : "text-text-primary"
          )}
        >
          {status === "forged"
            ? "Maîtrisé"
            : status === "partial"
            ? "Partiel"
            : status === "lacune"
            ? "À revoir"
            : "Difficile"}
        </Badge>
      </div>

      {/* Barre de progression si fournie */}
      {progress > 0 && (
        <div className="mb-2">
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1">{progress}%</p>
        </div>
      )}

      {/* Description du statut */}
      <p className="text-sm text-text-muted">
        {status === "forged"
          ? "Concept parfaitement maîtrisé et prêt pour l'imprentage"
          : status === "partial"
          ? "Concept partiellement compris — des lacunes nécessitent un rappel"
          : status === "lacune"
          ? "Concept non maîtrisé — recommencez l'apprentissage"
          : "Concept difficile — priorité d'imprentage"}
      </p>
    </div>
  );
}
