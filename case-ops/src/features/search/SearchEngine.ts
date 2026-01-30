// ============================================
// CASE OPS - Motor de Búsqueda Unificado
// Busca en documentos, hechos, jurisprudencia, mislata
// ============================================

import { hechosReclamados, type HechoReclamado } from '../../data/hechosReclamados';
import { todasLasCitas, type CitaJurisprudencia } from '../../data/jurisprudencia';
import {
  procedimientoMislata,
  argumentosContestacion,
  nuestrosArgumentos,
  frasesClaveVista,
  type ArgumentoContrario,
} from '../../data/mislata';
import { LEGAL_DOCS_MAP } from '../../data/legal_texts';

// Tipos de resultado
export type ResultType =
  | 'hecho'
  | 'jurisprudencia'
  | 'documento'
  | 'argumento'
  | 'frase'
  | 'procedimiento';

export interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  snippet: string;
  relevance: number;
  data: unknown;
  link?: string;
}

// Función para calcular relevancia simple
function calculateRelevance(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const terms = lowerQuery.split(/\s+/).filter((t) => t.length > 1);

  let score = 0;

  // Coincidencia exacta de la frase completa
  if (lowerText.includes(lowerQuery)) {
    score += 100;
  }

  // Coincidencias de términos individuales
  terms.forEach((term) => {
    const regex = new RegExp(term, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      score += matches.length * 10;
    }
  });

  // Bonus si aparece al inicio
  if (lowerText.startsWith(lowerQuery)) {
    score += 50;
  }

  return score;
}

// Extraer snippet con contexto
function extractSnippet(text: string, query: string, maxLength = 150): string {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + query.length + 100);
  let snippet = text.substring(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}

// Buscar en hechos reclamados (Picassent)
function searchHechos(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  hechosReclamados.forEach((hecho) => {
    const searchableText = [
      hecho.titulo,
      hecho.hechoActora,
      hecho.realidadHechos,
      hecho.oposicion.join(' '),
      hecho.estrategia,
    ].join(' ');

    if (searchableText.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: `hecho-${hecho.id}`,
        type: 'hecho',
        title: `Hecho ${hecho.id}: ${hecho.titulo}`,
        subtitle: `${hecho.cuantia.toLocaleString('es-ES')} € - ${hecho.estado.toUpperCase()}`,
        snippet: extractSnippet(hecho.realidadHechos, query),
        relevance: calculateRelevance(searchableText, query),
        data: hecho,
        link: '/analytics/hechos',
      });
    }
  });

  return results;
}

// Buscar en jurisprudencia
function searchJurisprudencia(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  todasLasCitas.forEach((cita) => {
    const searchableText = [
      cita.numero,
      cita.fragmentoClave,
      cita.textoCompleto,
      cita.tematica.join(' '),
      cita.tags.join(' '),
      cita.cuandoAplica,
      cita.fraseParaJuez || '',
    ].join(' ');

    if (searchableText.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: `juris-${cita.id}`,
        type: 'jurisprudencia',
        title: `${cita.tribunal} ${cita.numero}`,
        subtitle: cita.tematica.join(', '),
        snippet: extractSnippet(cita.fragmentoClave, query),
        relevance: calculateRelevance(searchableText, query) + cita.importancia * 5,
        data: cita,
        link: '/jurisprudencia',
      });
    }
  });

  return results;
}

// Buscar en argumentos de Mislata
function searchArgumentos(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  argumentosContestacion.forEach((arg) => {
    const searchableText = [
      arg.titulo,
      arg.argumentoVicenta,
      arg.nuestraReplica,
      arg.articulosInvocados.join(' '),
      arg.jurisprudenciaAFavor.join(' '),
    ].join(' ');

    if (searchableText.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: `arg-${arg.id}`,
        type: 'argumento',
        title: `Arg. Vicenta: ${arg.titulo}`,
        subtitle: `Estado: ${arg.estado.toUpperCase()} - Prioridad: ${arg.prioridad}`,
        snippet: extractSnippet(arg.nuestraReplica, query),
        relevance: calculateRelevance(searchableText, query),
        data: arg,
      });
    }
  });

  nuestrosArgumentos.forEach((arg) => {
    const searchableText = [arg.titulo, arg.fundamento, arg.texto, arg.cita].join(' ');

    if (searchableText.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: `nuestro-arg-${arg.id}`,
        type: 'argumento',
        title: `Nuestro Arg: ${arg.titulo}`,
        subtitle: arg.fundamento,
        snippet: extractSnippet(arg.texto, query),
        relevance: calculateRelevance(searchableText, query) + 20, // Bonus para nuestros argumentos
        data: arg,
      });
    }
  });

  return results;
}

