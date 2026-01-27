import { ArrowLeft, Scale, Moon, Sun } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLitigationStore } from '../store/litigationStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title = 'Chaladita.net', showBack = false }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Usar store para persistencia del modo juicio
  const modoJuicio = useLitigationStore((state) => state.config.modoJuicio);
  const toggleModoJuicio = useLitigationStore((state) => state.toggleModoJuicio);

  useEffect(() => {
    if (modoJuicio) {
      document.documentElement.classList.add('modo-juicio');
    } else {
      document.documentElement.classList.remove('modo-juicio');
    }
  }, [modoJuicio]);

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && !isHome && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          {isHome && <Scale className="w-8 h-8 text-blue-500" />}
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {isHome && (
              <p className="text-xs text-slate-400">Sistema de Soporte a Litigios</p>
            )}
          </div>
        </div>

        <button
          onClick={toggleModoJuicio}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
            ${modoJuicio
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}
          `}
          title={modoJuicio ? 'Desactivar Modo Juicio' : 'Activar Modo Juicio (alto contraste)'}
        >
          {modoJuicio ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="hidden sm:inline">{modoJuicio ? 'Normal' : 'Modo Juicio'}</span>
        </button>
      </div>
    </header>
  );
}
