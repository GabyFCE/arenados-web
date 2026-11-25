# Arenados — sitio web

Sitio institucional de una sola página para un servicio de arenado industrial en Zona Norte
del Gran Buenos Aires. Presenta el proceso, muestra el resultado sobre piezas de taller y
ofrece un formulario para pedir presupuesto.

Es un proyecto de diseño y desarrollo web. La página está terminada y verificada; su contenido
comercial todavía es de muestra.

## Qué cuenta la página

- **Servicio.** Qué se hace, sobre qué materiales y con qué terminación.
- **Datos operativos.** Plazo de entrega, capacidad de trabajo y zona de cobertura.
- **Proceso.** Cuatro pasos: diagnóstico de la pieza, preparación, arenado y control final.
- **Casos de uso.** Piezas típicas por rubro: fundición, maquinaria, automotor y estructuras.
- **Antes y después.** Cinco piezas comparadas con un control deslizante que responde al
  mouse, al dedo y a las flechas del teclado.
- **Presupuesto.** Formulario de cinco campos, con tres obligatorios.
- **Contacto.** Pie con teléfono, correo y dirección.

## Cómo está hecho

HTML, CSS y JavaScript, sin frameworks, sin compilación y sin dependencias externas. El sitio
completo pesa 1,8 MB, de los cuales 1,7 MB son las imágenes del comparador.

La tipografía principal es Inter; las etiquetas y las cifras usan la monoespaciada del
sistema, así que hay una sola descarga de fuentes.

El comparador antes/después no dibuja sobre un canvas: las dos fotos están superpuestas en el
mismo encuadre y el control mueve un recorte. Son dos imágenes y una variable de estilo, sin
pérdida de calidad y sin código dibujando píxeles.

## Criterios de diseño

**Una sola página.** La decisión de contacto se toma en una pantalla o no se toma. Cada
sección responde una pregunta del comprador y la siguiente queda a un scroll.

**Un solo acento.** El cobre aparece en menos del 5 % de la superficie: llamados a la acción,
etiquetas y reglas finas. La paleta evita usar el óxido como decoración, porque el óxido es
justamente lo que el servicio retira.

**Tono formal.** Sin tuteo. Le habla a un comprador técnico que ya conoce el oficio: describe
qué se hace y qué se obtiene, sin explicar normas ni unidades.

## Accesibilidad

Foco visible en todos los controles, etiquetas asociadas a cada campo, nombre accesible en el
control del comparador y avisos del formulario anunciados a los lectores de pantalla. Los
textos principales superan 15:1 de contraste; el cobre queda en 4,1 sobre el fondo claro, por
eso se reserva para trazos y etiquetas y no para párrafos.

Las apariciones al hacer scroll se disparan al entrar en pantalla, sin escuchar el evento de
scroll, y todas las animaciones se desactivan cuando el sistema pide movimiento reducido.

## Contenido

Las imágenes de la sección «Antes y después» son ilustraciones generadas y la página lo
declara en un aviso al pie de esa sección. Los datos de contacto del pie son provisorios.

Mientras siga así, el sitio sirve para mostrar el diseño y el desarrollo; no es la vidriera
comercial de una empresa en actividad.
