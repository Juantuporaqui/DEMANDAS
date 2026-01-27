// ============================================
// CASE OPS - App Shell
// ============================================

import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function AppShell() {
  const isOnline = useOnlineStatus();

  return (
    <div className="app-shell">
      {!isOnline && (
        <div className="offline-banner">
          Sin conexión - Modo offline
        </div>
      )}
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
