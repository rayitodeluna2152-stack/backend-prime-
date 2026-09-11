// ===============================
// 🔥 VARIABLES BASE
// ===============================
const id = localStorage.getItem("usuarioID");
const modoCreador = localStorage.getItem("modoCreador");

// ===============================
// 🔥 ELEMENTOS DEL DASHBOARD
// ===============================
const usernameEl = document.getElementById("dash-username");
const subtitleEl = document.getElementById("dash-subtitle");
const premiumBtn = document.getElementById("dash-premium-btn");
const footerPremium = document.getElementById("dash-footer-premium");

const progressFill = document.getElementById("dash-progress-fill");
const primeLevelEl = document.getElementById("dash-prime-level");
const primePercentEl = document.getElementById("dash-prime-percent");

const rachaEl = document.getElementById("dash-racha");
const sesionesEl = document.getElementById("dash-sesiones");

const historyEl = document.getElementById("dash-history");

const statusButtons = document.querySelectorAll(".status-btn");
const statusTextEl = document.getElementById("dash-status-text");

// ===============================
// 🔥 FUNCIÓN PARA LEER NÚMEROS SEGUROS
// ===============================
function getNum(key, def = 0) {
    if (!id) return def;
    const raw = localStorage.getItem(id + key);
    const num = Number(raw);
    return isNaN(num) ? def : num;
}

// ===============================
// 🔥 CARGAR NOMBRE
// ===============================
if (id && usernameEl) {
    usernameEl.textContent = id + " · Road To Prime";
}

// ===============================
// 🔥 PROGRESO PRIME
// ===============================
const nivelPrime = getNum("_nivelPrime", 1);
const porcentajePrime = getNum("_porcentajePrime", 0);

primeLevelEl.textContent = "Nivel " + nivelPrime;
primePercentEl.textContent = porcentajePrime + "%";

// ANIMACIÓN DE LA BARRA
setTimeout(() => {
    progressFill.style.width = porcentajePrime + "%";
}, 300);

// ===============================
// 🔥 RACHA Y SESIONES
// ===============================
rachaEl.textContent = getNum("_rachaPrime", 0) + " días";
sesionesEl.textContent = getNum("_sesionesHoy", 0) + " sesiones";

// ===============================
// 🔥 HISTORIAL
// ===============================
let historial = [];

try {
    historial = JSON.parse(localStorage.getItem(id + "_historialModulos")) || [];
} catch {
    historial = [];
}

historyEl.innerHTML = "";

historial.slice(-5).reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <div class="history-dot"></div>
      <span>${item}</span>
    `;
    historyEl.appendChild(div);
});

// ===============================
// 🔥 ESTADO ACTUAL
// ===============================
statusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        statusButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const estado = btn.dataset.status;
        statusTextEl.textContent = estado;

        localStorage.setItem(id + "_estadoActual", estado);
    });
});

const estadoGuardado = localStorage.getItem(id + "_estadoActual");
if (estadoGuardado) {
    statusTextEl.textContent = estadoGuardado;
    statusButtons.forEach(btn => {
        if (btn.dataset.status === estadoGuardado) {
            btn.classList.add("active");
        }
    });
}

// ===============================
// 🔥 SISTEMA PREMIUM / PRUEBA / CREADOR
// ===============================
const premiumActivo = localStorage.getItem(id + "_premiumActivo");
const premiumFin = localStorage.getItem(id + "_premiumFin");

const pruebaActiva = localStorage.getItem(id + "_pruebaActiva");
const pruebaFin = localStorage.getItem(id + "_pruebaFin");

function actualizarPremium() {
    const now = Date.now();

    // 🔥 MODO CREADOR
    if (modoCreador === "true") {
        subtitleEl.textContent = "Modo CREADOR · Todo desbloqueado.";
        premiumBtn.textContent = "Creador 🔥";
        premiumBtn.classList.add("secondary");
        footerPremium.textContent = "Estado: CREADOR";
        return;
    }

    // 🔥 PREMIUM MENSUAL
    if (premiumActivo === "true" && premiumFin && now <= Number(premiumFin)) {
        subtitleEl.textContent = "Modo PRIME activado · Disfruta tu poder.";
        premiumBtn.textContent = "Eres PRIME 🔥";
        premiumBtn.classList.add("secondary");
        footerPremium.textContent = "Estado: PRIME";
        return;
    }

    // 🔥 PRUEBA DE 7 DÍAS
    if (pruebaActiva === "true" && pruebaFin && now <= Number(pruebaFin)) {
        subtitleEl.textContent = "Prueba activa · 7 días de PRIME.";
        premiumBtn.textContent = "Prueba activa";
        premiumBtn.classList.add("secondary");
        footerPremium.textContent = "Estado: PRUEBA";
        return;
    }

    // 🔥 MODO FREE
    subtitleEl.textContent = "Modo FREE · Activa PRIME para más poder.";
    premiumBtn.textContent = "Hazte PRIME";
    footerPremium.textContent = "Estado: FREE";
}

actualizarPremium();
