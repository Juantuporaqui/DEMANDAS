// ============================================
// CASE OPS - App Shell
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from '../components';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const MODO_JUICIO_KEY = 'caseops:modoJuicio';

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const [modoJuicio, setModoJuicio] = useState(false);

  const showBackButton = useMemo(() => {
    return location.pathname !== '/' && location.pathname !== '/dashboard';
  }, [location.pathname]);

  useEffect(() => {
    const storedValue = localStorage.getItem(MODO_JUICIO_KEY);
    const enabled = storedValue === 'true';
    setModoJuicio(enabled);
    document.documentElement.classList.toggle('modo-juicio', enabled);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('modo-juicio', modoJuicio);
    localStorage.setItem(MODO_JUICIO_KEY, String(modoJuicio));
  }, [modoJuicio]);

  const handleToggleModoJuicio = () => {
    setModoJuicio((prev) => !prev);
  };

  return (
    <div className="app-shell">
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          color: '#f8fafc',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          backdropFilter: 'blur(10px)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {showBackButton && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => navigate(-1)}
                aria-label="Volver"
              >
                ← Volver
              </button>
            )}
            <div>
              <div style={{ fontWeight: 700 }}>Case Ops</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(248, 250, 252, 0.7)' }}>
                Panel operativo
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isOnline && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(251, 191, 36, 0.2)',
                  color: '#fbbf24',
                }}
              >
                OFFLINE
              </span>
            )}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleToggleModoJuicio}
            >
              Modo Juicio
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
