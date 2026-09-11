let fechaActual = new Date();
let diaSeleccionado = null;

// 🔥 USUARIO ACTUAL
const id = localStorage.getItem("usuarioID");

// 🔥 CALENDARIO PERSONAL POR USUARIO
let eventos = JSON.parse(localStorage.getItem(id + "_eventosCalendario")) || {};

let filtros = { estudio: true, examen: true, trabajo: true, personal: true };

function guardarEventos() {
  localStorage.setItem(id + "_eventosCalendario", JSON.stringify(eventos));
}

function formatoFechaClave(año, mes, dia) {
  return `${año}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function pintarCalendario() {
  const grid = document.getElementById("grid-dias");
  const mesAno = document.getElementById("mes-ano");

  grid.innerHTML = "";

  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();

  const nombresMes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  mesAno.textContent = `${nombresMes[mes]} ${año}`;

  const primerDiaMes = new Date(año, mes, 1);
  const diaSemana = (primerDiaMes.getDay() + 6) % 7;
  const diasEnMes = new Date(año, mes + 1, 0).getDate();

  for (let i = 0; i < diaSemana; i++) {
    grid.appendChild(document.createElement("div"));
  }

  const hoy = new Date();
  const hoyClave = formatoFechaClave(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate());

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const clave = formatoFechaClave(año, mes + 1, dia);
    const div = document.createElement("div");
    div.className = "dia";

    if (clave === hoyClave) div.classList.add("dia-hoy");

    const num = document.createElement("div");
    num.className = "dia-numero";
    num.textContent = dia;

    const evts = (eventos[clave] || []).filter(e => filtros[e.tipo]);

    const evtsDiv = document.createElement("div");
    evtsDiv.className = "dia-eventos";
    if (evts.length > 0) evtsDiv.textContent = `${evts.length} evento${evts.length > 1 ? "s" : ""}`;

    div.onclick = () => seleccionarDia(año, mes + 1, dia);

    div.appendChild(num);
    div.appendChild(evtsDiv);
    grid.appendChild(div);
  }

  pintarMiniCalendario();
  pintarProximosEventos();
}

function seleccionarDia(año, mes, dia) {
  diaSeleccionado = { año, mes, dia };
  const clave = formatoFechaClave(año, mes, dia);
  const titulo = document.getElementById("titulo-dia");
  const lista = document.getElementById("lista-eventos");

  titulo.textContent = `Eventos del ${dia}/${mes}/${año}`;
  lista.innerHTML = "";

  const evts = eventos[clave] || [];

  evts.forEach((e, i) => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.innerHTML = `<strong>${e.titulo}</strong><br>${e.hora || "Sin hora"}<br>${e.notas || ""}`;

    const btn = document.createElement("button");
    btn.className = "evento-borrar";
    btn.textContent = "Borrar";
    btn.onclick = () => {
      evts.splice(i, 1);
      eventos[clave] = evts;
      guardarEventos();
      seleccionarDia(año, mes, dia);
      pintarCalendario();
    };

    li.appendChild(info);
    li.appendChild(btn);
    lista.appendChild(li);
  });
}

function guardarEvento() {
  if (!diaSeleccionado) return;

  const titulo = document.getElementById("evento-titulo").value.trim();
  const hora = document.getElementById("evento-hora").value;
  const tipo = document.getElementById("evento-tipo").value;
  const notas = document.getElementById("evento-notas").value.trim();

  if (!titulo) return;

  const clave = formatoFechaClave(diaSeleccionado.año, diaSeleccionado.mes, diaSeleccionado.dia);
  const evts = eventos[clave] || [];

  evts.push({ titulo, hora, tipo, notas });
  eventos[clave] = evts;
  guardarEventos();

  document.getElementById("evento-titulo").value = "";
  document.getElementById("evento-hora").value = "";
  document.getElementById("evento-notas").value = "";

  seleccionarDia(diaSeleccionado.año, diaSeleccionado.mes, diaSeleccionado.dia);
  pintarCalendario();
}

function cambiarMes(delta) {
  fechaActual.setMonth(fechaActual.getMonth() + delta);
  pintarCalendario();
}

function irHoy() {
  fechaActual = new Date();
  pintarCalendario();
}

function filtrar(tipo) {
  filtros[tipo] = !filtros[tipo];
  pintarCalendario();
}

function buscarEventos() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const cont = document.getElementById("proximos-eventos");

  cont.innerHTML = "";

  Object.keys(eventos).forEach(fecha => {
    eventos[fecha].forEach(e => {
      if (e.titulo.toLowerCase().includes(texto)) {
        const div = document.createElement("div");
        div.textContent = `${fecha}: ${e.titulo}`;
        cont.appendChild(div);
      }
    });
  });
}

function pintarMiniCalendario() {
  const mini = document.getElementById("mini-cal-grid");
  mini.innerHTML = "";

  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();
  const dias = new Date(año, mes + 1, 0).getDate();

  for (let d = 1; d <= dias; d++) {
    const div = document.createElement("div");
    div.className = "mini-dia";
    div.textContent = d;
    div.onclick = () => seleccionarDia(año, mes + 1, d);
    mini.appendChild(div);
  }
}

function pintarProximosEventos() {
  const cont = document.getElementById("proximos-eventos");
  cont.innerHTML = "";

  const hoy = new Date();
  const limite = new Date();
  limite.setDate(hoy.getDate() + 7);

  const lista = [];

  Object.keys(eventos).forEach(fecha => {
    const [a, m, d] = fecha.split("-").map(Number);
    const f = new Date(a, m - 1, d);

    if (f >= hoy && f <= limite) {
      eventos[fecha].forEach(e => {
        lista.push({ fecha: f, titulo: e.titulo, tipo: e.tipo });
      });
    }
  });

  lista.sort((a, b) => a.fecha - b.fecha);

  lista.forEach(e => {
    const div = document.createElement("div");
    div.textContent = `${e.fecha.getDate()}/${e.fecha.getMonth() + 1} - ${e.titulo}`;
    cont.appendChild(div);
  });
}

window.onload = () => {
  pintarCalendario();
};
