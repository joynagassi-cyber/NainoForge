import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

// Les ratings visuels
const RATING_OPTIONS = [
  { value: "again", label: "À revoir", color: "text-red-500" },
  { value: "hard", label: "Difficile", color: "text-yellow-500" },
  { value: "good", label: "Solide", color: "text-blue-500" },
  { value: "easy", label: "Maîtrisé", color: "text-green-500" },
];

type Rating = "again" | "hard" | "good" | "easy";

interface ReviewCardProps {
  question: string;
  answer: string;
  onRating: (rating: Rating) => void;
}

export function ReviewCard({ question, answer, onRating }: ReviewCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);

  const handleRating = (rating: Rating) => {
    setSelectedRating(rating);
    onRating(rating);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      {/* Front */}
      {!showAnswer ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-text-primary">Question</h3>
          <p className="text-text-primary leading-relaxed">{question}</p>
          <Button onClick={() => setShowAnswer(true)}>Révéler la réponse</Button>
        </div>
      ) : (
        {/* Back */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-text-primary">Réponse</h3>
          <p className="text-text-primary leading-relaxed">{answer}</p>

          {/* Ratings visuels */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {RATING_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={selectedRating === option.value ? "primary" : "secondary"}
                className={cn(
                  "px-4 py-2 text-sm",
                  option.color.replace("text-", "border-").replace("-500", "-500/20")
                )}
                onClick={() => handleRating(option.value as Rating)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Feedback visuel */}
          {selectedRating && (
            <div className="mt-4 p-3 rounded bg-surface-2 border border-border-subtle">
              <p className="text-sm">
                Feedback pour "{option.label}": {selectedRating === "easy" ? "Excellent ! Continuez comme ça." : selectedRating === "good" ? "Bonne maîtrise. Révisée dans quelques jours." : selectedRating === "hard" ? "Difficile—retravaillez ce point." : "À revoir rapidement !"}
              </p>
            </div>
          )}

          <Button variant="ghost" onClick={() => setShowAnswer(false)}>
            Revoir
          </Button>
        </div>
      )}
    </Card>
  );
}