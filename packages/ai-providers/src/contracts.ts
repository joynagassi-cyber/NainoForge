// ─── AI provider contracts ─────────────────────────────────────
// Provider-agnostic gateway. MVP: LiteLLM-backed, fallback to env config.

export type AiProviderMode = 'cloud' | 'local';

export interface AiProviderConfig {
  provider: 'litellm';
  baseUrl: string;
  apiKey?: string;
  defaultModel: string;
  timeoutMs?: number;
}

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiChatChoice {
  message: AiChatMessage;
  finish_reason?: string;
}

export interface AiCompletionResult {
  provider: string;
  model: string;
  text: string;
  choice: AiChatChoice;
}

export interface IAiProvider {
  complete(messages: AiChatMessage[]): Promise<AiCompletionResult>;
}
