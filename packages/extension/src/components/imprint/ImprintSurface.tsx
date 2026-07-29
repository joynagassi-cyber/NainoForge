import { useCallback, useEffect, useMemo, useRef } from "react";
import { BlockNoteView } from "@blocknote/react";
import { BlockNoteEditor } from "@blocknote/core";
import { Flame, BookOpen, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useImprint } from "../../hooks/use-imprint.js";
import { nfCustomBlocks } from "./custom-blocks";
import { ImprintCard } from "./ImprintCard";
import { ConfidenceMarker } from "../ConfidenceMarker";

/**
 * Surface IMPRINT — editor BlockNote habillé NainoForge.
 *
 * Cette surface est un atelier de forge cognitive.
 * custom blocks : keyIdea, example, analogy, teachBackSeed (tous implémentés)
 */

export function ImprintSurface() {
  const { content, setContent, cran, iqs, saving, saved, evaluate, handleSave, minLength } = useImprint(
    "temp-source",  // TODO: pass real sourceId from parent
    "temp-concept", // TODO: pass real conceptId from parent
  );

  const editorRef = useRef<BlockNoteEditor | null>(null);

  // Create BlockNote editor connected to useImprint content
  const editor = useMemo(
    () =>
      BlockNoteEditor.create({
        // Custom blocks pour NainoForge
        customBlocks: nfCustomBlocks,
        // ponytail: BlockNoteSchema.create() has a TS type bug in v0.51.x
        // where it can't be used as a value. We work around it by casting.
        schema: (BlockNoteEditor as any).defaultSchema,
      }),
    []
  );

  // Sync BlockNote editor reference for toolbar insertion
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Sync BlockNote content back to useImprint state via onChange callback
  const handleEditorChange = useCallback(() => {
    const text = editor.blocks
      .map((b) => b.content ?? "")
      .join("\n");
    setContent(text);
    evaluate(text);
  }, [editor, setContent, evaluate]);

  // Subscribe to BlockNote changes instead of polling with setInterval
  useEffect(() => {
    handleEditorChange(); // seed initial content
    return editor.onChange(handleEditorChange);
  }, [editor, setContent, evaluate]);

  // Insert a custom block at the cursor position
  const insertBlock = (blockType: string, label: string, icon: any) => {
    if (editorRef.current) {
      // Create a new block of the specified type
      const newBlock = {
        type: blockType as any,
        content: {
          text: label, // Initial content with label
        },
      };
      // Insert the block at the current cursor position
      editorRef.current?.insertBlock(newBlock);
    }
  };

  // Mock source data for demonstration (would come from IndexedDB in production)
  const mockSource = {
    id: "src-1",
    sourceType: "web_article" as const,
    title: "L'importance du feedback cognitif dans l'apprentissage",
    privacyLevel: "public" as const,
    status: "forged" as const,
    wordCount: 1245,
    capturedAt: "28 juil. 2026, 14:30",
    onForge: () => console.log("Forge clicked"),
    onPreview: () => console.log("Preview clicked"),
  };

  // Subscribe to BlockNote changes instead of polling with setInterval
  useEffect(() => {
    handleEditorChange(); // seed initial content
    return editor.onChange(handleEditorChange);
  }, [editor, setContent, evaluate]);

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
          <Button
            variant="forge"
            size="sm"
            iconRight
            disabled={saving || content.length < minLength || saved}
            onClick={() => {
              evaluate(content);
              handleSave();
            }}
          >
            {saving ? "Forging..." : saved ? "Forged" : "Forger"}
          </Button>
        </div>
      </div>

      {/* Toolbar rapide pour les blocs custom */}
      <div className="px-4 py-2 border-b border-border-subtle bg-surface-1">
        <div className="mx-auto max-w-[600px] flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => insertBlock("keyIdea", "Idée clé", Flame)}
            className="flex items-center gap-1"
          >
            <Flame className="w-3 h-3" />
            Idée clé
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => insertBlock("example", "Exemple", BookOpen)}
            className="flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            Exemple
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => insertBlock("analogy", "Analogie", Sparkles)}
            className="flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Analogie
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => insertBlock("teachBackSeed", "Amorce TB", HelpCircle)}
            className="flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            Amorce TB
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="mx-auto max-w-[600px]">
          {/* Barre cognitive dynamique avec marqueur de confiance */}
          <div className="mb-4 flex items-center gap-3">
            <div className="cognitive-bar flex-1">
              <div
                className="cognitive-bar-fill"
                style={{ width: `${(cran / 5) * 100}%` }}
                data-state={cran >= 3 ? "good" : cran >= 1 ? "partial" : "default"}
              />
            </div>
            {/* Remplacement du texte par le marqueur de confiance */}
            <div className="flex items-center gap-2">
              <ConfidenceMarker cran={cran} size="lg" />
              <span className="text-caption text-text-muted">Cran {cran}/5 · IQS {iqs}</span>
            </div>
          </div>

          <BlockNoteView
            editor={editor}
            className="min-h-[200px] rounded-md border border-border-subtle bg-surface-1 p-3"
            theme="dark"
          />

          {/* Carte IMPRINT de démonstration */}
          {content.length > 0 && (
            <div className="mt-6">
              <h3 className="text-h3 font-semibold text-text-primary mb-3">Source Impremée</h3>
              <ImprintCard {...mockSource} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
