// ============================================
// CASE OPS - Analytics Entry (Chaladita scaffold)
// ============================================

import { Navigate, Route, Routes } from 'react-router-dom';
import { AnalyticsLayout } from './layout/AnalyticsLayout';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboard';
import { CourtDashboard } from './pages/CourtDashboard';
import { HechosPage } from './pages/HechosPage';
import { PrescripcionPage } from './pages/PrescripcionPage';

export function AnalyticsDashboard() {
  return (
    <AnalyticsLayout>
      <Routes>
        <Route index element={<AnalyticsDashboardPage />} />
        <Route
          path="picassent"
          element={<CourtDashboard courtId="picassent" />}
        />
        <Route path="quart" element={<CourtDashboard courtId="quart" />} />
        <Route path="mislata" element={<CourtDashboard courtId="mislata" />} />
        <Route path="prescripcion" element={<PrescripcionPage />} />
        <Route path="hechos" element={<HechosPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </AnalyticsLayout>
  );
}
