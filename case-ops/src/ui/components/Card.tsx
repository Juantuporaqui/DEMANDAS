import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  shine?: boolean;
};

export default function Card({ children, className, elevated, shine }: CardProps) {
  return (
    <div
      className={[
        'rounded-[var(--radius-lg)] border border-[var(--border)] transition-all duration-300',
        'relative overflow-hidden',
        elevated
          ? 'bg-[var(--surface-elevated)] shadow-[var(--shadow-2)]'
          : 'bg-[var(--card)] shadow-[var(--shadow-1)] backdrop-blur-xl',
        shine ? 'card-shine' : '',
        className ?? '',
      ].join(' ')}
    >
      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.06) 50%, transparent 100%)',
        }}
      />
      {children}
    </div>
  );
}
