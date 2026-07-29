import { Flame } from "@/components/icons";
import { BlockNoteBlock } from "@blockNote/core";

/**
 * Blocs personnalisés NainoForge pour BlockNote.
 * Ces blocs permettent de marquer visuellement différents types de contenu
 * dans l'éditeur IMPRINT.
 */
export const nfCustomBlocks = [
  // Bloc "Idée clé" — premier bloc custom à implémenter (histoire 3-2-custom-blocks-keyidea)
  {
    type: "keyIdea",
    label: "Idée clé",
    icon: Flame,
    // BlockNote requiert un schema pour le bloc. Le schéma complet sera
    // défini lors de l'initialisation de l'éditeur.
    content: {
      // Contenu par défaut du bloc (texte)
    },
  },
  // Autres blocs à implémenter ultérieurement :
  // { type: "example", label: "Exemple", icon: BookOpen },
  // { type: "analogy", label: "Analogie", icon: Sparkles },
  // { type: "teachBackSeed", label: "Amorce TB", icon: HelpCircle },
];
