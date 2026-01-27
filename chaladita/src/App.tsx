import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, PicassentPage, QuartPage, MislataPage, OtrosPage } from './pages';
import NotFoundPage from './pages/NotFoundPage';
import DocumentosPage from './pages/DocumentosPage';
import JurisprudenciaPage from './pages/JurisprudenciaPage';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import { useEffect } from 'react';
import { useLitigationStore } from './store/litigationStore';
import { getSeedData } from './data/seedData';

function App() {
  const procedimientos = useLitigationStore((state) => state.procedimientos);
  const loadSeedData = useLitigationStore((state) => state.loadSeedData);

  // Cargar datos de ejemplo si el store está vacío
  useEffect(() => {
    if (procedimientos.length === 0) {
      loadSeedData(getSeedData());
    }
  }, [procedimientos.length, loadSeedData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/picassent" element={<PicassentPage />} />
        <Route path="/quart" element={<QuartPage />} />
        <Route path="/mislata" element={<MislataPage />} />
        <Route path="/otros" element={<OtrosPage />} />
        <Route path="/documentos" element={<DocumentosPage />} />
        <Route path="/jurisprudencia" element={<JurisprudenciaPage />} />
        {/* Ruta 404 - Captura todas las rutas no definidas */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* Prompt de actualización PWA */}
      <PWAUpdatePrompt />
    </BrowserRouter>
  );
}

export default App;
