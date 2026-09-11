// ===============================
// 🔥 ID DEL USUARIO ACTUAL
// ===============================
const id = localStorage.getItem("usuarioID");

// Protección extra
if (!id) {
  alert("Debes iniciar sesión.");
  location.href = "login.html";
}

// ===============================
// 🔥 CARGAR TAREAS PERSONALES
// ===============================
let tareas = [];

try {
  tareas = JSON.parse(localStorage.getItem(id + "_tareasApp")) || [];
} catch {
  tareas = [];
}

// ===============================
// 🔥 GUARDAR TAREAS
// ===============================
function guardarTareas() {
  localStorage.setItem(id + "_tareasApp", JSON.stringify(tareas));
}

// ===============================
// 🔥 RENDERIZAR TAREAS
// ===============================
function renderTareas() {
  const pendientes = document.getElementById("pendientes");
  const progreso = document.getElementById("progreso");
  const completadas = document.getElementById("completadas");

  pendientes.innerHTML = "";
  progreso.innerHTML = "";
  completadas.innerHTML = "";

  tareas.forEach((tarea, index) => {
    const div = document.createElement("div");
    div.className = "tarea";

    div.innerHTML = `
      <div class="tarea-header">
        <span class="tarea-titulo">${tarea.titulo}</span>
        <span class="tarea-prioridad prioridad-${tarea.prioridad}">
          ${tarea.prioridad}
        </span>
      </div>

      <p class="tarea-descripcion">${tarea.descripcion}</p>

      <div class="tarea-actions">
        <button class="btn-editar" onclick="editarTarea(${index})">Editar</button>
        <button class="btn-borrar" onclick="borrarTarea(${index})">Borrar</button>
      </div>
    `;

    if (tarea.estado === "pendiente") pendientes.appendChild(div);
    if (tarea.estado === "progreso") progreso.appendChild(div);
    if (tarea.estado === "completada") completadas.appendChild(div);
  });
}

// ===============================
// 🔥 MODAL
// ===============================
function abrirModal() {
  document.getElementById("modal").classList.remove("oculto");
}

function cerrarModal() {
  document.getElementById("modal").classList.add("oculto");
}

// ===============================
// 🔥 GUARDAR NUEVA TAREA
// ===============================
function guardarTarea() {
  const titulo = document.getElementById("tareaTitulo").value.trim();
  const descripcion = document.getElementById("tareaDescripcion").value.trim();
  const prioridad = document.getElementById("tareaPrioridad").value;
  const estado = document.getElementById("tareaEstado").value;

  if (!titulo) {
    alert("Pon un título bro");
    return;
  }

  tareas.push({ titulo, descripcion, prioridad, estado });
  guardarTareas();

  cerrarModal();
  renderTareas();
}

// ===============================
// 🔥 BORRAR TAREA
// ===============================
function borrarTarea(index) {
  tareas.splice(index, 1);
  guardarTareas();
  renderTareas();
}

// ===============================
// 🔥 EDITAR TAREA
// ===============================
function editarTarea(index) {
  const tarea = tareas[index];

  document.getElementById("tareaTitulo").value = tarea.titulo;
  document.getElementById("tareaDescripcion").value = tarea.descripcion;
  document.getElementById("tareaPrioridad").value = tarea.prioridad;
  document.getElementById("tareaEstado").value = tarea.estado;

  abrirModal();

  // Eliminar temporalmente para reemplazarla al guardar
  tareas.splice(index, 1);
  guardarTareas();
}

// ===============================
// 🔥 INICIALIZAR
// ===============================
renderTareas();
