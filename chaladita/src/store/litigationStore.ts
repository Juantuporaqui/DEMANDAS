// Store central de Zustand para el sistema de litigio
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Procedimiento,
  EventoCronologia,
  Reclamacion,
  Hecho,
  Tarea,
  Estrategia,
  Documento,
  Jurisprudencia,
  ConfigUsuario,
  LitigationState,
  EstadisticasGlobales,
  BackupData,
} from '../types';

// Versión del schema para migraciones
const SCHEMA_VERSION = 1;

// Estado inicial
const initialState: LitigationState = {
  procedimientos: [],
  cronologia: [],
  reclamaciones: [],
  hechos: [],
  tareas: [],
  estrategias: [],
  documentos: [],
  jurisprudencia: [],
  config: {
    modoJuicio: false,
    temaOscuro: true,
    notificacionesActivas: true,
    ultimoBackup: undefined,
  },
  schemaVersion: SCHEMA_VERSION,
  lastUpdated: new Date().toISOString(),
};

// Helpers
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const now = () => new Date().toISOString();

// Interfaz del store con acciones
interface LitigationStore extends LitigationState {
  // ============================================
  // PROCEDIMIENTOS CRUD
  // ============================================
  addProcedimiento: (proc: Omit<Procedimiento, 'id'>) => string;
  updateProcedimiento: (id: string, updates: Partial<Procedimiento>) => void;
  deleteProcedimiento: (id: string) => void;
  getProcedimiento: (id: string) => Procedimiento | undefined;

  // ============================================
  // CRONOLOGÍA CRUD
  // ============================================
  addEvento: (evento: Omit<EventoCronologia, 'id'>) => string;
  updateEvento: (id: string, updates: Partial<EventoCronologia>) => void;
  deleteEvento: (id: string) => void;
  getEventosByProceso: (procesoId: string) => EventoCronologia[];

