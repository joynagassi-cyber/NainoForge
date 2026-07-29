import { useMemo } from "react";
import {
  AssistantChat,
  type UseAssistantReturnType,
  useAssistant,
} from "@assistant-ui/react";
import { cn } from "../lib/utils";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { LiteLLMProvider } from "../../ai-providers/engine";
import type { AiChatMessage } from "../../ai-providers/contracts";

// Thème NainoForge pour assistant-ui
const nainoforgeTheme = {
  // Couleurs du design system NainoForge (dark mode)
  colors: {
    background: "#0A0A0F", // surface-base
    surface: "#12101C", // surface-1
    surfaceSecondary: "#1A1726", // surface-2
    primary: "#7C3AED", // primary
    primaryForeground: "#FFFFFF",
    foreground: "#F0F2F5", // text-primary
    foregroundMuted: "#A5A0B8", // text-muted
    border: "rgba(255,255,255,0.08)", // border-subtle
  },
  // Formes (border-radius)
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
  },
  // Espacements
  spacing: {
    xs: "8px",
    sm: "12px",
    md: "16px",
  },
};

// Configuration de l'AiProvider (à lire depuis variables d'environnement dans la vraie app)
const aiProviderConfig = {
  provider: "litellm" as const,
  baseUrl: process.env.AI_BASE_URL || "http://localhost:4000",
  apiKey: process.env.AI_API_KEY || "",
  defaultModel: process.env.AI_MODEL || "gpt-3.5-turbo",
  timeoutMs: 30000,
};

// Instance de l'AiProvider
const aiProvider = new LiteLLMProvider(aiProviderConfig);

export function StudentAISurface() {
  // Hook pour l'assistant
  const {
    messages,
    messageCache,
    submitting,
    submitMessage,
    setInput,
    input,
    clearChat
  }: UseAssistantReturnType = useAssistant({
    async fetch: async (request) => {
      // Convertir les messages d'assistant-ui au format AiChatMessage
      const aiMessages: AiChatMessage[] = request.messages.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      }));

      try {
        // Appeler l'AiProvider
        const result = await aiProvider.complete(aiMessages);

        // Réponse formatée pour l'assistant-ui
        return new Response(
          JSON.stringify({
            replies: [
              {
                content: result.text,
                role: "assistant",
                data: {
                  confidence: Math.round(Math.random() * 20 + 70), // fake confidence for demo
                },
              },
            ],
          })
        );
      } catch (error) {
        // En cas d'erreur, retourner une réponse de fallback
        console.error("AiProvider error:", error);
        return new Response(
          JSON.stringify({
            replies: [
              {
                content: "Désolé, je ne peux pas répondre en moment. Veuillez réessayer plus tard.",
                role: "assistant",
              },
            ],
          })
        );
      }
    },
  });

  // Calcul du Cran (simplified - dans la vraie implémentation, cela viendrait de l'évaluation)
  const cran = messages.length > 0 ? Math.min(5, Math.max(1, Math.floor(messages.length / 2))) : 0;
  const iqs = Math.round((cran / 5) * 100);

  return (
    <AssistantChat
      theme={nainoforgeTheme}
      className="flex h-full flex-col"
      renderMessage={({ message, index }) => (
        <div
          key={index}
          className={cn(
            "max-w-[85%] rounded-lg px-3 py-2 text-body",
            message.role === "user"
              ? "ml-auto bg-primary text-surface-base"
              : "mr-auto bg-surfaceSecondary text-foreground"
          )}
        >
          <p>{message.content}</p>
          {message.data?.confidence !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-caption text-foregroundMuted">
                Confiance évaluée
              </span>
              <span className="text-caption font-medium text-accent-warm">
                {message.data.confidence}%
              </span>
            </div>
          )}
        </div>
      )}
      renderInput={({ input, setInput, onSubmit, disabled }) => (
        <div className="border-t border-border px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Explique avec tes propres mots..."
              className={cn(
                "flex-1 rounded-md border border-border-default bg-surface px-3 py-2 text-body text-foreground placeholder-text-foregroundMuted focus:border-primary focus:outline-none",
                input && !disabled && "border-primary"
              )}
              disabled={disabled}
            />
            <Button
              type="submit"
              variant="primary"
              size="icon"
              disabled={!input.trim() || submitting || disabled}
              iconLeft={<Send className="h-4 w-4" />}
            />
          </form>
        </div>
      )}
      renderLoading={() => (
        <div className="mr-auto mt-2">
          <Spinner size="sm" label="Réflexion..." />
        </div>
      )}
    </AssistantChat>
  );
}
