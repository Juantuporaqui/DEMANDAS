// ============================================
// CASE OPS - Modo Teleprónter para Audiencia
// Frases clave en grande para la vista oral
// ============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { frasesClaveVista, argumentosContestacion, nuestrosArgumentos } from '../../data/mislata';
import { todasLasCitas } from '../../data/jurisprudencia';
import { estrategiaPicassent } from '../../data/estrategia/informeEstrategico';

interface FraseTeleprompter {
  id: string;
  categoria: string;
  filterCategoria: 'TODO' | 'DEFENSA' | 'ATAQUE' | 'RÉPLICA' | 'PREGUNTA';
  titulo: string;
  frase: string;
  subtitulo?: string;
}

const categoriaMap = {
  defensa: 'DEFENSA',
  ataque: 'ATAQUE',
  replica: 'RÉPLICA',
  pregunta: 'PREGUNTA',
} as const;

const filterCategorias: FraseTeleprompter['filterCategoria'][] = [
  'TODO',
  'DEFENSA',
  'ATAQUE',
  'RÉPLICA',
  'PREGUNTA',
];

const resumenLinea = (texto: string) => {
  const primeraLinea = texto.split('\n')[0]?.trim() ?? '';
  if (!primeraLinea) return '';
  const punto = primeraLinea.indexOf('.');
  if (punto > 0) {
    return primeraLinea.slice(0, punto + 1);
  }
  return primeraLinea;
};

// Combinar todas las frases relevantes de Mislata
function getFrasesMislata(): FraseTeleprompter[] {
  const frases: FraseTeleprompter[] = [];

  // Frases clave de Mislata
  frasesClaveVista.forEach((f, i) => {
    frases.push({
      id: `frase-${i}`,
      categoria: 'FRASE CLAVE',
      filterCategoria: 'ATAQUE',
      titulo: f.contexto,
      frase: f.frase,
    });
  });

  // Réplicas a argumentos de Vicenta
  argumentosContestacion.forEach((arg) => {
    frases.push({
      id: `replica-${arg.id}`,
      categoria: 'RÉPLICA',
      filterCategoria: 'RÉPLICA',
      titulo: `Contra: ${arg.titulo}`,
      frase: arg.nuestraReplica.split('\n')[0], // Primera línea
      subtitulo: arg.articulosInvocados.join(', '),
    });
  });

  // Nuestros argumentos
  nuestrosArgumentos.forEach((arg) => {
    frases.push({
      id: `arg-${arg.id}`,
      categoria: 'ARGUMENTO',
      filterCategoria: 'DEFENSA',
      titulo: arg.titulo,
      frase: arg.cita,
      subtitulo: arg.fundamento,
    });
  });

  // Frases para juez de jurisprudencia
  todasLasCitas
    .filter((c) => c.fraseParaJuez && c.procedimientosAplicables.includes('mislata'))
    .forEach((c) => {
      frases.push({
        id: `juris-${c.id}`,
        categoria: 'JURISPRUDENCIA',
        filterCategoria: 'DEFENSA',
        titulo: `${c.tribunal} ${c.numero}`,
        frase: c.fraseParaJuez!,
        subtitulo: c.tematica.join(', '),
      });
    });

  return frases;
}

// Combinar todas las frases relevantes de Picassent
function getFrasesPicassent(): FraseTeleprompter[] {
  const frases: FraseTeleprompter[] = [];

  estrategiaPicassent.forEach((linea) => {
    const categoria = categoriaMap[linea.tipo];
    linea.frasesClave.forEach((frase, index) => {
      frases.push({
        id: `${linea.id}-frase-${index}`,
        categoria,
        filterCategoria: categoria,
        titulo: linea.titulo,
        frase,
        subtitulo: linea.descripcion,
      });
    });

    const fundamentoResumen = resumenLinea(linea.fundamento);
    if (fundamentoResumen) {
      frases.push({
        id: `${linea.id}-fundamento`,
        categoria: 'ARGUMENTO',
        filterCategoria: categoria,
        titulo: `${linea.titulo} · Fundamento`,
        frase: fundamentoResumen,
        subtitulo: linea.fundamento,
      });
    }
  });

  return frases;
}

