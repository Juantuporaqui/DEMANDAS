import { Link } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="w-24 h-24 mx-auto text-amber-500 mb-4" />
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-slate-300 mb-4">
            Pagina no encontrada
          </h2>
          <p className="text-slate-400">
            La pagina que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver atras
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <p className="text-slate-500 text-sm">
            Chaladita.net - Sistema de Apoyo a Litigio
          </p>
        </div>
      </div>
    </div>
  );
}
