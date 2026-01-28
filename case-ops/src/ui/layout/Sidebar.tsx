import { NavLink } from 'react-router-dom';
import { router } from '../../app/router';
import { border, card, radius, sidebarWidth, textMuted } from '../tokens';

type NavItem = {
  label: string;
  path: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: 'dashboard' },
  { label: 'Demandas', path: 'cases' },
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
      className="hidden min-h-screen flex-col gap-6 px-4 py-6 lg:flex"
      style={{ width: sidebarWidth }}
    >
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
          CO
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-900">Case Ops</div>
          <div className={`text-xs ${textMuted}`}>Legal-tech suite</div>
        </div>
      </div>

      <div className={`flex flex-1 flex-col gap-4 ${card} ${border} p-4`} style={{ borderRadius: radius }}>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Principal
        </div>
        <nav className="flex flex-col gap-2">
          {primaryItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/${item.path}`}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`
              }
            >
              <span>{item.label}</span>
              <span className="text-xs">›</span>
            </NavLink>
          ))}
          {primaryItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 px-3 py-2 text-xs text-zinc-500">
              Dashboard
            </div>
          ) : null}
        </nav>

        {settingsItem ? (
          <div className="mt-auto flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Sistema
            </div>
            <NavLink
              to={`/${settingsItem.path}`}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`
              }
            >
              <span>{settingsItem.label}</span>
              <span className="text-xs">›</span>
            </NavLink>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
