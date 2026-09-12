// ===============================
// 🔥 POMODORO GLOBAL
// ===============================
function guardarPomodoroGlobal(startTime, duration) {
  const endTime = startTime + duration;

  localStorage.setItem("pomodoro_start", startTime);
  localStorage.setItem("pomodoro_end", endTime);
  localStorage.setItem("pomodoro_running", "true");
}

function obtenerPomodoroGlobal() {
  const running = localStorage.getItem("pomodoro_running");
  if (running !== "true") return null;

  const endTime = parseInt(localStorage.getItem("pomodoro_end"));
  const ahora = Date.now();
  const restante = endTime - ahora;

  if (restante <= 0) {
    localStorage.removeItem("pomodoro_running");
    return null;
  }

  return restante;
}

// ===============================
// 🔥 ID DEL USUARIO ACTUAL
// ===============================
const id = localStorage.getItem("usuarioID");

if (!id) {
  alert("Debes iniciar sesión.");
  location.href = "login.html";
}

// ===============================
// 🔥 VARIABLES DEL POMODORO
// ===============================
let tiempo = 25 * 60;
let intervalo = null;
let modoActual = "enfoque";

// ===============================
// 🔥 DATOS PERSONALES
// ===============================
let sesionesHoy = parseInt(localStorage.getItem(id + "_sesionesHoy")) || 0;
let racha = parseInt(localStorage.getItem(id + "_racha")) || 0;
let ultimaFecha = localStorage.getItem(id + "_ultimaFecha") || "";

document.getElementById("sesionesHoy").textContent = sesionesHoy;
document.getElementById("rachaDias").textContent = racha;

const circle = document.getElementById("progressCircle");
const circleLength = 690;

// ===============================
// 🔥 PANEL IZQUIERDO
// ===============================
function actualizarPanelIzquierdo() {
  let modoTexto = "Enfoque";
  let duracion = "25 min";
  let descanso = "5 min";

  if (modoActual === "corto") {
    modoTexto = "Descanso corto";
    duracion = "5 min";
    descanso = "15 min";
  }

  if (modoActual === "largo") {
    modoTexto = "Descanso largo";
    duracion = "15 min";
    descanso = "25 min";
  }

  document.getElementById("infoModo").textContent = modoTexto;
  document.getElementById("infoDuracion").textContent = duracion;
  document.getElementById("infoDescanso").textContent = descanso;

  document.getElementById("infoSesion").textContent = sesionesHoy + 1;
  document.getElementById("infoCompletadas").textContent = sesionesHoy;

  const frases = [
    "Tú puedes con todo 💪",
    "Cada minuto cuenta ⏳",
    "Disciplina = libertad ⚡",
    "Hoy lo revientas 🚀"
  ];

  document.getElementById("fraseMotivacion").textContent =
    frases[Math.floor(Math.random() * frases.length)];
}

// ===============================
// 🔥 EDICIÓN MANUAL
// ===============================
document.getElementById("editarRacha").onclick = () => {
  const nueva = prompt("Nueva racha:");
  if (!isNaN(nueva)) {
    racha = parseInt(nueva);
    localStorage.setItem(id + "_racha", racha);
    document.getElementById("rachaDias").textContent = racha;
    actualizarPanelIzquierdo();
  }
};

document.getElementById("editarSesiones").onclick = () => {
  const nueva = prompt("Sesiones hoy:");
  if (!isNaN(nueva)) {
    sesionesHoy = parseInt(nueva);
    localStorage.setItem(id + "_sesionesHoy", sesionesHoy);
    document.getElementById("sesionesHoy").textContent = sesionesHoy;
    actualizarPanelIzquierdo();
  }
};

// ===============================
// 🔥 TIMER
// ===============================
function actualizarTimer() {
  const minutos = Math.floor(tiempo / 60);
  const segundos = tiempo % 60;

  document.getElementById("timer").textContent =
    `${minutos}:${segundos < 10 ? "0" + segundos : segundos}`;

  const progreso = tiempo / (25 * 60);
  circle.style.strokeDashoffset = circleLength * (1 - progreso);
}

// ===============================
// 🔥 MODOS
// ===============================
function setModo(modo, minutos) {
  modoActual = modo;
  tiempo = minutos * 60;
  actualizarTimer();

  document.querySelectorAll(".modo").forEach(b => b.classList.remove("activo"));
  if (modo === "enfoque") document.getElementById("modoEnfoque").classList.add("activo");
  if (modo === "corto") document.getElementById("modoDescansoCorto").classList.add("activo");
  if (modo === "largo") document.getElementById("modoDescansoLargo").classList.add("activo");

  actualizarPanelIzquierdo();
}

document.getElementById("modoEnfoque").onclick = () => setModo("enfoque", 25);
document.getElementById("modoDescansoCorto").onclick = () => setModo("corto", 5);
document.getElementById("modoDescansoLargo").onclick = () => setModo("largo", 15);

// ===============================
// 🔥 CONTROLES
// ===============================
function iniciarPomodoro() {
  if (intervalo) return;

  // 🔥 Guardar Pomodoro GLOBAL SOLO si NO viene de recuperación
  if (!obtenerPomodoroGlobal()) {
    const startTime = Date.now();
    const duration = tiempo * 1000;
    guardarPomodoroGlobal(startTime, duration);
  }

  intervalo = setInterval(() => {
    tiempo--;
    actualizarTimer();
    if (tiempo <= 0) {
      completarPomodoro();
      reiniciarPomodoro();
    }
  }, 1000);
}

function pausarPomodoro() {
  clearInterval(intervalo);
  intervalo = null;
}

function reiniciarPomodoro() {
  clearInterval(intervalo);
  intervalo = null;

  if (modoActual === "enfoque") tiempo = 25 * 60;
  if (modoActual === "corto") tiempo = 5 * 60;
  if (modoActual === "largo") tiempo = 15 * 60;

  actualizarTimer();
  actualizarPanelIzquierdo();
}

// ===============================
// 🔥 COMPLETAR POMODORO
// ===============================
function completarPomodoro() {
  if (modoActual === "enfoque") {
    sesionesHoy++;
    localStorage.setItem(id + "_sesionesHoy", sesionesHoy);
  }

  const hoy = new Date().toLocaleDateString();
  if (ultimaFecha !== hoy) {
    racha++;
    ultimaFecha = hoy;
    localStorage.setItem(id + "_racha", racha);
    localStorage.setItem(id + "_ultimaFecha", ultimaFecha);
  }

  document.getElementById("sesionesHoy").textContent = sesionesHoy;
  document.getElementById("rachaDias").textContent = racha;

  agregarAlHistorial();
  actualizarPanelIzquierdo();
}

// ===============================
// 🔥 HISTORIAL
// ===============================
function agregarAlHistorial() {
  const lista = document.getElementById("listaHistorial");
  const li = document.createElement("li");
  const ahora = new Date().toLocaleTimeString();

  let textoModo = "Enfoque";
  if (modoActual === "corto") textoModo = "Descanso corto";
  if (modoActual === "largo") textoModo = "Descanso largo";

  li.textContent = `${textoModo} completado a las ${ahora}`;
  lista.appendChild(li);
}

// ===============================
// 🔥 INICIALIZAR + RECUPERAR GLOBAL
// ===============================
setModo("enfoque", 25);
actualizarPanelIzquierdo();

window.addEventListener("load", () => {
  const restante = obtenerPomodoroGlobal();
  if (restante) {
    tiempo = Math.floor(restante / 1000);
    actualizarTimer();
    iniciarPomodoro(); // ✔ ahora NO guarda un nuevo pomodoro global
  }
});
