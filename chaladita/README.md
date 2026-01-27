# Chaladita.net - Sistema de Apoyo a Litigio

Sistema PWA para gestionar procedimientos judiciales: hechos, reclamaciones, documentos, cronologia, tareas y estrategias de defensa.

## Desarrollo local

```bash
cd chaladita
npm install
npm run dev
```

La app se abre en http://localhost:5173

## Build local

```bash
npm run build
npm run preview
```

## Deploy

El deploy se realiza automaticamente via GitHub Actions cuando se hace push a la rama principal.

**URL de produccion:** https://juantuporaqui.github.io/DEMANDAS/

### Workflow

El archivo `.github/workflows/pages.yml` se encarga de:
1. Instalar dependencias
2. Build con `VITE_BASE_PATH=/DEMANDAS/`
3. Subir a GitHub Pages

## Limpiar cache (version vieja)

Si ves una version antigua tras un deploy, el Service Worker puede estar sirviendo cache viejo.

**Opcion 1 - Desde la app:**
Cuando hay actualizacion, aparece un banner "Nueva version disponible". Click en "Actualizar ahora".

**Opcion 2 - Manual en Chrome:**
1. Abre DevTools (F12)
2. Tab "Application" > "Service Workers"
3. Click "Unregister" en el SW activo
4. Recarga la pagina (Ctrl+Shift+R)

**Opcion 3 - Borrar todo:**
1. DevTools > Application > Storage
2. Click "Clear site data"
3. Recarga

## Estructura

```
chaladita/
├── src/
│   ├── components/   # Componentes reutilizables
│   ├── pages/        # Paginas (Home, Documentos, etc.)
│   ├── store/        # Zustand store con persistencia
│   ├── data/         # Datos estaticos y seed
│   └── types/        # TypeScript interfaces
├── public/           # Assets PWA
└── vite.config.ts    # Config Vite + PWA
```

## Funcionalidades

- Dashboard con estadisticas derivadas del store
- CRUD de procedimientos, hechos, reclamaciones, tareas
- Cronologia global editable
- Evidence Locker (subida y vinculacion de documentos)
- Jurisprudencia (sentencias y estrategias)
- Modo Juicio (alto contraste)
- Backup/Import JSON
- PWA instalable con actualizaciones
