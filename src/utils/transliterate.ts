import { useEffect, useRef, useState } from 'react';

/**
 * Transliterates English/Romanized text into Hindi (Devanagari script)
 * Uses Google Input Tools API with in-memory caching and safe fallbacks.
 */
const memoryCache = new Map<string, string>();

export async function transliterateToHindi(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  if (memoryCache.has(trimmed)) {
    return memoryCache.get(trimmed)!;
  }

  try {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(
      trimmed
    )}&itc=hi-t-i0-und&num=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Transliteration failed');

    const data = await res.json();
    if (data && data[0] === 'SUCCESS' && Array.isArray(data[1])) {
      const parts = data[1].map((item: any) => {
        // item[1] is array of candidates, e.g. ["रामपुर", ...]
        if (item && Array.isArray(item[1]) && item[1].length > 0) {
          return item[1][0];
        }
        return item[0] || '';
      });

      const translated = parts.join(' ').trim();
      if (translated) {
        memoryCache.set(trimmed, translated);
        return translated;
      }
    }
  } catch (err) {
    console.warn('Auto-transliteration (safe to ignore if offline):', err);
  }

  return '';
}

/**
 * React hook to auto-populate Hindi text box when English text is entered.
 * Allows user to still manually edit the Hindi box without it being overwritten.
 */
export function useAutoHindi(
  englishText: string,
  onHindiCalculated: (hindiText: string) => void,
  options: { enabled?: boolean; delayMs?: number } = {}
) {
  const { enabled = true, delayMs = 300 } = options;
  const isManuallyEditedRef = useRef(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!enabled || isManuallyEditedRef.current) return;
    if (!englishText.trim()) {
      onHindiCalculated('');
      return;
    }

    setIsTranslating(true);
    const timer = setTimeout(async () => {
      try {
        const hindi = await transliterateToHindi(englishText);
        if (hindi && !isManuallyEditedRef.current) {
          onHindiCalculated(hindi);
        }
      } finally {
        setIsTranslating(false);
      }
    }, delayMs);

    return () => {
      clearTimeout(timer);
      setIsTranslating(false);
    };
  }, [englishText, enabled, delayMs]);

  const handleManualHindiChange = (val: string) => {
    isManuallyEditedRef.current = true;
    onHindiCalculated(val);
  };

  const forceRetranslate = async () => {
    isManuallyEditedRef.current = false;
    if (englishText.trim()) {
      setIsTranslating(true);
      const hindi = await transliterateToHindi(englishText);
      if (hindi) {
        onHindiCalculated(hindi);
      }
      setIsTranslating(false);
    }
  };

  const resetManual = () => {
    isManuallyEditedRef.current = false;
  };

  return {
    isTranslating,
    handleManualHindiChange,
    forceRetranslate,
    resetManual,
  };
}
