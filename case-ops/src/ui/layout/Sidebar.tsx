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
  Building2,
  ChevronLeft,
  ChevronRight,
  List,
  Wallet,
} from 'lucide-react';
import { casesRepo } from '../../db/repositories';
import type { Case } from '../../types';

// Navegación Principal
const NAV_ITEMS = [
  { to: '/cases', label: 'Panel', icon: <LayoutDashboard size={18} />, section: 'principal' },
  { to: '/events', label: 'Cronología', icon: <Calendar size={18} />, section: 'principal' },
  { to: '/facts', label: 'Evidencias', icon: <Gavel size={18} />, section: 'principal' },
  { to: '/partidas', label: 'Económica', icon: <Wallet size={18} />, section: 'principal' },
  { to: '/documents', label: 'Documentos', icon: <FileText size={18} />, section: 'principal' },
  { to: '/tasks', label: 'Tareas', icon: <CheckSquare size={18} />, section: 'principal' },
];

// Navegación Secundaria
const NAV_SECONDARY = [
  { to: '/search', label: 'Buscador', icon: <Search size={18} /> },
  { to: '/warroom', label: 'War Room', icon: <Target size={18} /> },
  { to: '/settings', label: 'Ajustes', icon: <Settings size={18} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
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

  const navItemBase =
    'group relative flex items-center gap-3 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60';
  const navItemActive = 'bg-amber-500/15 text-amber-300';
  const navItemInactive =
    'text-slate-400 hover:text-white hover:bg-slate-700/30 border border-transparent';

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen fixed z-50 border-r border-[var(--border)] transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%)' }}
    >
      {/* Header del Sidebar - Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-[var(--border)]">
        <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[var(--radius-md)] flex items-center justify-center font-black text-slate-900 shadow-lg shadow-amber-500/30 text-lg">
          C
        </div>
        {!collapsed && (
          <div>
            <span className="text-white font-bold tracking-tight text-base block">CASE OPS</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Legal Command</span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleClearCache}
            disabled={isClearing}
            title="Limpiar caché"
            className="p-1.5 rounded-[var(--radius-sm)] text-slate-500 hover:text-amber-400 hover:bg-slate-700/50 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isClearing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            className="p-1.5 rounded-[var(--radius-sm)] text-slate-500 hover:text-amber-400 hover:bg-slate-700/50 transition-all"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Sección: Control */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Centro de Control
            </div>
          )}
          <div className="space-y-1">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive} ${
                    collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
                  }`
                }
              >
                <span className="flex h-9 w-9 items-center justify-center">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-100 opacity-0 shadow-lg shadow-black/30 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Sección: Frentes Judiciales */}
        <div>
          {!collapsed && (
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
          )}

          {(frentesExpanded || collapsed) && (
            <div className="space-y-1">
              {mainCases.length > 0 ? mainCases.map(caseItem => {
                const urgency = getCaseUrgency(caseItem);
                const isActive = location.pathname.includes(`/cases/${caseItem.id}`);
                return (
                  <NavLink
                    key={caseItem.id}
                    to={`/cases/${caseItem.id}`}
                    title={collapsed ? caseItem.title : undefined}
                    className={`${navItemBase} ${isActive ? navItemActive : navItemInactive} ${
                      collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'
                    }`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center">
                      {urgency === 'urgente' && (
                        <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
                      )}
                      {urgency === 'activo' && (
                        <Scale size={16} className="text-emerald-400 flex-shrink-0" />
                      )}
                      {urgency === 'normal' && (
                        <Gavel size={16} className="text-slate-500 flex-shrink-0" />
                      )}
                    </span>
                    {!collapsed && (
                      <>
                        <span className="truncate">{caseItem.title}</span>
                        {urgency === 'urgente' && (
                          <span className="badge badge-warn ml-auto px-1.5 py-0.5 text-[9px]">!
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-100 opacity-0 shadow-lg shadow-black/30 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        {caseItem.title}
                      </span>
                    )}
                  </NavLink>
                );
              }) : (
                <div className={`px-3 py-2 text-xs text-slate-600 italic ${collapsed ? 'hidden' : ''}`}>
                  Sin casos cargados
                </div>
              )}
              <NavLink
                to="/cases"
                title={collapsed ? 'Ver todos los casos' : undefined}
                className={`${navItemBase} ${navItemInactive} ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}`}
              >
                <span className="flex h-9 w-9 items-center justify-center">
                  <List size={16} className="text-slate-500" />
                </span>
                {!collapsed && <span className="text-xs text-slate-500">+ Ver todos los casos</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-100 opacity-0 shadow-lg shadow-black/30 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    Ver todos los casos
                  </span>
                )}
              </NavLink>
            </div>
          )}
        </div>

        {/* Sección: Herramientas */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Herramientas
            </div>
          )}
          <div className="space-y-1">
            {NAV_SECONDARY.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `${navItemBase} ${isActive ? navItemActive : navItemInactive} ${
                    collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
                  }`
                }
              >
                <span className="flex h-9 w-9 items-center justify-center">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-100 opacity-0 shadow-lg shadow-black/30 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {item.label}
                  </span>
                )}
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
            {!collapsed && <span>Sistema Activo</span>}
          </div>
          {!collapsed && <span className="font-mono">v2.0</span>}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
