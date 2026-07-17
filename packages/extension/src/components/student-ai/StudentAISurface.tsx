import { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Send } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
};

export function StudentAISurface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Prêt ? Explique-moi le concept que tu viens de forger. Je vais t'aider à trouver tes angles morts.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          "Bonne explication. Ton raisonnement sur les prérequis est fluide. Par contre, tu sembles moins à l'aise sur l'impact des contraintes de synchronisation : tu veux creuser cet angle ?",
        confidence: 72,
      };
      setMessages((m) => [...m, aiMsg]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border-subtle px-4 py-3">
        <h2 className="text-h2 font-semibold text-text-primary">Student AI</h2>
        <p className="text-caption text-text-muted">
          Boucle de teach-back et recalibration
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[85%] rounded-lg px-3 py-2 text-body",
              msg.role === "user"
                ? "ml-auto bg-primary text-surface-base"
                : "mr-auto bg-surface-2 text-text-primary"
            )}
          >
            <p>{msg.content}</p>
            {msg.confidence !== undefined && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-caption text-text-muted">
                  Confiance évaluée
                </span>
                <span className="text-caption font-medium text-accent-warm">
                  {msg.confidence}%
                </span>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="mr-auto">
            <Spinner size="sm" label="Réflexion..." />
          </div>
        )}
      </div>

      <div className="border-t border-border-subtle p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Explique avec tes propres mots..."
            className="flex-1 rounded-md border border-border-default bg-surface-2 px-3 py-2 text-body text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <Button
            type="submit"
            variant="primary"
            size="icon"
            disabled={!input.trim() || loading}
            iconLeft={<Send className="h-4 w-4" />}
          />
        </form>
      </div>
    </div>
  );
}
