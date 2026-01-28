import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { appMaxWidth, bg, textPrimary } from '../tokens';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

type AppLayoutProps = {
  children?: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isAnalytics = location.pathname.startsWith('/analytics');

  return (
    <div className={`${bg} ${textPrimary} min-h-screen font-sans selection:bg-blue-500/30`}>
      <div className={`flex min-h-screen ${isAnalytics ? 'flex-col' : ''}`}>
        {!isAnalytics ? <Sidebar /> : null}
        <div className="flex min-h-screen flex-1 flex-col">
          {!isAnalytics ? <Topbar /> : null}
          <main
            className={`flex-1 overflow-x-hidden ${
              isAnalytics ? 'px-4 pb-16 pt-10 md:px-10' : 'px-4 pb-12 pt-6 md:px-8'
            }`}
          >
            <div className="mx-auto w-full" style={{ maxWidth: appMaxWidth }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
