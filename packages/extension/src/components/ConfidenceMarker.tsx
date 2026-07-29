import { Flame } from "lucide-react";
import { cn } from "../lib/utils";

// Props pour ConfidenceMarker
interface ConfidenceMarkerProps {
  cran: number; // Niveau de Cran (1-5)
  size?: "sm" | "md" | "lg"; // Taille du marqueur
}

/**
 * ConfidenceMarker — jauge de visualisation du Cran (niveau de maîtrise).
 *
 * Suit le design system NainoForge:
 * - Cran 1: text-muted (gris)
 * - Cran 2: accent-warm (orange)
 * - Cran 3: primary (violet)
 * - Cran 4-5: state-forged (vert) + icône flame
 */
export function ConfidenceMarker({ cran, size = "md" }: ConfidenceMarkerProps) {
  // Valider et normaliser le Cran
  const normalizedCran = Math.max(1, Math.min(5, cran));

  // Déterminer la couleur et l'icône selon le Cran
  let icon: React.ReactNode = null;
  let className = "";

  switch (normalizedCran) {
    case 1:
      className = "text-text-muted";
      break;
    case 2:
      className = "text-accent-warm";
      break;
    case 3:
      className = "text-primary";
      break;
    case 4:
    case 5:
      className = "text-state-forged";
      icon = <Flame className="w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />;
      break;
  }

  // Calculer les dimensions en fonction de la taille
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };
  const sizeClass = sizes[size] || sizes.md;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full border-2 border-current",
        sizeClass,
        className
      )}
      aria-label={`Niveau de maîtrise: ${normalizedCran}/5`}
    >
      {/* Cercle de fond */}
      <div className="absolute inset-0 bg-surface-2 rounded-full" />

      {/* Icône ou nombre central */}
      {icon ? (
        icon
      ) : (
        <span className="text-xs font-bold text-text-primary">{normalizedCran}</span>
      )}
    </div>
  );
}