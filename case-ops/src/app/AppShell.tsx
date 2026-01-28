// ============================================
// CASE OPS - App Shell
// ============================================

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from '../components';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const modoJuicioStorageKey = 'caseops:modoJuicio';

export function AppShell() {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const [modoJuicio, setModoJuicio] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(modoJuicioStorageKey);
    const enabled = storedValue === 'true';
    setModoJuicio(enabled);
    document.documentElement.classList.toggle('modo-juicio', enabled);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('modo-juicio', modoJuicio);
    localStorage.setItem(modoJuicioStorageKey, String(modoJuicio));
  }, [modoJuicio]);

  const showBackButton = location.pathname !== '/' && location.pathname !== '/dashboard';

  return (
    <div className="app-shell">
      {!isOnline && (
        <div className="offline-banner">
          Sin conexión - Modo offline
        </div>
      )}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.85)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {showBackButton && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => navigate(-1)}
                aria-label="Volver"
              >
                Volver
              </button>
            )}
            <span style={{ color: '#e2e8f0', fontWeight: 700 }}>Case Ops</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setModoJuicio((prev) => !prev)}
            aria-pressed={modoJuicio}
          >
            {modoJuicio ? <Sun size={18} /> : <Moon size={18} />}
            Modo Juicio
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
