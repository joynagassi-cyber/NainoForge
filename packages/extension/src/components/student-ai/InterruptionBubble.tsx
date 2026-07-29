import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { cn } from "../lib/utils";

// Props pour InterruptionBubble
interface InterruptionBubbleProps {
  question: string;
  isOpen: boolean;
  onAnswer: (answer: string) => void;
  onDismiss?: () => void;
  timeoutSec?: number; // timeout en secondes, undefined pour pas de timeout
}

/**
 * InterruptionBubble — bubble d'interruption pédagogique.
 *
 * Suit le design system NainoForge:
 * - Fond: surface-1 avec bordure subtile
 * - Mode dark
 * - Animation d'apparition
 */
export function InterruptionBubble({
  question,
  isOpen,
  onAnswer,
  onDismiss,
  timeoutSec = 30,
}: InterruptionBubbleProps) {
  const [input, setInput] = useState("");
  const [timer, setTimer] = useState<number | null>(null);

  // Gestion du timer de timeout
  useEffect(() => {
    let interval: number | null = null;

    if (isOpen && timeoutSec !== undefined) {
      let remaining = timeoutSec;
      setTimer(remaining);

      interval = window.setInterval(() => {
        remaining -= 1;
        setTimer(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          onDismiss?.(); // auto-dismiss
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, timeoutSec, onDismiss]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnswer(input.trim());
      setInput("");
    }
  };

  const handleDismiss = () => {
    onDismiss?.();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50 p-4",
        isOpen ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Bubble content */}
      <div
        className={cn(
          "relative bg-surface-1 border border-border-subtle rounded-lg p-6 w-full max-w-md transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">❓</span>
          <h3 className="text-h2 font-semibold text-text-primary">Pause!</h3>
        </div>

        {/* Question */}
        <p className="text-body text-text-primary mb-4 leading-relaxed">
          {question}
        </p>

        {/* Response form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ta réponse ici..."
            className="w-full px-3 py-2 rounded-md border border-border-default bg-surface text-text-primary placeholder-text-text-muted focus:border-primary focus:outline-none"
            autoFocus
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary" flex-1>
              Répondre
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleDismiss}
              disabled={!isOpen}
            >
              Passer
            </Button>
          </div>
        </form>

        {/* Timer if timeout is set */}
        {timeoutSec !== undefined && timer !== null && (
          <div className="mt-4 text-xs text-text-muted text-right">
            {timer}s
          </div>
        )}
      </div>
    </div>
  );
}