// ===============================
// XP SYSTEM — ROAD TO PRIME (ULTRA VERSION)
// ===============================

let xp = parseInt(localStorage.getItem("xp")) || 0;
let nivel = parseInt(localStorage.getItem("nivel")) || 1;
let titulo = localStorage.getItem("titulo") || "Novato";

// XP necesario por nivel
function xpNecesario(nivel) {
  return Math.floor(150 * Math.pow(1.3, nivel - 1));
}

// Añadir XP con animación
function ganarXP(cantidad) {
  xp += cantidad;
  localStorage.setItem("xp", xp);

  mostrarXPFlotante(cantidad);
  actualizarNivel();
  actualizarUI();
}

// Animación XP flotante
function mostrarXPFlotante(cantidad) {
  const div = document.createElement("div");
  div.className = "xp-flotante";
  div.innerHTML = `+${cantidad} XP`;
  document.body.appendChild(div);

  setTimeout(() => div.remove(), 1500);
}

// Subir de nivel
function actualizarNivel() {
  while (xp >= xpNecesario(nivel)) {
    nivel++;
    localStorage.setItem("nivel", nivel);
    actualizarTitulo();
    mostrarPantallaSubidaNivel();
  }
}

// Títulos según nivel
function actualizarTitulo() {
  if (nivel < 5) titulo = "Novato";
  else if (nivel < 10) titulo = "Estudiante PRO";
  else if (nivel < 20) titulo = "Elite";
  else if (nivel < 30) titulo = "Maestro";
  else titulo = "PRIME";

  localStorage.setItem("titulo", titulo);
}

// Pantalla de subida de nivel
function mostrarPantallaSubidaNivel() {
  const div = document.createElement("div");
  div.className = "pantalla-nivel";
  div.innerHTML = `
    <h1>🔥 NIVEL ${nivel} 🔥</h1>
    <p>Título: ${titulo}</p>
  `;
  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}

// Actualizar barra de XP
function actualizarUI() {
  const barra = document.getElementById("barraXP");
  const texto = document.getElementById("textoXP");

  if (!barra || !texto) return;

  const necesario = xpNecesario(nivel);
  const porcentaje = (xp / necesario) * 100;

  barra.style.width = porcentaje + "%";
  texto.textContent = `Nivel ${nivel} (${titulo}) — ${xp} XP / ${necesario} XP`;
}
