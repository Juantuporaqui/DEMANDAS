import { useState } from 'react';
import { Database, Home, TreePine, AlertOctagon, Mail } from 'lucide-react';
import { Header, Card, StatCard, Tag } from '../components';
import { activos, evidenciasMalaFe, olivar2021 } from '../data/finanzas';

type TabId = 'lope-vega' | 'olivar' | 'mala-fe';

const tabs = [
  { id: 'lope-vega' as TabId, label: 'Lope de Vega', icon: Home },
  { id: 'olivar' as TabId, label: 'Olivar', icon: TreePine },
  { id: 'mala-fe' as TabId, label: 'Mala Fe', icon: AlertOctagon },
];

export function OtrosPage() {
  const [activeTab, setActiveTab] = useState<TabId>('lope-vega');

  return (
    <div className="min-h-screen bg-slate-900">
      <Header title="Otros Temas" showBack />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header info */}
        <div className="bg-gradient-to-r from-slate-600/20 to-slate-800/20 rounded-3xl p-6 border border-slate-500/30">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-8 h-8 text-slate-400" />
                <h1 className="text-2xl font-bold">Inteligencia de Activos</h1>
              </div>
              <p className="text-slate-400">Base de datos de activos privativos y evidencias de mala fe</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Tag label="3 activos" variant="neutral" />
                <Tag label="3 evidencias" variant="mala_fe" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Activos privativos Juan" value="2" color="favorable" />
          <StatCard label="Valor estimado" value={225000} color="favorable" />
          <StatCard label="Vivienda Vicenta" value="Alquilada" sublabel="Mientras alega asfixia" color="alerta" />
          <StatCard label="Evidencias mala fe" value="3" color="alerta" />
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
                    ? 'bg-slate-600 text-white'
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
          {activeTab === 'lope-vega' && <LopeVegaTab />}
          {activeTab === 'olivar' && <OlivarTab />}
          {activeTab === 'mala-fe' && <MalaFeTab />}
        </div>
      </main>
    </div>
  );
}

