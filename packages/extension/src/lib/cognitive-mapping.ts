/**
 * Mapping des termes cognitifs vers les niveaux de Cran (1-5).
 *
 * Suit la sémantique du DESIGN.md :
 * - Cran 1 (text-muted) → "À revoir"
 * - Cran 2 (accent-warm) → "Difficile"
 * - Cran 3 (primary) → (intermédiaire, non nommé explicitement)
 * - Cran 4 (state-forged) → "Solide"
 * - Cran 5 (state-forged + flame) → "Maîtrisé"
 */

export function cognitiveWordToCran(word: string): number {
  // Normaliser le terme (minuscules, supprimer accents)
  const normalized = word
    .toLowerCase()
    .replace(/[ÀÁÂÄÃÅ]/g, 'a')
    .replace(/[ÈÉÊË]/g, 'e')
    .replace(/[ÎÏ]/g, 'i')
    .replace(/[ÒÓÔÖ]/g, 'o')
    .replace(/[ÙÚÛÜ]/g, 'u')
    .replace(/[Ç]/g, 'c');

  switch (normalized) {
    case 'à revoir':
    case 'à revoir':
    case 'a revoir':
    case 'àrevoyer':
      return 1;
    case 'difficile':
      return 2;
    case 'solide':
      return 4;
    case 'maîtrisé':
    case 'maitrise':
    case 'maetrise':
      return 5;
    default:
      // Valeur par défaut pour les termes inconnus
      return 3;
  }
}

/**
 * Sens inverse : Cran à terme cognitif (pour l'affichage UI)
 */
export function cranToCognitiveWord(cran: number): string {
  switch (cran) {
    case 1:
      return 'À revoir';
    case 2:
      return 'Difficile';
    case 3:
      return 'En cours';
    case 4:
      return 'Solide';
    case 5:
      return 'Maîtrisé';
    default:
      return 'Inconnu';
  }
}
