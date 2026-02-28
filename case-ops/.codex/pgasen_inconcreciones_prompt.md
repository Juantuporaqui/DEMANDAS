# MEGAPROMPT PARA CODEX (v2) — PGASEN — Reaprovechar “🧠 Escenarios (Grafo)” y convertirlo en “Inconcreciones” sin perder el Laboratorio

## Decisión de arquitectura (fija)
NO vamos a crear una pestaña nueva. Vamos a **MODIFICAR la pestaña existente** (la que hoy es `escenarios` / “🧠 Escenarios (Grafo)”) para que:

- El **label** pase a: **“⚖️ Inconcreciones”**
- El **slug / query param** se mantiene: `?tab=escenarios` (NO romper enlaces ni lógica)
- Dentro del tab habrá **3 sub‑vistas internas**:
  1) **Inconcreciones** (DEFAULT)  ✅ objetivo principal
  2) **Estrategia** (la antigua capa táctica de TabEscenarios)
  3) **Laboratorio** (la antigua capa analítica AnalisisTecnico)

Así conservamos todo el trabajo ya hecho (teleprompter, matrices, grafo/scorecard/Monte Carlo) y añadimos tu módulo operativo de AP de manera “1 click” (al entrar ya está Inconcreciones).

---

## 0) Rol de Codex (obligatorio)
Eres un **ingeniero senior full‑stack** (React/TS) y tu misión es **re‑enfocar** la tab existente `escenarios` para que sea el “centro de mando” de AP, con prioridad **Inconcreciones**.

Reglas:
- NO inventes hechos; NO inventes jurisprudencia.
- Todo contenido debe salir del dataset local de este prompt.
- Si falta algo: mostrar **NO_CONSTA** (no lo rellenes).
- NO añadas dependencias nuevas.
- Mantén layout y patrón de componentes del proyecto `case-ops`.

---

## 1) Punto exacto de intervención (paths obligatorios)
Trabajas en este repo/estructura (NO lo ignores):
- `case-ops/src/features/cases/CaseDetailPage.tsx`  
  (define la tab y su label “🧠 Escenarios (Grafo)” y el render del tab)
- `case-ops/src/features/cases/tabs/TabEscenarios.tsx`  
  (UI principal: Estrategia/Laboratorio + bloque Picassent)
- `case-ops/src/features/cases/tabs/AnalisisTecnico.tsx`  
  (scorecard/grafo/montecarlo)
- `case-ops/src/data/picassent/escenarios.ts`  
  (escenarios editoriales)
- `case-ops/src/data/picassent/index.ts`  
  (matriz refutación + exports)
- `case-ops/src/data/escenarios/types.ts`

**Implementación requerida:**
- Crear: `case-ops/src/features/cases/tabs/TabInconcreciones.tsx` (nuevo)
- Crear: `case-ops/src/data/picassent/inconcreciones.ts` (dataset exportable)
- Modificar: `TabEscenarios.tsx` para añadir un selector interno de 3 vistas:
  - Inconcreciones (render TabInconcreciones)
  - Estrategia (la actual)
  - Laboratorio (la actual AnalisisTecnico)

Y en `CaseDetailPage.tsx`:
- Cambiar el **label** del tab `escenarios` a “⚖️ Inconcreciones”
- Mantener el `tabKey`/slug `escenarios`

---

## 2) Objetivo funcional (UX)
Al abrir el tab “⚖️ Inconcreciones”:
- Se ve inmediatamente la **Vista Rápida** (tabla principal) en modo compacto.
- En 1 click puedes saltar a:
  - Partidas (Hecho Cuarto)
  - Cronología
  - Guión AP
  - (y también) Estrategia / Laboratorio

Botones arriba (cabecera fija):
- **Modo AP (⏱)** → filtra P1 y muestra el guión 60s destacado
- **Imprimir** → print table compacta + guión 60s + peticiones
- **Copiar Guión 60s**
- **Reset filtros**

Persistencia: `localStorage` (`pgasen.inconcreciones.filters.v1`)

---

## 3) UI exigida — TabInconcreciones

