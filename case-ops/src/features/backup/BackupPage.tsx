// ============================================
// CASE OPS - Backup/Restore Page (FASE 7: Export/Import JSON)
// ============================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  exportToZip,
  importFromZip,
  downloadBlob,
  getExportFilename,
  type ExportProgress,
  type ImportProgress,
  type ImportResult,
} from '../../utils/zip';
import { formatDateTime } from '../../utils/dates';
import { formatBytes } from '../../utils/validators';
import {
  casesRepo,
  factsRepo,
  issuesRepo,
  documentsRepo,
  partidasRepo,
  eventsRepo,
  linksRepo,
  rulesRepo,
  scenarioModelsRepo,
  scenarioNodesRepo,
} from '../../db/repositories';

export function BackupPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportingJson, setExportingJson] = useState(false);
  const [importingJson, setImportingJson] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // FASE 7: Export JSON
  async function handleExportJson() {
    setExportingJson(true);
    try {
      const [cases, facts, issues, documents, partidas, events, links, rules, scenarioModels, scenarioNodes] =
        await Promise.all([
          casesRepo.getAll(),
          factsRepo.getAll(),
          issuesRepo.getAll(),
          documentsRepo.getAll(),
          partidasRepo.getAll(),
          eventsRepo.getAll(),
          linksRepo.getAll(),
          rulesRepo.getAll(),
          scenarioModelsRepo.getAll(),
          scenarioNodesRepo.getAll(),
        ]);

      const data = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        cases,
        facts,
        issues,
        documents: documents.map(d => ({ ...d, blob: undefined })), // Sin blobs
        partidas,
        events,
        links,
        rules,
        scenarioModels,
        scenarioNodes,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const filename = `case-ops-export-${new Date().toISOString().slice(0, 10)}.json`;
      downloadBlob(blob, filename);
      alert(`Exportado: ${filename}`);
    } catch (error) {
      console.error('Export JSON error:', error);
      alert('Error al exportar JSON: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setExportingJson(false);
    }
  }

  // FASE 7: Import JSON
  async function handleImportJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('Selecciona un archivo JSON');
      return;
    }

    const confirmed = confirm(
      `¿Importar datos desde "${file.name}"?\n\nLos registros existentes con el mismo ID serán actualizados.`
    );

    if (!confirmed) {
      if (jsonInputRef.current) jsonInputRef.current.value = '';
      return;
    }

    setImportingJson(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      let imported = {
        cases: 0,
        facts: 0,
        issues: 0,
        documents: 0,
        partidas: 0,
        events: 0,
        links: 0,
        rules: 0,
        scenarioModels: 0,
        scenarioNodes: 0,
      };

      // Importar casos
      if (data.cases) {
        for (const c of data.cases) {
          const existing = await casesRepo.getById(c.id);
          if (existing) {
            await casesRepo.update(c.id, c);
          } else {
            await casesRepo.create(c);
          }
          imported.cases++;
        }
      }

      // Importar hechos
      if (data.facts) {
        for (const f of data.facts) {
          const existing = await factsRepo.getById(f.id);
          if (existing) {
            await factsRepo.update(f.id, f);
          } else {
            await factsRepo.create(f);
          }
          imported.facts++;
        }
      }

      // Importar issues
      if (data.issues) {
        for (const issue of data.issues) {
          const existing = await issuesRepo.getById(issue.id);
          if (existing) {
            await issuesRepo.update(issue.id, issue);
          } else {
            await issuesRepo.create(issue);
          }
          imported.issues++;
        }
      }

      // Importar documentos (metadatos)
      if (data.documents) {
        for (const d of data.documents) {
          const existing = await documentsRepo.getById(d.id);
          if (existing) {
            await documentsRepo.update(d.id, d);
          } else {
            await documentsRepo.create(d);
          }
          imported.documents++;
        }
      }

      // Importar partidas
      if (data.partidas) {
        for (const p of data.partidas) {
          const existing = await partidasRepo.getById(p.id);
          if (existing) {
            await partidasRepo.update(p.id, p);
          } else {
            await partidasRepo.create(p);
          }
          imported.partidas++;
        }
      }

      // Importar eventos
      if (data.events) {
        for (const ev of data.events) {
          const existing = await eventsRepo.getById(ev.id);
          if (existing) {
            await eventsRepo.update(ev.id, ev);
          } else {
            await eventsRepo.create(ev);
          }
          imported.events++;
        }
      }

      // Importar links
      if (data.links) {
        for (const l of data.links) {
          const existing = await linksRepo.getById(l.id);
          if (!existing) {
            await linksRepo.create(l.fromType, l.fromId, l.toType, l.toId, l.meta?.role, l.meta?.comment);
          }
          imported.links++;
        }
      }

      // Importar rules
      if (data.rules) {
        for (const rule of data.rules) {
          const existing = await rulesRepo.getById(rule.id);
          if (existing) {
            await rulesRepo.update(rule.id, rule);
          } else {
            await rulesRepo.create(rule);
          }
          imported.rules++;
        }
      }

      // Importar scenario models
      if (data.scenarioModels) {
        for (const model of data.scenarioModels) {
          const existing = await scenarioModelsRepo.getById(model.id);
          if (existing) {
            await scenarioModelsRepo.update(model.id, model);
          } else {
            await scenarioModelsRepo.create(model);
          }
          imported.scenarioModels++;
        }
      }

      // Importar scenario nodes
      if (data.scenarioNodes) {
        for (const node of data.scenarioNodes) {
          const existing = await scenarioNodesRepo.getById(node.id);
          if (existing) {
            await scenarioNodesRepo.update(node.id, node);
          } else {
            await scenarioNodesRepo.create(node);
          }
          imported.scenarioNodes++;
        }
      }

      alert(
        `Importación completada:\n- Casos: ${imported.cases}\n- Hechos: ${imported.facts}\n- Issues: ${imported.issues}\n- Documentos: ${imported.documents}\n- Partidas: ${imported.partidas}\n- Eventos: ${imported.events}\n- Links: ${imported.links}\n- Reglas: ${imported.rules}\n- Modelos escenario: ${imported.scenarioModels}\n- Nodos escenario: ${imported.scenarioNodes}`
      );
    } catch (error) {
      console.error('Import JSON error:', error);
      alert('Error al importar JSON: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setImportingJson(false);
      if (jsonInputRef.current) jsonInputRef.current.value = '';
    }
  }

  async function handleExport() {
    setExporting(true);
    setExportProgress(null);

    try {
      const blob = await exportToZip((progress) => {
        setExportProgress(progress);
      });

      const filename = getExportFilename();
      downloadBlob(blob, filename);

      alert(`Backup exportado: ${filename}\nTamaño: ${formatBytes(blob.size)}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error al exportar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setExporting(false);
      setExportProgress(null);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      alert('Selecciona un archivo ZIP');
      return;
    }

    const confirmed = confirm(
      `¿Importar backup "${file.name}"?\n\nSe fusionarán los datos usando la estrategia "el más reciente gana".`
    );

    if (!confirmed) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setImporting(true);
    setImportProgress(null);
    setImportResult(null);

    try {
      const result = await importFromZip(file, (progress) => {
        setImportProgress(progress);
      });

      setImportResult(result);

      if (result.success) {
        alert('Importación completada correctamente');
      } else {
        alert(
          'Importación completada con errores:\n' + result.errors.join('\n')
        );
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Error al importar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setImporting(false);
      setImportProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1 }}>
          Backup / Restore
        </h1>
      </div>

      {/* Export Section */}
      <section className="section">
        <h2 className="section-title">Exportar</h2>
        <div className="card">
          <div className="card-body">
            <p className="mb-md">
              Exporta todos los datos y documentos PDF a un archivo ZIP.
            </p>

            {exportProgress && (
              <div className="mb-md">
                <div className="progress mb-sm">
                  <div
                    className="progress-bar"
                    style={{ width: `${exportProgress.current}%` }}
                  />
                </div>
                <p className="text-muted text-center" style={{ fontSize: '0.875rem' }}>
                  {exportProgress.message}
                </p>
              </div>
            )}

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20 }} />
                  Exportando...
                </>
              ) : (
                <>💾 Exportar backup ZIP</>
              )}
            </button>

            <p className="form-hint mt-md">
              El archivo incluye: db.json (datos), docs/ (PDFs), manifest.json
            </p>
          </div>
        </div>
      </section>

      {/* Import Section */}
      <section className="section">
        <h2 className="section-title">Importar</h2>
        <div className="card">
          <div className="card-body">
            <p className="mb-md">
              Importa datos desde un backup ZIP. Los registros se fusionan usando la
              estrategia "el más reciente gana" (last-write-wins).
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleImport}
              style={{ display: 'none' }}
            />

            {importProgress && (
              <div className="mb-md">
                <div className="progress mb-sm">
                  <div
                    className="progress-bar"
                    style={{ width: `${importProgress.current}%` }}
                  />
                </div>
                <p className="text-muted text-center" style={{ fontSize: '0.875rem' }}>
                  {importProgress.message}
                </p>
              </div>
            )}

            <button
              className="btn btn-secondary btn-block btn-lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
            >
              {importing ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20 }} />
                  Importando...
                </>
              ) : (
                <>📥 Seleccionar archivo ZIP</>
              )}
            </button>

            <div className="alert alert-warning mt-md">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <div className="alert-title">Estrategia de fusión</div>
                <div className="alert-description">
                  Si un registro existe en ambos sitios, se conserva el más reciente
                  según updatedAt. Los archivos PDF se deduiplican por hash SHA-256.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Import Result */}
      {importResult && (
        <section className="section">
          <h2 className="section-title">Resultado de importación</h2>
          <div className="card">
            <div className="card-body">
              <div
                className={`chip ${importResult.success ? 'chip-success' : 'chip-warning'} mb-md`}
              >
                {importResult.success ? 'Completado sin errores' : 'Completado con errores'}
              </div>

              <div className="grid grid-2 gap-sm">
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Casos
                  </p>
                  <p className="font-bold">{importResult.stats.casesImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Documentos
                  </p>
                  <p className="font-bold">{importResult.stats.documentsImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Archivos importados
                  </p>
                  <p className="font-bold">{importResult.stats.filesImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Archivos omitidos (ya existían)
                  </p>
                  <p className="font-bold">{importResult.stats.filesSkipped}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Spans
                  </p>
                  <p className="font-bold">{importResult.stats.spansImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Hechos
                  </p>
                  <p className="font-bold">{importResult.stats.factsImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Partidas
                  </p>
                  <p className="font-bold">{importResult.stats.partidasImported}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Enlaces
                  </p>
                  <p className="font-bold">{importResult.stats.linksImported}</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="mt-md">
                  <p className="text-danger font-bold mb-sm">Errores:</p>
                  {importResult.errors.map((error, i) => (
                    <p
                      key={i}
                      className="text-muted"
                      style={{ fontSize: '0.875rem' }}
                    >
                      • {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FASE 7: Export/Import JSON */}
      <section className="section">
        <h2 className="section-title">Export / Import JSON (Mantenimiento sin agentes)</h2>
        <div className="card">
          <div className="card-body">
            <p className="mb-md">
              Exporta o importa los datos en formato JSON para mantenimiento del sistema sin necesidad de agentes externos.
            </p>

            <div className="grid grid-2 gap-md">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleExportJson}
                disabled={exportingJson}
              >
                {exportingJson ? (
                  <>
                    <span className="spinner" style={{ width: 20, height: 20 }} />
                    Exportando...
                  </>
                ) : (
                  <>📤 Exportar JSON</>
                )}
              </button>

              <input
                ref={jsonInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJson}
                style={{ display: 'none' }}
              />
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => jsonInputRef.current?.click()}
                disabled={importingJson}
              >
                {importingJson ? (
                  <>
                    <span className="spinner" style={{ width: 20, height: 20 }} />
                    Importando...
                  </>
                ) : (
                  <>📥 Importar JSON</>
                )}
              </button>
            </div>

            <p className="form-hint mt-md">
              El archivo JSON incluye: cases, facts, documents (metadatos), partidas, events, links
            </p>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="section">
        <h2 className="section-title">Sincronización manual</h2>
        <div className="card">
          <div className="card-body">
            <ol style={{ paddingLeft: '1.25rem', lineHeight: 1.8 }}>
              <li>
                <strong>En el dispositivo origen:</strong> Exporta el backup ZIP
              </li>
              <li>
                <strong>Transfiere el archivo:</strong> Por cable USB, nube, email...
              </li>
              <li>
                <strong>En el dispositivo destino:</strong> Importa el archivo ZIP
              </li>
              <li>
                <strong>Repite en dirección contraria</strong> si ambos dispositivos tienen
                cambios
              </li>
            </ol>

            <div className="alert alert-info mt-md">
              <span className="alert-icon">💡</span>
              <div className="alert-content">
                <div className="alert-title">Tip</div>
                <div className="alert-description">
                  Los archivos PDF se deduiplican automáticamente. Si el mismo PDF existe
                  en ambos dispositivos (mismo hash SHA-256), no se duplicará.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