function LopeVegaTab() {
  const lopeVega = activos.find(a => a.id === 'act-01')!;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Home className="w-6 h-6 text-emerald-400" />
          Blindaje Vivienda Lope de Vega
        </h2>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
          <p className="text-emerald-400">
            <strong>Carácter privativo acreditado:</strong> La vivienda fue adquirida en el año 2000,
            <strong> antes del matrimonio</strong> celebrado en 2016.
          </p>
        </div>

        {/* Property card */}
        <div className="border border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-slate-800 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{lopeVega.nombre}</p>
              <Tag label="Privativo" variant="favorable" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Tipo</p>
                <p className="font-medium">Inmueble</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Titular</p>
                <p className="font-medium">Juan</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Fecha adquisición</p>
                <p className="font-medium">15 marzo 2000</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Valor estimado</p>
                <p className="font-medium text-emerald-400">
                  {lopeVega.valorEstimado?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Documentación acreditativa</p>
              <p className="text-slate-300">{lopeVega.documentacion}</p>
            </div>
          </div>
        </div>

        {/* Legal basis */}
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">Fundamento legal del carácter privativo:</h3>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-purple-400 font-semibold mb-2">Art. 1346.1 Código Civil</p>
            <p className="text-slate-300 text-sm">
              "Son privativos de cada uno de los cónyuges: 1.º Los bienes y derechos que le pertenecieran
              al comenzar la sociedad."
            </p>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="font-semibold text-blue-400 mb-2">Consecuencia jurídica</p>
            <p className="text-slate-300">
              La vivienda de Lope de Vega <strong>no forma parte del patrimonio ganancial</strong> y
              no puede ser objeto de liquidación en el procedimiento de Picassent.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function OlivarTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TreePine className="w-6 h-6 text-emerald-400" />
          Explotación Olivar - Desglose 2021
        </h2>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
          <p className="text-emerald-400">
            <strong>Bien privativo por herencia:</strong> El olivar fue recibido por Juan como herencia
            familiar en 1998, manteniendo su carácter privativo por subrogación real.
          </p>
        </div>

        {/* Financial summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400">Beneficio bruto 2021</p>
            <p className="text-2xl font-bold text-emerald-400">
              {olivar2021.beneficioBruto.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400">Gastos</p>
            <p className="text-2xl font-bold text-red-400">
              {(olivar2021.gastos.maquinaria + olivar2021.gastos.mantenimiento + olivar2021.gastos.otros).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400">Beneficio neto</p>
            <p className="text-2xl font-bold text-blue-400">
              {olivar2021.beneficioNeto.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="border border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-slate-800 px-4 py-3">
            <p className="font-semibold">Desglose de gastos 2021</p>
          </div>
          <div className="divide-y divide-slate-700">
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Maquinaria agrícola</span>
              <span className="font-mono">
                {olivar2021.gastos.maquinaria.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Mantenimiento</span>
              <span className="font-mono">
                {olivar2021.gastos.mantenimiento.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Otros gastos</span>
              <span className="font-mono">
                {olivar2021.gastos.otros.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          </div>
        </div>

        {/* Reinvestment note */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="font-semibold text-blue-400 mb-2">Reinversión de beneficios</p>
          <p className="text-slate-300">
            {olivar2021.concepto}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Importe reinvertido: <strong className="text-emerald-400">
              {olivar2021.reinvertido.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </strong>
          </p>
        </div>

        {/* Legal basis */}
        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <p className="text-purple-400 font-semibold mb-2">Art. 1346.2 y 1347.2 CC - Frutos</p>
          <p className="text-slate-300 text-sm">
            Los frutos del olivar (bien privativo) se integran en la sociedad de gananciales.
            Sin embargo, la reinversión en mejoras del propio bien mantiene el carácter privativo
            por el principio de subrogación real.
          </p>
        </div>
      </Card>
    </div>
  );
}

function MalaFeTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertOctagon className="w-6 h-6 text-orange-400" />
          Evidencias de Mala Fe Procesal
        </h2>

        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
          <p className="text-orange-400">
            <strong>Relevancia:</strong> Estas evidencias demuestran contradicciones en las alegaciones
            de Vicenta y pueden ser utilizadas para cuestionar su credibilidad procesal.
          </p>
        </div>

        {/* Evidence cards */}
        <div className="space-y-4">
          {evidenciasMalaFe.map((evidencia) => {
            const colorMap = {
              mala_fe: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
              contradiccion: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
              favorable: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
            };
            const colors = colorMap[evidencia.relevancia];

            return (
              <div key={evidencia.id} className={`border rounded-xl overflow-hidden ${colors.border}`}>
                <div className={`${colors.bg} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    {evidencia.tipo === 'email' && <Mail className={`w-5 h-5 ${colors.text}`} />}
                    {evidencia.tipo !== 'email' && <AlertOctagon className={`w-5 h-5 ${colors.text}`} />}
                    <div>
                      <p className="font-semibold">{evidencia.descripcion}</p>
                      <p className="text-sm text-slate-400">
                        {evidencia.tipo.charAt(0).toUpperCase() + evidencia.tipo.slice(1)} - {evidencia.fecha}
                      </p>
                    </div>
                  </div>
                  <Tag
                    label={evidencia.relevancia.replace('_', ' ')}
                    variant={evidencia.relevancia === 'favorable' ? 'favorable' : 'mala_fe'}
                  />
                </div>
                <div className="p-4">
                  <p className="text-slate-300">{evidencia.contenido}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key evidence highlight */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="font-semibold text-red-400 mb-2">Evidencia clave: Email 12/01/2025</p>
          <p className="text-slate-300">
            Vicenta reconoce en comunicación escrita que tiene <strong>alquilada su vivienda privativa</strong>,
            lo cual contradice directamente su alegación de "situación de asfixia económica" en los procedimientos.
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Esta contradicción puede ser utilizada para:
          </p>
          <ul className="text-sm text-slate-400 mt-1 list-disc list-inside">
            <li>Cuestionar la veracidad de sus alegaciones económicas</li>
            <li>Solicitar exhibición de contratos de arrendamiento</li>
            <li>Incluir los ingresos por alquiler en la liquidación</li>
          </ul>
        </div>

        {/* Vivienda Vicenta */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Vivienda privativa de Vicenta</h3>
          <div className="border border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
              <p className="font-semibold">Vivienda (alquilada actualmente)</p>
              <Tag label="Privativo Vicenta" variant="neutral" />
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Valor estimado</p>
                  <p className="font-medium">150.000€</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Estado actual</p>
                  <p className="font-medium text-amber-400">Alquilada</p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-700">
                <p className="text-sm text-amber-400">
                  Vicenta obtiene ingresos por alquiler mientras alega no poder hacer frente a sus gastos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
