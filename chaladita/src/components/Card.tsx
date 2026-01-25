import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-slate-800 rounded-3xl p-6 shadow-xl
        ${hover ? 'cursor-pointer transition-all duration-300 hover:bg-slate-700 hover:scale-[1.02] hover:shadow-2xl' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'favorable' | 'alerta' | 'neutral';
}

export function StatCard({ label, value, sublabel, color = 'neutral' }: StatCardProps) {
  const colorClasses = {
    favorable: 'text-emerald-400',
    alerta: 'text-red-400',
    neutral: 'text-slate-300',
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>
        {typeof value === 'number' ? value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) : value}
      </p>
      {sublabel && <p className="text-slate-500 text-xs mt-1">{sublabel}</p>}
    </div>
  );
}
