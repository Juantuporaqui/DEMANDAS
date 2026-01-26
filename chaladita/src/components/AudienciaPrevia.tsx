import { useState } from 'react';
import {
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Scale,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  StickyNote,
} from 'lucide-react';
import {
  alegacionesComplementarias,
  hechosControvertidos,
  resumenAudiencia,
  type Alegacion,
  type HechoControvertido,
} from '../data/audienciaPrevia';

type TabId = 'alegaciones' | 'hechos';

const tipoPruebaConfig = {
  documental: { label: 'Documental', color: 'blue' },
  pericial: { label: 'Pericial', color: 'purple' },
  testifical: { label: 'Testifical', color: 'amber' },
  interrogatorio: { label: 'Interrogatorio', color: 'emerald' },
};

const estadoConfig = {
  pendiente: { label: 'Pendiente', color: 'slate', icon: Clock },
  propuesto: { label: 'Propuesto', color: 'blue', icon: AlertCircle },
  admitido: { label: 'Admitido', color: 'emerald', icon: CheckCircle2 },
};

export function AudienciaPrevia() {
  const [activeTab, setActiveTab] = useState<TabId>('alegaciones');

  return (
    <div className="space-y-6">
      {/* Header con info de la audiencia */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-3xl p-6 border border-amber-500/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <Scale className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-amber-400">Audiencia Previa</h2>
              <p className="text-slate-400">{resumenAudiencia.juzgado}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">
              {new Date(resumenAudiencia.fecha).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              })}
            </p>
            <p className="text-amber-400 font-medium">{resumenAudiencia.hora}h</p>
            <p className="text-sm text-slate-500">{resumenAudiencia.sala}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{resumenAudiencia.totalAlegaciones}</p>
            <p className="text-xs text-slate-400">Alegaciones</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-purple-400">{resumenAudiencia.totalHechosControvertidos}</p>
            <p className="text-xs text-slate-400">Hechos Controvertidos</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">{resumenAudiencia.hechosPendientes}</p>
            <p className="text-xs text-slate-400">Por Proponer</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{resumenAudiencia.hechosPropuestos}</p>
            <p className="text-xs text-slate-400">Propuestos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('alegaciones')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
            activeTab === 'alegaciones'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Alegaciones Complementarias</span>
          <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
            {alegacionesComplementarias.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('hechos')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
            activeTab === 'hechos'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span>Hechos Controvertidos</span>
          <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
            {hechosControvertidos.length}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {activeTab === 'alegaciones' && <AlegacionesTab />}
        {activeTab === 'hechos' && <HechosControvertidosTab />}
      </div>
    </div>
  );
}

