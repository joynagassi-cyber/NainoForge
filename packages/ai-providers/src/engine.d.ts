import type { AiProviderConfig, AiChatMessage, AiCompletionResult, IAiProvider } from './contracts.js';
export declare class LiteLLMProvider implements IAiProvider {
    private cfg;
    constructor(cfg: AiProviderConfig);
    complete(messages: AiChatMessage[]): Promise<AiCompletionResult>;
}
