# Arenados — sitio web

Sitio estático de una página para el servicio de arenado industrial (Zona Norte, GBA).
Sin frameworks, sin build y sin dependencias: tres archivos y una carpeta de imágenes.
Se abre `index.html` y funciona.

**Estado: borrador publicable.** Faltan los datos reales de contacto y el endpoint del
formulario (ver *Checklist antes de publicar*).

---

## Verlo en tu máquina

Doble clic en `index.html` alcanza. Si querés servirlo como en producción (necesario para
probar rutas y el formulario):

```bash
python3 -m http.server 8000
# abrir http://127.0.0.1:8000
```

## Estructura

```
sitio/
├── index.html    estructura y textos
├── styles.css    sistema visual: paleta, tipografía, componentes, responsive
├── script.js     menú móvil, animaciones, comparador antes/después, formulario
└── assets/       10 fotos (antes/después de 5 piezas), recortadas a 1400 px
```

Secciones de la página, en orden: hero → datos → proceso → casos de uso → trabajos
(comparador) → cotizar → pie de contacto.

## Editar

### Textos
Todo el contenido está en `index.html`, en el orden en que se ve. No hay CMS ni plantillas:
se edita el HTML y se guarda.

### Fotos
El comparador antes/después espera pares con nombre fijo dentro de `assets/`:

```
<pieza>-antes.jpg
<pieza>-despues.jpg
```

Las cinco piezas actuales: `bloque-motor`, `carcasa-bomba`, `carcasa-gases`,
`cartera-compresor`, `cuadro-moto`. Para reemplazar una foto, se sobrescribe el archivo
con el mismo nombre y no hay que tocar el HTML.

Las imágenes actuales son generadas: antes de publicar hay que reemplazarlas por fotos
reales y borrar el aviso del final de la sección.

Recomendaciones: JPEG, 1400 px de ancho, menos de 300 KB cada una; las dos fotos de un par
tienen que estar encuadradas igual para que el comparador no salte.

### Colores y tipografía
Están como variables al principio de `styles.css`:

```css
:root {
  --ink-900: #0F1115;   /* fondo del hero y del pie */
  --ink-800: #15181E;   /* franja de datos */
  --paper:   #F5F4F1;   /* fondo general */
  --paper-2: #EBE8E2;   /* sección de casos */
  --copper:  #B4602C;   /* acento único: CTA, etiquetas, reglas */
  --text:    #14161A;
  --muted:   #6B7280;
}
```

Tipografía: **Inter** (300–600) para todo y **JetBrains Mono** para etiquetas y cifras.
Se cargan de Google Fonts; sin red caen a las del sistema.

### Formulario
En `script.js`:

```js
var FORM_ENDPOINT = window.ARENADOS_FORM_ENDPOINT || "https://formspree.io/f/XXXXXXXX";
var MAIL_RESPALDO  = "presupuestos@arenados.com.ar";
```

Mientras `FORM_ENDPOINT` conserve el marcador `XXXXXXXX`, el sitio envía por el cliente de
correo (`mailto:` a `MAIL_RESPALDO`) y lo avisa en pantalla. Para activar Formspree: crear
cuenta, crear un formulario y pegar la URL con forma `https://formspree.io/f/abcdwxyz`.
Plan gratuito: 50 envíos por mes.

Ya está resuelto: campo trampa `_gotcha` contra bots, asunto «Pedido de presupuesto — <nombre>»,
mensajes de éxito y error, y envío sin recargar la página.

## Trabajar con git

```bash
# primera vez
git clone https://github.com/GabyFCE/arenados-web.git
cd arenados-web

# cambios
git checkout -b fix/telefono-pie     # una rama por cambio, no commitear en main
git add -A
git commit -m "fix: telefono real en el pie"
git push -u origin fix/telefono-pie
```

Después se abre el PR en GitHub y se mergea. Para ver qué cambió antes de commitear:
`git diff`.

## Publicar

El sitio es 100% estático: cualquier servidor que sirva archivos alcanza.

- **Hosting compartido (cPanel/FTP)**: subir el contenido de `sitio/` a `public_html`,
  respetando la carpeta `assets/`.
- **Netlify / Vercel / Cloudflare Pages**: conectar el repo y publicar; sin comando de build,
  directorio de salida `/` (o `sitio` si subís el repo entero).
- **GitHub Pages**: requiere repo público (en privado necesita plan pago), así que con este
  repo no sirve tal cual.

Requisitos mínimos al publicar:
- HTTPS (cualquiera de las opciones de arriba lo da).
- Que `assets/` se sirva con cache largo y `index.html` sin cache, para no servir versiones viejas.
- Un favicon y `og:image` reales: hoy los metadatos son provisorios.

## Checklist antes de publicar

- [ ] **Datos del pie**: dirección, teléfono y email reales (en `index.html`, bloque marcado
      `<!-- TODO: reemplazar por los datos reales de la empresa -->`).
- [ ] **`FORM_ENDPOINT`** con la URL real de Formspree.
- [ ] **`MAIL_RESPALDO`** con un buzón que se lea.
- [ ] **Fotos reales** en `assets/` (mismos nombres) y borrar el aviso de imágenes ilustrativas.
- [ ] **Plazos y zona**: «7 días» y «zona norte» son valores de ejemplo.
- [ ] **Metadatos**: `description`, `og:image`, favicon.
- [ ] Probar el formulario de punta a punta y mirar si el mail llega (y no a spam).

## Notas de diseño

- **Una sola página con anclas**: en una pyme de servicio la decisión de contacto tiene que
  poder tomarse sin navegar.
- **Un solo acento**: el cobre aparece en menos del 5% de la superficie. La paleta no usa el
  óxido como decoración — el óxido es lo que se saca, no la identidad.
- **Tono**: registro formal, sin tuteo. Habla con un comprador técnico sin explicarle normas ni
  unidades: describe qué se hace y qué se obtiene.
- **Compatibilidad**: Chrome, Firefox, Safari y Edge actuales. Si el navegador es viejo, el
  comparador queda al 50% y el resto sigue funcionando. Respeta `prefers-reduced-motion`.
