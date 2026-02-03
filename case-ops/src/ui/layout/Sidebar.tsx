import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Scale,
  FileText,
  Target,
  CheckSquare,
  Calendar,
  Search,
  Gavel,
  RefreshCw,
  Settings,
  ChevronDown,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { casesRepo } from '../../db/repositories';
import type { Case } from '../../types';

// Navegación Principal
const NAV_ITEMS = [
  { to: '/cases', label: 'Panel', icon: <LayoutDashboard size={18} />, section: 'principal' },
  { to: '/events', label: 'Agenda Global', icon: <Calendar size={18} />, section: 'principal' },
  { to: '/tasks', label: 'Tareas', icon: <CheckSquare size={18} />, section: 'principal' },
  { to: '/documents', label: 'Documentos', icon: <FileText size={18} />, section: 'principal' },
];

// Navegación Secundaria
const NAV_SECONDARY = [
  { to: '/search', label: 'Buscador', icon: <Search size={18} /> },
  { to: '/warroom', label: 'War Room', icon: <Target size={18} /> },
  { to: '/settings', label: 'Ajustes', icon: <Settings size={18} /> },
];

export function Sidebar() {
  const [isClearing, setIsClearing] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [frentesExpanded, setFrentesExpanded] = useState(true);
  const location = useLocation();

  // Cargar casos al montar
  useEffect(() => {
    casesRepo.getAll().then(setCases).catch(console.error);
  }, []);

  // Filtrar casos principales (Mislata, Picassent, Quart)
  const mainCases = cases.filter(c => !c.parentCaseId).slice(0, 5);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      const keysToKeep = ['theme', 'user-preferences'];
      Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.includes(key)) localStorage.removeItem(key);
      });
      window.location.reload();
    } catch (error) {
      console.error('Error limpiando caché:', error);
      window.location.reload();
    }
  };

  // Helper para determinar urgencia del caso
  const getCaseUrgency = (caseItem: Case) => {
    const title = caseItem.title?.toLowerCase() || '';
    if (title.includes('picassent')) return 'urgente';
    if (title.includes('mislata')) return 'activo';
    return 'normal';
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-64 h-screen fixed z-50 border-r border-[var(--border)]"
      style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%)' }}
    >
      {/* Header del Sidebar - Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-[var(--border)]">
        <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[var(--radius-md)] flex items-center justify-center font-black text-slate-900 shadow-lg shadow-amber-500/30 text-lg">
          C
        </div>
        <div>
          <span className="text-white font-bold tracking-tight text-base block">CASE OPS</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Legal Command</span>
        </div>
        <button
          onClick={handleClearCache}
          disabled={isClearing}
          title="Limpiar caché"
          className="ml-auto p-1.5 rounded-[var(--radius-sm)] text-slate-500 hover:text-amber-400 hover:bg-slate-700/50 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={isClearing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">

        {/* Sección: Control */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Centro de Control
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30 border border-transparent'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Sección: Frentes Judiciales */}
        <div>
          <button
            onClick={() => setFrentesExpanded(!frentesExpanded)}
            className="w-full px-3 mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Building2 size={12} />
              Frentes Judiciales
            </span>
            <ChevronDown size={12} className={`transition-transform ${frentesExpanded ? 'rotate-180' : ''}`} />
          </button>

          {frentesExpanded && (
            <div className="space-y-1">
              {mainCases.length > 0 ? mainCases.map(caseItem => {
                const urgency = getCaseUrgency(caseItem);
                const isActive = location.pathname.includes(`/cases/${caseItem.id}`);
                return (
                  <NavLink
                    key={caseItem.id}
                    to={`/cases/${caseItem.id}`}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-all duration-200
                      ${isActive
                        ? 'bg-slate-700/50 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                      }
                    `}
                  >
                    {urgency === 'urgente' && (
                      <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
                    )}
                    {urgency === 'activo' && (
                      <Scale size={14} className="text-emerald-400 flex-shrink-0" />
                    )}
                    {urgency === 'normal' && (
                      <Gavel size={14} className="text-slate-500 flex-shrink-0" />
                    )}
                    <span className="truncate">{caseItem.title}</span>
                    {urgency === 'urgente' && (
                      <span className="badge badge-warn ml-auto px-1.5 py-0.5 text-[9px]">
                        !
                      </span>
                    )}
                  </NavLink>
                );
              }) : (
                <div className="px-3 py-2 text-xs text-slate-600 italic">
                  Sin casos cargados
                </div>
              )}
              <NavLink
                to="/cases"
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-amber-400 transition-colors"
              >
                <span>+ Ver todos los casos</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Sección: Herramientas */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Herramientas
          </div>
          <div className="space-y-1">
            {NAV_SECONDARY.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-all duration-200
                  ${isActive
                    ? 'bg-slate-700/50 text-white'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/30'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between text-[10px] text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistema Activo</span>
          </div>
          <span className="font-mono">v2.0</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
