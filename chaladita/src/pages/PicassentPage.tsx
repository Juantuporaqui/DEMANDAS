import { useState } from 'react';
import {
  Scale,
  Clock,
  FileWarning,
  Users,
  CheckSquare,
  Banknote,
  ListChecks,
  Gavel,
  ArrowRight,
  Target,
  AlertTriangle,
  Calendar,
  FileText,
  ChevronLeft,
} from 'lucide-react';
import {
  Header,
  Card,
  StatCard,
  Checklist,
  Tag,
  SalaryComparisonChart,
  ComparisonTable,
  MoneyFlowChart,
  DesgloseHechos,
  AudienciaPrevia,
} from '../components';
import { procedimientos, checklistAudienciaPrevia, comparativaDoc25 } from '../data/procedimientos';
import { nominas, ventaArturPiera } from '../data/finanzas';
import { resumenAudiencia } from '../data/audienciaPrevia';
import { resumenContador } from '../data/hechosReclamados';

type ViewMode = 'home' | 'desglose' | 'audiencia' | 'herramientas';
type ToolId = 'prescripcion' | 'nominas' | 'doc25' | 'checklist' | 'artur';

export function PicassentPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const procedimiento = procedimientos.find(p => p.id === 'picassent')!;

  // Calcular días hasta la audiencia
  const diasHastaAudiencia = Math.ceil(
    (new Date(resumenAudiencia.fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const handleBack = () => {
    if (activeTool) {
      setActiveTool(null);
    } else {
      setViewMode('home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header
        title={viewMode === 'home' ? 'Picassent' : getViewTitle(viewMode, activeTool)}
        showBack
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Botón volver cuando no estamos en home */}
        {(viewMode !== 'home' || activeTool) && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
        )}

        {/* Vista principal (Home) */}
        {viewMode === 'home' && !activeTool && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-br from-blue-600/20 via-blue-700/10 to-slate-900 rounded-3xl p-8 border border-blue-500/30 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                        <Scale className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold">Procedimiento Ordinario 715/2024</h1>
                        <p className="text-slate-400">Juzgado de Primera Instancia nº 4 de Picassent</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Tag label="Caso Maestro" variant="favorable" />
                      <Tag label="Reclamación: 212.677,08€" variant="alerta" />
                      <Tag label="Riesgo Real: ~62.000€" variant="prescripcion" />
                    </div>
                  </div>

                  {/* Countdown to hearing */}
                  <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-5 border border-amber-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      <span className="text-sm text-amber-400 font-medium">Audiencia Previa</span>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">
                      {diasHastaAudiencia > 0 ? diasHastaAudiencia : 'HOY'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {diasHastaAudiencia > 0 ? 'días restantes' : ''}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      {new Date(resumenAudiencia.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })} - {resumenAudiencia.hora}h
                    </p>
                  </div>
                </div>

                {/* Objetivo procesal */}
                <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Objetivo procesal actual</p>
                  <p className="text-lg font-medium">
                    Reducción del <span className="text-emerald-400">70%</span> de la cuantía mediante prescripción (Art. 1964.2 CC) e impugnación documental
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Reclamado" value={resumenContador.totalReclamado} color="alerta" />
              <StatCard label="Prescrito (~)" value={150000} sublabel="Art. 1964.2 CC" color="favorable" />
              <StatCard label="Riesgo Real" value={resumenContador.cifraRiesgoReal} color="alerta" />
              <StatCard label="Estrategias" value="5 activas" color="favorable" />
            </div>

            {/* Main Action Buttons */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Desglose de Hechos Button */}
              <button
                onClick={() => setViewMode('desglose')}
                className="group relative bg-gradient-to-br from-blue-600/20 to-blue-800/20 hover:from-blue-600/30 hover:to-blue-800/30 rounded-3xl p-8 border-2 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
                    <ListChecks className="w-7 h-7 text-blue-400" />
                  </div>

                  <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    Desglose de Hechos
                  </h2>
                  <p className="text-slate-400 mb-4">
                    10 partidas reclamadas con análisis detallado, oposición y estrategia
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                      6 Prescritos
                    </span>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                      2 Compensables
                    </span>
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full">
                      2 Disputa
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-blue-400 font-medium">
                    <span>Ver desglose completo</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Audiencia Previa Button */}
              <button
                onClick={() => setViewMode('audiencia')}
                className="group relative bg-gradient-to-br from-amber-600/20 to-orange-800/20 hover:from-amber-600/30 hover:to-orange-800/30 rounded-3xl p-8 border-2 border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                {/* Urgency badge */}
                {diasHastaAudiencia <= 7 && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-xs font-medium animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    Urgente
                  </div>
                )}

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4">
                    <Gavel className="w-7 h-7 text-amber-400" />
                  </div>

                  <h2 className="text-2xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                    Audiencia Previa
                  </h2>
                  <p className="text-slate-400 mb-4">
                    Alegaciones complementarias y fijación de hechos controvertidos
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                      12 Alegaciones
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                      18 Hechos
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-amber-400 font-medium">
                    <span>Preparar audiencia</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>

            {/* Secondary Tools */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-400" />
                Herramientas de Análisis
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { id: 'prescripcion' as ToolId, icon: Clock, label: 'Prescripción', color: 'purple' },
                  { id: 'nominas' as ToolId, icon: Banknote, label: 'Nóminas', color: 'emerald' },
                  { id: 'doc25' as ToolId, icon: FileWarning, label: 'Doc. 25', color: 'red' },
                  { id: 'checklist' as ToolId, icon: CheckSquare, label: 'Checklist', color: 'amber' },
                  { id: 'artur' as ToolId, icon: Users, label: 'Artur Piera', color: 'blue' },
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setViewMode('herramientas');
                        setActiveTool(tool.id);
                      }}
                      className={`p-4 rounded-2xl border border-slate-700 hover:border-${tool.color}-500/50 bg-slate-800/50 hover:bg-slate-800 transition-all group`}
                    >
                      <Icon className={`w-6 h-6 text-${tool.color}-400 mx-auto mb-2`} />
                      <p className="text-sm font-medium text-center">{tool.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Qué falta para ir fuerte */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Qué falta para ir fuerte
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <FileText className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Certificado Bankia completo</p>
                    <p className="text-xs text-slate-500">Para contraponer a Doc. 25</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <FileText className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Tabla gastos reforma Artur Piera</p>
                    <p className="text-xs text-slate-500">Leroy Merlin, Bricomart</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Certificación nóminas 2016-2022</p>
                    <p className="text-xs text-slate-500">Para acreditar aportaciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista Desglose */}
        {viewMode === 'desglose' && (
          <div className="animate-fadeIn">
            <DesgloseHechos />
          </div>
        )}

        {/* Vista Audiencia Previa */}
        {viewMode === 'audiencia' && (
          <div className="animate-fadeIn">
            <AudienciaPrevia />
          </div>
        )}

        {/* Vista Herramientas */}
        {viewMode === 'herramientas' && activeTool && (
          <div className="animate-fadeIn">
            {activeTool === 'prescripcion' && <PrescripcionTool />}
            {activeTool === 'nominas' && <NominasTool />}
            {activeTool === 'doc25' && <Doc25Tool />}
            {activeTool === 'checklist' && <ChecklistTool />}
            {activeTool === 'artur' && <ArturPieraTool />}
          </div>
        )}
      </main>
    </div>
  );
}

