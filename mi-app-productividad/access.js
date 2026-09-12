localStorage.removeItem("premium");
// ===============================
// 🔥 SISTEMA DE ACCESO UNIFICADO (VERSIÓN FINAL)
// ===============================

// Generar ID si no existe
function obtenerID() {
    let id = localStorage.getItem("usuarioID");
    if (!id) {
        id = "USER-" + Math.random().toString(36).substring(2, 10);
        localStorage.setItem("usuarioID", id);
    }
    return id;
}

// ===============================
// 🔥 FUNCIONES BASE
// ===============================

function esCreador() {
    return localStorage.getItem("modoCreador") === "true";
}

// ❌ YA NO SE USA premium = "true"
// ✔ SOLO el creador tiene premium infinito
function esPremiumInfinito() {
    return esCreador();
}

function esPremiumMensual(id) {
    const activo = localStorage.getItem(id + "_premiumActivo");
    const fin = Number(localStorage.getItem(id + "_premiumFin"));

    if (activo === "true") {
        if (Date.now() > fin) {
            localStorage.removeItem(id + "_premiumActivo");
            return false;
        }
        return true;
    }
    return false;
}

function esPruebaActiva(id) {
    const activa = localStorage.getItem(id + "_pruebaActiva");
    const fin = Number(localStorage.getItem(id + "_pruebaFin"));

    if (activa === "true") {
        if (Date.now() > fin) {
            localStorage.removeItem(id + "_pruebaActiva");
            return false;
        }
        return true;
    }
    return false;
}

// ===============================
// 🔥 ACCESO A MÓDULOS NORMALES
// ===============================
// Dashboard, pomodoro, tareas, logros, premium.html, etc.
function accesoModuloNormal() {
    const id = obtenerID();

    // Módulos normales → prueba SÍ puede entrar
    if (
        esCreador() ||
        esPremiumInfinito() ||
        esPremiumMensual(id) ||
        esPruebaActiva(id)
    ) {
        return; // acceso permitido
    }

    alert("Necesitas prueba o PREMIUM para usar este módulo.");
    location.href = "premium.html";
}

// ===============================
// 🔥 ACCESO A MÓDULOS EXCLUSIVOS
// ===============================
// Lectura PRIME, Rutina PRIME, 70 trucos
function accesoModuloPremiumSolo() {
    const id = obtenerID();

    // SOLO premium mensual o creador
    if (esCreador() || esPremiumInfinito() || esPremiumMensual(id)) {
        return; // acceso permitido
    }

    // La prueba NO puede entrar aquí
    if (esPruebaActiva(id)) {
        alert("Este módulo es exclusivo para usuarios PREMIUM.");
        location.href = "premium.html";
        return;
    }

    alert("Debes ser PREMIUM para acceder a este módulo.");
    location.href = "premium.html";
}
