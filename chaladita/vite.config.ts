import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Base path configurable via env:
  // - VITE_BASE_PATH="/" en Netlify
  // - VITE_BASE_PATH="/DEMANDAS/" en GitHub Pages
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt', // Cambiado a prompt para control manual de actualizaciones
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Chaladita.net - Soporte a Litigios',
        short_name: 'Chaladita',
        description: 'Sistema de soporte a litigios para defensa judicial',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        // Evita cachear indefinidamente durante desarrollo
        cleanupOutdatedCaches: true,
        // Limita las versiones antiguas del cache
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Navegación fallback para SPA
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // Desactivar SW en desarrollo para evitar problemas de cache
      },
    }),
  ],
  // Configuración de servidor para desarrollo
  server: {
    port: 5173,
    strictPort: false,
  },
  // Configuración de build
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
})
