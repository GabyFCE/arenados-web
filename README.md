# Sitio de Arenados — cómo está armado y qué falta

Tres archivos y una carpeta de imágenes. Sin frameworks, sin build, sin dependencias:
se abre `index.html` y funciona.

```
sitio/
├── index.html    estructura y textos
├── styles.css    sistema visual (paleta, tipografía, componentes, responsive)
├── script.js     menú móvil, animaciones, comparador antes/después, formulario
└── assets/       10 fotos (antes/después de 5 piezas) recortadas a 1400 px
```

## Estructura elegida

Landing de una sola página con navegación por anclas. El contenido de una pyme de
servicio no da para un sitio de varias páginas: la decisión de contacto tiene que
poder tomarse sin navegar. Las secciones siguen el recorrido lógico de un cliente
técnico:

1. **Hero** — qué hace y para quién, con la norma técnica como prueba.
2. **Datos** — los cuatro números que un comprador industrial busca (grado, perfil, plazo, abrasivo).
3. **Proceso** — qué pasa con la pieza, en tres etapas.
4. **Casos de uso** — seis tipos de pieza, cada uno con el problema concreto que resuelve.
5. **Trabajos** — comparador arrastrable antes/después.
6. **Cotizar** — qué datos hacen falta + formulario.
7. **Pie** — contacto, horarios, aviso sobre las imágenes.

## Paleta

| Token | Valor | Uso |
|---|---|---|
| `--ink-900` | `#0F1115` | fondo del hero y del pie |
| `--ink-800` | `#15181E` | franja de datos |
| `--paper` | `#F5F4F1` | fondo general (blanco cálido, no puro) |
| `--paper-2` | `#EBE8E2` | sección de casos |
| `--copper` | `#B4602C` | acento único: CTA, etiquetas, reglas |
| `--text` | `#14161A` | texto principal |
| `--muted` | `#6B7280` | texto secundario |

El cobre es el único color saturado y aparece en menos del 5% de la superficie. La
paleta no usa el óxido como decoración: el óxido es lo que se saca, no la identidad.

Tipografía: **Inter** (300–600) para todo, **JetBrains Mono** para etiquetas y cifras.
Las dos se cargan de Google Fonts; si no hay red, caen a las del sistema.

El formulario apunta a Formspree. Mientras `FORM_ENDPOINT` tenga el marcador `XXXXXXXX`,
cae al envío por correo (`mailto:`) y lo avisa en pantalla.

## Tono de los textos

Registro formal, sin tuteo: «solicite», «consulte», «se retira», «su pieza». El sitio habla
con un comprador técnico pero no le explica normas ni unidades: describe qué se hace y qué
se obtiene. Los estándares (grado de limpieza, perfil de anclaje) se dan en la conversación
comercial, no en la página.

## Qué reemplazar antes de publicar

- [ ] **Datos del pie** (marcados con `<!-- TODO -->` en `index.html`): dirección, teléfono, email.
- [ ] **Endpoint del formulario**: `FORM_ENDPOINT` en `script.js` (ver abajo).
- [ ] **Email de respaldo**: `MAIL_RESPALDO` en `script.js` (hoy `presupuestos@arenados.com.ar`).
- [ ] **Fotos de la galería**: las actuales son ilustraciones generadas. Reemplazar por fotos
      reales con el mismo nombre de archivo (`<pieza>-antes.jpg` / `<pieza>-despues.jpg`) y
      borrar el aviso del final de la sección.
- [ ] **Plazos y capacidad**: "7 días" y "zona norte" son valores de ejemplo.
- [ ] **Metadatos**: `og:image`, `description`, y agregar favicon.

## El formulario (Formspree)

Envía por `POST` a Formspree, sin backend. Plan gratuito: 50 envíos por mes y 30 días de
historial. La validación corre en el navegador antes de enviar.

### Activarlo (5 minutos)

1. Crear cuenta en `formspree.io` con el mail del taller.
2. Crear un formulario nuevo y copiar la URL, con esta forma: `https://formspree.io/f/abcdwxyz`.
3. Pegarla en `script.js`:

   ```js
   var FORM_ENDPOINT = window.ARENADOS_FORM_ENDPOINT || "https://formspree.io/f/XXXXXXXX";
   ```

   Reemplazar `https://formspree.io/f/XXXXXXXX` por la URL real. Mientras quede el marcador,
   el sitio funciona igual pero envía por el cliente de correo y lo aclara en pantalla.
4. Mandar una prueba desde el sitio y confirmar que llega el mail (revisar spam la primera vez).

### Qué ya está resuelto

- **Antibot**: campo trampa `_gotcha` oculto. Si viene completo, se descarta sin avisar.
- **Asunto**: cada envío llega con «Pedido de presupuesto — <nombre>».
- **Estados**: mensaje de éxito, mensaje de error si falla el envío, botón bloqueado mientras envía.
- **Sin recarga**: `fetch`, el visitante no sale de la página.

### Sin Formspree

Si preferís no depender de un servicio: un endpoint PHP/Node propio que reciba `POST` y mande
el mail por SMTP. Requiere hosting con backend y configurar SPF/DKIM, o los mails caen en spam.

## Compatibilidad

Chrome, Firefox, Safari y Edge actuales. Usa `clip-path`, `IntersectionObserver` y
`pointer events`; si el navegador es viejo, el comparador queda en 50% y el resto del
sitio sigue funcionando. Respeta `prefers-reduced-motion`.
