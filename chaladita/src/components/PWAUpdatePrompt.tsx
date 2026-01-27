import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

// Este componente detecta actualizaciones del Service Worker y muestra un prompt
export default function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // Solo ejecutar si hay soporte para Service Workers
    if (!('serviceWorker' in navigator)) return;

    const handleUpdate = () => {
      navigator.serviceWorker.ready.then((registration) => {
        // Escuchar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // Nueva versión disponible
              setWaitingWorker(newWorker);
              setShowPrompt(true);
            }
          });
        });

        // Comprobar si ya hay un worker esperando
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowPrompt(true);
        }
      });
    };

    handleUpdate();

    // Escuchar mensajes de control del SW
    const handleControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Enviar mensaje al SW para que se active
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-fade-in">
      <div className="bg-blue-600 text-white rounded-xl shadow-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-blue-500 rounded-lg">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">Nueva version disponible</h4>
          <p className="text-sm text-blue-100 mt-1">
            Hay una actualizacion de la aplicacion. Actualiza para obtener las
            ultimas mejoras.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Actualizar ahora
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-400 transition-colors"
            >
              Mas tarde
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-blue-500 rounded transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
