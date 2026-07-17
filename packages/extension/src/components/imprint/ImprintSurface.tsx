import { useMemo } from "react";
import { BlockNoteView } from "@blocknote/react";
import { BlockNoteEditor } from "@blocknote/core";
import type { BlockNoteSchema } from "@blocknote/core";
import { Button } from "../ui/button";

/**
 * Surface IMPRINT — editor BlockNote habillé NainoForge.
 *
 * Cette surface est un atelier de forge cognitive.
 * Elle distingue 4 modes visuels pour les blocs :
 *   keyIdea  → idée clé
 *   example  → exemple
 *   analogy  → analogie
 *   teachBackSeed → amorce teach-back
 */

type BlockType = "keyIdea" | "example" | "analogy" | "teachBackSeed";

const NF_COLORS = {
  keyIdea: { background: "#7C3AED22", border: "#7C3AED", text: "#F0F2F5" },
  example: { background: "#22C55E22", border: "#22C55E", text: "#F0F2F5" },
  analogy: { background: "#F59E0B22", border: "#F59E0B", text: "#F0F2F5" },
  teachBackSeed: { background: "#1A1726", border: "#A5A0B8", text: "#F0F2F5" },
};

export function ImprintSurface() {
  const editor = useMemo(
    () =>
      BlockNoteEditor.create({
        schema: BlockNoteSchema.create() as BlockNoteSchema,
      }),
    []
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <div>
          <h2 className="text-h2 font-semibold text-text-primary">IMPRINT</h2>
          <p className="text-caption text-text-muted">
            Transforme ta capture en forge cognitive
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Évaluer
          </Button>
          <Button variant="forge" size="sm" iconRight>
            Forger
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="mx-auto max-w-[600px]">
          {/* Barre cognitive inline */}
          <div className="mb-4 flex items-center gap-3">
            <div className="cognitive-bar flex-1">
              <div
                className="cognitive-bar-fill"
                style={{ width: "45%" }}
                data-state="default"
              />
            </div>
            <span className="text-caption text-text-muted">Cran perçu ~3/5</span>
          </div>

          <BlockNoteView
            editor={editor}
            className="min-h-[200px] rounded-md border border-border-subtle bg-surface-1 p-3"
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
}
