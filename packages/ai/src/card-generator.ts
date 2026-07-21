// ponytail: deterministic card generation from IMPRINT notes.
// MVP: template-based (no LLM call). Production: one LLM call per card type.
//
// PRD rules:
//   FR-CARD-001: Each valid IMPRINT generates min 1 B02 (Definition) + 1 B04 (Short Answer)
//   FR-CARD-002: B03 (MCQ) and B05 (Application) if cran >= 3
//   FR-CARD-003: B01 (Exposition) generated once per concept
//   FR-IQS-013: IQS < 30 → B01 + B02 only (no B03/B04/B05)

export interface ImprintNote {
  id: string;
  source_id: string;
  concept_id: string;
  content: string;
  word_count: number;
  cran_level: number; // 1-5
  quality_score: number; // 0-100
  bloom_level?: string;
  concept_coverage_pct?: number;
  created_at: number;
}

export interface GeneratedCard {
  id: string;
  card_type: 'B01' | 'B02' | 'B03' | 'B04' | 'B05';
  concept_id: string;
  front: string;
  back: string;
}

// Deterministic card IDs: `${concept_id}-${card_type}-${index}`
// Eliminates crypto.randomUUID() calls and enables test reproducibility.
function makeId(conceptId: string, cardType: string, index: number): string {
  return `${conceptId}-${cardType}-${index}`;
}

// Card template definitions — single source of truth.
const CARD_TEMPLATES: Record<string, (phrase: string, content: string, idx: number, conceptId: string) => { front: string; back: string }> = {
  B01: (phrase, content) => ({ front: `Explain the concept "${phrase}" from scratch.`, back: content }),
  B02: (phrase, content) => ({ front: `Define: ${phrase}`, back: content.slice(0, 200) }),
  B03: (phrase, content) => ({ front: `Which statement best describes "${phrase}"?`, back: content.slice(0, 100) }),
  B04: (phrase, content) => ({ front: `What is the key idea behind "${phrase}"?`, back: content.split(/[.!?]+/).slice(0, 2).join('. ') + '.' }),
  B05: (phrase, content) => ({ front: `Apply the concept "${phrase}" to a new scenario.`, back: content.slice(0, 150) }),
};

export function generateCards(
  imprint: ImprintNote,
  _provider?: unknown, // reserved for LLM card generation
): GeneratedCard[] {
  const cards: GeneratedCard[] = [];
  const { concept_id, content, cran_level, quality_score } = imprint;
  const lowQuality = quality_score < 30;
  const phrase = extractConceptPhrase(content);

  // FR-IQS-013: IQS < 30 → B01 + B02 only
  if (lowQuality) {
    pushCards(cards, concept_id, ['B01', 'B02'], phrase, content);
    return cards;
  }

  const types = ['B02', 'B04'];
  if (cran_level >= 3) types.push('B03', 'B05');
  types.push('B01'); // Exposition always last

  pushCards(cards, concept_id, types, phrase, content);
  return cards;
}

function pushCards(
  cards: GeneratedCard[],
  conceptId: string,
  types: string[],
  phrase: string,
  content: string,
): void {
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const tmpl = CARD_TEMPLATES[type];
    if (!tmpl) continue;
    const { front, back } = tmpl(phrase, content, i, conceptId);
    cards.push({ id: makeId(conceptId, type, i), card_type: type as GeneratedCard['card_type'], concept_id: conceptId, front, back });
  }
}

function extractConceptPhrase(text: string): string {
  const match = text.match(/\b([A-Z][a-z]+(?:\s+[a-z]+)+)\b/);
  return match ? match[1] : text.slice(0, 40);
}
