import { Header, ProcedureCard, TimelineChart } from '../components';
import { procedimientos, hitosLinea } from '../data/procedimientos';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export function HomePage() {
  // Calculate upcoming deadlines
  const proximosHitos = procedimientos
    .filter(p => p.proximoHito)
    .map(p => ({
      ...p.proximoHito!,
      procedimiento: p.titulo,
      color: p.color,
    }))
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const diasHastaProximo = proximosHitos[0]
    ? Math.ceil(
        (new Date(proximosHitos[0].fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Alert banner if upcoming deadline */}
        {diasHastaProximo !== null && diasHastaProximo <= 14 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-4 animate-fadeIn">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-400">
                {proximosHitos[0].evento} - {proximosHitos[0].procedimiento}
              </p>
              <p className="text-sm text-slate-300 mt-1">
                {new Date(proximosHitos[0].fecha).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {' '}
                ({diasHastaProximo === 0 ? 'HOY' : `en ${diasHastaProximo} días`})
              </p>
            </div>
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">3</p>
            <p className="text-sm text-slate-400">Procedimientos Activos</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-red-400">222.022€</p>
            <p className="text-sm text-slate-400">Total Reclamado</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">5</p>
            <p className="text-sm text-slate-400">Estrategias Activas</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">{diasHastaProximo ?? '-'}</p>
            <p className="text-sm text-slate-400">Días hasta vista</p>
          </div>
        </div>

        {/* Main navigation grid */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Frentes Judiciales
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {procedimientos.map(proc => (
              <ProcedureCard key={proc.id} procedimiento={proc} />
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <TimelineChart data={hitosLinea} />
        </section>

        {/* Quick access links */}
        <section className="bg-slate-800/30 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Acceso Rápido</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="/picassent#checklist"
              className="p-3 bg-slate-800 rounded-xl text-sm hover:bg-slate-700 transition-colors text-center"
            >
              Checklist Audiencia
            </a>
            <a
              href="/picassent#doc25"
              className="p-3 bg-slate-800 rounded-xl text-sm hover:bg-slate-700 transition-colors text-center"
            >
              Impugnación Doc. 25
            </a>
            <a
              href="/quart#compensacion"
              className="p-3 bg-slate-800 rounded-xl text-sm hover:bg-slate-700 transition-colors text-center"
            >
              Calculadora Compensación
            </a>
            <a
              href="/otros#mala-fe"
              className="p-3 bg-slate-800 rounded-xl text-sm hover:bg-slate-700 transition-colors text-center"
            >
              Evidencias Mala Fe
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 mt-8 border-t border-slate-800">
        <p className="text-center text-sm text-slate-500">
          Chaladita.net - Sistema de Soporte a Litigios
        </p>
        <p className="text-center text-xs text-slate-600 mt-1">
          Defensa de Juan Rodríguez Crespo
        </p>
      </footer>
    </div>
  );
}
