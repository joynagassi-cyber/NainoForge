import { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { ReviewCard } from "./ReviewCard";
import { getScheduler, type Rating } from "@nainoforge/fsrs";
import type { FsrsCard } from "@nainoforge/fsrs";

export function ReviewSurface() {
  const [cards, setCards] = useState<FsrsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const loadCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const scheduler = getScheduler();
      const dueCards = await scheduler.due();
      setCards(dueCards);
      setActiveIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleRating = async (rating: Rating) => {
    const card = cards[activeIndex];
    if (!card) return;

    const scheduler = getScheduler();
    await scheduler.reviewCard({ card, rating });

    // Recharge les cartes après la révision
    const nextCards = await scheduler.due();
    setCards(nextCards);

    // Passer à la suivante ou terminer
    if (nextCards.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= nextCards.length) {
      setActiveIndex(0);
    }
    // sinon reste sur le même index (la carte a été retirée de la liste)
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
        <Spinner size="lg" label="Chargement des cartes..." />
        <Skeleton className="h-32 w-80" />
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-text-primary">Erreur de chargement</p>
          <p className="text-sm text-text-muted">{error}</p>
        </div>
        <Button onClick={loadCards} variant="secondary">
          Réessayer
        </Button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-text-primary">Aucune carte à réviser</p>
          <p className="text-sm text-text-muted">
            Toutes vos cartes ont été revues. Capturez du contenu pour continuer.
          </p>
        </div>
        <Button onClick={loadCards} variant="secondary">
          Rafraîchir
        </Button>
      </div>
    );
  }

  const currentCard = cards[activeIndex];

  return (
    <div className="flex flex-col h-full px-4 py-3">
      {/* Header avec progression */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-h2 font-semibold text-text-primary">Révision</h2>
          <p className="text-caption text-text-muted">
            {activeIndex + 1} / {cards.length}
          </p>
        </div>
        <Button onClick={loadCards} variant="ghost" size="sm">
          Rafraîchir
        </Button>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-surface-2 rounded-full h-1 mb-4">
        <div
          className="bg-primary h-1 rounded-full transition-all duration-300"
          style={{ width: `${((activeIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Carte de révision */}
      <div className="flex-1 overflow-y-auto">
        {currentCard && (
          <ReviewCard
            question={`Carte #${currentCard.id.slice(0, 8)}`}
            answer="Révisez ce concept en vous basant sur votre imprint."
            onRating={handleRating}
          />
        )}
      </div>

      {/* Navigation entre cartes */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
        >
          Précédent
        </Button>

        <span className="text-caption text-text-muted">
          {activeIndex + 1} sur {cards.length}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveIndex(Math.min(cards.length - 1, activeIndex + 1))}
          disabled={activeIndex >= cards.length - 1}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