### 3.1. Subtabs internos (dentro de TabInconcreciones)
- Vista Rápida (default)
- Partidas (Hecho Cuarto)
- Cronología
- Guión AP
- Normativa/Jurisprudencia

### 3.2. Vista Rápida — Tabla principal (de un vistazo)
Columnas (8):
1) ID
2) Severidad (P1/P2/P3)
3) Categoría
4) Tema
5) Qué está mal (1 línea)
6) Dónde (Demanda/Contestación + doc/segmento si consta)
7) Impacto en sala (1 línea)
8) Acción (ver detalle)

Funciones:
- sticky header
- search
- filtros: categoría, severidad, lado (Demanda/Contestación), tema
- orden: severidad desc, fecha si hay

Detalle (drawer/modal):
- descripción completa
- cita corta (<=25 palabras)
- fuente (docName + docNumbers si constan)
- “Qué pedir en AP”
- botón Copiar (1-liner + impacto + petición + cita)

### 3.3. Partidas (Hecho Cuarto)
Tabla 10 partidas (idx 1–10) con:
- concept, periodo, importe, problema principal, fuente, réplica 1 línea

### 3.4. Cronología
Doble carril:
- Orden lógico
- Orden narrativo (si lo construyes, si no: NO_CONSTA y solo muestras el lógico)

### 3.5. Guión AP
Bloques copiables:
- 60s
- 3–4 min
- completo
- Peticiones
- Protestas

---

## 4) Integración con datos “vivos” del caso (si existen)
`CaseDetailPage` ya pasa `facts`, `partidas`, `documents` a la tab.
En TabInconcreciones:
- intenta resolver `docName`/`docNumbers` a un `Document` real (si hay IDs o títulos coincidentes).
- Si no hay match: muestra “NO_CONSTA (no enlazable)”.
- NO intentes “adivinar” IDs.

---

## 5) Dataset “fuente de verdad”
Crear `case-ops/src/data/picassent/inconcreciones.ts` y exportar desde `case-ops/src/data/picassent/index.ts`:

Incluye exactamente estos exports:
- `PGASEN_ISSUES`
- `PGASEN_PARTIDAS`
- `PGASEN_TIMELINE_LOGICAL`
- `PGASEN_LAW_REFS`
- `PGASEN_AP_SCRIPTS`

### 5.1 Tipos (si TS)
(Usa los tipos del prompt v1; si ya existen equivalentes en el repo, adapta sin cambiar la semántica.)

### 5.2 Contenido
COPIA literal el dataset del prompt v1 (Issue/Partida/Timeline/Law/AP scripts).  
NO reescribas “con tus palabras”.

---

## 6) Pasos de implementación (obligatorios)
1) Localiza en `CaseDetailPage.tsx` la definición del tab `escenarios` y cambia el label a “⚖️ Inconcreciones”, manteniendo el key/slug.
2) Crea `inconcreciones.ts` en `src/data/picassent/` y exporta desde `src/data/picassent/index.ts`.
3) Crea `TabInconcreciones.tsx` en `src/features/cases/tabs/`.
4) En `TabEscenarios.tsx`:
   - añade un selector interno de 3 vistas:
     - “Inconcreciones” (default)
     - “Estrategia”
     - “Laboratorio”
   - renderiza:
     - Inconcreciones → `<TabInconcreciones {...props} />`
     - Estrategia → contenido existente
     - Laboratorio → `<AnalisisTecnico ... />` existente
5) Implementa Modo AP, Print, Copy.
6) Ajusta responsive (tabla → cards en móvil).
7) Accesibilidad básica (ARIA tabs, focus en drawer).
8) Smoke test manual: navegación, filtros, copiar, print.

---

## 7) Criterios de aceptación (QA)
- Al entrar en `?tab=escenarios` se ve “⚖️ Inconcreciones” y por defecto la tabla principal.
- Estrategia y Laboratorio siguen accesibles sin romper nada.
- No hay dependencias nuevas.
- Todo campo no soportado por dataset → “NO_CONSTA”.
- Copiar/Imprimir funcionan.

FIN DEL MEGAPROMPT v2.
