import React from 'react';

interface TextReaderProps {
  content: string;
}

export function TextReader({ content }: TextReaderProps) {
  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4 md:p-8 custom-scrollbar">
      {/* Contenedor tipo "Folio" */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] min-h-full rounded-sm overflow-hidden">
        
        {/* Cabecera visual del folio (opcional, estética) */}
        <div className="h-2 bg-slate-100 border-b border-slate-200" />

        <div className="p-8 md:p-12">
          {/* ATENCIÓN: 'whitespace-pre-wrap' es lo que hace que 
             los saltos de línea del archivo .ts se vean en pantalla.
             'text-justify' ayuda a que parezca un documento legal formal.
          */}
          <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-justify text-slate-800 font-medium font-mono-off">
            {content}
          </pre>
        </div>
        
      </div>
    </div>
  );
}
