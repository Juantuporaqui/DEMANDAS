// ============================================
// CASE OPS - Router Configuration
// ============================================

import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

// Features
import { SearchPage } from '../features/search/SearchPage';
import { DocumentsPage } from '../features/documents/DocumentsPage';
import { DocumentDetailPage } from '../features/documents/DocumentDetailPage';
import { DocumentFormPage } from '../features/documents/DocumentFormPage';
import { PdfViewerPage } from '../features/pdfviewer/PdfViewerPage';
import { FactsPage } from '../features/facts/FactsPage';
import { FactDetailPage } from '../features/facts/FactDetailPage';
import { FactFormPage } from '../features/facts/FactFormPage';
import { PartidasPage } from '../features/partidas/PartidasPage';
import { PartidaDetailPage } from '../features/partidas/PartidaDetailPage';
import { PartidaFormPage } from '../features/partidas/PartidaFormPage';
import { EventsPage } from '../features/events/EventsPage';
import { EventFormPage } from '../features/events/EventFormPage';
import { WarRoomPage } from '../features/warroom/WarRoomPage';
import { StrategyFormPage } from '../features/warroom/StrategyFormPage';
import { TasksPage } from '../features/tasks/TasksPage';
import { NewTaskPage } from '../features/tasks/NewTaskPage';
import { BackupPage } from '../features/backup/BackupPage';
import { MorePage } from '../features/dashboard/MorePage';
import { SettingsPage } from '../features/dashboard/SettingsPage';
import { CasesPage } from '../features/cases/CasesPage';
import { CaseDetailPage } from '../features/cases/CaseDetailPage';
import { CasePrescripcionPage } from '../features/cases/CasePrescripcionPage';
import { AnalyticsDashboardPage } from '../features/analytics/pages/AnalyticsDashboard';
import { AnalyticsAdminPage } from '../features/analytics/pages/AnalyticsAdminPage';
import { CourtDashboard } from '../features/analytics/pages/CourtDashboard';
import { HechosPage } from '../features/analytics/pages/HechosPage';
import { PrescripcionPage } from '../features/analytics/pages/PrescripcionPage';
import { ExcepcionAcumulacionPage } from '../features/analytics/pages/ExcepcionAcumulacionPage';
import { ModoAudienciaPage } from '../features/audiencia/ModoAudienciaPage';
import { AudienciaPreviaPage } from '../features/audiencia/AudienciaPreviaPage';
import { ModoTelepronter } from '../features/audiencia/ModoTelepronter';
import { ChecklistAudiencia } from '../features/audiencia/ChecklistAudiencia';
import { ToolsPage } from '../features/tools/ToolsPage';
import { JurisprudenciaPage } from '../features/jurisprudencia/JurisprudenciaPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        {
          index: true,
          element: <CasesPage />,
        },
        {
          path: 'dashboard',
          element: <CasesPage />,
        },
        {
          path: 'analytics',
          element: <AnalyticsDashboardPage />,
        },
        {
          path: 'analytics/admin',
          element: <AnalyticsAdminPage />,
        },
        {
          path: 'analytics/prescripcion',
          element: <PrescripcionPage />,
        },
        {
          path: 'analytics/hechos',
          element: <HechosPage />,
        },
        {
          path: 'analytics/audiencia',
          element: <ModoAudienciaPage />,
        },
        {
          path: 'audiencia-previa',
          element: <AudienciaPreviaPage />,
        },
        // Audiencia mejorada
        {
          path: 'audiencia/telepronter',
          element: <ModoTelepronter />,
        },
        {
          path: 'audiencia/checklist',
          element: <ChecklistAudiencia />,
        },
        {
          path: 'tools',
          element: <ToolsPage />,
        },
        // Jurisprudencia
        {
          path: 'jurisprudencia',
          element: <JurisprudenciaPage />,
        },
        {
          path: 'analytics/:court',
          element: <CourtDashboard />,
        },
        {
          path: 'search',
          element: <SearchPage />,
        },
        // Cases
        {
          path: 'cases',
          element: <CasesPage />,
        },
        {
          path: 'cases/:id',
          element: <CaseDetailPage />,
        },
        {
          path: 'cases/:caseId/prescripcion',
          element: <CasePrescripcionPage />,
        },
        {
          path: 'cases/:caseId/estrategias/excepcion-acumulacion',
          element: <ExcepcionAcumulacionPage />,
        },
        // Documents
        {
          path: 'documents',
          element: <DocumentsPage />,
        },
        {
          path: 'documents/new',
          element: <DocumentFormPage />,
        },
        {
          path: 'documents/:id',
          element: <DocumentDetailPage />,
        },
        {
          path: 'documents/:id/edit',
          element: <DocumentFormPage />,
        },
        {
          path: 'documents/:id/view',
          element: <PdfViewerPage />,
        },
        // Facts
        {
          path: 'facts',
          element: <FactsPage />,
        },
        {
          path: 'facts/new',
          element: <FactFormPage />,
        },
        {
          path: 'facts/:id',
          element: <FactDetailPage />,
        },
        {
          path: 'facts/:id/edit',
          element: <FactFormPage />,
        },
        // Partidas
        {
          path: 'partidas',
          element: <PartidasPage />,
        },
        {
          path: 'partidas/new',
          element: <PartidaFormPage />,
        },
        {
          path: 'partidas/:id',
          element: <PartidaDetailPage />,
        },
        {
          path: 'partidas/:id/edit',
          element: <PartidaFormPage />,
        },
        // Events/Timeline
        {
          path: 'events',
          element: <EventsPage />,
        },
        {
          path: 'events/new',
          element: <EventFormPage />,
        },
        {
          path: 'events/:id/edit',
          element: <EventFormPage />,
        },
        // War Room
        {
          path: 'warroom',
          element: <WarRoomPage />,
        },
        {
          path: 'warroom/new',
          element: <StrategyFormPage />,
        },
        {
          path: 'warroom/:id/edit',
          element: <StrategyFormPage />,
        },
        // Tasks
        {
          path: 'tasks',
          element: <TasksPage />,
        },
        {
          path: 'tasks/new',
          element: <NewTaskPage />,
        },
        // Backup
        {
          path: 'backup',
          element: <BackupPage />,
        },
        // More & Settings
        {
          path: 'more',
          element: <MorePage />,
        },
        {
          path: 'settings',
          element: <SettingsPage />,
        },
      ],
    },
  ],
  {
    // Respeta el "base" de Vite (p.ej. /DEMANDAS/ en GitHub Pages)
    basename: import.meta.env.BASE_URL,
  }
);
