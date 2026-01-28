import { useEffect, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '../ui/layout/AppLayout';

type AppShellProps = {
  children?: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const storageKey = 'case-ops:modo-juicio';
    const stored = localStorage.getItem(storageKey) === 'true';
    document.documentElement.classList.toggle('modo-juicio', stored);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      const enabled = event.newValue === 'true';
      document.documentElement.classList.toggle('modo-juicio', enabled);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return <AppLayout>{children ?? <Outlet />}</AppLayout>;
}

export { AppShell };
