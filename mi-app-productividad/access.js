// ===============================
// 🔥 SISTEMA DE ACCESO UNIFICADO
// ===============================

// Funciones base
function esCreador() {
    return localStorage.getItem("modoCreador") === "true";
}

function esPremiumInfinito() {
    return localStorage.getItem("premium") === "true"; // creador
}

function esPremiumMensual(id) {
    const activo = localStorage.getItem(id + "_premiumActivo");
    const fin = localStorage.getItem(id + "_premiumFin");

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
    const fin = localStorage.getItem(id + "_pruebaFin");

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
// Pomodoro, tareas, dashboard, logros, etc.
function accesoModuloNormal() {
    const id = localStorage.getItem("usuarioID");
    if (!id) {
        alert("Debes iniciar sesión.");
        location.href = "login.html";
        return;
    }

    // Módulos normales → prueba SÍ puede entrar
    if (esCreador() || esPremiumInfinito() || esPremiumMensual(id) || esPruebaActiva(id)) {
        return; // acceso permitido
    }

    alert("Necesitas prueba o PREMIUM para usar este módulo.");
    location.href = "premium.html";
}

// ===============================
// 🔥 ACCESO A MÓDULOS EXCLUSIVOS
// ===============================
// Rutina PRIME, Lectura PRIME, 70 trucos
function accesoModuloPremiumSolo() {
    const id = localStorage.getItem("usuarioID");
    if (!id) {
        alert("Debes iniciar sesión.");
        location.href = "login.html";
        return;
    }

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
