"use strict";
/* Portal de lectura: las especificaciones se cargan directamente del Handbook v2 del mismo repositorio.
   Nunca interpreta TO-BE como funcionalidad implementada. Sin dependencias ni telemetría. */
const HB = "../orchestrator-handbook-v2/";
const FLOW = "../orchestrator-flow-manual/index.html";
const GROUPS = [
{title:"Comenzar",items:[["inicio","Visión general"],["comenzar","Cómo usar la documentación"],["cobertura","Cobertura del sistema"],["preparacion","Antes de desarrollar"],["flow","Flujo completo e interactivo"]]},
{title:"Arquitectura y gobierno",items:[["architecture.html","Visión y arquitectura"],["core.html","Núcleo del Orchestrator"],["workflow-engine.html","Motor de workflows"],["permission-engine.html","Motor de permisos"],["context-manager.html","Gestión de contexto"],["path-resolver.html","Rutas y filesystem"],["governance.html","Políticas y gobierno"],["traceability.html","Trazabilidad"]]},
{title:"Organización multiagente",items:[["teams.html","Mapa de equipos"],["team-commercial.html","Área comercial"],["team-finance.html","Área financiera"],["team-content.html","Contenido y creatividad"],["team-communications.html","Comunicaciones"],["team-software.html","Desarrollo de software"],["team-cybersecurity.html","Ciberseguridad"],["team-secops.html","Operaciones de seguridad"],["team-qa-governance.html","QA y gobernanza"],["pmo.html","PMO y continuidad"]]},
{title:"Orquestación y ejecución",items:[["workflows.html","Coordinación y workflows"],["runtime.html","Runtime e IA local"],["memory.html","Memoria y conocimiento"],["registry.html","Catálogo y registro"]]},
{title:"Construcción, configuración y API",items:[["implementation.html","Plan de construcción"],["backend-developer.html","Desarrollo backend"],["deployment.html","Entornos y despliegue"],["operacion","Operación y configuración"]]},
{title:"Infraestructura y protección",items:[["storage.html","Almacenamiento por niveles"],["cybersecurity.html","Seguridad y permisos"],["secops.html","SecOps del Mac Studio"]]},
{title:"QA, auditoría y liberación",items:[["quality.html","Pruebas y calidad"],["audit-final.html","Auditoría documental"],["vacios","Brechas y requisitos por cerrar"]]},
{title:"Índice de referencia",items:[["catalogo-v42.html","Catálogo normativo v4.2: 93 agentes y 27 interfaces"],["index.html","Handbook V2 — Índice original"],["registro","Registro y navegación"]]}
];
const VIRTUAL = new Set(["inicio","comenzar","cobertura","preparacion","operacion","vacios","registro"]);
const ALL = GROUPS.flatMap(g=>g.items.map(a=>({id:a[0],label:a[1],group:g.title})));
const DOC_IDS=new Set(ALL.map(x=>x.id));
const state={current:null,token:0,contentCache:new Map(),searchData:[],indexed:false,indexing:false};
const $=s=>document.querySelector(s);
function safe(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function href(id,hash){return "?doc="+encodeURIComponent(id)+(hash?"#"+encodeURIComponent(hash):"");}
function localLink(id,label,detail){return '<a class="doc-card" href="'+href(id)+'"><span class="eyebrow">'+safe(detail||"DOCUMENTACIÓN")+'</span><h3>'+safe(label)+'</h3><p>Consultar especificación, relaciones, dependencias y brechas explícitas →</p></a>';}
function getId(){const p=new URLSearchParams(location.search).get("doc")||"inicio";return DOC_IDS.has(p)?p:"inicio";}
function navHTML(){return GROUPS.map(g=>'<section class="nav-group"><div class="nav-label">'+safe(g.title)+'</div>'+g.items.map(([id,title])=>'<a class="nav-item" data-doc="'+safe(id)+'" href="'+href(id)+'">'+safe(title)+'</a>').join("")+'</section>').join("");}
function setActive(id){document.querySelectorAll(".nav-item").forEach(a=>{const yes=a.dataset.doc===id;a.classList.toggle("active",yes);if(yes)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});}
function hero(tag,title,description){return '<section class="hero"><div class="eyebrow">'+safe(tag)+'</div><h1>'+safe(title)+'</h1><p class="lead">'+safe(description)+'</p><div class="statusline"><span class="tag warn">Documento del diseño ≠ implementación verificada</span><span class="tag soft">Repositorio: agentes-rrss-site</span></div></section>';}
const ROWS=[
["Entrada y experiencia de usuario","architecture.html","Intención, autorización, solicitudes y retorno del resultado"],
["Orquestador y decisiones","core.html","Task Manager, Planner, Registry, Scheduler, políticas"],
["Contratos y workflows","workflow-engine.html","Estados, idempotencia, fallos, aprobaciones"],
["Estructura empresarial y agentes","teams.html","Responsables, equipos, delegación, especialistas"],
["PMO y continuidad","pmo.html","Coordinación, seguimiento y escalamiento"],
["Ejecución e IA local","runtime.html","Modelos, gateway, tool gateway, structured output"],
["Memoria y contexto","memory.html","Conocimiento, aislamiento, contexto, lifecycle"],
["Seguridad y permisos","cybersecurity.html","Autenticación, IAM, least privilege, límites"],
["Sistema operativo y SecOps","secops.html","Mac Studio, operaciones, procesos, observabilidad"],
["Almacenamiento y datos","storage.html","TIER-0/TIER-1, identidad, capacidad, recuperación"],
["Despliegue e instalación","deployment.html","DEV/TEST/PROD, servicios, configuración"],
["Construcción y API","implementation.html","Secuencia de desarrollo y dependencias"],
["Calidad y auditoría","quality.html","Tests, evidencia y release gates"],
["Registro y trazabilidad","traceability.html","Requisito a prueba y estado"]
];
function overview(){return hero("Propuesta del proyecto","AGENTIA_PAOD: una empresa multiagente, gobernada desde una sola interfaz","Diseño de una plataforma empresarial local de inteligencia artificial en la que una persona dirige, solicita y supervisa trabajos mientras el Orchestrator coordina departamentos, equipos y agentes especializados.")+
'<h2 id="propuesta">La propuesta</h2>'+
'<p>AGENTIA_PAOD nace de una idea: <strong>construir una empresa digital operada parcialmente por agentes de inteligencia artificial</strong>, organizada con una estructura de dirección, departamentos, equipos y especialistas. El usuario actúa como Dirección General: expresa necesidades y objetivos en lenguaje natural, revisa propuestas, toma decisiones y conserva la autoridad sobre las acciones críticas.</p>'+
'<p>El propósito no es disponer de un simple chatbot ni de una colección aislada de asistentes. Es crear una <strong>plataforma de trabajo coordinado</strong> capaz de transformar una solicitud empresarial en un proceso planificado, asignado, ejecutado, revisado y documentado, con responsabilidades claras y resultados verificables.</p>'+
'<h2 id="vision">Visión y valor esperado</h2>'+
'<p>El sistema se proyecta con <strong>operación local y modelos de IA locales como base</strong>, inicialmente sobre un Mac Studio, para favorecer privacidad, control de los datos y menor dependencia estructural de servicios de IA pagados. Busca automatizar tareas, reutilizar conocimiento, estandarizar procesos, reducir trabajo repetitivo y mejorar la trazabilidad de las decisiones y entregables.</p>'+
'<p>La plataforma no está limitada a redes sociales: su alcance abarca <strong>desarrollo de software, gestión comercial, comunicaciones, contenido multimedia, finanzas, gobierno y PMO, calidad, ciberseguridad y operaciones SecOps</strong>. Estos dominios forman parte de una arquitectura empresarial común; su despliegue funcional se realizará por etapas.</p>'+
'<h2 id="modelo-empresa">Cómo se organiza la empresa agéntica</h2>'+
'<div class="card-grid">'+
'<div class="doc-card"><span class="eyebrow">DIRECCIÓN GENERAL</span><h3>El usuario mantiene el control</h3><p>Solicita informes, proyectos, estrategias o desarrollos; consulta su estado; aprueba, rechaza o redefine el trabajo cuando corresponde.</p></div>'+
'<div class="doc-card"><span class="eyebrow">ORCHESTRATOR CENTRAL</span><h3>Interpreta y distribuye</h3><p>Conserva la intención de la solicitud, clasifica capacidades, consulta políticas y determina el equipo principal y los apoyos necesarios.</p></div>'+
'<div class="doc-card"><span class="eyebrow">DEPARTAMENTOS Y ESPECIALISTAS</span><h3>Ejecutan según su función</h3><p>Gerentes, equipos y roles especializados participan mediante tareas, contratos, herramientas permitidas y responsabilidades definidas.</p></div>'+
'<div class="doc-card"><span class="eyebrow">GOBIERNO TRANSVERSAL</span><h3>Coordina, verifica y protege</h3><p>PMO interviene cuando la política exige gestión sostenida; QA verifica; permisos, seguridad y aprobación humana controlan las acciones.</p></div></div>'+
'<h2 id="funcionamiento">Cómo funcionará una solicitud</h2>'+
'<ol class="guide-list"><li><strong>Solicitud:</strong> el usuario explica qué necesita desde la interfaz, sin seleccionar manualmente cada agente.</li>'+
'<li><strong>Comprensión y clasificación:</strong> el Orchestrator identifica objetivo, restricciones, capacidades requeridas y datos faltantes; solicita aclaraciones cuando sea necesario.</li>'+
'<li><strong>Enrutamiento dinámico:</strong> asigna un equipo <code>PRIMARY</code>, apoyos <code>SUPPORTING</code> y participaciones <code>CONDITIONAL</code> según capacidades y políticas, no por reglas rígidas basadas solo en palabras clave.</li>'+
'<li><strong>Planificación y ejecución:</strong> organiza workflows y tareas; activa únicamente los agentes y herramientas autorizados para el trabajo.</li>'+
'<li><strong>Supervisión:</strong> aplica QA, seguridad y aprobaciones. La PMO se activa de forma condicional cuando corresponde el modo <code>PMO_MANAGED</code>, no necesariamente para toda solicitud.</li>'+
'<li><strong>Entrega y continuidad:</strong> devuelve resultados, evidencias, estado, riesgos y próximos pasos; conserva trazabilidad para revisiones posteriores.</li></ol>'+
'<div class="callout"><strong>Ejemplo:</strong> «Necesito un informe de las ventas del mes». El Orchestrator debe identificar las capacidades comerciales necesarias, activar el área responsable y los apoyos pertinentes, comprobar si hay datos autorizados, y entregar un informe verificable o indicar qué información falta. La solicitud puede coordinar varios especialistas sin exigir al usuario conocer su estructura interna.</div>'+
'<h2 id="alcance">Alcance del proyecto</h2>'+
'<p><strong>Incluye en su arquitectura objetivo:</strong> Orchestrator y su interfaz, equipos y agentes configurables, planificación y workflows, PMO, permisos y aprobación humana, QA, memoria y conocimiento, herramientas, observabilidad, almacenamiento por niveles, seguridad, backups y recuperación, y entornos locales DEV/TEST/PROD.</p>'+
'<p><strong>No implica autonomía ilimitada:</strong> decisiones financieras reales, firma de contratos, operaciones destructivas, elevación de privilegios y cambios críticos siguen sujetos a aprobación humana. Un despliegue VPS, alta disponibilidad multi-host e infraestructura LAN/WAN ampliada permanecen fuera del MVP inicial.</p>'+
'<h2 id="desarrollo">De la propuesta a la implementación</h2>'+
'<p>AGENTIA_PAOD es una <strong>arquitectura empresarial objetivo en preparación para desarrollo progresivo</strong>. El diseño organizacional v4.2-RC1 contempla nueve equipos y 93 fichas normativas de agentes. Esto describe responsabilidades de diseño, <strong>no 93 procesos autónomos ya funcionando</strong>. El desarrollo comenzará por las fundaciones y flujos demostrables y se ampliará sin perder la visión integral del sistema.</p>'+
'<div class="callout warn"><strong>Estado actual:</strong> el Handbook documenta arquitectura y contratos, pero quedan decisiones y brechas de la auditoría V5. El runtime integral no está certificado como implementado. Esta página presenta la propuesta documentada y su alcance objetivo, no un producto en producción.</div>'+
'<h2 id="explorar">Explorar la documentación técnica</h2><div class="card-grid">'+[
["flow","Mapa interactivo del funcionamiento","FLUJO MAESTRO"],
["teams.html","Organización, equipos y agentes","ESTRUCTURA EMPRESARIAL"],
["core.html","Núcleo del Orchestrator","ARQUITECTURA"],
["runtime.html","Modelos y ejecución local","IA Y RUNTIME"],
["cobertura","Alcance y cobertura del sistema","ÍNDICE MAESTRO"],
["preparacion","Preparación para el desarrollo","DESARROLLO CONTROLADO"]].map(i=>localLink(i[0],i[1],i[2])).join("")+'</div>'+
'<h2 id="referencias">Base documental de la propuesta</h2>'+
'<p>Introducción derivada de las definiciones de <code>01_NEGOCIO_Y_ALCANCE/01_BUSINESS_CASE.md</code>, <code>02_ALCANCE_Y_EXCLUSIONES.md</code>, <code>00_GOBIERNO_Y_MAESTROS/01_MASTER_PLAN.md</code>, <code>03_ARQUITECTURA/01_ARQUITECTURA_EMPRESARIAL.md</code> y <code>49_DYNAMIC_ORGANIZATIONAL_ORCHESTRATION/</code> de la copia documental v4.2-RC1. Consulta el <a href="../orchestrator-handbook-v2/catalogo-v42.html">catálogo normativo v4.2</a> y el <a href="'+href("flow")+'">diagrama interactivo</a> para el detalle técnico.</p>';
}
function gettingStarted(){return hero("Guía de lectura","Cómo utilizar AGENTIA_PAOD Docs","Navega por el sistema desde una petición de negocio hasta cada parámetro técnico, identificando qué está definido, qué no y qué evidencia exige.")+
'<h2 id="pasos">Secuencia recomendada</h2><ol class="guide-list"><li>Revisa la <a href="'+href("architecture.html")+'">visión y arquitectura</a> para conocer los límites del sistema.</li><li>Sigue el <a href="'+href("flow")+'">diagrama interactivo</a>: los nodos abren fichas del componente.</li><li>Consulta <a href="'+href("teams.html")+'">áreas y equipos</a> para comprender delegación, ownership y responsabilidades.</li><li>En cada ficha revisa relaciones, contratos, configuración, estados, seguridad, pruebas y fuentes primarias.</li><li>Completa las brechas en <a href="'+href("vacios")+'">requisitos por cerrar</a> antes de generar código.</li><li>Utiliza la <a href="'+href("preparacion")+'">matriz de preparación</a> para gobernar el inicio del desarrollo.</li></ol>'+
'<h2 id="busqueda">Búsqueda global</h2><p>Pulsa <kbd>⌘ K</kbd> (o Ctrl+K). Se buscan primero los títulos y, al solicitar la búsqueda, se indexan bajo demanda las secciones de las páginas originales.</p>'+
'<h2 id="reglas">Convenciones de evidencia</h2><table class="check-table"><thead><tr><th>Etiqueta</th><th>Interpretación</th></tr></thead><tbody><tr><td>TO-BE / diseño</td><td>Especificación de comportamiento esperado; no prueba de funcionalidad.</td></tr><tr><td>IMPLEMENTED</td><td>Existe implementación identificable; falta verificar su funcionamiento si no hay evidencia.</td></tr><tr><td>VERIFIED</td><td>Validado con pruebas y evidencias concretas.</td></tr><tr><td>CERTIFIED</td><td>Gates aplicables superados sin pendientes críticos conocidos.</td></tr><tr><td>GAP / pendiente</td><td>Contrato, decisión, test o dato no demostrado. Nunca completar por conjetura.</td></tr></tbody></table>'+
'<div class="callout warn">Este sitio publica el diseño y la navegación técnica; antes de iniciar el desarrollo debe contrastarse con PADRINO, MASTER GOVERNANCE, ADR y baseline vigente fuera de este sitio.</div>';
}
function coverage(){return hero("Inventario del sistema","Cobertura documental por dominio","Los dominios están enlazados a las especificaciones existentes. Su existencia en la navegación no acredita exhaustividad técnica ni implementación.")+
'<h2 id="matriz">Matriz de dominios</h2><table class="check-table"><thead><tr><th>Dominio</th><th>Fuente principal</th><th>Cobertura requerida</th></tr></thead><tbody>'+ROWS.map(r=>'<tr><td>'+safe(r[0])+'</td><td><a href="'+href(r[1])+'">'+safe(r[1])+'</a></td><td>'+safe(r[2])+'</td></tr>').join("")+'</tbody></table>'+
'<h2 id="equipos">Especialidades y departamentos</h2><div class="card-grid">'+GROUPS.find(x=>x.title==="Organización multiagente").items.map(a=>localLink(a[0],a[1],"EQUIPO / ROL")).join("")+'</div>'+
'<h2 id="limitaciones">Límite de esta cobertura</h2><p>El Handbook V2 anuncia 367 entidades; el inventario, el origen de cada requisito y su completitud deben auditarse contra las fuentes actuales. Las páginas que declaran gaps o TO-BE no deben tratarse como cerradas.</p>';
}
function readiness(){const steps=[
["01. Baseline y autoridad","Identificar versión normativa, índice, manifiesto, ADR vigentes y descartar copias históricas","governance.html"],
["02. Requisitos y alcance","RF/RNF, casos de uso, interfaces, límites, criterios de aceptación y exclusions","architecture.html"],
["03. Estructura de organización","Roles de gerente general, managers, equipos y especialistas, activación y PMO","teams.html"],
["04. Arquitectura y contratos","Componentes, contratos I/O, errores, idempotencia, lifecycle y ownership","core.html"],
["05. Gobernanza y aprobación","Políticas, gates, human-in-the-loop, autoridad y rollback","permission-engine.html"],
["06. Runtime y herramientas","Modelos, contexto, herramientas y autorizaciones de los agentes","runtime.html"],
["07. Datos y persistencia","Clasificación, retención, storage, recuperación y seguridad","storage.html"],
["08. Operabilidad","Startup/shutdown, puertos, variables, health, logs, fallos y recuperación","deployment.html"],
["09. Pruebas y evidencias","Unit/contract/integration/E2E/security/recovery, criterios PASS y responsables","quality.html"],
["10. Construcción y release","Orden de entrega, CI/CD, cambios controlados, compatibilidad y certificación","implementation.html"]];
return hero("Pre-development gate","Qué debe estar listo antes de escribir código","Esta página es un checklist de preparación. Define el trabajo documental pendiente; no declara que los requisitos estén resueltos.")+
'<div class="callout warn"><strong>Estado de preparación:</strong> NO CERTIFICADO. La existencia del Handbook y del flujo no demuestra contratos cerrados, endpoints operativos ni gates superados.</div>'+
'<h2 id="checklist">Matriz de cierre de especificaciones</h2><table class="check-table"><thead><tr><th>Área</th><th>Qué debe documentarse y aprobarse</th><th>Referencia</th></tr></thead><tbody>'+steps.map(r=>'<tr><td><strong>'+safe(r[0])+'</strong></td><td>'+safe(r[1])+'</td><td><a href="'+href(r[2])+'">Ver ficha →</a></td></tr>').join("")+'</tbody></table>'+
'<h2 id="evidencia">Contrato mínimo de una ficha implementable</h2><ol class="guide-list"><li>ID único, definición, propietario funcional y técnico.</li><li>Requisito, decisión y límites del componente.</li><li>Entradas, salidas, contratos/versiones, errores, timeouts, reintentos e idempotencia.</li><li>Autenticación, autorización, mínimos privilegios y exposición de datos.</li><li>Configuración detallada: variables, defaults, validaciones, reinicios y rollback.</li><li>Dependencias, modelo de estados, recuperación, logs y health check.</li><li>Pruebas, resultado obtenido, evidencia rastreable, pendientes y estado.</li></ol>'+
'<h2 id="criterio">Criterio de avance</h2><p>No iniciar una implementación que dependa de contratos críticos indefinidos. Toda brecha se marca y asigna a una decisión o especificación con responsable y evidencia. El usuario conserva las aprobaciones críticas.</p>';
}
function operations(){return hero("Operación del sistema","Configuración, despliegue y diagnóstico","La documentación operacional debe ser reproducible en el Mac Studio y distinguir entornos, servicios reales y diseño futuro.")+
'<h2 id="runbook">Runbook mínimo por servicio</h2><ol class="guide-list"><li>Precondiciones: macOS, arquitectura, runtime, dependencias y rutas verdaderas.</li><li>Inventario de servicios: nombres, puertos, usuario de ejecución, dependencias y responsables.</li><li>Comandos exactos de arranque, verificación de readiness, parada y reinicio.</li><li>Logs, métricas, error handling, observabilidad y correlation ID.</li><li>Protección de configuraciones, secretos, permisos, backup y restore.</li><li>Operación en modo degradado, rollback, escenarios de falla y criterios de recuperación.</li></ol>'+
'<div class="callout warn">No hay un comando de arranque de la interfaz verificado en las fuentes del portal. Debe localizarse y validarse en la implementación local antes de publicarlo como runbook operativo.</div>'+
'<h2 id="capas">Documentación relacionada</h2><div class="card-grid">'+[["deployment.html","Entornos y despliegue"],["runtime.html","Runtime e IA local"],["storage.html","Storage TIER-0/TIER-1"],["secops.html","Seguridad operacional del Mac"],["quality.html","Control de calidad"],["implementation.html","Plan de construcción"]].map(r=>localLink(r[0],r[1],"RUNBOOK / DEPENDENCIA")).join("")+'</div>';
}
function gaps(){return hero("Registro de brechas","Definiciones faltantes antes del desarrollo","Una ficha incompleta permanece visible como GAP. La documentación no se completa por invención ni se presenta como operativa sin pruebas.")+
'<h2 id="tipos">Qué buscar en cada página</h2><table class="check-table"><thead><tr><th>Señal</th><th>Decisión requerida</th></tr></thead><tbody>'+
[["No existe endpoint explícito","Definir contrato/API solo cuando el componente lo necesite."],["Sin test directo en matriz","Asignar prueba y criterio de aceptación rastreable."],["Schemas I/O sin formalizar","Definir tipos, validación, versiones, errores y compatibilidad."],["TO-BE / diseño","Confirmar si el código existe; no confundir diseño con implementación."],["Sin estado/owner/operación","Definir responsable, estados, configuración, recuperación y evidencia."]].map(r=>'<tr><td>'+safe(r[0])+'</td><td>'+safe(r[1])+'</td></tr>').join("")+'</tbody></table>'+
'<h2 id="rastreabilidad">Rastreabilidad obligatoria</h2><pre><code>REQUISITO → DECISIÓN → COMPONENTE → CONFIGURACIÓN\n         → IMPLEMENTACIÓN → PRUEBA → EVIDENCIA → ESTADO</code></pre>'+
'<h2 id="gates">Gates pendientes</h2><p>Corresponde validar autoridad del baseline, contratos, seguridad, operabilidad, pruebas y evidencia de cada componente. OD-004 no puede declararse aprobado por un benchmark funcional aislado; su gate debe resolverse de forma independiente.</p>'+
'<h2 id="consulta">Dónde revisar las brechas existentes</h2><div class="card-grid">'+[["audit-final.html","Auditoría del Handbook"],["registry.html","Registro de entidades"],["runtime.html","IA local y lifecycle"],["traceability.html","Trazabilidad"],["quality.html","QA y validación"],["governance.html","Gobernanza"]].map(r=>localLink(r[0],r[1],"EVIDENCIA")).join("")+'</div>';
}
function registry(){return hero("Navegación exhaustiva","Índice por componentes y especialidad","Acceso directo a todas las páginas del Handbook V2 que existen en el repositorio y a la vista de flujo. Utiliza búsqueda global para localizar entidades concretas.")+
GROUPS.filter(g=>!["Comenzar","Índice de referencia"].includes(g.title)).map(g=>'<h2 id="'+g.title.replace(/[^a-zA-Z]/g,"-")+'">'+safe(g.title)+'</h2><div class="card-grid">'+g.items.filter(it=>!VIRTUAL.has(it[0])).map(it=>localLink(it[0],it[1],"DOCUMENTO EXISTENTE")).join("")+'</div>').join("")+'<p>El índice original también está disponible en <a href="'+href("index.html")+'">Handbook v2</a>.</p>';
}
const VIRTUAL_HTML={inicio:overview,comenzar:gettingStarted,cobertura:coverage,preparacion:readiness,operacion:operations,vacios:gaps,registro:registry};
function docAddress(doc){return doc==="flow"?FLOW:HB+doc;}
function mapLink(raw,current){
 if(!raw || /^(mailto:|tel:|javascript:)/i.test(raw))return null;
 if(raw.startsWith("#"))return href(current,raw.slice(1));
 if(/^(https?:)?\/\//i.test(raw))return null;
 const [pathname,fragment=""]=raw.split("#");
 const normalized=pathname.replace(/^\.\//,"");
 if(/orchestrator-flow-manual/.test(normalized))return href("flow",fragment);
 const page=normalized.replace(/^\.\.\/orchestrator-handbook-v2\//,"").split("/").pop();
 if(DOC_IDS.has(page))return href(page,fragment);
 if(!pathname && fragment)return href(current,fragment);
 return null;
}
async function source(doc){if(state.contentCache.has(doc))return state.contentCache.get(doc);const res=await fetch(docAddress(doc),{cache:"default"});if(!res.ok)throw new Error("HTTP "+res.status+" al leer "+docAddress(doc));const h=await res.text();state.contentCache.set(doc,h);return h;}
function tocFrom(root,doc){const sections=[...root.querySelectorAll("h2,h3")];const a=sections.map((h,i)=>{if(!h.id){h.id="apartado-"+i;}return {id:h.id,label:h.textContent.trim().slice(0,105),level:h.tagName==="H3"?3:2};});return a.filter(x=>x.label);}
function setToc(entries,id){$("#tocNav").innerHTML=entries.slice(0,90).map(t=>'<a class="'+(t.level===3?"sub":"")+'" href="'+href(id,t.id)+'">'+safe(t.label)+'</a>').join("");}
function scrollAnchor(){const id=decodeURIComponent(location.hash.replace(/^#/,""));if(!id)return;let root=$("#pageContent");let el=root.querySelector("#"+CSS.escape(id));if(!el&&root.firstElementChild?.shadowRoot)el=root.firstElementChild.shadowRoot.getElementById(id);if(el){el.scrollIntoView({block:"start",behavior:"auto"});}}
function renderPager(id){const i=ALL.findIndex(x=>x.id===id);const prev=ALL[i-1],next=ALL[i+1];$("#pagination").innerHTML=(prev?'<a href="'+href(prev.id)+'">← '+safe(prev.label)+'</a>':'<span></span>')+(next?'<a href="'+href(next.id)+'">'+safe(next.label)+' →</a>':'');}
async function display(){const id=getId();const token=++state.token;state.current=id;setActive(id);const meta=ALL.find(x=>x.id===id);document.title=meta.label+" — AGENTIA_PAOD Docs";$("#crumbs").textContent="AGENTIA_PAOD / "+meta.group+" / "+meta.label;$("#pageContent").innerHTML='<p class="loading">Cargando documentación…</p>';$("#tocNav").innerHTML="";$("#sourceLink").innerHTML="";renderPager(id);
 try{
 if(VIRTUAL.has(id)){
 $("#pageContent").innerHTML=VIRTUAL_HTML[id]();
 setToc(tocFrom($("#pageContent"),id),id);
 }else{
 const src=await source(id);if(token!==state.token)return;
 const parsed=new DOMParser().parseFromString(src,"text/html");
 const main=parsed.querySelector("main");
 if(!main)throw new Error("No se encontró <main> en el documento original.");
 const host=document.createElement("div");host.className="source-doc";
 const shadow=host.attachShadow({mode:"open"});
 const style=parsed.querySelector("style")?.textContent||"";
 // Contenido y CSS del Handbook se mantienen separados del shell para evitar colisiones.
 const s=document.createElement("style");s.textContent=":host{display:block;color:#d7e4e9;font-family:Inter,system-ui,-apple-system,sans-serif}main{padding:0!important;max-width:none!important;margin:0!important} .entity{scroll-margin-top:90px!important}";shadow.append(s);
 const originalStyle=document.createElement("style");originalStyle.textContent=style;shadow.append(originalStyle);
 const article=document.createElement("div");article.innerHTML=main.innerHTML;
 const allLinks=article.querySelectorAll("a[href]");
 allLinks.forEach(a=>{const newHref=mapLink(a.getAttribute("href"),id);if(newHref)a.setAttribute("href",newHref);});
 shadow.append(article);$("#pageContent").replaceChildren(host);
 const hs=[...article.querySelectorAll("h2,h3")];const entries=hs.map((h,i)=>{if(!h.id){const parent=h.closest("[id]");if(parent)h.id=parent.id+"-heading";else h.id="h-"+i;}return {id:h.id,label:h.textContent.trim().slice(0,105),level:h.tagName==="H3"?3:2};});
 setToc(entries,id);
 $("#sourceLink").innerHTML='<a href="'+docAddress(id)+'" target="_blank" rel="noopener">Abrir fuente original ↗</a>';
 }
 }catch(e){if(token!==state.token)return;$("#pageContent").innerHTML='<div class="error"><strong>No se pudo cargar esta página.</strong><p>'+safe(e.message)+'</p><p><a href="'+docAddress(id)+'">Abrir el documento original →</a></p></div>';}
 requestAnimationFrame(()=>{if(location.hash)scrollAnchor();else window.scrollTo(0,0);});}
function route(event){const a=event.target.closest?.("a[href]");if(!a)return;const link=a.getAttribute("href");if(!link||!link.startsWith("?doc="))return;event.preventDefault();history.pushState(null,"",link);display();$("#sidebar").classList.remove("is-open");hideSearch();}
function openSearch(){const overlay=$("#searchOverlay");overlay.classList.remove("hidden");$("#searchInput").focus();$("#searchInput").select();searchNow();}
function hideSearch(){$("#searchOverlay").classList.add("hidden");}
function addSearchItem(id,title,anchor,description){state.searchData.push({id,title,anchor,description});}
function seedIndex(){ALL.forEach(x=>addSearchItem(x.id,x.label,"",x.group));}
async function indexAll(){if(state.indexed||state.indexing)return;state.indexing=true;const ids=ALL.filter(x=>!VIRTUAL.has(x.id)).map(x=>x.id);let done=0;
 async function worker(){while(ids.length){const id=ids.shift();try{const sourceHtml=await source(id);const doc=new DOMParser().parseFromString(sourceHtml,"text/html");const main=doc.querySelector("main");if(!main)continue;for(const el of main.querySelectorAll(".entity,h2,h3")){if(el.classList.contains("entity")){const h=el.querySelector("h2,h3");if(h)addSearchItem(id,h.textContent.trim(),el.id,(el.querySelector(".summary")?.textContent||"").trim().slice(0,180));}else if(!el.closest(".entity"))addSearchItem(id,el.textContent.trim(),el.id||"",id);}}
 catch(e){/* Una fuente faltante no bloquea la búsqueda de las demás. */}finally{done++;$("#searchProgress").textContent="Indexando documentos originales: "+done+" / "+ALL.filter(x=>!VIRTUAL.has(x.id)).length;}}
 }
 await Promise.all([worker(),worker(),worker(),worker()]);state.indexed=true;state.indexing=false;$("#searchProgress").textContent="Índice preparado · "+state.searchData.length+" entradas";searchNow();}
function searchNow(){const term=$("#searchInput").value.trim().toLocaleLowerCase("es");if(!term){$("#searchResults").innerHTML='<p class="loading" style="padding:15px">Busca cualquier agente, flujo, especificación o requisito.</p>';return;}const hits=state.searchData.filter(x=>(x.title+" "+x.description).toLocaleLowerCase("es").includes(term)).slice(0,80);$("#searchResults").innerHTML=hits.length?hits.map(x=>'<a class="result" href="'+href(x.id,x.anchor)+'"><strong>'+safe(x.title)+'</strong><small>'+safe(x.description||x.id)+'</small></a>').join(""):'<p class="loading" style="padding:15px">Sin coincidencias en el índice disponible.</p>';}
$("#nav").innerHTML=navHTML();seedIndex();
document.addEventListener("click",route);
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("is-open"));
["openSearch","searchTop"].forEach(id=>$("#"+id).addEventListener("click",()=>{openSearch();indexAll();}));
$("#closeSearch").addEventListener("click",hideSearch);
$("#searchOverlay").addEventListener("click",e=>{if(e.target===$("#searchOverlay"))hideSearch();});
$("#searchInput").addEventListener("input",searchNow);
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch();indexAll();}if(e.key==="Escape")hideSearch();});
window.addEventListener("popstate",display);
window.addEventListener("hashchange",scrollAnchor);
display();