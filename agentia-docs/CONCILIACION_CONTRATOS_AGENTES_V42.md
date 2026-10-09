# AGENTIA_PAOD — Conciliación de contratos de agentes (2026-10-09)

**Estado:** IMPLEMENTED en rama documental. No implica implementación de runtime ni certificación.
**Cambio:** solo contenido de tablas de fichas del Handbook V2; estilos, navegación, diagramas y estructura del portal sin modificaciones.

## Fuente y autoridad
- Copia de trabajo consultada: `AGENTIA_PAOD_v4.2-RC1_FASE2_V5_ADR_REVIEW_IN_PROGRESS.zip`, Library AGENTIA_PAOD/FASE2_P0_WORK.
- SHA-256 de la copia: `a01e86f035dd4f2ab0a8241ddbf97fbecaa940a2a5375a0fc06f219a141bce41`.
- Documento de catálogo: `04_AGENTES_Y_EQUIPOS/02_CATALOGO_AGENTES.md`.
- Fichas de agentes: `04_AGENTES_Y_EQUIPOS/AGENTES/TEAM_*/<AGENT_ID>.md`.
- Las fichas históricas que figuran en la copia v4.2-RC1 indican `BASELINE_CANDIDATE` y `NOT_IMPLEMENTED`. Estos datos son **diseño**, no evidencia de implementación ni autorización de producción.
- La autoridad de la copia no sustituye la ratificación normativa pendiente del baseline y decisiones vigentes.

## Resultado
| Página | Roles con ficha 1:1 | Roles conceptuales/agrupados | Campos revisados |
|---|---:|---:|---:|
| team-commercial.html | 8 | 0 | 104 |
| team-communications.html | 7 | 3 | 130 |
| team-content.html | 15 | 2 | 221 |
| team-cybersecurity.html | 11 | 0 | 143 |
| team-finance.html | 5 | 1 | 78 |
| team-qa-governance.html | 7 | 0 | 91 |
| team-secops.html | 14 | 0 | 182 |
| team-software.html | 12 | 0 | 148 |
| **TOTAL** | **79** | **6** | **1.097** |

De los 1.097 campos que anteriormente afirmaban “TBD — no definido específicamente en la baseline v4.0”:
- **1.019** se sustituyeron por valores/políticas documentados en las fichas de los 79 agentes correspondientes (identidad, prompt, activación, capacidades lógicas, permisos, memoria, contratos, gates, aprobaciones, riesgo, timeout, retry).
- **78** se sustituyeron por una explicación explícita sobre seis nodos sin una ficha de agente 1:1 en el catálogo actualizado. Esto es una **brecha real de modelo documental**, no un permiso para crear IDs o capacidades.
- Los valores tienen la ruta de archivo fuente en el atributo `title` de la celda.

## Seis nodos que requieren reconciliación arquitectónica (sin inventar valores)
- `cm-press`: agrupa a `COMMS_PRENSA` y `COMMS_MEDIA_RELATIONS` (dos agentes separados).
- `cm-journalist`: periodista/redactor del diagrama histórico, sin ficha normativa individual 1:1.
- `cm-stake`: relaciones con stakeholders, sin ficha normativa individual 1:1.
- `ct-audio`: agrupa a `CONTENT_AUDIO_PRODUCER` y `CONTENT_TTS_SPECIALIST`.
- `ct-perf`: análisis de rendimiento, sin ficha normativa individual 1:1.
- `fi-approval`: control de acciones reales, representado históricamente como nodo; no figura como agente autónomo.

## Restricciones preservadas
- `allowed_tools` muestra **capacidades lógicas** y el estado `NOT_MAPPED_UNTIL_IMPLEMENTATION`, sin fingir herramientas ejecutables.
- `timeout` no recibe valor numérico sin evidencia: `WORKFLOW_DEFINED_PRE_EXECUTION_AND_MEASURED_BEFORE_PROD`.
- Los permisos por defecto son `DENY_BY_DEFAULT` y las acciones críticas requieren aprobación humana.
- Estado de runtime: `NOT_IMPLEMENTED` según fichas normativas heredadas.

## Pendiente antes de declarar cierre documental integral
1. Resolver los seis nodos 1:N o conceptuales y registrar las decisiones arquitectónicas pertinentes.
2. Conciliar con los contratos implementados si existe una versión posterior del código/configuración.
3. Prueba visual/E2E del portal publicado; esta conciliación solo valida la sustitución documental y la preservación del diseño.
