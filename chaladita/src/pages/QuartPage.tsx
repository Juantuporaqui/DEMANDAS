import { useState } from 'react';
import { Receipt, ShoppingBag, Calculator, CreditCard } from 'lucide-react';
import {
  Header,
  Card,
  StatCard,
  Tag,
  DataTable,
  CompensationChart,
  ExpenseDistributionChart,
} from '../components';
import { procedimientos } from '../data/procedimientos';
import {
  gastosVicentaPersonal,
  pagosJuanHijos,
  auditoriaGastos,
  calculoCompensacion,
} from '../data/finanzas';

type TabId = 'auditoria' | 'compensacion' | 'pagos';

const tabs = [
  { id: 'auditoria' as TabId, label: 'Auditoría Gastos', icon: ShoppingBag },
  { id: 'compensacion' as TabId, label: 'Compensación', icon: Calculator },
  { id: 'pagos' as TabId, label: 'Pagos Directos', icon: CreditCard },
];

export function QuartPage() {
  const [activeTab, setActiveTab] = useState<TabId>('auditoria');
  const procedimiento = procedimientos.find(p => p.id === 'quart')!;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header title="Quart de Poblet" showBack />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header info */}
        <div className="bg-gradient-to-r from-amber-600/20 to-amber-800/20 rounded-3xl p-6 border border-amber-500/30">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="w-8 h-8 text-amber-400" />
                <h1 className="text-2xl font-bold">Ejecución de Títulos Judiciales 1428/2025</h1>
              </div>
              <p className="text-slate-400">Juzgado de Primera Instancia nº 2 de Quart de Poblet</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Tag label="Ejecución" variant="alerta" />
                <Tag label="2.400€ reclamados" variant="alerta" />
                <Tag label="Art. 1195 CC" variant="prescripcion" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Reclamación</p>
              <p className="text-xl font-bold text-red-400">2.400,00€</p>
              <p className="text-sm text-emerald-400">Compensable</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Reclamación Vicenta" value={2400} color="alerta" />
          <StatCard label="Gastos personales Vicenta" value={2710.61} color="alerta" sublabel="Con fondo de hijos" />
          <StatCard label="Pagos directos Juan" value={1895.65} color="favorable" />
          <StatCard label="Saldo a favor Juan" value={-310.61} color="favorable" sublabel="Tras compensación" />
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
                    ? 'bg-amber-600 text-white'
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
          {activeTab === 'auditoria' && <AuditoriaTab />}
          {activeTab === 'compensacion' && <CompensacionTab />}
          {activeTab === 'pagos' && <PagosTab />}
        </div>
      </main>
    </div>
  );
}

function AuditoriaTab() {
  const expenseData = [
    { name: 'Perfumería/Druni', value: 845.30 + 485.66, color: '#f43f5e' },
    { name: 'Mascotas', value: 623.45, color: '#f59e0b' },
    { name: 'Ropa', value: 756.20, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-red-400" />
          Auditoría de Gastos Personales de Vicenta
        </h2>

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400">
            <strong>Hallazgo:</strong> Vicenta ha utilizado <strong>2.710,61€</strong> del fondo destinado
            a los hijos para gastos estrictamente personales (perfumería, mascotas, ropa).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <DataTable
            data={gastosVicentaPersonal}
            title="Detalle de gastos personales"
          />

          <ExpenseDistributionChart
            data={expenseData}
            title="Distribución por categoría"
          />
        </div>

        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="font-semibold text-amber-400 mb-2">Base legal de la oposición</p>
          <p className="text-slate-300">
            El uso de fondos destinados a los hijos para gastos personales constituye un incumplimiento
            de la obligación de destino que permite oponer la compensación al amparo del <strong>Art. 1195 CC</strong>.
          </p>
        </div>
      </Card>
    </div>
  );
}

function CompensacionTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-purple-400" />
          Calculadora de Compensación - Art. 1195 CC
        </h2>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
          <p className="text-lg font-semibold text-purple-400 mb-2">
            "Tendrá lugar la compensación cuando dos personas, por derecho propio, sean recíprocamente
            acreedoras y deudoras la una de la otra."
          </p>
          <p className="text-sm text-slate-400">Art. 1195 Código Civil</p>
        </div>

        <CompensationChart
          reclamacion={calculoCompensacion.reclamacionVicenta}
          gastosPersonales={calculoCompensacion.gastosPersonalesVicenta}
          pagosDirectos={calculoCompensacion.pagosDirectosJuan}
        />

        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">Desglose del cálculo:</h3>

          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
              <span>Reclamación de Vicenta (fondo hijos)</span>
              <span className="font-mono text-red-400">+ 2.400,00€</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
              <span>Gastos personales Vicenta con fondo hijos</span>
              <span className="font-mono text-emerald-400">- 2.710,61€</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl font-semibold">
              <span>Saldo resultante</span>
              <span className="font-mono text-emerald-400">- 310,61€</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <p className="font-semibold text-emerald-400 mb-2">Conclusión</p>
            <p className="text-slate-300">
              La compensación no solo extingue la deuda reclamada, sino que genera un crédito
              de <strong>310,61€ a favor de Juan</strong> por el mal uso que Vicenta hizo del fondo de hijos.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PagosTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-emerald-400" />
          Registro de Pagos Directos de Juan a los Hijos
        </h2>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
          <p className="text-emerald-400">
            Además de las aportaciones al fondo común, Juan ha pagado directamente <strong>1.895,65€</strong>
            en gastos de los hijos que no han sido descontados de su obligación.
          </p>
        </div>

        <DataTable
          data={pagosJuanHijos}
          title="Facturas pagadas directamente por Juan"
        />

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-xl text-center">
            <p className="text-sm text-slate-400">Tecnología</p>
            <p className="text-xl font-bold text-blue-400">1.548,00€</p>
            <p className="text-xs text-slate-500">iPad + Ordenador</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl text-center">
            <p className="text-sm text-slate-400">Salud visual</p>
            <p className="text-xl font-bold text-emerald-400">347,65€</p>
            <p className="text-xs text-slate-500">Gafas graduadas</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl text-center">
            <p className="text-sm text-slate-400">Total</p>
            <p className="text-xl font-bold text-amber-400">1.895,65€</p>
            <p className="text-xs text-slate-500">Sin descontar</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="font-semibold text-blue-400 mb-2">Documentación acreditativa</p>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Factura Apple Store - iPad (Sept. 2023)</li>
            <li>• Factura MediaMarkt - Ordenador portátil (Ene. 2024)</li>
            <li>• Facturas Óptica - Gafas graduadas ambos hijos (Nov. 2023, Mar. 2024)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
