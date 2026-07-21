import { useState, useCallback } from 'react';
import { engineBridge } from '../lib/engine-bridge.js';

export function useImprint(sourceId: string, conceptId: string) {
  const [content, setContent] = useState('');
  const [cran, setCran] = useState(0);
  const [iqs, setIqs] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const evaluate = useCallback((text: string) => {
    // ponytail: lightweight cran/IQS estimation from content
    const words = text.trim().split(/\s+/).length;
    const lower = text.toLowerCase();
    const hasConnector = /(?:because|therefore|however|thus|consequently|moreover)/i.test(lower);
    const hasExample = /(?:for example|for instance|e\.g\.|such as|including)/i.test(lower);

    // Weighted sum: base 1 + bonus for each positive signal
    let score = 0;
    if (words >= 20) score++;
    if (hasConnector) score++;
    if (hasExample) score++;
    const newCran = Math.min(4, 1 + score);

    const newIqs = Math.min(100, newCran * 20 + (words >= 50 ? 10 : 0));
    setCran(newCran);
    setIqs(newIqs);
  }, []);

  const handleSave = useCallback(async () => {
    if (content.length < 20) return;
    setSaving(true);
    setSaved(false);
    try {
      await engineBridge.saveImprint(sourceId, conceptId, content);
      setSaved(true);
    } catch {
      // swallow — UI shows error state
    } finally {
      setSaving(false);
    }
  }, [content, sourceId, conceptId]);

  return { content, setContent, cran, iqs, saving, saved, evaluate, handleSave, minLength: 20 };
}
