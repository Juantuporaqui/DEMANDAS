import { useCallback } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
  onCopied?: (text: string) => void;
}

export function CopyButton({ text, label = 'Copiar', onCopied }: CopyButtonProps) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      onCopied?.(text);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  }, [onCopied, text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100 transition hover:border-emerald-400/60 hover:bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
    >
      {label}
    </button>
  );
}
