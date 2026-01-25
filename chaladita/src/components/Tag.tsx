interface TagProps {
  label: string;
  variant?: 'impugnable' | 'prescripcion' | 'mala_fe' | 'favorable' | 'neutral' | 'alerta';
  size?: 'sm' | 'md';
}

const variantStyles = {
  impugnable: 'bg-red-500/20 text-red-400 border-red-500/30',
  prescripcion: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  mala_fe: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  favorable: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  neutral: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  alerta: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export function Tag({ label, variant = 'neutral', size = 'sm' }: TagProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${variantStyles[variant]}
        ${sizeClasses}
      `}
    >
      {label}
    </span>
  );
}

export function TagGroup({ tags }: { tags: { label: string; variant: TagProps['variant'] }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <Tag key={idx} label={tag.label} variant={tag.variant} />
      ))}
    </div>
  );
}
