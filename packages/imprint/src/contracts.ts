export interface CrankEvaluation {
  cran: 1 | 2 | 3 | 4 | 5;
  iqs: number; // 0-100
  word_count: number;
  bloom_level?: string;
  concept_coverage_pct?: number; // 0-100
  has_example: boolean;
  has_analogy: boolean;
}

export interface ImprintEvaluationInput {
  content: string;
  conceptCount?: number;
}

export interface ImprintNoteInput {
  sourceId: string;
  conceptId: string;
  content: string;
}

const CONNECTORS = new Set([
  'because','therefore','however','thus','consequently','moreover','furthermore',
  'nevertheless','nonetheless','accordingly','hence','so','but','and','or',
  'for example','for instance','e.g.','such as','like','including',
]);

const RICH_CONNECTORS = new Set([
  'therefore','consequently','furthermore','moreover','however','nevertheless',
  'for example','for instance','such as','because','thus','hence',
]);

const ANALOGY_MARKERS = ['like', 'as if', 'as though', 'similar to', 'compared to', 'just as'];

export function evaluateCrank(input: ImprintEvaluationInput): CrankEvaluation {
  const text = input.content.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const word_count = words.length;
  const lower = text.toLowerCase();

  const hasConnector = [...CONNECTORS].some((c) => lower.includes(c));
  const hasRichConnector = [...RICH_CONNECTORS].some((c) => lower.includes(c));
  const hasExample = /(?:for example|for instance|e\.g\.|such as|including)/.test(lower);
  const hasAnalogy = ANALOGY_MARKERS.some((m) => lower.includes(m));

  const exampleCount = (hasExample ? 1 : 0) + (hasAnalogy ? 1 : 0);

  let cran: 1 | 2 | 3 | 4 | 5 = 1;
  if (word_count >= 200) cran = 2;
  if (hasConnector) cran = 3;
  if (exampleCount >= 1) cran = 4;
  if (exampleCount >= 2 && hasRichConnector) cran = 5;

  const coverage = input.conceptCount ? Math.min(100, Math.round((exampleCount / Math.max(1, input.conceptCount)) * 100)) : undefined;

  const sigCount = [hasConnector, hasExample, hasAnalogy, word_count >= 200].filter(Boolean).length;
  const iqs = Math.round(Math.min(100, (cran / 5) * 60 + sigCount * 10));

  return {
    cran,
    iqs,
    word_count,
    bloom_level: bloomFromText(lower),
    concept_coverage_pct: coverage,
    has_example: hasExample,
    has_analogy: hasAnalogy,
  };
}

function bloomFromText(text: string): string | undefined {
  if (/\b(analyze|compare|contrast|distinguish|examine)\b/.test(text)) return 'analyze';
  if (/\b(apply|use|demonstrate|implement|solve)\b/.test(text)) return 'apply';
  if (/\b(evaluate|judge|defend|critique|recommend)\b/.test(text)) return 'evaluate';
  if (/\b(synthesize|create|design|construct|propose)\b/.test(text)) return 'synthesize';
  if (/\b(understand|explain|describe|summarize|interpret)\b/.test(text)) return 'understand';
  if (/\b(remember|list|name|define|recall|identify)\b/.test(text)) return 'remember';
  return undefined;
}
