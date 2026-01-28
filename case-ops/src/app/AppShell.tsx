// ============================================
// CASE OPS - App Shell
// ============================================

import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, WifiOff } from 'lucide-react';
import { BottomNav } from '../components';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const MODO_JUICIO_STORAGE_KEY = 'caseops:modoJuicio';

export function AppShell() {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [modoJuicio, setModoJuicio] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(MODO_JUICIO_STORAGE_KEY);
    if (storedValue === '1') {
      setModoJuicio(true);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (modoJuicio) {
      root.classList.add('modo-juicio');
      window.localStorage.setItem(MODO_JUICIO_STORAGE_KEY, '1');
    } else {
      root.classList.remove('modo-juicio');
      window.localStorage.setItem(MODO_JUICIO_STORAGE_KEY, '0');
    }
  }, [modoJuicio]);

  const showBackButton = pathname !== '/' && pathname !== '/dashboard';

  return (
    <div className="app-shell">
      <header
        className="app-shell__header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 16px',
          background: 'rgba(12, 14, 20, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#f1f5f9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showBackButton && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="app-shell__back"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '999px',
                background: 'rgba(30, 41, 59, 0.6)',
                color: 'inherit',
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={18} />
              <span>Volver</span>
            </button>
          )}
          {!isOnline && (
            <div
              className="offline-banner"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
              }}
            >
              <WifiOff size={16} />
              <span>Sin conexión - Modo offline</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setModoJuicio((value) => !value)}
          className="app-shell__modo-juicio"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            background: 'rgba(15, 23, 42, 0.7)',
            color: 'inherit',
            padding: '6px 12px',
            cursor: 'pointer',
          }}
        >
          {modoJuicio ? <Sun size={18} /> : <Moon size={18} />}
          <span>Modo Juicio</span>
        </button>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
