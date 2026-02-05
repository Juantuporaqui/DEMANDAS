import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  iconButton?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)]',
  secondary:
    'bg-white/[0.05] text-[var(--text)] border border-[var(--border)] hover:bg-white/[0.08] hover:border-[var(--border-hover)]',
  ghost:
    'bg-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/[0.04]',
  danger:
    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 hover:border-red-500/30',
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
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:shadow-[var(--ring)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[0.98]',
        iconButton ? 'h-9 w-9 p-0' : 'px-4 py-2.5',
        variantStyles[variant],
        className ?? '',
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
