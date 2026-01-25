import { useState } from 'react';
import { Scale, Clock, FileWarning, Users, CheckSquare, Banknote } from 'lucide-react';
import {
  Header,
  Card,
  StatCard,
  Checklist,
  Tag,
  SalaryComparisonChart,
  ComparisonTable,
  MoneyFlowChart,
} from '../components';
import { procedimientos, checklistAudienciaPrevia, comparativaDoc25 } from '../data/procedimientos';
import { nominas, ventaArturPiera } from '../data/finanzas';

type TabId = 'prescripcion' | 'nominas' | 'doc25' | 'checklist' | 'artur';

const tabs = [
  { id: 'prescripcion' as TabId, label: 'Prescripción', icon: Clock },
  { id: 'nominas' as TabId, label: 'Nóminas', icon: Banknote },
  { id: 'doc25' as TabId, label: 'Doc. 25', icon: FileWarning },
  { id: 'checklist' as TabId, label: 'Checklist', icon: CheckSquare },
  { id: 'artur' as TabId, label: 'Artur Piera', icon: Users },
];

export function PicassentPage() {
  const [activeTab, setActiveTab] = useState<TabId>('prescripcion');
  const procedimiento = procedimientos.find(p => p.id === 'picassent')!;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header title="Picassent" showBack />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header info */}
        <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-3xl p-6 border border-blue-500/30">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Scale className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl font-bold">Procedimiento Ordinario 715/2024</h1>
              </div>
              <p className="text-slate-400">Juzgado de Primera Instancia nº 4 de Picassent</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Tag label="Caso Maestro" variant="favorable" />
                <Tag label="212.677,08€" variant="alerta" />
                {procedimiento.estrategias.map(e => (
                  <Tag key={e.id} label={e.titulo} variant="prescripcion" />
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Próxima vista</p>
              <p className="text-xl font-bold text-amber-400">20 enero 2026</p>
              <p className="text-sm text-slate-500">Audiencia Previa</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Cuantía reclamada" value={212677.08} color="alerta" />
          <StatCard label="Prescrito (pre-2019)" value="~60%" sublabel="Pendiente cálculo exacto" color="favorable" />
          <StatCard label="Docs impugnables" value="3" color="neutral" />
          <StatCard label="Estrategias activas" value="2" color="favorable" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="animate-fadeIn">
          {activeTab === 'prescripcion' && <PrescripcionTab />}
          {activeTab === 'nominas' && <NominasTab />}
          {activeTab === 'doc25' && <Doc25Tab />}
          {activeTab === 'checklist' && <ChecklistTab />}
          {activeTab === 'artur' && <ArturPieraTab />}
        </div>
      </main>
    </div>
  );
}

function PrescripcionTab() {
  return (
    <div className="space-y-6">
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
            La aplicación de la prescripción podría reducir la cuantía reclamada en aproximadamente un <strong>60%</strong>,
            dejando únicamente exigibles los créditos generados entre junio 2019 y la separación.
          </p>
        </div>
      </Card>
    </div>
  );
}

function NominasTab() {
  return (
    <div className="space-y-6">
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
          <p className="text-sm text-slate-500 mt-2">
            Referencia: Extractos de cuenta nómina + Certificados de empresa
          </p>
        </div>
      </Card>
    </div>
  );
}

function Doc25Tab() {
  return (
    <div className="space-y-6">
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

        <div className="mt-6">
          <h3 className="font-semibold mb-3">Discrepancias detectadas:</h3>
          <ul className="space-y-2">
            {comparativaDoc25.discrepancias.map((d, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-red-400 mt-1">•</span>
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="font-semibold text-amber-400 mb-2">Acción en Audiencia Previa</p>
          <p className="text-slate-300">
            Impugnar formalmente el Doc. 25 al amparo del <strong>Art. 326 LEC</strong> y solicitar que se tenga
            por no aportado o, subsidiariamente, que se valore con las debidas reservas.
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Contraprueba: Certificado oficial bancario solicitado por Juan
          </p>
        </div>
      </Card>
    </div>
  );
}

function ChecklistTab() {
  return (
    <div className="space-y-6">
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
    </div>
  );
}

function ArturPieraTab() {
  return (
    <div className="space-y-6">
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
    </div>
  );
}
