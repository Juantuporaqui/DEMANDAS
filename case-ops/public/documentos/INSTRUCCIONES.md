# Documentos para /analytics/hechos

Esta carpeta está pensada para alojar los documentos citados en la vista **Hechos** de la app, para que cada referencia sea descargable.

## Cómo se construyen los enlaces
- Cuando en la UI aparece `Doc. 13`, el enlace apunta a:
  - `/documentos/doc-13.pdf`
- Es decir, el patrón esperado es:
  - `doc-<número>.pdf`

Si en algún caso una referencia no tiene número (p. ej. "Contrato notarial"), el sistema intentará buscar:
- `/documentos/contrato-notarial.pdf`

## Qué archivos subir
Sube aquí los documentos citados en los hechos reclamados, siguiendo el patrón:

| Referencia en la UI | Nombre de archivo esperado |
| --- | --- |
| Doc. 1 | `doc-1.pdf` |
| Doc. 2 | `doc-2.pdf` |
| Doc. 3 | `doc-3.pdf` |
| Doc. 4 | `doc-4.pdf` |
| Doc. 6 | `doc-6.pdf` |
| Doc. 11 | `doc-11.pdf` |
| Doc. 12 | `doc-12.pdf` |
| Doc. 13 | `doc-13.pdf` |
| Doc. 16 | `doc-16.pdf` |
| Doc. 17 | `doc-17.pdf` |
| Doc. 20 | `doc-20.pdf` |
| Doc. 22 | `doc-22.pdf` |
| Doc. 27 | `doc-27.pdf` |
| Doc. 28 | `doc-28.pdf` |
| Doc. 29 | `doc-29.pdf` |

## Formato recomendado
- PDF (`.pdf`), con nombres en minúsculas y guiones.
- Ejemplo: `doc-13.pdf`

## Sugerencia de flujo
1. Copia el PDF original con el nombre correcto.
2. Súbelo a esta carpeta (`case-ops/public/documentos/`).
3. Al abrir `/analytics/hechos`, cada chip de documento será descargable.