function getViewTitle(viewMode: ViewMode, activeTool: ToolId | null): string {
  if (viewMode === 'desglose') return 'Desglose de Hechos';
  if (viewMode === 'audiencia') return 'Audiencia Previa';
  if (viewMode === 'herramientas' && activeTool) {
    const titles: Record<ToolId, string> = {
      prescripcion: 'Prescripción',
      nominas: 'Análisis de Nóminas',
      doc25: 'Impugnación Doc. 25',
      checklist: 'Checklist Audiencia',
      artur: 'Trazabilidad Artur Piera',
    };
    return titles[activeTool];
  }
  return 'Picassent';
}

// Tool Components
function PrescripcionTool() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6 text-purple-400" />
        Estrategia de Prescripción - Art. 1964.2 CC
      </h2>

      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
        <p className="text-lg font-semibold text-purple-400 mb-2">
          "Las acciones personales que no tengan plazo especial prescriben a los cinco años desde que pueda exigirse el cumplimiento de la obligación."
        </p>
        <p className="text-sm text-slate-400">Art. 1964.2 Código Civil (redacción Ley 42/2015)</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 font-bold">✓</span>
          </div>
          <div>
            <p className="font-semibold">Fecha límite de prescripción</p>
            <p className="text-slate-400">Todo pago realizado <strong className="text-emerald-400">antes de junio de 2019</strong> está prescrito</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-blue-400 font-bold">i</span>
          </div>
          <div>
            <p className="font-semibold">Cálculo del plazo</p>
            <p className="text-slate-400">Demanda presentada en mayo 2024 → 5 años atrás = junio 2019</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
            <span className="text-amber-400 font-bold">!</span>
          </div>
          <div>
            <p className="font-semibold">Hitos a marcar en vista</p>
            <ul className="text-slate-400 text-sm mt-1 list-disc list-inside">
              <li>Alegar prescripción al inicio de la audiencia</li>
              <li>Solicitar que se excluyan las partidas anteriores a junio 2019</li>
              <li>Aportar jurisprudencia sobre cómputo del plazo</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <p className="font-semibold text-emerald-400 mb-2">Impacto estimado</p>
        <p className="text-slate-300">
          La aplicación de la prescripción podría reducir la cuantía reclamada en aproximadamente un <strong>70%</strong>,
          dejando únicamente exigibles los créditos generados entre junio 2019 y la separación.
        </p>
      </div>
    </Card>
  );
}

