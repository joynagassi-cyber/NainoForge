import { useCallback, useEffect, useMemo } from "react";
import { BlockNoteView } from "@blocknote/react";
import { BlockNoteEditor } from "@blocknote/core";
import { Button } from "../ui/button";
import { useImprint } from "../../hooks/use-imprint.js";

/**
 * Surface IMPRINT — editor BlockNote habillé NainoForge.
 *
 * Cette surface est un atelier de forge cognitive.
 * TODO: wire custom block types (keyIdea, example, analogy, teachBackSeed)
 * when BlockNote v0.52+ resolves the schema type bug.
 */

export function ImprintSurface() {
  const { content, setContent, cran, iqs, saving, saved, evaluate, handleSave, minLength } = useImprint(
    "temp-source",  // TODO: pass real sourceId from parent
    "temp-concept", // TODO: pass real conceptId from parent
  );

  // Create BlockNote editor connected to useImprint content
  const editor = useMemo(
    () =>
      BlockNoteEditor.create({
        // ponytail: BlockNoteSchema.create() has a TS type bug in v0.51.x
        // where it can't be used as a value. We work around it by casting.
        schema: (BlockNoteEditor as any).defaultSchema,
      }),
    []
  );

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

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="mx-auto max-w-[600px]">
          {/* Barre cognitive dynamique */}
          <div className="mb-4 flex items-center gap-3">
            <div className="cognitive-bar flex-1">
              <div
                className="cognitive-bar-fill"
                style={{ width: `${(cran / 5) * 100}%` }}
                data-state={cran >= 3 ? "good" : cran >= 1 ? "partial" : "default"}
              />
            </div>
            <span className="text-caption text-text-muted">Cran {cran}/5 · IQS {iqs}</span>
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
