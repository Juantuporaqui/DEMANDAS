import { Link } from 'react-router-dom';
import Card from '../../ui/components/Card';

type DocumentItem = {
  id: string;
  title: string;
  href: string;
  docType: string;
  caseLabel: string;
};

const QUART_INTERNAL_DOC = new URL(
  '../../data/quart/Quart_impugnac oposic dda ejecución.pdf',
  import.meta.url
).href;

const PDF_DOCUMENTS: DocumentItem[] = [
  {
    id: 'picassent-doc-03',
    title: 'Doc-03 Retirada 38.500 (Vicenta)',
    href: encodeURI('/docs/picassent/Doc-03-retirada 38500_Vicen.pdf'),
    docType: 'extracto',
    caseLabel: 'Picassent',
  },
  {
    id: 'picassent-doc-04',
    title: 'Doc-04 Respuesta Requerimiento Hacienda',
    href: encodeURI('/docs/picassent/Doc-04_Respuesta_reque Hacienda.pdf'),
    docType: 'comunicacion',
    caseLabel: 'Picassent',
  },
  {
    id: 'picassent-doc-13',
    title: 'Doc-13 Retiradas Efectivo BBVA 2008',
    href: encodeURI('/docs/picassent/Doc-13_Retiradas_Efectivo_BBVA_2008.pdf'),
    docType: 'extracto',
    caseLabel: 'Picassent',
  },
  {
    id: 'picassent-doc-15',
    title: 'Doc-15 Extracto Retirada Volvo',
    href: encodeURI('/docs/picassent/Doc-15_EXTRACTO_RETIRADA VOLVO.pdf'),
    docType: 'extracto',
    caseLabel: 'Picassent',
  },
  {
    id: 'picassent-doc-18',
    title: 'Doc-18 Depósito Subasta',
    href: encodeURI('/docs/picassent/Doc-18_Deposito_subasta.pdf'),
    docType: 'auto',
    caseLabel: 'Picassent',
  },
  {
    id: 'picassent-doc-26',
    title: 'Doc-26 Demostración gráfica manipulación',
    href: encodeURI('/docs/picassent/Doc-26_Demostracion_grafica_manipulacion.pdf'),
    docType: 'informe',
    caseLabel: 'Picassent',
  },
  {
    id: 'mislata-doc-02',
    title: 'Doc-02 Recurso Reposición',
    href: '/docs/mislata/Doc_02_RecursoReposicion.pdf',
    docType: 'escrito',
    caseLabel: 'Mislata',
  },
  {
    id: 'mislata-doc-03',
    title: 'Doc-03 Impugnación',
    href: '/docs/mislata/Doc_03_Impugancion.pdf',
    docType: 'escrito',
    caseLabel: 'Mislata',
  },
  {
    id: 'mislata-doc-04',
    title: 'Doc-04 Contestación Demanda',
    href: '/docs/mislata/Doc_04_ContestacionDemanda.pdf',
    docType: 'contestacion',
    caseLabel: 'Mislata',
  },
  {
    id: 'mislata-doc-06',
    title: 'Doc-06 Alegaciones Impugnación',
    href: '/docs/mislata/Doc_06_AlegacionesImpugancion.pdf',
    docType: 'escrito',
    caseLabel: 'Mislata',
  },
  {
    id: 'mislata-doc-07',
    title: 'Doc-07 Contraprueba',
    href: '/docs/mislata/Doc_07_ContrPrueba.pdf',
    docType: 'prueba',
    caseLabel: 'Mislata',
  },
  {
    id: 'mislata-doc-08',
    title: 'Doc-08 Solicitud Prueba',
    href: '/docs/mislata/Doc_08_SolPrueva.pdf',
    docType: 'prueba',
    caseLabel: 'Mislata',
  },
  {
    id: 'quart-doc-01',
    title: 'Doc-01 Sentencia Divorcio',
    href: '/docs/quart/Doc_01_SentenciaDivorcio.pdf',
    docType: 'sentencia',
    caseLabel: 'Quart',
  },
  {
    id: 'quart-doc-02',
    title: 'Doc-02 Demanda Ejecución',
    href: '/docs/quart/Doc_02_DemandaEjecucion.pdf',
    docType: 'demanda',
    caseLabel: 'Quart',
  },
  {
    id: 'quart-doc-03',
    title: 'Doc-03 Oposición Ejecución',
    href: '/docs/quart/Doc_03_OposicionEjecucion.pdf',
    docType: 'contestacion',
    caseLabel: 'Quart',
  },
  {
    id: 'quart-doc-04',
    title: 'Doc-04 Impugnación Oposición',
    href: '/docs/quart/Doc_04_ImpugnacionOposicion.pdf',
    docType: 'escrito',
    caseLabel: 'Quart',
  },
  {
    id: 'quart-interno',
    title: 'Impugnación oposición ejecución (interno)',
    href: QUART_INTERNAL_DOC,
    docType: 'escrito',
    caseLabel: 'Quart',
  },
];

const FOLDER_LINKS = [
  { id: 'folder-picassent', label: 'Picassent', href: '/docs/picassent/' },
  { id: 'folder-mislata', label: 'Mislata', href: '/docs/mislata/' },
  { id: 'folder-quart', label: 'Quart', href: '/docs/quart/' },
];

const DOC_TYPE_ICONS: Record<string, string> = {
  sentencia: '⚖️',
  demanda: '📜',
  contestacion: '🧾',
  escrito: '📝',
  prueba: '🧷',
  extracto: '🏦',
  informe: '📊',
  comunicacion: '✉️',
  auto: '🧷',
};

export function DocumentsPage() {
  const docsByCase = PDF_DOCUMENTS.reduce<Record<string, DocumentItem[]>>((acc, doc) => {
    if (!acc[doc.caseLabel]) acc[doc.caseLabel] = [];
    acc[doc.caseLabel].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Archivo</h1>
          <p className="text-sm text-slate-400">Evidencias y escritos</p>
        </div>
        <Link to="/documents/new" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500">
          + Subir
        </Link>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Carpetas</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {FOLDER_LINKS.map((folder) => (
            <a
              key={folder.id}
              href={folder.href}
              className="group"
              target="_blank"
              rel="noreferrer"
            >
              <Card className="flex aspect-square flex-col items-center justify-center gap-2 border border-slate-800 bg-slate-900/60 p-4 text-center transition hover:border-cyan-500/50 hover:bg-slate-900">
                <span className="text-2xl">📁</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  {folder.label}
                </span>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        {Object.entries(docsByCase).map(([caseLabel, docs]) => (
          <div key={caseLabel} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {caseLabel}
              </h2>
              <span className="text-xs text-slate-500">{docs.length} PDFs</span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {docs.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.href}
                  className="group"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Card className="flex aspect-square flex-col items-center justify-between gap-3 border border-slate-800 bg-slate-900/60 p-4 text-center transition hover:border-blue-500/60 hover:bg-slate-900">
                    <span className="text-2xl">
                      {DOC_TYPE_ICONS[doc.docType] ?? '📄'}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-slate-200 line-clamp-3 group-hover:text-blue-300">
                        {doc.title}
                      </h3>
                      <p className="text-[0.65rem] uppercase tracking-widest text-slate-500">
                        {doc.docType}
                      </p>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        ))}
        {PDF_DOCUMENTS.length === 0 && (
          <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Archivo vacío.
          </div>
        )}
      </section>
    </div>
  );
}
