/* Caja Trujillo — comportamiento de la página
   Simulador de plazo fijo, explorador de productos y menú móvil. */
(function () {
  "use strict";

  var BASE = "https://www.cajatrujillo.com.pe/";
  var TREA = 0.0525; // Referencia: "Hasta 5.25 % TREA" de la campaña vigente
  var PLAZOS = [3, 6, 12, 18, 24];

  var fmt = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });
  function soles(n) { return "S/ " + fmt.format(Math.round(n)); }

  var reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Catálogo (nombres y enlaces tomados del menú del sitio actual)
     ------------------------------------------------------------------ */
  function p(nombre, ruta) { return { nombre: nombre, href: BASE + ruta }; }

  var CATALOGO = {
    personas: [
      {
        id: "ahorrar", titulo: "Quiero ahorrar",
        resumen: "Cuentas y depósitos para guardar tu dinero y verlo crecer.",
        productos: [
          p("Crece Mujer", "cuenta-crece-mujer.html"),
          p("Cuenta Simple", "ahorros_simple.html"),
          p("Ahorro Total Disponibilidad", "ahorros_cuenta_de_ahorros.html"),
          p("Cuenta Intangible", "ahorros_cuenta_intangible.html"),
          p("MiniAhorro", "ahorros_cuenta_miniahorro.html"),
          p("Ahorro Cuota", "ahorros_ahorrocuota.html"),
          p("Ahorro Sueldo Efectivo", "ahorros_SueldoEfectivo.html"),
          p("Depósito a Plazo Fijo", "ahorros_pfijo_.html"),
          p("Depósito CTS", "ahorros_depositoCTS.html")
        ]
      },
      {
        id: "credito", titulo: "Quiero un crédito personal",
        resumen: "Financiamiento para tus planes, con la opción que mejor se ajuste a ti.",
        productos: [
          p("Credijoya", "creditos_credijoya.html"),
          p("Crédito con garantía de depósito en efectivo", "creditos_garantia_depositoEfectivo.html"),
          p("Descuento por planilla", "creditos_dxp_.html"),
          p("Disfruta+", "creditos_disfruta_mas.html"),
          p("Disfruta+ MYPE", "creditos_disfruta_mas_mype.html"),
          p("Emprende+", "creditos_emprende_mas.html"),
          p("Mejorando vidas", "credito_mejorandovidas.html")
        ]
      },
      {
        id: "casa", titulo: "Quiero comprar una casa",
        resumen: "Créditos para comprar tu vivienda.",
        productos: [
          p("Crédito Mi Vivienda +", "creditos_mivivienda.html"),
          p("Techo Propio", "creditos_techo_propio.html"),
          p("Hipotecaja +", "creditos_hipotecaja.html")
        ]
      },
      {
        id: "seguro", titulo: "Necesito un seguro",
        resumen: "Protección para ti, tu familia y tus compromisos.",
        productos: [
          p("Seguro Vida Crédito", "seguro-vida-credito.html"),
          p("Protección Familiar", "seguro-proteccion-familiar.html"),
          p("Seguro de Vida - Sepelio", "servicios_microseguro_sepelio.html"),
          p("Seguro Oncológico", "servicios_seguro_oncologico.html"),
          p("Seguro de Protección de Tarjetas", "servicios_segurtarjeta.html"),
          p("Seguro Pensión Educativa", "servicios_pension_educativa.html"),
          p("Venta de SOAT", "servicios_soat.html"),
          p("Seguro Vida Integral", "seguro-mas-vida.html"),
          p("Seguro de Desgravamen", "servicios_seguroDesgravamen.html"),
          p("Seguro Desgravamen con Devolución", "servicios_seguroDesgravamenDevolucion.html")
        ]
      },
      {
        id: "tarjeta", titulo: "Necesito una tarjeta",
        resumen: "Paga y retira con tu tarjeta.",
        productos: [
          p("Tarjeta de débito Visa", "Tarjeta_de_Debito_Caja_Trujillo.html")
        ]
      },
      {
        id: "servicio", titulo: "Necesito un servicio",
        resumen: "Envía, recibe y paga sin complicaciones.",
        productos: [
          p("Cobranzas a otras instituciones", "servicios_cobranzadeotrasinstituciones.html"),
          p("Envío y recepción de dinero", "servicios_remesas.html"),
          p("Giros", "servicios_giros.html"),
          p("Multiservicios y Recargas", "servicios_sistemaderecaudacion.html"),
          p("Servicios débito automático", "Servicio_Debito_Automatico.html"),
          p("Tipo de cambio", "servicios_cambiodemoneda.html"),
          p("Transferencias interbancarias", "servicios_CCE.html")
        ]
      }
    ],
    negocios: [
      {
        id: "ahorrar", titulo: "Quiero ahorrar",
        resumen: "Cuentas y depósitos para el dinero de tu negocio.",
        productos: [
          p("Ahorro Total Disponibilidad", "ahorros_cuenta_de_ahorros.html"),
          p("Depósitos de Corto Plazo", "tesoreria_dcplazo.html")
        ]
      },
      {
        id: "credito", titulo: "Quiero un crédito",
        resumen: "Financiamiento para hacer crecer tu negocio.",
        productos: [
          p("+Negocios", "creditos_mas_negocios.html"),
          p("Agrícola Emprendedor", "creditos_agricola_emprendedor.html"),
          p("Microemprendedor Caja Trujillo", "creditos_microemprendedor.html"),
          p("Pecuario Emprendedor", "creditos_pecuario_emprendedor.html"),
          p("Facilito", "creditos_facilito.html"),
          p("Mi Local Comercial", "creditos_milocalcomercial.html"),
          p("Mejorando vidas", "credito_mejorandovidas.html"),
          p("Empodérate Mujer", "empoderate_mujer.html")
        ]
      },
      {
        id: "seguro", titulo: "Necesito un seguro",
        resumen: "Protección para tu negocio y tus créditos.",
        productos: [
          p("Seguro Vida Crédito", "seguro-vida-credito.html"),
          p("Seguro Vida Integral", "seguro-mas-vida.html"),
          p("Seguro Multiriesgo", "servicios_seguroMultiriesgo.html"),
          p("Venta de SOAT", "servicios_soat.html"),
          p("Seguro de Desgravamen", "servicios_seguroDesgravamen.html"),
          p("Seguro Desgravamen con Devolución", "servicios_seguroDesgravamenDevolucion.html")
        ]
      },
      {
        id: "tarjeta", titulo: "Necesito una tarjeta",
        resumen: "Paga y retira con tu tarjeta.",
        productos: [
          p("Tarjeta de débito Visa", "Tarjeta_de_Debito_Caja_Trujillo.html")
        ]
      },
      {
        id: "servicio", titulo: "Necesito un servicio",
        resumen: "Cobra, paga y mueve el dinero de tu negocio.",
        productos: [
          p("Cobranzas a otras instituciones", "servicios_cobranzadeotrasinstituciones.html"),
          p("Envío y recepción de dinero", "servicios_remesas.html"),
          p("Giros", "servicios_giros.html"),
          p("Multiservicios y Recargas", "servicios_sistemaderecaudacion.html"),
          p("Pago a Proveedores del Estado", "servicios_pagoproveedores.html"),
          p("Pago de Planillas", "servicios_pagoPlanillas.html"),
          p("Servicios débito automático", "Servicio_Debito_Automatico.html"),
          p("Operaciones de Cambio", "tesoreria_opcambio.html"),
          p("Transferencias interbancarias", "servicios_CCE.html")
        ]
      }
    ]
  };

  /* ------------------------------------------------------------------
     Explorador de productos
     ------------------------------------------------------------------ */
  var segmento = "personas";
  var intencionId = "ahorrar";

  var elIntenciones = document.getElementById("intenciones");
  var elPanel = document.getElementById("productos-panel");
  var botonesSegmento = Array.prototype.slice.call(document.querySelectorAll(".segmentos__boton"));

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function pintarProductos() {
    var grupos = CATALOGO[segmento];
    var actual = grupos.filter(function (g) { return g.id === intencionId; })[0] || grupos[0];
    intencionId = actual.id;

    elIntenciones.innerHTML = grupos.map(function (g) {
      var sel = g.id === actual.id;
      return '<button class="intencion" type="button" role="tab" id="int-' + g.id + '"' +
        ' aria-selected="' + sel + '" aria-controls="productos-panel" tabindex="' + (sel ? 0 : -1) + '"' +
        ' data-id="' + g.id + '">' + esc(g.titulo) + "</button>";
    }).join("");

    elPanel.setAttribute("aria-labelledby", "int-" + actual.id);
    elPanel.innerHTML =
      '<p class="productos__resumen">' + esc(actual.resumen) + "</p>" +
      '<ul class="productos__lista">' +
      actual.productos.map(function (pr) {
        return '<li><a href="' + esc(pr.href) + '">' + esc(pr.nombre) + "</a></li>";
      }).join("") + "</ul>";
  }

  function elegirSegmento(nuevo, enfocar) {
    segmento = nuevo;
    botonesSegmento.forEach(function (b) {
      var sel = b.getAttribute("data-segmento") === nuevo;
      b.setAttribute("aria-selected", sel);
      b.tabIndex = sel ? 0 : -1;
      if (sel && enfocar) b.focus();
    });
    pintarProductos();
  }

  botonesSegmento.forEach(function (b, i) {
    b.addEventListener("click", function () { elegirSegmento(b.getAttribute("data-segmento")); });
    b.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var j = (i + (e.key === "ArrowRight" ? 1 : -1) + botonesSegmento.length) % botonesSegmento.length;
      elegirSegmento(botonesSegmento[j].getAttribute("data-segmento"), true);
    });
  });

  elIntenciones.addEventListener("click", function (e) {
    var b = e.target.closest(".intencion");
    if (!b) return;
    intencionId = b.getAttribute("data-id");
    pintarProductos();
    var nuevo = document.getElementById("int-" + intencionId);
    if (nuevo) nuevo.focus();
  });

  elIntenciones.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    var grupos = CATALOGO[segmento];
    var i = grupos.findIndex(function (g) { return g.id === intencionId; });
    var j = (i + (e.key === "ArrowDown" ? 1 : -1) + grupos.length) % grupos.length;
    intencionId = grupos[j].id;
    pintarProductos();
    document.getElementById("int-" + intencionId).focus();
  });

  // Los enlaces "Para ti" y "Para tu negocio" de la cabecera eligen el segmento
  Array.prototype.forEach.call(document.querySelectorAll(".nav__lista a[data-segmento]"), function (a) {
    a.addEventListener("click", function () { elegirSegmento(a.getAttribute("data-segmento")); });
  });

  /* ------------------------------------------------------------------
     Simulador de plazo fijo
     ------------------------------------------------------------------ */
  var elMonto = document.getElementById("monto");
  var elMontoSalida = document.getElementById("monto-salida");
  var elPlazos = document.getElementById("plazos");
  var elEscalera = document.getElementById("escalera");
  var elFin = document.getElementById("escalera-fin");
  var elTotal = document.getElementById("total");
  var elInteres = document.getElementById("interes");

  var plazo = 12;
  var barrasPara = 0;

  function pintarPlazos() {
    elPlazos.innerHTML = PLAZOS.map(function (m) {
      return '<label class="plazo"><input type="radio" name="plazo" value="' + m + '"' +
        (m === plazo ? " checked" : "") + "><span><b>" + m + '</b><i class="sr-only"> meses</i></span></label>';
    }).join("");
    elPlazos.addEventListener("change", function (e) {
      if (e.target && e.target.name === "plazo") {
        plazo = Number(e.target.value);
        actualizar();
      }
    });
  }

  function interesHasta(monto, mes) {
    return monto * (Math.pow(1 + TREA, mes / 12) - 1);
  }

  function actualizar(primeraVez) {
    var monto = Number(elMonto.value);
    var ganancia = interesHasta(monto, plazo);

    elMontoSalida.textContent = soles(monto);
    var min = Number(elMonto.min), max = Number(elMonto.max);
    elMonto.style.setProperty("--relleno", ((monto - min) / (max - min)) * 100 + "%");

    elTotal.textContent = soles(monto + ganancia);
    elInteres.textContent = "Eso incluye " + soles(ganancia) + " de interés estimado.";
    elFin.textContent = "Mes " + plazo;

    // Un escalón por mes. Si cambia el plazo se reconstruyen; si solo cambia el monto, solo cambian las alturas.
    if (barrasPara !== plazo) {
      var html = "";
      for (var i = 1; i <= plazo; i++) {
        html += '<div class="escalon' + (i === plazo ? " escalon--ultimo" : "") + '" style="--i:' + (i - 1) + '"></div>';
      }
      elEscalera.innerHTML = html;
      elEscalera.parentNode.style.setProperty("--n", plazo);
      barrasPara = plazo;
      if (primeraVez && !reducirMovimiento) {
        elEscalera.parentNode.classList.add("escalera--entrada");
        setTimeout(function () { elEscalera.parentNode.classList.remove("escalera--entrada"); }, 2800);
      }
    }
    var escalones = elEscalera.children;
    for (var k = 0; k < escalones.length; k++) {
      var relativo = interesHasta(monto, k + 1) / ganancia; // 0..1
      escalones[k].style.setProperty("--alto", Math.max(8, relativo * 100) + "%");
    }
  }

  pintarPlazos();
  elMonto.addEventListener("input", function () { actualizar(); });

  /* ------------------------------------------------------------------
     Menú móvil
     ------------------------------------------------------------------ */
  var botonMenu = document.querySelector(".cabecera__menu");
  var nav = document.getElementById("navegacion");
  botonMenu.addEventListener("click", function () {
    var abierto = nav.classList.toggle("nav--abierto");
    botonMenu.setAttribute("aria-expanded", abierto);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a") && nav.classList.contains("nav--abierto")) {
      nav.classList.remove("nav--abierto");
      botonMenu.setAttribute("aria-expanded", "false");
    }
  });

  /* Inicio */
  document.getElementById("anio").textContent = new Date().getFullYear();
  pintarProductos();
  actualizar(true);
})();
