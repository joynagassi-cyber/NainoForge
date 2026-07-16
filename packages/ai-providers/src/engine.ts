// ponytail: LiteLLM-backed provider gateway.
// MVP: simple /v1/chat/completions passthrough with minimal error surfacing.

import type { AiProviderConfig, AiChatMessage, AiCompletionResult, IAiProvider } from './contracts.js';

export class LiteLLMProvider implements IAiProvider {
  constructor(private cfg: AiProviderConfig) {}

  async complete(messages: AiChatMessage[]): Promise<AiCompletionResult> {
    if (!this.cfg.baseUrl) {
      throw new Error('AiProvider: missing baseUrl');
    }

    const url = `${this.cfg.baseUrl.replace(/\/$/, '')}/v1/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.cfg.apiKey ? { Authorization: `Bearer ${this.cfg.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.cfg.defaultModel,
        messages,
      }),
      signal: new AbortController().signal, // placeholder for timeout wiring
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`AiProvider ${response.status}: ${text}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: AiChatMessage; finish_reason?: string }>;
      model?: string;
    };

    const choice = data.choices[0];
    if (!choice) {
      throw new Error('AiProvider: empty completion');
    }

    return {
      provider: this.cfg.provider,
      model: data.model ?? this.cfg.defaultModel,
      text: choice.message.content,
      choice,
    };
  }
}
