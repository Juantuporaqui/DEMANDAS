// ============================================
// CASE OPS - Router Configuration
// ============================================

import { Navigate, createBrowserRouter } from 'react-router-dom';
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
import { CaseTimelinePage } from '../features/events/CaseTimelinePage';
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
import { PasivoPreferentePage } from '../features/analytics/pages/PasivoPreferentePage';
import { PruebaDigitalPage } from '../features/analytics/pages/PruebaDigitalPage';
import { InversionMercantilPage } from '../features/analytics/pages/InversionMercantilPage';
import { AntiSTS458Page } from '../features/analytics/pages/AntiSTS458Page';
import { ModoAudienciaPage } from '../features/audiencia/ModoAudienciaPage';
import { AudienciaPreviaPage } from '../features/audiencia/AudienciaPreviaPage';
import { AudienciaPreviaRedirect } from '../features/audiencia/AudienciaPreviaRedirect';
import { ModoTelepronter } from '../features/audiencia/ModoTelepronter';
import { ChecklistAudiencia } from '../features/audiencia/ChecklistAudiencia';
import { ToolsPage } from '../features/tools/ToolsPage';
import { IntegrityPage } from '../features/tools/IntegrityPage';
import { JurisprudenciaPage } from '../features/jurisprudencia/JurisprudenciaPage';
import { EvidenceComparePage } from '../features/evidence/EvidenceComparePage';
import { FairLiquidationPage } from '../features/finance/FairLiquidationPage';
import { AeatContradictionPage } from '../features/contradiction/AeatContradictionPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        {
          index: true,
          element: <CasesPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'dashboard',
          element: <CasesPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics',
          element: <AnalyticsDashboardPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics/admin',
          element: <AnalyticsAdminPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics/prescripcion',
          element: <PrescripcionPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics/liquidacion-justa',
          element: <FairLiquidationPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics/contradiccion-aeat',
          element: <AeatContradictionPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics/pasivo-preferente',
          element: <PasivoPreferentePage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics/prueba-digital',
          element: <PruebaDigitalPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics/inversion-mercantil',
          element: <InversionMercantilPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics/anti-sts-458-2025',
          element: <AntiSTS458Page />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics/hechos',
          element: <HechosPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'analytics/audiencia',
          element: <ModoAudienciaPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'audiencia-previa',
          element: <AudienciaPreviaRedirect />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'audiencia-previa-legacy',
          element: <AudienciaPreviaPage />,
          handle: { pageMode: 'prose' },
        },
        // Audiencia mejorada
        {
          path: 'audiencia/telepronter',
          element: <ModoTelepronter />,
          handle: { pageMode: 'full' },
        },
        {
          path: 'audiencia/checklist',
          element: <ChecklistAudiencia />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'tools',
          element: <ToolsPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'tools/prescripcion',
          element: <Navigate to="/analytics/prescripcion" replace />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'tools/comparador-evidencia',
          element: <EvidenceComparePage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'tools/integridad',
          element: <IntegrityPage />,
          handle: { pageMode: 'prose' },
        },
        // Jurisprudencia
        {
          path: 'jurisprudencia',
          element: <JurisprudenciaPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'analytics/:court',
          element: <CourtDashboard />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'search',
          element: <SearchPage />,
          handle: { pageMode: 'wide' },
        },
        // Cases
        {
          path: 'cases',
          element: <CasesPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'cases/:id',
          element: <CaseDetailPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'cases/:caseId/prescripcion',
          element: <CasePrescripcionPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'cases/:caseId/estrategias/excepcion-acumulacion',
          element: <ExcepcionAcumulacionPage />,
          handle: { pageMode: 'prose' },
        },
        // Documents
        {
          path: 'documents',
          element: <DocumentsPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'documents/new',
          element: <DocumentFormPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'documents/:id',
          element: <DocumentDetailPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'documents/:id/edit',
          element: <DocumentFormPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'documents/:id/view',
          element: <PdfViewerPage />,
          handle: { pageMode: 'full' },
        },
        // Facts
        {
          path: 'facts',
          element: <FactsPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'facts/new',
          element: <FactFormPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'facts/:id',
          element: <FactDetailPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'facts/:id/edit',
          element: <FactFormPage />,
          handle: { pageMode: 'prose' },
        },
        // Partidas
        {
          path: 'partidas',
          element: <PartidasPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'partidas/new',
          element: <PartidaFormPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'partidas/:id',
          element: <PartidaDetailPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'partidas/:id/edit',
          element: <PartidaFormPage />,
          handle: { pageMode: 'prose' },
        },
        // Events/Timeline
        {
          path: 'events',
          element: <CaseTimelinePage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'events/agenda',
          element: <EventsPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'events/new',
          element: <EventFormPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'events/:id/edit',
          element: <EventFormPage />,
          handle: { pageMode: 'prose' },
        },
        // War Room
        {
          path: 'warroom',
          element: <WarRoomPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'warroom/new',
          element: <StrategyFormPage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'warroom/:id/edit',
          element: <StrategyFormPage />,
          handle: { pageMode: 'prose' },
        },
        // Tasks
        {
          path: 'tasks',
          element: <TasksPage />,
          handle: { pageMode: 'wide' },
        },
        {
          path: 'tasks/new',
          element: <NewTaskPage />,
          handle: { pageMode: 'prose' },
        },
        // Backup
        {
          path: 'backup',
          element: <BackupPage />,
          handle: { pageMode: 'prose' },
        },
        // More & Settings
        {
          path: 'more',
          element: <MorePage />,
          handle: { pageMode: 'prose' },
        },
        {
          path: 'settings',
          element: <SettingsPage />,
          handle: { pageMode: 'prose' },
        },
      ],
    },
  ],
  {
    // Respeta el "base" de Vite (p.ej. /DEMANDAS/ en GitHub Pages)
    basename: import.meta.env.BASE_URL,
  }
);
