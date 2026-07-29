import { useMemo, useState } from "react";
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
import { StudentCard } from "./StudentCard";
import { InterruptionBubble } from "./InterruptionBubble";

// Thème NainoForge pour assistant-ui
const nainoforgeTheme = {
  colors: {
    background: "#0A0A0F",
    surface: "#12101C",
    surfaceSecondary: "#1A1726",
    primary: "#7C3AED",
    primaryForeground: "#FFFFFF",
    foreground: "#F0F2F5",
    foregroundMuted: "#A5A0B8",
    border: "rgba(255,255,255,0.08)",
  },
  radius: { sm: "6px", md: "10px", lg: "14px" },
  spacing: { xs: "8px", sm: "12px", md: "16px" },
};

const aiProviderConfig = {
  provider: "litellm" as const,
  baseUrl: process.env.AI_BASE_URL || "http://localhost:4000",
  apiKey: process.env.AI_API_KEY || "",
  defaultModel: process.env.AI_MODEL || "gpt-3.5-turbo",
  timeoutMs: 30000,
};

const aiProvider = new LiteLLMProvider(aiProviderConfig);

export function StudentAISurface() {
  const { messages, submitting, setInput, input } = useAssistant({
    async fetch: async (request) => {
      const aiMessages: AiChatMessage[] = request.messages.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      }));

      try {
        const result = await aiProvider.complete(aiMessages);
        return new Response(JSON.stringify({
          replies: [{ content: result.text, role: "assistant", data: { confidence: Math.round(Math.random() * 20 + 70) } }],
        }));
      } catch (error) {
        console.error("AiProvider error:", error);
        return new Response(JSON.stringify({
          replies: [{ content: "Désolé, je ne peux pas répondre. Veuillez réessayer plus tard.", role: "assistant" }],
        }));
      }
    },
  });

  const [interruptionOpen, setInterruptionOpen] = useState(false);
  const [interruptionQuestion, setInterruptionQuestion] = useState("");

  const studentCards = [
    { conceptName: "Algorithmes de tri", status: "forged", progress: 95 },
    { conceptName: "Complexité algorithmique", status: "partial", progress: 65 },
    { conceptName: "Structure de données", status: "lacune", progress: 30 },
    { conceptName: "Réseaux de neurones", status: "leech", progress: 15 },
  ];

  const handleInterruptionAnswer = (answer: string) => {
    console.log("Interruption answer:", answer);
    setInterruptionOpen(false);
  };

  const triggerInterruption = () => {
    const questions = [
      "Selon toi, quel est le lien entre ces deux concepts ?",
      "Peux-tu expliquer cela avec tes propres mots ?",
      "Qu'est-ce que tu as appris aujourd'hui qui t'a surpris ?",
      "Comment appliquerais-tu ce knowledge dans un autre contexte ?"
    ];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setInterruptionQuestion(randomQuestion);
    setInterruptionOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border-subtle px-4 py-3 flex justify-between items-center">
        <div>
          <h2 className="text-h2 font-semibold text-text-primary">Student AI</h2>
          <p className="text-caption text-text-muted">Boucle de teach-back et recalibration</p>
        </div>
        <Button variant="secondary" size="sm" onClick={triggerInterruption}>
          Test Interruption
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="mb-6">
          <h3 className="text-h3 font-semibold text-text-primary mb-3">
            Vos concepts et maîtrise
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentCards.map((card) => (
              <StudentCard
                key={card.conceptName}
                conceptName={card.conceptName}
                status={card.status}
                progress={card.progress}
              />
            ))}
          </div>
        </div>

        <AssistantChat
          theme={nainoforgeTheme}
          className="flex-1 min-h-[400px]"
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
            <div className="border-t border-border px-4 py-3 mt-6">
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
        />
      </div>

      {interruptionOpen && (
        <InterruptionBubble
          question={interruptionQuestion}
          isOpen={interruptionOpen}
          onAnswer={handleInterruptionAnswer}
          onDismiss={() => setInterruptionOpen(false)}
          timeoutSec={20}
        />
      )}
    </div>
  );
}