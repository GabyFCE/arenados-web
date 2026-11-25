/* ==========================================================================
   ARENADOS — interacciones
   Sin dependencias. Navegación móvil, reveal al scroll, comparador
   antes/después y validación del formulario.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Año del pie ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: fondo sólido al scrollear + menú móvil ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-solid", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    if (!links || !toggle) return;
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Reveal al entrar en pantalla ---------- */
  var reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveal.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    reveal.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveal.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Comparador antes / después ---------- */
  document.querySelectorAll("[data-ba]").forEach(function (ba) {
    var clip = ba.querySelector(".ba__clip");
    var handle = ba.querySelector(".ba__handle");
    if (!clip || !handle) return;
    var dragging = false;

    function setPos(clientX) {
      var r = ba.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      clip.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      handle.style.left = pct + "%";
    }

    ba.addEventListener("pointerdown", function (e) {
      dragging = true;
      try {
        if (ba.setPointerCapture) ba.setPointerCapture(e.pointerId);
      } catch (_) { /* pointerId sintético o ya liberado: seguimos igual */ }
      setPos(e.clientX);
    });
    ba.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      e.preventDefault();
      setPos(e.clientX);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
      ba.addEventListener(ev, function () { dragging = false; });
    });

    /* Teclado: flechas mueven la línea */
    ba.setAttribute("tabindex", "0");
    ba.setAttribute("role", "slider");
    ba.setAttribute("aria-label", "Comparador antes y después");
    ba.setAttribute("aria-valuemin", "0");
    ba.setAttribute("aria-valuemax", "100");
    ba.setAttribute("aria-valuenow", "50");
    ba.addEventListener("keydown", function (e) {
      var cur = parseFloat(ba.getAttribute("aria-valuenow")) || 50;
      var next = null;
      if (e.key === "ArrowLeft") next = cur - 4;
      if (e.key === "ArrowRight") next = cur + 4;
      if (next === null) return;
      e.preventDefault();
      next = Math.max(2, Math.min(98, next));
      ba.setAttribute("aria-valuenow", next);
      clip.style.clipPath = "inset(0 " + (100 - next) + "% 0 0)";
      handle.style.left = next + "%";
    });
  });

  /* ---------- Formulario ---------- */
  var form = document.getElementById("form");
  if (!form) return;

  var okBox = document.getElementById("formOk");
  var errBox = document.getElementById("formErr");
  var boton = form.querySelector('button[type="submit"]');
  var botonTexto = boton ? boton.innerHTML : "";

  /* ===== CONFIGURACIÓN =====
     Pegá acá la URL que da Formspree al crear el formulario, con esta forma:
        https://formspree.io/f/abcdwxyz
     Mientras siga el marcador XXXXXXXX, el sitio funciona igual pero envía
     por el cliente de correo (respaldo), y lo avisa en pantalla. */
  var FORM_ENDPOINT = window.ARENADOS_FORM_ENDPOINT || "https://formspree.io/f/XXXXXXXX";
  var MAIL_RESPALDO = "presupuestos@arenados.com.ar"; // TODO: buzón real
  var sinConfigurar = /X{6,}/.test(FORM_ENDPOINT);

  function fieldOf(input) { return input.closest(".field"); }

  function invalid(input, msg) {
    var f = fieldOf(input);
    if (!f) return;
    f.classList.add("is-invalid");
    var e = f.querySelector(".field__err");
    if (e && msg) e.textContent = msg;
  }

  function clear(input) {
    var f = fieldOf(input);
    if (f) f.classList.remove("is-invalid");
  }

  function ocultarAvisos() {
    if (okBox) okBox.classList.remove("is-visible");
    if (errBox) errBox.classList.remove("is-visible");
  }

  function mostrar(box, texto) {
    if (!box) return;
    if (texto) {
      var p = box.querySelector("[data-msg]");
      if (p) p.textContent = texto;
    }
    box.classList.add("is-visible");
  }

  function ocupado(estado) {
    if (!boton) return;
    boton.disabled = estado;
    boton.innerHTML = estado ? "Enviando…" : botonTexto;
  }

  form.querySelectorAll("input, textarea, select").forEach(function (el) {
    el.addEventListener("input", function () { clear(el); });
  });

  /* Respaldo cuando todavía no hay endpoint configurado */
  function enviarPorCorreo(datos) {
    var cuerpo = [
      "Nombre: " + datos.nombre,
      datos.empresa ? "Empresa: " + datos.empresa : null,
      "Email: " + datos.email,
      datos.telefono ? "Teléfono: " + datos.telefono : null,
      "",
      "Qué necesita arenar:",
      datos.mensaje
    ].filter(function (l) { return l !== null; }).join("\r\n");
    var url = "mailto:" + MAIL_RESPALDO +
              "?subject=" + encodeURIComponent("Consulta de presupuesto — " + datos.nombre) +
              "&body=" + encodeURIComponent(cuerpo);
    window.location.href = url;
    mostrar(okBox, "Se abrió el cliente de correo con la consulta redactada. " +
                   "Si no se abrió, escriba a " + MAIL_RESPALDO + ".");
    ocupado(false);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ocultarAvisos();
    /* limpiar marcas previas: si el usuario corrigió y reenvió, no deben quedar */
    form.querySelectorAll(".field.is-invalid").forEach(function (f) {
      f.classList.remove("is-invalid");
    });

    var nombre = form.nombre, email = form.email, mensaje = form.mensaje;
    var errores = 0;

    if (!nombre.value.trim()) { invalid(nombre, "Ingrese su nombre."); errores++; }
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.value.trim())) {
      invalid(email, "Ingrese un correo electrónico válido."); errores++;
    }
    if (mensaje.value.trim().length < 10) {
      invalid(mensaje, "Indique qué pieza o material necesita arenar."); errores++;
    }

    if (errores) {
      var primero = form.querySelector(".is-invalid input, .is-invalid textarea");
      if (primero) primero.focus();
      return;
    }

    /* Trampa antibot: si viene completa, es un robot. Se finge éxito y no se envía. */
    var trampa = form.querySelector('[name="_gotcha"]');
    if (trampa && trampa.value) {
      mostrar(okBox);
      form.reset();
      return;
    }

    var datos = {
      nombre: nombre.value.trim(),
      empresa: form.empresa.value.trim(),
      email: email.value.trim(),
      telefono: form.telefono.value.trim(),
      mensaje: mensaje.value.trim()
    };

    if (sinConfigurar) { enviarPorCorreo(datos); return; }

    var cuerpo = new FormData(form);
    cuerpo.append("_subject", "Consulta de presupuesto — " + datos.nombre);
    ocupado(true);

    fetch(FORM_ENDPOINT, {
      method: "POST",
      body: cuerpo,
      headers: { "Accept": "application/json" }
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json().catch(function () { return {}; });
      })
      .then(function () {
        form.reset();
        mostrar(okBox, "Su consulta fue recibida. La respuesta se enviará dentro de las 24 horas hábiles.");
        ocupado(false);
      })
      .catch(function () {
        ocupado(false);
        mostrar(errBox, "No fue posible enviar la consulta. Intente nuevamente o escriba a " + MAIL_RESPALDO + ".");
      });
  });
})();
