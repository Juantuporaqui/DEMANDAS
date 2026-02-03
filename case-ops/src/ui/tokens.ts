// Dimensiones
export const appMaxWidth = '1400px'; // Un poco más ancho para ver mejor los gráficos
export const sidebarWidth = '280px';
export const radius = 'var(--radius-lg)'; // Bordes unificados por tokens

// COLORES "HARDCODED" (Fuerza Bruta para garantizar el diseño)
// Fondo: Slate 950 real (#020617)
export const bg = 'bg-[var(--bg)]';

// Tarjetas: Slate 900 real (#0f172a) con un poco de transparencia
export const card = 'bg-[var(--card)] backdrop-blur-md shadow-[var(--shadow-1)]';

// Bordes: Slate 800 (#1e293b)
export const border = 'border border-[var(--border)]';

// Sombras
export const shadowCard = 'shadow-[var(--shadow-2)]';

// Tipografía
export const textPrimary = 'text-[var(--text)]'; // Slate 50 (Blanco roto)
export const textSecondary = 'text-[color-mix(in srgb, var(--text) 70%, transparent)]';
export const textMuted = 'text-[var(--muted)]';
export const accent = 'text-[var(--warn)]';

// Interacción
export const hover = 'hover:bg-[color-mix(in srgb, var(--surface) 70%, transparent)] transition-all duration-200 cursor-pointer';

// Estado Activo (El toque War Room)
// Fondo Amber 500 (#f59e0b) con texto oscuro y sombra resplandeciente
export const active = 'bg-[var(--warn)] text-[#020617] font-bold shadow-lg shadow-[color-mix(in srgb, var(--warn) 45%, transparent)] translate-x-1';
