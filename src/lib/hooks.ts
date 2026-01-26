import { useCallback, useState } from "react";

/**
 * Hook to copy text to clipboard
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, []);
  return { copy, copied };
}
