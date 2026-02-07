import type { ReactNode } from 'react';

export type PageShellMode = 'prose' | 'wide' | 'full';

const MODE_CLASSES: Record<PageShellMode, string> = {
  prose: 'max-w-[1200px]',
  wide: 'max-w-[1440px]',
  full: 'max-w-none',
};

interface PageShellProps {
  mode?: PageShellMode;
  children: ReactNode;
  className?: string;
}

export function PageShell({ mode = 'prose', children, className = '' }: PageShellProps) {
  return (
    <section
      className={[
        'w-full mx-auto px-3 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 page-enter',
        MODE_CLASSES[mode],
        className,
      ].join(' ')}
    >
      {children}
    </section>
  );
}
