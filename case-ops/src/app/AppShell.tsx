// ============================================
// CASE OPS — Main Application Shell (Premium)
// ============================================

import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Sidebar } from '../ui/layout/Sidebar';
import { BottomNav } from '../components/BottomNav';
import { AppHeader } from '../ui/layout/AppHeader';
import { AppFooter } from '../ui/layout/AppFooter';
import { PageShell, type PageShellMode } from '../ui/layout/PageShell';

export function AppShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const matches = useMatches();
  const pageMode = useMemo<PageShellMode>(() => {
    const matchWithMode = [...matches].reverse().find((match) => {
      const handle = match.handle as { pageMode?: PageShellMode } | undefined;
      return Boolean(handle?.pageMode);
    });
    const handle = matchWithMode?.handle as { pageMode?: PageShellMode } | undefined;
    return handle?.pageMode ?? 'prose';
  }, [matches]);

  return (
    <div
      className="min-h-screen font-sans selection:bg-amber-500/25 gradient-mesh"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Sidebar Desktop */}
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Contenido Principal */}
      <main
        className={`min-h-screen flex flex-col transition-all duration-300 ease-out ${
          isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[272px]'
        }`}
      >
        <AppHeader />

        <div className="flex-1 pb-24 lg:pb-8">
          <PageShell mode={pageMode}>
            <Outlet />
          </PageShell>
        </div>

        <AppFooter />
      </main>

      {/* Navegación Móvil */}
      <BottomNav />

      <ScrollRestoration />
    </div>
  );
}
