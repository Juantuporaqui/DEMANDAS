import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Importamos el Sidebar que arreglamos antes

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Barra lateral fija */}
      <Sidebar />
      
      {/* Contenido principal (Outlet es donde se pintan las páginas) */}
      <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 pb-24 lg:pb-8 lg:ml-64 lg:px-8 lg:py-8 max-w-[100vw] overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
