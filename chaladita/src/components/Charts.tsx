import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { Nomina } from '../types';

const formatCurrency = (value: number | undefined) => {
  if (value === undefined) return '';
  return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
};

// Salary comparison chart
interface SalaryChartProps {
  data: Nomina[];
}

export function SalaryComparisonChart({ data }: SalaryChartProps) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-4">Comparativa de Ingresos Anuales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="periodo" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px' }}
            formatter={(value) => [formatCurrency(value as number)]}
          />
          <Legend />
          <Bar dataKey="juan" name="Juan" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="vicenta" name="Vicenta" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <p className="text-sm text-emerald-400">
          <strong>Conclusión:</strong> Juan aportó consistentemente más ingresos al hogar familiar durante todo el período matrimonial.
        </p>
      </div>
    </div>
  );
}

// Pie chart for expense distribution
interface ExpenseDistributionProps {
  data: { name: string; value: number; color: string }[];
  title: string;
}

export function ExpenseDistributionChart({ data, title }: ExpenseDistributionProps) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px' }}
            formatter={(value) => [formatCurrency(value as number)]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-slate-400">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Compensation calculator visual
interface CompensationChartProps {
  reclamacion: number;
  gastosPersonales: number;
  pagosDirectos: number;
}

export function CompensationChart({ reclamacion, gastosPersonales, pagosDirectos }: CompensationChartProps) {
  const saldoFinal = reclamacion - gastosPersonales;
  const data = [
    { name: 'Reclamación Vicenta', vicenta: reclamacion, juan: 0 },
    { name: 'Gastos Personales Vicenta', vicenta: 0, juan: gastosPersonales },
    { name: 'Pagos Directos Juan', vicenta: 0, juan: pagosDirectos },
  ];

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-4">Calculadora de Compensación (Art. 1195 CC)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" stroke="#94a3b8" tickFormatter={(v) => `${v.toLocaleString()}€`} />
          <YAxis type="category" dataKey="name" stroke="#94a3b8" width={90} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px' }}
            formatter={(value) => [formatCurrency(value as number)]}
          />
          <Bar dataKey="vicenta" name="A favor Vicenta" fill="#f43f5e" radius={[0, 4, 4, 0]} />
          <Bar dataKey="juan" name="A favor Juan" fill="#10b981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className={`mt-4 p-4 rounded-xl border ${saldoFinal < 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-slate-400">Reclamación</p>
            <p className="text-xl font-bold text-red-400">
              {reclamacion.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Crédito Juan</p>
            <p className="text-xl font-bold text-emerald-400">
              {gastosPersonales.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-600 text-center">
          <p className="text-sm text-slate-400">Saldo resultante</p>
          <p className={`text-2xl font-bold ${saldoFinal < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {saldoFinal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </p>
          {saldoFinal < 0 && (
            <p className="text-sm text-emerald-400 mt-2">
              La compensación extingue la deuda y genera un crédito a favor de Juan
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Timeline chart
interface TimelineChartProps {
  data: { fecha: string; evento: string; tipo: string }[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  const colorMap: Record<string, string> = {
    neutral: '#64748b',
    favorable: '#10b981',
    clave: '#3b82f6',
    alerta: '#ef4444',
    proximo: '#f59e0b',
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-4">Línea Temporal del Caso</h3>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: colorMap[item.tipo] || colorMap.neutral }}
            />
            <div className="flex-1 flex items-center justify-between">
              <span className="text-sm">{item.evento}</span>
              <span className="text-xs text-slate-500">
                {new Date(item.fecha).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-700">
        {Object.entries(colorMap).map(([tipo, color]) => (
          <div key={tipo} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-slate-400 capitalize">{tipo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Artur Piera money flow
interface MoneyFlowProps {
  total: number;
  destinoJuan: number;
  destinoVicenta: number;
}

export function MoneyFlowChart({ total, destinoJuan, destinoVicenta }: MoneyFlowProps) {
  const diferencia = destinoVicenta - destinoJuan;
  const data = [
    { name: 'Juan', value: destinoJuan, color: '#10b981' },
    { name: 'Vicenta', value: destinoVicenta, color: '#f43f5e' },
  ];

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-2">Trazabilidad Venta Artur Piera</h3>
      <p className="text-sm text-slate-400 mb-4">Distribución de los 120.000€</p>

      <div className="flex items-center justify-center mb-4">
        <div className="text-center px-6 py-4 bg-slate-900 rounded-xl">
          <p className="text-3xl font-bold text-blue-400">
            {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </p>
          <p className="text-sm text-slate-400">Importe total venta</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name}: ${(value as number).toLocaleString()}€`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px' }}
            formatter={(value) => [formatCurrency(value as number)]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
        <p className="text-sm text-red-400">
          <strong>Discrepancia:</strong> Vicenta retiró{' '}
          <span className="font-bold">
            {diferencia.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </span>{' '}
          más que Juan de la cuenta común.
        </p>
      </div>
    </div>
  );
}
