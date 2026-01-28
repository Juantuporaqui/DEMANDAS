import type { ReactNode } from 'react';
import { appMaxWidth, bg, textPrimary } from '../tokens';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

type AppLayoutProps = {
  children?: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={`${bg} ${textPrimary} min-h-screen font-sans selection:bg-blue-500/30`}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 pb-12 pt-6 md:px-8 overflow-x-hidden">
            <div className="mx-auto w-full" style={{ maxWidth: appMaxWidth }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
