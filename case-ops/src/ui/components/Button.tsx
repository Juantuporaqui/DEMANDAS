import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  iconButton?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-[0_2px_12px_-3px_rgba(251,191,36,0.4)] hover:shadow-[0_4px_20px_-4px_rgba(251,191,36,0.5)] relative overflow-hidden',
  secondary:
    'bg-white/[0.04] text-[var(--text)] border border-[var(--border)] hover:bg-white/[0.08] hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-1)]',
  ghost:
    'bg-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/[0.04]',
  danger:
    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 hover:border-red-500/30 hover:shadow-[0_0_20px_-5px_rgba(248,113,113,0.15)]',
};

export default function Button({
  children,
  className,
  variant = 'secondary',
  iconButton = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] text-sm font-semibold',
        'transition-all duration-250 ease-out',
        'focus-visible:outline-none focus-visible:shadow-[var(--ring)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[0.97]',
        iconButton ? 'h-10 w-10 sm:h-9 sm:w-9 p-0' : 'px-4 py-3 sm:py-2.5',
        variantStyles[variant],
        className ?? '',
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
