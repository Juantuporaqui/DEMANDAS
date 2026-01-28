import { NavLink } from 'react-router-dom';
import * as tokens from '../tokens';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Panel', icon: '📊' },
  { to: '/cases', label: 'Casos', icon: '⚖️' },
];

// 1. Exportación con nombre (para quien lo pida así)
export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800 h-screen fixed">
      <div className="p-4 text-white font-bold">JUANTU LEGAL</div>
      <nav className="flex-1 p-4">
        {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} className="block p-2 text-slate-400 hover:text-white">
                {item.icon} {item.label}
            </NavLink>
        ))}
      </nav>
    </aside>
  );
}

// 2. Exportación por defecto (PARA SOLUCIONAR TU ERROR)
export default Sidebar;
