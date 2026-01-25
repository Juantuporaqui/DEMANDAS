import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, PicassentPage, QuartPage, MislataPage, OtrosPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/picassent" element={<PicassentPage />} />
        <Route path="/quart" element={<QuartPage />} />
        <Route path="/mislata" element={<MislataPage />} />
        <Route path="/otros" element={<OtrosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
