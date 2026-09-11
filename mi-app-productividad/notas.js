// ===============================
// 🔥 ID DEL USUARIO ACTUAL
// ===============================
const id = localStorage.getItem("usuarioID");

// Protección extra (aunque access.js ya controla esto)
if (!id) {
  alert("Debes iniciar sesión.");
  location.href = "login.html";
}

// ===============================
// 🔥 CARGAR NOTAS PERSONALES (cada usuario tiene las suyas)
// ===============================
let notas = [];

try {
  notas = JSON.parse(localStorage.getItem(id + "_notasApp")) || [];
} catch {
  notas = [];
}

let notaActualId = null;
let carpetaActiva = "todas";

// ===============================
// 🔥 ELEMENTOS DEL DOM
// ===============================
const listaNotas = document.getElementById("lista-notas");
const nuevaNotaBtn = document.getElementById("nueva-nota");
const buscador = document.getElementById("buscador-notas");

const tituloInput = document.getElementById("nota-titulo");
const etiquetaSelect = document.getElementById("nota-etiqueta");
const contenidoTextarea = document.getElementById("nota-contenido");
const infoSpan = document.getElementById("nota-info");
const estadoSpan = document.getElementById("nota-estado");
const borrarBtn = document.getElementById("nota-borrar");
const favoritaBtn = document.getElementById("nota-favorita");
const pantallaCompletaBtn = document.getElementById("pantalla-completa");

// ===============================
// 🔥 GUARDAR NOTAS
// ===============================
function guardarNotas() {
  localStorage.setItem(id + "_notasApp", JSON.stringify(notas));
  estadoSpan.textContent = "Guardado";
  estadoSpan.style.color = "#22c55e";
}

// ===============================
// 🔥 MARCAR COMO EDITANDO
// ===============================
function marcarPendienteGuardado() {
  estadoSpan.textContent = "Editando...";
  estadoSpan.style.color = "#f97316";
}

// ===============================
// 🔥 FILTRAR POR CARPETA
// ===============================
function filtrarCarpeta(carpeta) {
  carpetaActiva = carpeta;

  document.querySelectorAll(".carpeta").forEach(c => c.classList.remove("active"));
  document.querySelector(`.carpeta[onclick="filtrarCarpeta('${carpeta}')"]`).classList.add("active");

  renderListaNotas(buscador.value);
}

// ===============================
// 🔥 RENDER LISTA DE NOTAS
// ===============================
function renderListaNotas(filtroTexto = "") {
  listaNotas.innerHTML = "";

  notas
    .slice()
    .sort((a, b) => {
      if (a.favorita && !b.favorita) return -1;
      if (!a.favorita && b.favorita) return 1;
      return new Date(b.actualizada) - new Date(a.actualizada);
    })
    .filter(n => {
      if (carpetaActiva !== "todas" && n.etiqueta !== carpetaActiva) return false;

      const texto = filtroTexto.toLowerCase();
      return (
        n.titulo.toLowerCase().includes(texto) ||
        n.contenido.toLowerCase().includes(texto)
      );
    })
    .forEach(nota => {
      const li = document.createElement("li");
      if (nota.id === notaActualId) li.classList.add("active");

      li.onclick = () => seleccionarNota(nota.id);

      const etiquetaIcono = {
        estudio: "📘",
        ideas: "💡",
        personal: "📗",
        proyecto: "🚀"
      }[nota.etiqueta] || "📝";

      li.innerHTML = `
        <div>
          ${nota.favorita ? "⭐ " : ""}${etiquetaIcono} ${nota.titulo || "Sin título"}
          <div class="preview">${nota.contenido.slice(0, 40)}...</div>
        </div>
        <div class="nota-meta">${new Date(nota.actualizada).toLocaleDateString()}</div>
      `;

      listaNotas.appendChild(li);
    });
}

// ===============================
// 🔥 SELECCIONAR NOTA
// ===============================
function seleccionarNota(idNota) {
  const nota = notas.find(n => n.id === idNota);
  if (!nota) return;

  notaActualId = idNota;

  tituloInput.value = nota.titulo;
  etiquetaSelect.value = nota.etiqueta || "";
  contenidoTextarea.value = nota.contenido;
  favoritaBtn.textContent = nota.favorita ? "⭐" : "☆";

  infoSpan.textContent =
    `Creada: ${new Date(nota.creada).toLocaleString()} · Actualizada: ${new Date(nota.actualizada).toLocaleString()}`;

  estadoSpan.textContent = "Guardado";
  estadoSpan.style.color = "#22c55e";

  renderListaNotas(buscador.value);
}

// ===============================
// 🔥 CREAR NUEVA NOTA
// ===============================
function crearNuevaNota() {
  const ahora = new Date().toISOString();

  const nueva = {
    id: Date.now(),
    titulo: "Nueva nota",
    etiqueta: "",
    contenido: "",
    creada: ahora,
    actualizada: ahora,
    favorita: false
  };

  notas.unshift(nueva);
  guardarNotas();

  notaActualId = nueva.id;
  renderListaNotas(buscador.value);
  seleccionarNota(nueva.id);
}

// ===============================
// 🔥 ACTUALIZAR NOTA
// ===============================
function actualizarNota() {
  if (notaActualId === null) return;

  const nota = notas.find(n => n.id === notaActualId);
  if (!nota) return;

  nota.titulo = tituloInput.value;
  nota.etiqueta = etiquetaSelect.value;
  nota.contenido = contenidoTextarea.value;
  nota.actualizada = new Date().toISOString();

  marcarPendienteGuardado();
  guardarNotas();
  renderListaNotas(buscador.value);
}

// ===============================
// 🔥 BORRAR NOTA
// ===============================
function borrarNotaActual() {
  if (notaActualId === null) return;

  notas = notas.filter(n => n.id !== notaActualId);
  guardarNotas();

  notaActualId = null;

  tituloInput.value = "";
  etiquetaSelect.value = "";
  contenidoTextarea.value = "";
  infoSpan.textContent = "";
  estadoSpan.textContent = "";

  renderListaNotas(buscador.value);
}

// ===============================
// 🔥 FAVORITA
// ===============================
function toggleFavorita() {
  if (notaActualId === null) return;

  const nota = notas.find(n => n.id === notaActualId);
  if (!nota) return;

  nota.favorita = !nota.favorita;
  nota.actualizada = new Date().toISOString();

  favoritaBtn.textContent = nota.favorita ? "⭐" : "☆";

  guardarNotas();
  renderListaNotas(buscador.value);
}

// ===============================
// 🔥 PANTALLA COMPLETA
// ===============================
function togglePantallaCompleta() {
  document.body.classList.toggle("fullscreen");
}

// ===============================
// 🔥 EVENTOS
// ===============================
nuevaNotaBtn.onclick = crearNuevaNota;
borrarBtn.onclick = borrarNotaActual;
buscador.oninput = () => renderListaNotas(buscador.value);
favoritaBtn.onclick = toggleFavorita;
pantallaCompletaBtn.onclick = togglePantallaCompleta;

tituloInput.oninput = actualizarNota;
etiquetaSelect.onchange = actualizarNota;
contenidoTextarea.oninput = actualizarNota;

// ===============================
// 🔥 INICIALIZAR
// ===============================
window.onload = () => {
  renderListaNotas();
  if (notas.length > 0) seleccionarNota(notas[0].id);
};

