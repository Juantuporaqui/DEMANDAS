// ============================================
// TRAZABILIDAD PROBATORIA - Links Clicables a Documentos
// Convierte referencias a documentos en texto en links clicables
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Expresiones regulares para detectar referencias a documentos
 * Soporta: Doc. 1, Doc. 13, Documento 1, (Doc. 1), Doc 1, etc.
 */
const DOC_PATTERNS = [
  /\(Doc\.?\s*(\d+)\)/gi,           // (Doc. 1), (Doc 1)
  /Doc\.?\s*(\d+)/gi,               // Doc. 1, Doc 1, Doc.1
  /Documento\s+(\d+)/gi,            // Documento 1
];

/**
 * Mapeo de números de documento a IDs internos del sistema
 * Los documentos del caso Picassent están numerados del 1 al 60+
 */
const getDocumentPath = (docNum: number, caseId?: string): string => {
  // Para documentos específicos de casos, usar el path del caso
  if (caseId) {
    return `/cases/${caseId}/documents/${docNum}`;
  }
  // Por defecto, usar el viewer de documentos genérico
  return `/documents?doc=${docNum}`;
};

interface DocumentLinkProps {
  docNum: number;
  displayText: string;
  caseId?: string;
}

/**
 * Componente de link a documento individual
 */
export function DocumentLink({ docNum, displayText, caseId }: DocumentLinkProps) {
  return (
    <Link
      to={getDocumentPath(docNum, caseId)}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded text-sm font-mono transition-colors border border-blue-500/30"
      title={`Ver Documento ${docNum}`}
    >
      <span className="text-xs">📄</span>
      {displayText}
    </Link>
  );
}

/**
 * Props para el componente LinkedText
 */
interface LinkedTextProps {
  text: string;
  caseId?: string;
  className?: string;
}

/**
 * Componente que renderiza texto con links clicables a documentos
 * Detecta patrones como "Doc. 1", "(Doc. 3)", "Documento 5" y los convierte en links
 */
export function LinkedText({ text, caseId, className = '' }: LinkedTextProps) {
  if (!text) return null;

  // Encontrar todas las coincidencias y sus posiciones
  const matches: { start: number; end: number; docNum: number; originalText: string }[] = [];

  DOC_PATTERNS.forEach(pattern => {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        docNum: parseInt(match[1]),
        originalText: match[0]
      });
    }
  });

  // Si no hay coincidencias, devolver texto plano
  if (matches.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Ordenar por posición de inicio y eliminar duplicados solapados
  matches.sort((a, b) => a.start - b.start);
  const uniqueMatches = matches.filter((match, index) => {
    if (index === 0) return true;
    return match.start >= matches[index - 1].end;
  });

  // Construir el resultado con links
  const result: React.ReactNode[] = [];
  let lastEnd = 0;

  uniqueMatches.forEach((match, index) => {
    // Añadir texto antes del match
    if (match.start > lastEnd) {
      result.push(
        <span key={`text-${index}`}>{text.slice(lastEnd, match.start)}</span>
      );
    }

    // Añadir el link
    result.push(
      <DocumentLink
        key={`link-${index}`}
        docNum={match.docNum}
        displayText={match.originalText}
        caseId={caseId}
      />
    );

    lastEnd = match.end;
  });

  // Añadir texto restante
  if (lastEnd < text.length) {
    result.push(<span key="text-final">{text.slice(lastEnd)}</span>);
  }

  return <span className={className}>{result}</span>;
}

/**
 * Hook para obtener información de documento por número
 */
export function useDocumentInfo(docNum: number) {
  // Mapeo básico de documentos del caso Picassent
  const picassentDocs: Record<number, { titulo: string; tipo: string }> = {
    1: { titulo: 'Extracto cuenta BBVA', tipo: 'bancario' },
    2: { titulo: 'Anexo ingresos cuentas familiares', tipo: 'bancario' },
    3: { titulo: 'Justificante transferencia Vicenta', tipo: 'bancario' },
    4: { titulo: 'Contestación requerimiento AEAT', tipo: 'fiscal' },
    5: { titulo: 'Escritura compraventa Godelleta', tipo: 'notarial' },
    6: { titulo: 'Nota simple registro propiedad', tipo: 'registral' },
    7: { titulo: 'Recibo préstamo 10/02/2025', tipo: 'bancario' },
    8: { titulo: 'Correos electrónicos propuestas división', tipo: 'comunicaciones' },
    9: { titulo: 'Capturas WhatsApp', tipo: 'comunicaciones' },
    11: { titulo: 'Cancelación unilateral cuenta', tipo: 'bancario' },
    13: { titulo: 'Justificante ingreso 18.000€ Juan', tipo: 'bancario' },
    17: { titulo: 'Pago vehículo Renault Scenic', tipo: 'bancario' },
    20: { titulo: 'Documentación reforma Artur Piera', tipo: 'obras' },
    53: { titulo: 'Escritura préstamo hipotecario', tipo: 'notarial' },
  };

  return picassentDocs[docNum] || { titulo: `Documento ${docNum}`, tipo: 'general' };
}

/**
 * Extrae todos los números de documento mencionados en un texto
 */
export function extractDocumentNumbers(text: string): number[] {
  if (!text) return [];

  const docNums = new Set<number>();

  DOC_PATTERNS.forEach(pattern => {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      docNums.add(parseInt(match[1]));
    }
  });

  return Array.from(docNums).sort((a, b) => a - b);
}

/**
 * Crea un mapa de referencias de documentos para un array de textos
 */
export function createDocumentReferencesMap(texts: string[]): Map<number, string[]> {
  const map = new Map<number, string[]>();

  texts.forEach(text => {
    const docNums = extractDocumentNumbers(text);
    docNums.forEach(num => {
      if (!map.has(num)) {
        map.set(num, []);
      }
      map.get(num)!.push(text.slice(0, 100) + '...');
    });
  });

  return map;
}
