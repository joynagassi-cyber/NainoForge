import { Flame, BookOpen, Sparkles } from "lucide-react";
import { BlockNoteBlock } from "@blocknote/core";

/**
 * Blocs personnalisés NainoForge pour BlockNote.
 * Ces blocs permettent de marquer visuellement différents types de contenu
 * dans l'éditeur IMPRINT.
 */
export const nfCustomBlocks = [
  // Bloc "Idée clé" — premier bloc custom à implémenté (histoire 3-2)
  {
    type: "keyIdea",
    label: "Idée clé",
    icon: Flame,
    content: {},
  },
  // Bloc "Exemple" — histoire 3-3
  {
    type: "example",
    label: "Exemple",
    icon: BookOpen,
    content: {},
  },
  // Bloc "Analogie" — histoire 3-4
  {
    type: "analogy",
    label: "Analogie",
    icon: Sparkles,
    content: {},
  },
  // Bloc "TeachBackSeed" — à implémenter (histoire 3-5)
  // {
  //   type: "teachBackSeed",
  //   label: "Amorce TB",
  //   icon: HelpCircle,
  //   content: {},
  // },
];
