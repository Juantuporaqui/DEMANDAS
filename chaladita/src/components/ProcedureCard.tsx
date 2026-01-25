import { Scale, Receipt, Shield, Database, Calendar, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Procedimiento } from '../types';

const iconMap = {
  Scale,
  Receipt,
  Shield,
  Database,
};

const colorMap = {
  blue: {
    bg: 'from-blue-600/20 to-blue-800/20',
    border: 'border-blue-500/30 hover:border-blue-400/50',
    icon: 'text-blue-400',
    accent: 'bg-blue-500',
  },
  amber: {
    bg: 'from-amber-600/20 to-amber-800/20',
    border: 'border-amber-500/30 hover:border-amber-400/50',
    icon: 'text-amber-400',
    accent: 'bg-amber-500',
  },
  purple: {
    bg: 'from-purple-600/20 to-purple-800/20',
    border: 'border-purple-500/30 hover:border-purple-400/50',
    icon: 'text-purple-400',
    accent: 'bg-purple-500',
  },
  slate: {
    bg: 'from-slate-600/20 to-slate-800/20',
    border: 'border-slate-500/30 hover:border-slate-400/50',
    icon: 'text-slate-400',
    accent: 'bg-slate-500',
  },
};

interface ProcedureCardProps {
  procedimiento: Procedimiento;
}

export function ProcedureCard({ procedimiento }: ProcedureCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[procedimiento.icon as keyof typeof iconMap] || Scale;
  const colors = colorMap[procedimiento.color as keyof typeof colorMap] || colorMap.slate;

  const diasHastaHito = procedimiento.proximoHito
    ? Math.ceil(
        (new Date(procedimiento.proximoHito.fecha).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const esUrgente = diasHastaHito !== null && diasHastaHito <= 7 && diasHastaHito >= 0;

  return (
    <button
      onClick={() => navigate(`/${procedimiento.id}`)}
      className={`
        relative w-full text-left p-6 rounded-3xl border-2 transition-all duration-300
        bg-gradient-to-br ${colors.bg} ${colors.border}
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-${procedimiento.color}-500/10
        group overflow-hidden
      `}
    >
      {/* Decorative accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.accent} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`} />

      {/* Urgent badge */}
      {esUrgente && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-xs font-medium animate-pulse-slow">
          <AlertTriangle className="w-3 h-3" />
          {diasHastaHito} días
        </div>
      )}

      {/* Icon */}
      <div className={`w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-4 ${colors.icon}`}>
        <Icon className="w-8 h-8" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">
        {procedimiento.titulo}
      </h2>

      {/* Autos */}
      <p className="text-sm text-slate-400 mb-4">{procedimiento.autos}</p>

      {/* Cuantía */}
      {procedimiento.cuantia > 0 && (
        <p className="text-lg font-semibold text-slate-200">
          {procedimiento.cuantia.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </p>
      )}

      {/* Próximo hito */}
      {procedimiento.proximoHito && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className={`w-4 h-4 ${colors.icon}`} />
            <span className="text-slate-300">{procedimiento.proximoHito.evento}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {new Date(procedimiento.proximoHito.fecha).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Estrategias activas */}
      {procedimiento.estrategias.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {procedimiento.estrategias.filter(e => e.estado === 'activo').length} estrategias activas
          </span>
        </div>
      )}
    </button>
  );
}
