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
    // La fonction d'API réel serait branchée sur l'AiProvider
    // Pour MVP, utilisons un mock qui appelle le simulateur existant
    async fetch: async (request) => {
      // Mock: retourner une réponse fixe pour demonstration
      // Dans la version finale, ceci connectera à l'AiProvider via l'API backend
      const userMessage = request.messages[request.messages.length - 1]?.content;

      return new Response(
        JSON.stringify({
          replies: [
            {
              content: userMessage
                ? "Merci pour ton explication! J'ajoute quelques points pour enrichir ta compréhension:"
                : "Bienvenue dans Student AI! Explique-moi un concept que tu viens d'apprendre et je t'aiderai à identifier tes angles morts.",
              role: "assistant",
            },
          ],
        })
      );
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
          {message.confidence !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-caption text-foregroundMuted">
                Confiance évaluée
              </span>
              <span className="text-caption font-medium text-accent-warm">
                {message.confidence}%
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
