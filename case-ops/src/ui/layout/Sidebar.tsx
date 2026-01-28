import { NavLink } from 'react-router-dom';
import { router } from '../../app/router';
import {
  border,
  card,
  radius,
  sidebarWidth,
  textMuted,
  textPrimary,
  hover,
  active,
} from '../tokens';

type NavItem = { label: string; path: string };

const NAV_ITEMS: NavItem[] = [
  { label: 'Procedimientos', path: 'cases' },
  { label: 'Documentos', path: 'documents' },
  { label: 'Ajustes', path: 'settings' },
];

function getAvailablePaths(): Set<string> {
  const rootRoutes =
    (router as { routes?: { path?: string; children?: { path?: string }[] }[] })
      .routes ?? [];
  const childRoutes = rootRoutes.flatMap((route) => route.children ?? []);
  return new Set(
    childRoutes
      .map((route) => route.path)
      .filter((path): path is string => Boolean(path)),
  );
}

export default function Sidebar() {
  const availablePaths = getAvailablePaths();
  const enabledItems = NAV_ITEMS.filter((item) => availablePaths.has(item.path));
  const primaryItems = enabledItems.filter((item) => item.path !== 'settings');
  const settingsItem = enabledItems.find((item) => item.path === 'settings');

  return (
    <aside
      className="hidden min-h-screen flex-col gap-6 px-4 py-6 lg:flex border-r border-slate-800/50"
      style={{ width: sidebarWidth }}
    >
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white shadow-inner">
          CO
        </div>
        <div>
          <div className={`text-sm font-bold ${textPrimary} tracking-tight`}>
            Case Ops
          </div>
          <div className={`text-[10px] uppercase tracking-wider font-medium ${textMuted}`}>
            Legal Suite
          </div>
        </div>
      </div>

      <div
        className={`flex flex-1 flex-col gap-4 ${card} ${border} p-3`}
        style={{ borderRadius: radius }}
      >
        <div className={`px-2 text-[10px] font-bold uppercase tracking-[0.2em] ${textMuted}`}>
          Principal
        </div>
        <nav className="flex flex-col gap-1">
          {primaryItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/${item.path}`}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive ? active : `${textPrimary} ${hover}`
                }`
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
          {primaryItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-700 px-3 py-2 text-xs text-slate-500">
              Sin navegación disponible
            </div>
          ) : null}
        </nav>

        {settingsItem ? (
          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-700/30">
            <div className={`px-2 text-[10px] font-bold uppercase tracking-[0.2em] ${textMuted}`}>
              Sistema
            </div>
            <NavLink
              to={`/${settingsItem.path}`}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive ? active : `${textPrimary} ${hover}`
                }`
              }
            >
              <span>{settingsItem.label}</span>
            </NavLink>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
