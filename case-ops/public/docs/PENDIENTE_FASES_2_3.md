# Pendientes – Fase 2 (Prescripción Timeline) y Fase 3 (Comparador evidencia)

## Estado actual
- Fase 2 y Fase 3 están implementadas y expuestas por rutas/menú.
- En producción se visualizan, pero están en modo “demo/estático” (especialmente la Fase 3).

---

## FASE 2 — Línea de tiempo de prescripción (Timeline)
### Qué hace (usuario)
Pantalla didáctica con eje temporal 2000–2025:
- Marca eventos clave (hechos/norma/umbral/demanda).
- Señala el umbral 07/10/2020 como “tramo crítico” (orientativo).
- Tooltip con art. 1964.2 CC y nota de prudencia.

### Pendiente (si se quiere cerrar del todo)
1) **Revisión de exactitud jurídica y wording**
   - Confirmar que la etiqueta de zona y el tooltip no afirman prescripción automática.
   - Mantener “orientativo; depende de interrupción/dies a quo”.

2) **UX móvil**
   - Verificar que tooltips funcionen con tap (no solo hover).
   - Si el timeline no cabe, scroll horizontal sin romper layout.

3) **Trazabilidad de números (si se amplía)**
   - (Opcional) Enlazar eventos a documentos/partidas reales cuando exista estructura de “fuente” por evento.
   - (Opcional) Mostrar “origen del evento” (Doc X / pág Y) si se dispone.

---

## FASE 3 — Comparador de evidencia (Slider)
### Qué hace (usuario)
Página con slider before/after para comparar:
- “Prueba actora (incompleta)” vs “Prueba real (certificada)”
- Hotspot con explicación (modal)
- Redactions (si se usan)

### Estado actual
- Funciona el slider y la UI, pero el contenido es DEMO (placeholders), no imágenes reales del caso.

### Pendiente (decisión de producto)
A) **Mantenerlo como demo (recomendado por simplicidad)**
- Mostrar un aviso: “Demo / pendiente de cargar evidencias reales”.
- No implementar carga, persistencia ni compartición.

B) **Hacerlo utilizable con evidencias reales (si se prioriza)**
- Implementar carga de 2 imágenes (actora/real).
- Definir estrategia de compartición:
  - Opción 1: assets fijos en repo (NO recomendado por privacidad).
  - Opción 2: “pack” import/export (archivo JSON con imágenes en base64) (sin backend).
  - Opción 3: backend (Firebase/Storage + login) (más complejo).

C) **Alineación pixel-perfect (solo si se usa con imágenes reales)**
- Controles offsetX/offsetY/scale para ajustar.
- Presets por caso/documento.

D) **Privacidad**
- Sistema de redacción (blur/mask) si hay IBAN/saldos u otros datos.

---

## Nota de prioridad
Estas fases son “wow” y didácticas, pero NO son core del producto.
Prioridad alta actual: buscador global, matriz Hecho→Prueba→Petición, modo sala/audiencia.
