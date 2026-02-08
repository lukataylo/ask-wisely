import { useState, useRef, useEffect, useCallback } from 'react';
import { copyText } from '../lib/copyText';

export function useCopyToClipboard(
  text: string,
  onCopySuccess?: () => void,
): [boolean, () => Promise<boolean>] {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(async () => {
    const success = await copyText(text);

    if (success) {
      setCopied(true);
      onCopySuccess?.();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    }

    return success;
  }, [text, onCopySuccess]);

  return [copied, copy];
}