function AlegacionesTab() {
  const [expandido, setExpandido] = useState<number | null>(null);
  const [notas, setNotas] = useState<Record<number, string>>({});

  return (
    <div className="space-y-4">
      {/* Instrucciones */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-400 font-medium">Guion Esquemático para la Audiencia</p>
          <p className="text-sm text-slate-400 mt-1">
            Estos 12 puntos resumen la posición procesal del demandado. Pulse sobre cada uno para ver el detalle y añadir notas.
          </p>
        </div>
      </div>

      {/* Lista de alegaciones */}
      <div className="space-y-3">
        {alegacionesComplementarias.map((alegacion) => (
          <AlegacionCard
            key={alegacion.id}
            alegacion={alegacion}
            expandido={expandido === alegacion.id}
            onToggle={() => setExpandido(expandido === alegacion.id ? null : alegacion.id)}
            nota={notas[alegacion.id] || ''}
            onNotaChange={(nota) => setNotas({ ...notas, [alegacion.id]: nota })}
          />
        ))}
      </div>

      {/* Botón de imprimir */}
      <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-medium transition-colors">
        <Printer className="w-5 h-5" />
        Imprimir Guion de Alegaciones
      </button>
    </div>
  );
}

interface AlegacionCardProps {
  alegacion: Alegacion;
  expandido: boolean;
  onToggle: () => void;
  nota: string;
  onNotaChange: (nota: string) => void;
}

function AlegacionCard({ alegacion, expandido, onToggle, nota, onNotaChange }: AlegacionCardProps) {
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${
      expandido ? 'border-blue-500/50 bg-slate-800/50' : 'border-slate-700 bg-slate-800/30'
    }`}>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-bold text-lg">
            {alegacion.id}
          </span>
          <div>
            <h3 className="font-semibold">{alegacion.titulo}</h3>
            {alegacion.fundamentoLegal && (
              <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full">
                {alegacion.fundamentoLegal}
              </span>
            )}
          </div>
        </div>
        {expandido ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {expandido && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-700 pt-4 animate-fadeIn">
          <p className="text-slate-300 leading-relaxed">{alegacion.contenido}</p>

          {/* Campo de notas */}
          <div className="bg-slate-900/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Notas personales</span>
            </div>
            <textarea
              value={nota}
              onChange={(e) => onNotaChange(e.target.value)}
              placeholder="Añade notas para la vista..."
              className="w-full bg-transparent border border-slate-700 rounded-lg p-2 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-amber-500/50"
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function HechosControvertidosTab() {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const hechosFiltrados = hechosControvertidos.filter(h => {
    if (filtroTipo !== 'todos' && h.tipoPrueba !== filtroTipo) return false;
    if (filtroEstado !== 'todos' && h.estado !== filtroEstado) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Instrucciones */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-purple-400 font-medium">Propuesta de Hechos Controvertidos</p>
          <p className="text-sm text-slate-400 mt-1">
            Formato binario y probatorio. Cada hecho debe resolverse con prueba concreta. Use los filtros para organizar la proposición de prueba.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
          <span className="text-xs text-slate-500 px-2">Tipo:</span>
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filtroTipo === 'todos' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          {Object.entries(tipoPruebaConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFiltroTipo(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtroTipo === key ? `bg-${config.color}-500/30 text-${config.color}-400` : 'text-slate-400 hover:text-white'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
          <span className="text-xs text-slate-500 px-2">Estado:</span>
          <button
            onClick={() => setFiltroEstado('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filtroEstado === 'todos' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          {Object.entries(estadoConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFiltroEstado(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtroEstado === key ? `bg-${config.color}-500/30 text-${config.color}-400` : 'text-slate-400 hover:text-white'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contador de filtrados */}
      <p className="text-sm text-slate-500">
        Mostrando {hechosFiltrados.length} de {hechosControvertidos.length} hechos
      </p>

      {/* Lista de hechos */}
      <div className="grid gap-3">
        {hechosFiltrados.map((hecho) => (
          <HechoCard key={hecho.id} hecho={hecho} />
        ))}
      </div>

      {/* Botón de imprimir */}
      <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-medium transition-colors">
        <Printer className="w-5 h-5" />
        Imprimir Propuesta de Hechos
      </button>
    </div>
  );
}

function HechoCard({ hecho }: { hecho: HechoControvertido }) {
  const [expandido, setExpandido] = useState(false);
  const tipoConfig = tipoPruebaConfig[hecho.tipoPrueba];
  const estConfig = estadoConfig[hecho.estado];
  const EstadoIcon = estConfig.icon;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${
      expandido ? 'border-purple-500/50' : 'border-slate-700'
    }`}>
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full p-4 flex items-start gap-4 text-left hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-sm flex-shrink-0">
          {hecho.id}
        </span>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-2">{hecho.titulo}</h3>
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full bg-${tipoConfig.color}-500/20 text-${tipoConfig.color}-400`}>
              {tipoConfig.label}
            </span>
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-${estConfig.color}-500/20 text-${estConfig.color}-400`}>
              <EstadoIcon className="w-3 h-3" />
              {estConfig.label}
            </span>
          </div>
        </div>

        {expandido ? (
          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
      </button>

      {expandido && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-700 animate-fadeIn">
          <p className="text-slate-300 text-sm leading-relaxed">{hecho.descripcion}</p>
        </div>
      )}
    </div>
  );
}
