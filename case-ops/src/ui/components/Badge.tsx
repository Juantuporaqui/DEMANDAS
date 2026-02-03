import type { HTMLAttributes, ReactNode } from 'react';

type BadgeTone = 'ok' | 'warn' | 'danger' | 'info' | 'muted' | 'compensable';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClass: Record<BadgeTone, string> = {
  ok: 'badge-ok',
  warn: 'badge-warn',
  danger: 'badge-danger',
  info: 'badge-info',
  muted: 'badge-muted',
  compensable: 'badge-compensable',
};

export default function Badge({ children, className, tone = 'muted', ...props }: BadgeProps) {
  return (
    <span className={`badge ${toneClass[tone]} ${className ?? ''}`} {...props}>
      {children}
    </span>
  );
}
