import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ConfidenceMarker } from "../components/ConfidenceMarker";

interface ReviewCardProps {
  question: string;
  answer: string;
  rating?: "again" | "hard" | "good" | "easy";
  onRating?: (rating: "again" | "hard" | "good" | "easy") => void;
}

export function ReviewCard({
  question,
  answer,
  rating,
  onRating,
}: ReviewCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      {!showAnswer ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Question</h3>
          <p className="text-text-primary">{question}</p>
          <Button onClick={() => setShowAnswer(true)}>Révéler la réponse</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Réponse</h3>
          <p className="text-text-primary">{answer}</p>

          {onRating && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={rating === "again" ? "primary" : "secondary"}
                onClick={() => onRating("again")}
              >
                À revoir
              </Button>
              <Button
                variant={rating === "hard" ? "primary" : "secondary"}
                onClick={() => onRating("hard")}
              >
                Difficile
              </Button>
              <Button
                variant={rating === "good" ? "primary" : "secondary"}
                onClick={() => onRating("good")}
              >
                Solide
              </Button>
              <Button
                variant={rating === "easy" ? "primary" : "secondary"}
                onClick={() => onRating("easy")}
              >
                Maîtrisé
              </Button>
            </div>
          )}

          {rating && (
            <div className="mt-4 p-3 rounded bg-surface-2 border border-border-subtle">
              <p className="text-sm">
                Rating sélectionné :{" "}
                {rating === "again"
                  ? "À revoir"
                  : rating === "hard"
                  ? "Difficile"
                  : rating === "good"
                  ? "Solide"
                  : "Maîtrisé"}
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