  // ============================================
  // RECLAMACIONES CRUD
  // ============================================
  addReclamacion: (rec: Omit<Reclamacion, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateReclamacion: (id: string, updates: Partial<Reclamacion>) => void;
  deleteReclamacion: (id: string) => void;
  getReclamacionesByProceso: (procesoId: string) => Reclamacion[];

  // ============================================
  // HECHOS CRUD
  // ============================================
  addHecho: (hecho: Omit<Hecho, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateHecho: (id: string, updates: Partial<Hecho>) => void;
  deleteHecho: (id: string) => void;
  getHechosByProceso: (procesoId: string) => Hecho[];

  // ============================================
  // TAREAS CRUD
  // ============================================
  addTarea: (tarea: Omit<Tarea, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTarea: (id: string, updates: Partial<Tarea>) => void;
  deleteTarea: (id: string) => void;
  completarTarea: (id: string) => void;
  getTareasByProceso: (procesoId: string) => Tarea[];
  getTareasPendientes: () => Tarea[];

  // ============================================
  // ESTRATEGIAS CRUD
  // ============================================
  addEstrategia: (est: Omit<Estrategia, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateEstrategia: (id: string, updates: Partial<Estrategia>) => void;
  deleteEstrategia: (id: string) => void;
  getEstrategiasByProceso: (procesoId: string) => Estrategia[];

  // ============================================
  // DOCUMENTOS CRUD
  // ============================================
  addDocumento: (doc: Omit<Documento, 'id' | 'fechaSubida'>) => string;
  updateDocumento: (id: string, updates: Partial<Documento>) => void;
  deleteDocumento: (id: string) => void;
  getDocumentosByProceso: (procesoId: string) => Documento[];
  getDocumentosByHecho: (hechoId: string) => Documento[];

  // ============================================
  // JURISPRUDENCIA CRUD
  // ============================================
  addJurisprudencia: (jur: Omit<Jurisprudencia, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateJurisprudencia: (id: string, updates: Partial<Jurisprudencia>) => void;
  deleteJurisprudencia: (id: string) => void;

  // ============================================
  // CONFIGURACIÓN
  // ============================================
  setModoJuicio: (activo: boolean) => void;
  toggleModoJuicio: () => void;
  updateConfig: (updates: Partial<ConfigUsuario>) => void;

  // ============================================
  // SELECTORES DERIVADOS
  // ============================================
  getEstadisticas: () => EstadisticasGlobales;
  getTotalReclamado: () => number;
  getTotalDiscutido: () => number;
  getTotalPrescrito: () => number;
  getProximosHitos: (dias: number) => EventoCronologia[];
  getHechosSinDocumentos: () => Hecho[];

  // ============================================
  // BACKUP / IMPORT
  // ============================================
  exportBackup: () => BackupData;
  importBackup: (backup: BackupData) => { success: boolean; error?: string };
  resetStore: () => void;

  // ============================================
  // SEED DATA
  // ============================================
  loadSeedData: (data: Partial<LitigationState>) => void;
}

export const useLitigationStore = create<LitigationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ============================================
      // PROCEDIMIENTOS CRUD
      // ============================================
      addProcedimiento: (proc) => {
        const id = generateId();
        set((state) => ({
          procedimientos: [...state.procedimientos, { ...proc, id }],
          lastUpdated: now(),
        }));
        return id;
      },

      updateProcedimiento: (id, updates) => {
        set((state) => ({
          procedimientos: state.procedimientos.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          lastUpdated: now(),
        }));
      },

      deleteProcedimiento: (id) => {
        set((state) => ({
          procedimientos: state.procedimientos.filter((p) => p.id !== id),
          // También eliminar datos relacionados
          cronologia: state.cronologia.filter((e) => e.procesoId !== id),
          reclamaciones: state.reclamaciones.filter((r) => r.procesoId !== id),
          hechos: state.hechos.filter((h) => h.procesoId !== id),
          tareas: state.tareas.filter((t) => t.procesoId !== id),
          estrategias: state.estrategias.filter((e) => e.procesoId !== id),
          lastUpdated: now(),
        }));
      },

      getProcedimiento: (id) => get().procedimientos.find((p) => p.id === id),

      // ============================================
      // CRONOLOGÍA CRUD
      // ============================================
      addEvento: (evento) => {
        const id = generateId();
        set((state) => ({
          cronologia: [...state.cronologia, { ...evento, id }],
          lastUpdated: now(),
        }));
        return id;
      },

      updateEvento: (id, updates) => {
        set((state) => ({
          cronologia: state.cronologia.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
          lastUpdated: now(),
        }));
      },

      deleteEvento: (id) => {
        set((state) => ({
          cronologia: state.cronologia.filter((e) => e.id !== id),
          lastUpdated: now(),
        }));
      },

      getEventosByProceso: (procesoId) =>
        get().cronologia.filter((e) => e.procesoId === procesoId),

      // ============================================
      // RECLAMACIONES CRUD
      // ============================================
      addReclamacion: (rec) => {
        const id = generateId();
        const timestamp = now();
        set((state) => ({
          reclamaciones: [
            ...state.reclamaciones,
            { ...rec, id, createdAt: timestamp, updatedAt: timestamp },
          ],
          lastUpdated: timestamp,
        }));
        return id;
      },

      updateReclamacion: (id, updates) => {
        set((state) => ({
          reclamaciones: state.reclamaciones.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: now() } : r
          ),
          lastUpdated: now(),
        }));
      },

      deleteReclamacion: (id) => {
        set((state) => ({
          reclamaciones: state.reclamaciones.filter((r) => r.id !== id),
          lastUpdated: now(),
        }));
      },

      getReclamacionesByProceso: (procesoId) =>
        get().reclamaciones.filter((r) => r.procesoId === procesoId),

      // ============================================
      // HECHOS CRUD
      // ============================================
      addHecho: (hecho) => {
        const id = generateId();
        const timestamp = now();
        set((state) => ({
          hechos: [
            ...state.hechos,
            { ...hecho, id, createdAt: timestamp, updatedAt: timestamp },
          ],
          lastUpdated: timestamp,
        }));
        return id;
      },

      updateHecho: (id, updates) => {
        set((state) => ({
          hechos: state.hechos.map((h) =>
            h.id === id ? { ...h, ...updates, updatedAt: now() } : h
          ),
          lastUpdated: now(),
        }));
      },

      deleteHecho: (id) => {
        set((state) => ({
          hechos: state.hechos.filter((h) => h.id !== id),
          lastUpdated: now(),
        }));
      },

      getHechosByProceso: (procesoId) =>
        get()
          .hechos.filter((h) => h.procesoId === procesoId)
          .sort((a, b) => a.orden - b.orden),

      // ============================================
      // TAREAS CRUD
      // ============================================
      addTarea: (tarea) => {
        const id = generateId();
        const timestamp = now();
        set((state) => ({
          tareas: [
            ...state.tareas,
            { ...tarea, id, createdAt: timestamp, updatedAt: timestamp },
          ],
          lastUpdated: timestamp,
        }));
        return id;
      },

      updateTarea: (id, updates) => {
        set((state) => ({
          tareas: state.tareas.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: now() } : t
          ),
          lastUpdated: now(),
        }));
      },

