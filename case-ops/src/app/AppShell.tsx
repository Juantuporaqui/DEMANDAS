// ============================================
// CASE OPS - App Shell (Merged with Chaladita Header)
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Scale, Sun, WifiOff } from 'lucide-react';
import { BottomNav } from '../components';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const STORAGE_KEY = 'caseops:modoJuicio';

// “Modo Juicio” aquí = alto contraste rápido sin romper el theming actual.
// Si luego quieres, lo movemos a zustand + settings en Dexie.
function readModoJuicio(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeModoJuicio(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    // ignore
  }
}

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const [modoJuicio, setModoJuicio] = useState<boolean>(() => readModoJuicio());

  // Rutas donde NO tiene sentido el “volver” (ajusta a tu gusto)
  const showBack = useMemo(() => {
    const path = location.pathname;
    return !['/dashboard', '/'].includes(path);
  }, [location.pathname]);

  // Aplica una clase global para alto contraste sin depender aún de Tailwind
  useEffect(() => {
    const root = document.documentElement;
    if (modoJuicio) {
      root.classList.add('modo-juicio');
    } else {
      root.classList.remove('modo-juicio');
    }

    writeModoJuicio(modoJuicio);
  }, [modoJuicio]);

  return (
    <div className="app-shell">
      {!isOnline && (
        <div className="offline-banner">Sin conexión - Modo offline</div>
      )}

      {/* Header unificado (chaladita vibe, case-ops layout) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          background: 'rgba(15, 23, 42, 0.92)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            color: '#f1f5f9',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minWidth: 0,
            }}
          >
            {showBack ? (
              <button
                onClick={() => navigate(-1)}
                aria-label="Volver"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                  background: 'rgba(30, 41, 59, 0.65)',
                  color: '#f1f5f9',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: '1px solid rgba(37, 99, 235, 0.35)',
                  background: 'rgba(37, 99, 235, 0.14)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Case Ops"
              >
                <Scale size={22} />
              </div>
            )}

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Case Ops
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(226, 232, 240, 0.75)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Legal-Tech Enterprise · Offline-first
              </div>
            </div>

            {!isOnline && (
              <div
                style={{
                  marginLeft: 6,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 999,
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#fde68a',
                  fontSize: 12,
                  fontWeight: 700,
                }}
                title="Sin conexión"
              >
                <WifiOff size={14} />
                OFFLINE
              </div>
            )}
          </div>

          <button
            onClick={() => setModoJuicio((value) => !value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              minHeight: 44,
              padding: '8px 12px',
              borderRadius: 12,
              border: modoJuicio
                ? '1px solid rgba(245, 158, 11, 0.45)'
                : '1px solid rgba(148, 163, 184, 0.18)',
              background: modoJuicio
                ? 'rgba(245, 158, 11, 0.12)'
                : 'rgba(30, 41, 59, 0.65)',
              color: modoJuicio ? '#fde68a' : '#e2e8f0',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 0.2,
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
            title={
              modoJuicio
                ? 'Desactivar Modo Juicio'
                : 'Activar Modo Juicio (alto contraste)'
            }
          >
            {modoJuicio ? <Sun size={16} /> : <Moon size={16} />}
            {modoJuicio ? 'Normal' : 'Modo Juicio'}
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
