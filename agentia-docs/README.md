# AGENTIA_PAOD Docs — portal unificado

Portal estático de documentación previa al desarrollo; estructura inspirada en la **navegación documental** de Nexor (sin copiar su contenido, código ni identidad gráfica).

## Ubicación y alcance
- Sitio: \`/agentia-docs/\` dentro de \`poyarzun09/agentes-rrss-site\`.
- No sustituye ni altera \`orchestrator-flow-manual/\` ni \`orchestrator-handbook-v2/\`.
- El portal carga el contenido integral de esas páginas en el mismo origen y normaliza sus enlaces a la navegación del portal.
- Se incorporan guías de lectura, cobertura por dominios, readiness antes de desarrollo, operaciones, registro y brechas.
- La búsqueda indexa bajo demanda encabezados y fichas de las páginas del Handbook; no instala servicios externos.

## Fuente de verdad y límites
Handbook V2 v4.0 = especificación documental preexistente. Hay fichas TO-BE, brechas contractuales y tests no demostrados. La afirmación antigua de "cierre documental PASS" no certifica implementación, producción ni el contrato normativo vigente.
La fuente de autoridad para decisiones sigue siendo PADRINO, MASTER GOVERNANCE, ADR y baseline real de AGENTIA_PAOD: ese cotejo requiere archivos locales y aprobación humana correspondiente.

## Pruebas sugeridas
1. Abrir \`/agentia-docs/?doc=inicio\`.
2. Navegar a \`?doc=flow#runtime\` y desde un nodo a su ficha.
3. Abrir \`?doc=runtime.html#entity-models\` desde el índice o el buscador.
4. Seguir enlaces de vuelta al flujo, navegación lateral y enlaces anterior/siguiente.
5. Buscar "llama-server", "PMO", "permission" usando ⌘K o Ctrl+K.
6. Probar desktop y mobile, consola sin excepciones y sin links rotos.
7. Verificar contra implementación local y fuentes vigentes antes de proclamar documentalmente VERIFIED.

## Rollback
Se agregan archivos en \`agentia-docs/\`; basta revertir el commit que los añadió. Los documentos previos no se modifican.

## Estado
IMPLEMENTED al existir el commit. No declarar VERIFIED del UI o CERTIFIED sin ejecutar E2E de navegador y verificar la cobertura normativa contra el baseline real.
