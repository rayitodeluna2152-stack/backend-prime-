const id = localStorage.getItem("usuarioID");

// Si no hay ID → no está logueado
if (!id) {
    location.href = "login.html";
    return;
}

// Si es creador → infinito
if (localStorage.getItem("modoCreador") === "true") {
    document.getElementById("diasRestantes").innerText = "∞";
    return;
}

const activa = localStorage.getItem(id + "_pruebaActiva");
const finRaw = localStorage.getItem(id + "_pruebaFin");

// Si no hay prueba → redirigir
if (!activa || !finRaw || isNaN(Number(finRaw))) {
    location.href = "premium.html";
    return;
}

const fin = Number(finRaw);
const ahora = Date.now();

const dias = Math.ceil((fin - ahora) / (1000 * 60 * 60 * 24));

// Si terminó → redirigir
if (dias <= 0) {
    location.href = "premium.html";
    return;
}

document.getElementById("diasRestantes").innerText = dias;
