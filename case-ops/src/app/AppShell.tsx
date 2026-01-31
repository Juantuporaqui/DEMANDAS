// ============================================
// CASE OPS - Main Application Shell
// Estilo Legal Pro - Plan Maestro Fase 2
// ============================================

import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Sidebar } from '../ui/layout/Sidebar';
import { BottomNav } from '../components/BottomNav';

export function AppShell() {
  const location = useLocation();

  // Determinar si estamos en una página de caso específico
  const isInCase = location.pathname.startsWith('/cases/') && location.pathname !== '/cases';

  return (
    <div
      className="min-h-screen text-slate-200 font-sans selection:bg-amber-500/30"
      style={{ backgroundColor: '#1a202c' }}
    >

      {/* 1. Sidebar para Desktop (Izquierda) */}
      <Sidebar />

      {/* 2. Área de Contenido Principal */}
      <main className="lg:pl-64 min-h-screen flex flex-col transition-all duration-300">

        {/* Contenedor con padding responsivo */}
        <div className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>

      </main>

      {/* 3. Navegación Inferior para Móvil (Solo visible en pantallas pequeñas) */}
      <BottomNav />

      {/* Utilidades Globales */}
      <ScrollRestoration />
    </div>
  );
}