// Buscar en frases clave
function searchFrases(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  frasesClaveVista.forEach((frase, index) => {
    const searchableText = [frase.contexto, frase.frase].join(' ');

    if (searchableText.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: `frase-${index}`,
        type: 'frase',
        title: `Frase: ${frase.contexto}`,
        subtitle: 'Mislata - Vista oral',
        snippet: frase.frase,
        relevance: calculateRelevance(searchableText, query),
        data: frase,
      });
    }
  });

  return results;
}

// Buscar en documentos legales
function searchDocumentos(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  Object.entries(LEGAL_DOCS_MAP).forEach(([key, text]) => {
    if (text.toLowerCase().includes(lowerQuery)) {
      const isPicassent = key.includes('picassent');
      const isMislata = key.includes('mislata');

      results.push({
        id: `doc-${key}`,
        type: 'documento',
        title: key
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        subtitle: isPicassent ? 'Picassent P.O. 715/2024' : isMislata ? 'Mislata J.V. 1185/2025' : '',
        snippet: extractSnippet(text, query),
        relevance: calculateRelevance(text, query),
        data: { key, text },
      });
    }
  });

  return results;
}

// Buscar en procedimiento Mislata
function searchProcedimiento(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  const searchableText = [
    procedimientoMislata.nombre,
    procedimientoMislata.juzgado,
    procedimientoMislata.demandante,
    procedimientoMislata.demandada,
    procedimientoMislata.estado,
    procedimientoMislata.objetivoInmediato,
    procedimientoMislata.relacionConPicassent,
  ].join(' ');

  if (searchableText.toLowerCase().includes(lowerQuery)) {
    results.push({
      id: 'proc-mislata',
      type: 'procedimiento',
      title: procedimientoMislata.nombre,
      subtitle: `${procedimientoMislata.rol} - ${(procedimientoMislata.cuantiaReclamada / 100).toLocaleString('es-ES')} €`,
      snippet: extractSnippet(procedimientoMislata.objetivoInmediato, query),
      relevance: calculateRelevance(searchableText, query),
      data: procedimientoMislata,
    });
  }

  return results;
}

// Búsqueda global unificada
export function globalSearchUnified(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const allResults: SearchResult[] = [
    ...searchHechos(query),
    ...searchJurisprudencia(query),
    ...searchArgumentos(query),
    ...searchFrases(query),
    ...searchDocumentos(query),
    ...searchProcedimiento(query),
  ];

  // Ordenar por relevancia
  return allResults.sort((a, b) => b.relevance - a.relevance);
}

// Agrupar resultados por tipo
export function groupResultsByType(results: SearchResult[]): Record<ResultType, SearchResult[]> {
  const grouped: Record<ResultType, SearchResult[]> = {
    hecho: [],
    jurisprudencia: [],
    documento: [],
    argumento: [],
    frase: [],
    procedimiento: [],
  };

  results.forEach((r) => {
    grouped[r.type].push(r);
  });

  return grouped;
}

// Obtener estadísticas de búsqueda
export function getSearchStats(results: SearchResult[]): {
  total: number;
  byType: Record<ResultType, number>;
} {
  const byType: Record<ResultType, number> = {
    hecho: 0,
    jurisprudencia: 0,
    documento: 0,
    argumento: 0,
    frase: 0,
    procedimiento: 0,
  };

  results.forEach((r) => {
    byType[r.type]++;
  });

  return {
    total: results.length,
    byType,
  };
}
