import { NavLink } from 'react-router-dom';
import * as tokens from '../tokens'; // Importamos los estilos que definimos al principio

// Definimos los enlaces de navegación
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Panel de Control', icon: '📊' },
  { to: '/cases', label: 'Procedimientos', icon: '⚖️' },
  { to: '/warroom', label: 'War Room', icon: '🛡️' },
  { to: '/documents', label: 'Documentos', icon: '📂' },
  { to: '/tasks', label: 'Tareas', icon: '✅' },
];

export function Sidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50"
      style={{
        width: tokens.sidebarWidth,
        backgroundColor: '#020617', // Slate 950 "Hardcoded" para seguridad
        borderRight: '1px solid #1e293b', // Slate 800
      }}
    >
      {/* LOGO / TÍTULO */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20">
            J
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-tight leading-none">
              JUANTU
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-0.5">
              LEGAL OPS
            </p>
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              // Base styles
              let classes = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ";
              
              if (isActive) {
                // Estilo Activo (War Room style)
                classes += "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold translate-x-1";
              } else {
                // Estilo Inactivo
                classes += "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50";
              }
              return classes;
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* PIE DE PÁGINA (Usuario) */}
      <div className="border-t border-slate-800/50 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-3 border border-slate-800">
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 font-bold">
            JP
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-xs font-medium text-slate-200">
              Juan Tu
            </p>
            <p className="truncate text-[10px] text-slate-500">
              Socio Director
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