export function ModoTelepronter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const procParam = searchParams.get('proc');
  const procedimiento = procParam === 'picassent' ? 'picassent' : 'mislata';
  const [categoryFilter, setCategoryFilter] = useState<FraseTeleprompter['filterCategoria']>('TODO');
  const frases = useMemo(
    () => (procedimiento === 'picassent' ? getFrasesPicassent() : getFrasesMislata()),
    [procedimiento],
  );
  const filteredFrases = useMemo(
    () =>
      categoryFilter === 'TODO'
        ? frases
        : frases.filter((frase) => frase.filterCategoria === categoryFilter),
    [categoryFilter, frases],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(10000); // 10 segundos
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const fraseCount = filteredFrases.length;
  const hasFrases = fraseCount > 0;
  const currentFrase = hasFrases ? filteredFrases[currentIndex] : null;

  // Navegación
  const goNext = useCallback(() => {
    if (!fraseCount) return;
    setCurrentIndex((prev) => (prev + 1) % fraseCount);
  }, [fraseCount]);

  const goPrev = useCallback(() => {
    if (!fraseCount) return;
    setCurrentIndex((prev) => (prev - 1 + fraseCount) % fraseCount);
  }, [fraseCount]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goPrev();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen?.();
          } else {
            navigate(-1);
          }
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, isFullscreen, navigate]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [procedimiento, categoryFilter]);

  // Auto play
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(goNext, autoPlaySpeed);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlaySpeed, goNext]);

  // Cronómetro
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Copiar al portapapeles
  const copyToClipboard = async () => {
    try {
      if (!currentFrase) return;
      await navigator.clipboard.writeText(currentFrase.frase);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Colores por categoría
  const categoryColors: Record<string, string> = {
    'FRASE CLAVE': 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    RÉPLICA: 'bg-red-500/20 text-red-300 border-red-500/50',
    ARGUMENTO: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    JURISPRUDENCIA: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    DEFENSA: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    ATAQUE: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    PREGUNTA: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header con controles */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Volver
          </button>
          <span className="text-slate-500">|</span>
          <span className="text-white font-medium">Modo Teleprónter</span>
          <span className="text-slate-500 text-sm">
            {hasFrases ? currentIndex + 1 : 0} / {fraseCount}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Cronómetro */}
          {showTimer && (
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1">
              <span className="text-2xl font-mono text-white">{formatTime(timerSeconds)}</span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`text-xs px-2 py-1 rounded ${timerRunning ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}
              >
                {timerRunning ? 'Pausa' : 'Iniciar'}
              </button>
              <button
                onClick={() => {
                  setTimerSeconds(0);
                  setTimerRunning(false);
                }}
                className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300"
              >
                Reset
              </button>
            </div>
          )}

          <button
            onClick={() => setShowTimer(!showTimer)}
            className={`text-sm px-3 py-1.5 rounded ${showTimer ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}
          >
            Cronómetro
          </button>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`text-sm px-3 py-1.5 rounded ${autoPlay ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}
          >
            {autoPlay ? '⏸ Auto' : '▶ Auto'}
          </button>

          <button
            onClick={toggleFullscreen}
            className="text-sm px-3 py-1.5 rounded bg-slate-800 text-slate-400 hover:text-white"
          >
            {isFullscreen ? '⊡ Salir' : '⊞ Pantalla completa'}
          </button>
        </div>
      </div>

      {/* Chips de categoría */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-2">
        <div className="flex flex-wrap gap-2">
          {filterCategorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setCategoryFilter(categoria)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                categoryFilter === categoria
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:text-white'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {currentFrase ? (
          <>
            {/* Categoría */}
            <div
              className={`text-sm font-bold px-4 py-1 rounded-full border mb-4 ${
                categoryColors[currentFrase.categoria] || 'bg-slate-700 text-slate-300'
              }`}
            >
              {currentFrase.categoria}
            </div>

            {/* Título */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              {currentFrase.titulo}
            </h2>

            {/* Frase principal - GRANDE */}
            <div className="max-w-4xl mx-auto text-center mb-6">
              <p className="text-3xl md:text-5xl lg:text-6xl font-medium text-amber-400 leading-tight">
                {currentFrase.frase}
              </p>
            </div>

            {/* Subtítulo */}
            {currentFrase.subtitulo && (
              <p className="text-lg text-slate-400 text-center">{currentFrase.subtitulo}</p>
            )}

            {/* Botón copiar */}
            <button
              onClick={copyToClipboard}
              className="mt-8 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors"
            >
              Copiar frase
            </button>
          </>
        ) : (
          <div className="text-center text-slate-400">
            No hay frases para esta categoría.
          </div>
        )}
      </div>

      {/* Navegación inferior */}
      <div className="bg-slate-900/80 border-t border-slate-800 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={goPrev}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg bg-slate-800/50"
          >
            ← Anterior
          </button>

          {/* Indicadores */}
          <div className="flex gap-1 overflow-x-auto max-w-md">
            {filteredFrases.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-amber-500' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg bg-slate-800/50"
          >
            Siguiente →
          </button>
        </div>

        {/* Atajos de teclado */}
        <div className="text-center text-xs text-slate-600 mt-3">
          ← → Navegar | Espacio: Siguiente | F: Pantalla completa | Esc: Salir
        </div>
      </div>
    </div>
  );
}
