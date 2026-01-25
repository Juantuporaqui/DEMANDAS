import { useState } from 'react';
import { Shield, GitBranch, FileText, AlertTriangle } from 'lucide-react';
import { Header, Card, StatCard, Tag } from '../components';
import { procedimientos } from '../data/procedimientos';

type TabId = 'litispendencia' | 'recursos';

const tabs = [
  { id: 'litispendencia' as TabId, label: 'Litispendencia', icon: GitBranch },
  { id: 'recursos' as TabId, label: 'Recursos', icon: FileText },
];

export function MislataPage() {
  const [activeTab, setActiveTab] = useState<TabId>('litispendencia');
  const procedimiento = procedimientos.find(p => p.id === 'mislata')!;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header title="Mislata" showBack />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header info */}
        <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-3xl p-6 border border-purple-500/30">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-purple-400" />
                <h1 className="text-2xl font-bold">Juicio Verbal 1185/2025</h1>
              </div>
              <p className="text-slate-400">Juzgado de Primera Instancia nº 1 de Mislata</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Tag label="El Escudo" variant="favorable" />
                <Tag label="6.945,41€" variant="alerta" />
                <Tag label="Litispendencia" variant="prescripcion" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Estrategia</p>
              <p className="text-xl font-bold text-purple-400">Suspensión</p>
              <p className="text-sm text-slate-500">Por conexidad</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Cuantía reclamada" value={6945.41} color="alerta" />
          <StatCard label="Concepto" value="Hipoteca" sublabel="Pagos 2021-2023" color="neutral" />
          <StatCard label="Duplicidad" value="Sí" sublabel="Con Picassent" color="favorable" />
          <StatCard label="Recurso" value="Pendiente" sublabel="Reposición" color="alerta" />
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
                    ? 'bg-purple-600 text-white'
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
          {activeTab === 'litispendencia' && <LitispendenciaTab />}
          {activeTab === 'recursos' && <RecursosTab />}
        </div>
      </main>
    </div>
  );
}

function LitispendenciaTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-purple-400" />
          Lógica de Litispendencia - Art. 421 LEC
        </h2>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
          <p className="text-lg font-semibold text-purple-400 mb-2">
            "Cuando el tribunal aprecie la litispendencia [...] se abstendrá de conocer
            del asunto y sobreseerá el proceso."
          </p>
          <p className="text-sm text-slate-400">Art. 421.1 Ley de Enjuiciamiento Civil</p>
        </div>

        {/* Connection diagram */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4 text-center">Diagrama de Conexidad</h3>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Picassent box */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center min-w-[200px]">
              <p className="font-semibold text-blue-400">PICASSENT</p>
              <p className="text-sm text-slate-400">P.O. 715/2024</p>
              <p className="text-xs mt-2 text-slate-500">Liquidación gananciales</p>
              <p className="text-xs text-slate-500">212.677,08€</p>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-0.5 bg-amber-500 hidden md:block" />
              <div className="h-16 w-0.5 bg-amber-500 md:hidden" />
              <p className="text-xs text-amber-400 mt-1">INCLUYE</p>
            </div>

            {/* Mislata box */}
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center min-w-[200px]">
              <p className="font-semibold text-purple-400">MISLATA</p>
              <p className="text-sm text-slate-400">J.V. 1185/2025</p>
              <p className="text-xs mt-2 text-slate-500">Pagos hipoteca</p>
              <p className="text-xs text-slate-500">6.945,41€</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-center text-amber-400">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              <strong>Duplicidad:</strong> Los pagos de hipoteca reclamados en Mislata ya están incluidos
              en la liquidación de gananciales de Picassent
            </p>
          </div>
        </div>

        {/* Arguments */}
        <div className="space-y-4">
          <h3 className="font-semibold">Argumentos para la litispendencia:</h3>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="bg-emerald-500/20 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <div>
                <p className="font-semibold">Identidad de partes</p>
                <p className="text-sm text-slate-400">Ambos procedimientos enfrentan a Juan y Vicenta</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="bg-emerald-500/20 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <div>
                <p className="font-semibold">Identidad de objeto</p>
                <p className="text-sm text-slate-400">Los pagos de hipoteca son parte de la liquidación de la sociedad de gananciales</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="bg-emerald-500/20 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <div>
                <p className="font-semibold">Riesgo de resoluciones contradictorias</p>
                <p className="text-sm text-slate-400">Dos procedimientos resolviendo sobre las mismas cantidades generaría inseguridad jurídica</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <p className="font-semibold text-emerald-400 mb-2">Objetivo</p>
          <p className="text-slate-300">
            Conseguir la <strong>suspensión</strong> del procedimiento de Mislata hasta que se resuelva
            el de Picassent, evitando duplicidad de pagos y resoluciones contradictorias.
          </p>
        </div>
      </Card>
    </div>
  );
}

function RecursosTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-400" />
          Repositorio de Recursos
        </h2>

        <div className="space-y-4">
          {/* Recurso de Reposición */}
          <div className="border border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="font-semibold">Recurso de Reposición</p>
                  <p className="text-sm text-slate-400">Contra Decreto de Admisión</p>
                </div>
              </div>
              <Tag label="Pendiente" variant="alerta" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Fecha presentación:</span>
                <span>15 de septiembre de 2025</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Fundamento:</span>
                <span>Art. 421 LEC - Litispendencia</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Estado:</span>
                <span className="text-amber-400">Pendiente de resolución</span>
              </div>

              <div className="mt-4 p-3 bg-slate-800/50 rounded-xl">
                <p className="text-sm font-semibold mb-2">Petitum del recurso:</p>
                <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                  <li>Revocación del Decreto de admisión de la demanda</li>
                  <li>Suspensión del procedimiento por litispendencia impropia</li>
                  <li>Subsidiariamente, acumulación al P.O. 715/2024 de Picassent</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Escrito de oposición */}
          <div className="border border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-semibold">Contestación a la Demanda</p>
                  <p className="text-sm text-slate-400">Con alegación de litispendencia</p>
                </div>
              </div>
              <Tag label="Presentado" variant="favorable" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Fecha presentación:</span>
                <span>20 de octubre de 2025</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Páginas:</span>
                <span>12</span>
              </div>

              <div className="mt-4 p-3 bg-slate-800/50 rounded-xl">
                <p className="text-sm font-semibold mb-2">Excepciones alegadas:</p>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Litispendencia impropia (Art. 421 LEC)</li>
                  <li>• Cosa juzgada material (los pagos se incluirán en liquidación)</li>
                  <li>• Falta de legitimación activa parcial</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="font-semibold text-blue-400 mb-2">Próximos pasos</p>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Esperar resolución del Recurso de Reposición</li>
            <li>• Si se desestima, valorar recurso de apelación</li>
            <li>• Mantener coordinación con estrategia de Picassent</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