      deleteTarea: (id) => {
        set((state) => ({
          tareas: state.tareas.filter((t) => t.id !== id),
          lastUpdated: now(),
        }));
      },

      completarTarea: (id) => {
        set((state) => ({
          tareas: state.tareas.map((t) =>
            t.id === id
              ? { ...t, estado: 'completada', completadaAt: now(), updatedAt: now() }
              : t
          ),
          lastUpdated: now(),
        }));
      },

      getTareasByProceso: (procesoId) =>
        get().tareas.filter((t) => t.procesoId === procesoId),

      getTareasPendientes: () =>
        get().tareas.filter(
          (t) => t.estado === 'pendiente' || t.estado === 'en_progreso'
        ),

      // ============================================
      // ESTRATEGIAS CRUD
      // ============================================
      addEstrategia: (est) => {
        const id = generateId();
        const timestamp = now();
        set((state) => ({
          estrategias: [
            ...state.estrategias,
            { ...est, id, createdAt: timestamp, updatedAt: timestamp },
          ],
          lastUpdated: timestamp,
        }));
        return id;
      },

      updateEstrategia: (id, updates) => {
        set((state) => ({
          estrategias: state.estrategias.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: now() } : e
          ),
          lastUpdated: now(),
        }));
      },

      deleteEstrategia: (id) => {
        set((state) => ({
          estrategias: state.estrategias.filter((e) => e.id !== id),
          lastUpdated: now(),
        }));
      },

      getEstrategiasByProceso: (procesoId) =>
        get().estrategias.filter((e) => e.procesoId === procesoId),

      // ============================================
      // DOCUMENTOS CRUD
      // ============================================
      addDocumento: (doc) => {
        const id = generateId();
        set((state) => ({
          documentos: [...state.documentos, { ...doc, id, fechaSubida: now() }],
          lastUpdated: now(),
        }));
        return id;
      },

      updateDocumento: (id, updates) => {
        set((state) => ({
          documentos: state.documentos.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
          lastUpdated: now(),
        }));
      },

      deleteDocumento: (id) => {
        set((state) => ({
          documentos: state.documentos.filter((d) => d.id !== id),
          lastUpdated: now(),
        }));
      },

      getDocumentosByProceso: (procesoId) =>
        get().documentos.filter((d) => d.linkedTo.procesoId === procesoId),

      getDocumentosByHecho: (hechoId) =>
        get().documentos.filter((d) => d.linkedTo.hechoId === hechoId),

      // ============================================
      // JURISPRUDENCIA CRUD
      // ============================================
      addJurisprudencia: (jur) => {
        const id = generateId();
        const timestamp = now();
        set((state) => ({
          jurisprudencia: [
            ...state.jurisprudencia,
            { ...jur, id, createdAt: timestamp, updatedAt: timestamp },
          ],
          lastUpdated: timestamp,
        }));
        return id;
      },

      updateJurisprudencia: (id, updates) => {
        set((state) => ({
          jurisprudencia: state.jurisprudencia.map((j) =>
            j.id === id ? { ...j, ...updates, updatedAt: now() } : j
          ),
          lastUpdated: now(),
        }));
      },

      deleteJurisprudencia: (id) => {
        set((state) => ({
          jurisprudencia: state.jurisprudencia.filter((j) => j.id !== id),
          lastUpdated: now(),
        }));
      },

      // ============================================
      // CONFIGURACIÓN
      // ============================================
      setModoJuicio: (activo) => {
        set((state) => ({
          config: { ...state.config, modoJuicio: activo },
          lastUpdated: now(),
        }));
      },

      toggleModoJuicio: () => {
        set((state) => ({
          config: { ...state.config, modoJuicio: !state.config.modoJuicio },
          lastUpdated: now(),
        }));
      },

      updateConfig: (updates) => {
        set((state) => ({
          config: { ...state.config, ...updates },
          lastUpdated: now(),
        }));
      },

      // ============================================
      // SELECTORES DERIVADOS
      // ============================================
      getTotalReclamado: () => {
        const state = get();
        return state.reclamaciones
          .filter((r) => r.estado === 'activo' || r.estado === 'pendiente')
          .reduce((sum, r) => sum + r.importe, 0);
      },

      getTotalDiscutido: () => {
        const state = get();
        return state.reclamaciones
          .filter((r) => r.probabilidad === 'media' || r.probabilidad === 'baja')
          .reduce((sum, r) => sum + r.importe, 0);
      },

      getTotalPrescrito: () => {
        const state = get();
        return state.reclamaciones
          .filter((r) => r.estado === 'prescrito' || r.probabilidad === 'prescrito')
          .reduce((sum, r) => sum + r.importe, 0);
      },

      getProximosHitos: (dias) => {
        const state = get();
        const hoy = new Date();
        const limite = new Date();
        limite.setDate(hoy.getDate() + dias);

        return state.cronologia
          .filter((e) => {
            const fechaEvento = new Date(e.fecha);
            return !e.pasado && fechaEvento >= hoy && fechaEvento <= limite;
          })
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      },

      getHechosSinDocumentos: () => {
        const state = get();
        return state.hechos.filter(
          (h) => !h.documentosIds || h.documentosIds.length === 0
        );
      },

      getEstadisticas: () => {
        const state = get();
        const reclamacionesActivas = state.reclamaciones.filter(
          (r) => r.estado === 'activo' || r.estado === 'pendiente'
        );

        return {
          totalReclamado: reclamacionesActivas.reduce((sum, r) => sum + r.importe, 0),
          totalDiscutido: state.reclamaciones
            .filter((r) => r.probabilidad === 'media' || r.probabilidad === 'baja')
            .reduce((sum, r) => sum + r.importe, 0),
          totalPrescrito: state.reclamaciones
            .filter((r) => r.estado === 'prescrito' || r.probabilidad === 'prescrito')
            .reduce((sum, r) => sum + r.importe, 0),
          procedimientosActivos: state.procedimientos.filter(
            (p) => p.estado === 'activo'
          ).length,
          tareasPendientes: state.tareas.filter(
            (t) => t.estado === 'pendiente' || t.estado === 'en_progreso'
          ).length,
          hechosTotal: state.hechos.length,
          hechosSinDocumentos: state.hechos.filter(
            (h) => !h.documentosIds || h.documentosIds.length === 0
          ).length,
          estrategiasActivas: state.estrategias.filter(
            (e) => e.estado === 'activo'
          ).length,
          proximosHitos30Dias: state.cronologia
            .filter((e) => {
              const hoy = new Date();
              const limite = new Date();
              limite.setDate(hoy.getDate() + 30);
              const fechaEvento = new Date(e.fecha);
              return !e.pasado && fechaEvento >= hoy && fechaEvento <= limite;
            })
            .sort(
              (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
            ),
          reclamacionesPorProbabilidad: {
            alta: state.reclamaciones.filter((r) => r.probabilidad === 'alta').length,
            media: state.reclamaciones.filter((r) => r.probabilidad === 'media').length,
            baja: state.reclamaciones.filter((r) => r.probabilidad === 'baja').length,
            prescrito: state.reclamaciones.filter(
              (r) => r.probabilidad === 'prescrito'
            ).length,
            desestimado: state.reclamaciones.filter(
              (r) => r.probabilidad === 'desestimado'
            ).length,
          },
        };
      },

      // ============================================
      // BACKUP / IMPORT
      // ============================================
      exportBackup: () => {
        const state = get();
        const backup: BackupData = {
          version: '1.0.0',
          schemaVersion: state.schemaVersion,
          exportedAt: now(),
          data: {
            procedimientos: state.procedimientos,
            cronologia: state.cronologia,
            reclamaciones: state.reclamaciones,
            hechos: state.hechos,
            tareas: state.tareas,
            estrategias: state.estrategias,
            documentos: state.documentos,
            jurisprudencia: state.jurisprudencia,
            config: state.config,
            schemaVersion: state.schemaVersion,
            lastUpdated: state.lastUpdated,
          },
        };

        // Actualizar fecha de último backup
        set((s) => ({
          config: { ...s.config, ultimoBackup: now() },
        }));

        return backup;
      },

      importBackup: (backup) => {
        try {
          // Validación básica
          if (!backup.data || !backup.schemaVersion) {
            return { success: false, error: 'Formato de backup inválido' };
          }

          if (backup.schemaVersion > SCHEMA_VERSION) {
            return {
              success: false,
              error: `Versión de schema ${backup.schemaVersion} no soportada. Máximo: ${SCHEMA_VERSION}`,
            };
          }

          // Importar datos
          set({
            procedimientos: backup.data.procedimientos || [],
            cronologia: backup.data.cronologia || [],
            reclamaciones: backup.data.reclamaciones || [],
            hechos: backup.data.hechos || [],
            tareas: backup.data.tareas || [],
            estrategias: backup.data.estrategias || [],
            documentos: backup.data.documentos || [],
            jurisprudencia: backup.data.jurisprudencia || [],
            config: backup.data.config || initialState.config,
            schemaVersion: SCHEMA_VERSION,
            lastUpdated: now(),
          });

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
          };
        }
      },

      resetStore: () => {
        set({ ...initialState, lastUpdated: now() });
      },

      // ============================================
      // SEED DATA
      // ============================================
      loadSeedData: (data) => {
        set((state) => ({
          ...state,
          ...data,
          lastUpdated: now(),
        }));
      },
    }),
    {
      name: 'chaladita-litigation-store',
      storage: createJSONStorage(() => localStorage),
      version: SCHEMA_VERSION,
      partialize: (state) => ({
        procedimientos: state.procedimientos,
        cronologia: state.cronologia,
        reclamaciones: state.reclamaciones,
        hechos: state.hechos,
        tareas: state.tareas,
        estrategias: state.estrategias,
        documentos: state.documentos,
        jurisprudencia: state.jurisprudencia,
        config: state.config,
        schemaVersion: state.schemaVersion,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);

// Export selector hooks for convenience
export const useConfig = () => useLitigationStore((state) => state.config);
export const useModoJuicio = () => useLitigationStore((state) => state.config.modoJuicio);
export const useProcedimientos = () => useLitigationStore((state) => state.procedimientos);
export const useReclamaciones = () => useLitigationStore((state) => state.reclamaciones);
export const useHechos = () => useLitigationStore((state) => state.hechos);
export const useTareas = () => useLitigationStore((state) => state.tareas);
export const useEstrategias = () => useLitigationStore((state) => state.estrategias);
export const useDocumentos = () => useLitigationStore((state) => state.documentos);
export const useCronologia = () => useLitigationStore((state) => state.cronologia);
export const useJurisprudencia = () => useLitigationStore((state) => state.jurisprudencia);
