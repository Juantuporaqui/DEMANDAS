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
  Clock,
  SlidersHorizontal,
  BarChart3,
  SplitSquareVertical,
} from 'lucide-react';
import { casesRepo } from '../../db/repositories';
import type { Case } from '../../types';

const NAV_ITEMS = [
  { to: '/cases', label: 'Panel', icon: <LayoutDashboard size={18} />, section: 'principal' },
  { to: '/events', label: 'Cronologia', icon: <Calendar size={18} />, section: 'principal' },
  { to: '/facts', label: 'Evidencias', icon: <Gavel size={18} />, section: 'principal' },
  { to: '/partidas', label: 'Economica', icon: <Wallet size={18} />, section: 'principal' },
  { to: '/documents', label: 'Documentos', icon: <FileText size={18} />, section: 'principal' },
  { to: '/tasks', label: 'Tareas', icon: <CheckSquare size={18} />, section: 'principal' },
];

const NAV_SECONDARY = [
  { to: '/search', label: 'Buscador', icon: <Search size={18} /> },
  { to: '/tools/prescripcion', label: 'Prescripcion', icon: <Clock size={18} /> },
  { to: '/tools/comparador-evidencia', label: 'Comparador', icon: <SlidersHorizontal size={18} /> },
  { to: '/analytics/liquidacion-justa', label: 'Liquidacion', icon: <BarChart3 size={18} /> },
  { to: '/analytics/contradiccion-aeat', label: 'Contradiccion', icon: <SplitSquareVertical size={18} /> },
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

  useEffect(() => {
    casesRepo.getAll().then(setCases).catch(console.error);
  }, []);

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
      console.error('Error limpiando cache:', error);
      window.location.reload();
    }
  };

  const getCaseUrgency = (caseItem: Case) => {
    const title = caseItem.title?.toLowerCase() || '';
    if (title.includes('picassent')) return 'urgente';
    if (title.includes('mislata')) return 'activo';
    return 'normal';
  };

  const navItemBase =
    'group relative flex items-center gap-3 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40';
  const navItemActive = 'bg-amber-500/12 text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.08)]';
  const navItemInactive =
    'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent';

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen fixed z-50 border-r border-white/[0.06] transition-all duration-300 ease-out ${
        collapsed ? 'w-[72px]' : 'w-[272px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(10, 15, 26, 0.97) 0%, rgba(17, 24, 39, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-white/[0.06]">
        <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[10px] flex items-center justify-center font-black text-slate-900 shadow-lg shadow-amber-500/20 text-lg flex-shrink-0">
          C
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="text-white font-bold tracking-tight text-[15px] block leading-tight">CASE OPS</span>
            <span className="text-[10px] text-[var(--dim)] uppercase tracking-[0.15em]">Legal Command</span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleClearCache}
            disabled={isClearing}
            title="Limpiar cache"
            className="p-1.5 rounded-lg text-[var(--dim)] hover:text-amber-400 hover:bg-white/[0.06] transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isClearing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            className="p-1.5 rounded-lg text-[var(--dim)] hover:text-amber-400 hover:bg-white/[0.06] transition-all"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>

      {/* Navegacion */}
      <nav className="flex-1 px-3 py-5 space-y-7 overflow-y-auto custom-scrollbar">
        {/* Centro de Control */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--dim)]">
              Centro de Control
            </div>
          )}
          <div className="space-y-0.5">
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
                <span className="flex h-8 w-8 items-center justify-center flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 opacity-0 shadow-xl shadow-black/40 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 border border-white/[0.06]">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Frentes Judiciales */}
        <div>
          {!collapsed && (
            <button
              onClick={() => setFrentesExpanded(!frentesExpanded)}
              className="w-full px-3 mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--dim)] hover:text-slate-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Building2 size={12} />
                Frentes Judiciales
              </span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${frentesExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}

          {(frentesExpanded || collapsed) && (
            <div className="space-y-0.5">
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
                    <span className="flex h-8 w-8 items-center justify-center flex-shrink-0">
                      {urgency === 'urgente' && (
                        <AlertTriangle size={16} className="text-amber-400" />
                      )}
                      {urgency === 'activo' && (
                        <Scale size={16} className="text-emerald-400" />
                      )}
                      {urgency === 'normal' && (
                        <Gavel size={16} className="text-slate-500" />
                      )}
                    </span>
                    {!collapsed && (
                      <>
                        <span className="truncate text-[13px]">{caseItem.title}</span>
                        {urgency === 'urgente' && (
                          <span className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        )}
                      </>
                    )}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 opacity-0 shadow-xl shadow-black/40 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 border border-white/[0.06]">
                        {caseItem.title}
                      </span>
                    )}
                  </NavLink>
                );
              }) : (
                <div className={`px-3 py-2 text-xs text-[var(--dim)] italic ${collapsed ? 'hidden' : ''}`}>
                  Sin casos cargados
                </div>
              )}
              <NavLink
                to="/cases"
                title={collapsed ? 'Ver todos los casos' : undefined}
                className={`${navItemBase} ${navItemInactive} ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}`}
              >
                <span className="flex h-8 w-8 items-center justify-center flex-shrink-0">
                  <List size={16} className="text-[var(--dim)]" />
                </span>
                {!collapsed && <span className="text-xs text-[var(--dim)]">+ Ver todos</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 opacity-0 shadow-xl shadow-black/40 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 border border-white/[0.06]">
                    Ver todos los casos
                  </span>
                )}
              </NavLink>
            </div>
          )}
        </div>

        {/* Herramientas */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--dim)]">
              Herramientas
            </div>
          )}
          <div className="space-y-0.5">
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
                <span className="flex h-8 w-8 items-center justify-center flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 opacity-0 shadow-xl shadow-black/40 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 border border-white/[0.06]">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-between text-[10px] text-[var(--dim)]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
            {!collapsed && <span>Sistema Activo</span>}
          </div>
          {!collapsed && <span className="font-mono text-[var(--dim)]">v2.0</span>}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
