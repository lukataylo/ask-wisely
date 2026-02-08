import { useState, useRef, useEffect, useCallback } from 'react';

async function fallbackCopy(text: string): Promise<boolean> {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    document.body.appendChild(textArea);
    textArea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textArea);
    return ok;
  } catch {
    return false;
  }
}

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
    let success = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        success = true;
      } else {
        success = await fallbackCopy(text);
      }
    } catch {
      success = await fallbackCopy(text);
    }

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
