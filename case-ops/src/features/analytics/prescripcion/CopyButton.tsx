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
      aria-label={label}
      className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold leading-tight text-emerald-100 transition hover:border-emerald-400/60 hover:bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 sm:px-3 sm:text-xs"
    >
      {label}
    </button>
  );
}
