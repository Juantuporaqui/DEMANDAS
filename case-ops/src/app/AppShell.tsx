// ============================================
// CASE OPS - Main Application Shell
// Estilo Legal Pro - Plan Maestro Fase 2
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
      className="min-h-screen text-slate-200 font-sans selection:bg-amber-500/30"
      style={{ backgroundColor: '#1a202c' }}
    >
      {/* 1. Sidebar para Desktop (Izquierda) */}
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* 2. Área de Contenido Principal */}
      <main
        className={`min-h-screen flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
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

      {/* 3. Navegación Inferior para Móvil (Solo visible en pantallas pequeñas) */}
      <BottomNav />

      {/* Utilidades Globales */}
      <ScrollRestoration />
    </div>
  );
}
