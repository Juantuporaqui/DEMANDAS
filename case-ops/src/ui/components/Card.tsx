import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
};

export default function Card({ children, className, elevated }: CardProps) {
  return (
    <div
      className={[
        'rounded-[var(--radius-lg)] border border-[var(--border)] transition-all duration-250',
        elevated
          ? 'bg-[var(--surface-elevated)] shadow-[var(--shadow-2)]'
          : 'bg-[var(--card)] shadow-[var(--shadow-1)] backdrop-blur-xl',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
