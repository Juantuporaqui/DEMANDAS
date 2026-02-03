import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  iconButton?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--warn)] text-slate-900 hover:brightness-110 shadow-[var(--shadow-1)]',
  secondary:
    'bg-[color-mix(in srgb, var(--surface) 70%, transparent)] text-[var(--text)] border border-[var(--border)] hover:border-[color-mix(in srgb, var(--border) 70%, transparent)]',
  ghost:
    'bg-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[color-mix(in srgb, var(--surface) 60%, transparent)]',
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
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] text-sm font-semibold transition duration-200 ease-out',
        'focus-visible:outline-none focus-visible:shadow-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60',
        iconButton ? 'h-9 w-9 p-0' : 'px-4 py-2',
        variantStyles[variant],
        className ?? '',
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
