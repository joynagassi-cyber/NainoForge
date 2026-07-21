import type { SummarizeInput, SummarizeOutput, IAiProvider } from './contracts.js';
import { summarize as deterministicSummarize } from './summarizer.js';

const SYSTEM_PROMPT =
  'Extract the Pareto summary (80/20) of this text. Return a concise summary of the key ideas in 2-3 sentences, then a bullet list of key points. Format: SUMMARY: <text>\nKEY POINTS:\n- <point1>\n- <point2>';

// Pre-compiled regexes for parsing LLM output format.
const SUMMARY_RE = /SUMMARY:\s*([\s\S]*?)(?=KEY POINTS:|$)/i;
const KP_RE = /KEY POINTS:\s*([\s\S]*?)$/i;

/**
 * Route summarization through an optional AI provider, falling back to the
 * deterministic stub when no provider is configured or the provider fails.
 *
 * @see SummarizeInput.provider  -- optional LiteLLM provider
 * @see SummarizeOutput         -- { summary, keyPoints }
 */
export async function summarizeWithFallback(
  input: SummarizeInput,
): Promise<SummarizeOutput> {
  const provider = input.provider;
  if (!provider) {
    return deterministicSummarize(input);
  }

  // Compute deterministic fallback once — reused in both partial-match and full-failure paths.
  const fallback = deterministicSummarize(input);

  try {
    const result = await provider.complete([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: input.text.slice(0, input.maxTokens ?? 4000) },
    ]);

    const text = result.text;
    const summaryMatch = SUMMARY_RE.exec(text);
    const kpMatch = KP_RE.exec(text);

    const summary = summaryMatch
      ? summaryMatch[1].trim().replace(/\n+/g, ' ')
      : fallback.summary;

    const rawPoints = kpMatch?.[1]?.trimStart() ?? '';
    // Normalize: strip leading bullet marker so split works uniformly
    const normalized = rawPoints.replace(/^[-*]\s*/, '');
    const keyPoints = normalized
      .split(/^\s*[-*]\s*/m)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 5);

    return { summary, keyPoints };
  } catch {
    // ponytail: provider failure -> deterministic stub (offline-safe)
    return fallback;
  }
}
