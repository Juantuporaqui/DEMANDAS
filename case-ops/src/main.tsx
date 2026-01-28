import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as pdfjsLib from 'pdfjs-dist'
import './index.css'
import App from './App.tsx'

// Configura el worker solo si no hay una ruta previa definida.
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