function NominasTool() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Banknote className="w-6 h-6 text-emerald-400" />
        Análisis Comparativo de Ingresos (2016-2022)
      </h2>

      <SalaryComparisonChart data={nominas} />

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <p className="text-sm text-slate-400">Ingresos totales Juan</p>
          <p className="text-2xl font-bold text-emerald-400">
            {nominas.reduce((sum, n) => sum + n.juan, 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-sm text-slate-400">Ingresos totales Vicenta</p>
          <p className="text-2xl font-bold text-red-400">
            {nominas.reduce((sum, n) => sum + n.vicenta, 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <p className="font-semibold text-blue-400 mb-2">Brecha salarial acreditada</p>
        <p className="text-slate-300">
          Juan ingresó consistentemente un <strong>55-60% más</strong> que Vicenta durante todo el matrimonio.
          Esto contradice la afirmación de la demanda de que Juan "no aportaba al hogar familiar".
        </p>
      </div>
    </Card>
  );
}

function Doc25Tool() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FileWarning className="w-6 h-6 text-red-400" />
        Impugnación Documental - Doc. 25
      </h2>

      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
        <p className="font-semibold text-red-400 mb-2">Documento manipulado detectado</p>
        <p className="text-slate-300">
          El extracto bancario aportado como Doc. 25 por Vicenta presenta discrepancias significativas
          con el certificado oficial emitido por la entidad bancaria.
        </p>
      </div>

      <ComparisonTable
        title="Comparativa de Extractos"
        header1="Certificado Juan"
        header2="Doc. 25 Vicenta"
        rows={[
          { label: 'Saldo final', value1: '15.234,56€', value2: '8.123,45€', highlight: true },
          { label: 'Movimientos registrados', value1: '47', value2: '35', highlight: true },
          { label: 'Ingresos totales', value1: '89.456,00€', value2: '62.340,00€', highlight: true },
          { label: 'Gastos totales', value1: '74.221,44€', value2: '54.216,55€' },
          { label: 'Período', value1: '2018-2022', value2: '2018-2022' },
        ]}
      />

      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
        <p className="font-semibold text-amber-400 mb-2">Acción en Audiencia Previa</p>
        <p className="text-slate-300">
          Impugnar formalmente el Doc. 25 al amparo del <strong>Art. 326 LEC</strong> y solicitar que se tenga
          por no aportado o, subsidiariamente, que se valore con las debidas reservas.
        </p>
      </div>
    </Card>
  );
}

function ChecklistTool() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CheckSquare className="w-6 h-6 text-amber-400" />
        Checklist Audiencia Previa - 20/01/2026
      </h2>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
        <p className="text-amber-400">
          <strong>Importante:</strong> Esta lista debe verificarse punto por punto durante la audiencia.
          Use el "Modo Juicio" para mejor visualización en sala.
        </p>
      </div>

      <Checklist
        items={checklistAudienciaPrevia}
        title="Puntos de defensa"
      />
    </Card>
  );
}

function ArturPieraTool() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-400" />
        Trazabilidad Venta Artur Piera
      </h2>

      <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
        <p className="text-slate-300">
          En marzo de 2022 se vendió el inmueble de Artur Piera por <strong>120.000€</strong>.
          El importe fue depositado en cuenta común y posteriormente retirado por ambos cónyuges.
        </p>
      </div>

      <MoneyFlowChart
        total={ventaArturPiera.total}
        destinoJuan={ventaArturPiera.destinoJuan}
        destinoVicenta={ventaArturPiera.destinoVicenta}
      />

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-slate-800/50 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Retirado por Juan</span>
            <span className="font-mono text-emerald-400">
              {ventaArturPiera.destinoJuan.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Retirado por Vicenta</span>
            <span className="font-mono text-red-400">
              {ventaArturPiera.destinoVicenta.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-red-400">Diferencia a favor de Vicenta</span>
            <span className="font-mono font-bold text-red-400">
              {ventaArturPiera.diferencia.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <p className="font-semibold text-blue-400 mb-2">Relevancia probatoria</p>
        <p className="text-slate-300">
          Vicenta retiró 6.500€ más que Juan de los fondos comunes, lo cual debe ser tenido en cuenta
          en la liquidación de gananciales y contradice su alegación de "asfixia económica".
        </p>
      </div>
    </Card>
  );
}
