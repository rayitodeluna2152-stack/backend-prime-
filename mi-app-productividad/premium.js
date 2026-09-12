// ===============================
// 🔥 ID DEL USUARIO ACTUAL
// ===============================
const id = localStorage.getItem("usuarioID");

// Protección extra
if (!id) {
    alert("Debes iniciar sesión.");
    location.href = "login.html";
    throw new Error("No hay usuario");
}

// ===============================
// 🔥 ACTIVAR PREMIUM (manual o desde backend)
// ===============================
function activarPremium() {
    const inicio = Date.now();
    const fin = inicio + (30 * 24 * 60 * 60 * 1000); // 30 días

    // Guardar premium por usuario
    localStorage.setItem(id + "_premiumActivo", "true");
    localStorage.setItem(id + "_premiumInicio", inicio);
    localStorage.setItem(id + "_premiumFin", fin);

    alert("¡Gracias por pagar bro! Tienes 30 días de PRIME 🔥");

    // Redirigir al estado premium
    location.href = "premium.html";
}

// ===============================
// 🔥 COMPROBAR PREMIUM
// ===============================
function checkPremiumAccess() {
    const activo = localStorage.getItem(id + "_premiumActivo");
    const finRaw = localStorage.getItem(id + "_premiumFin");

    // Si nunca pagó → bloquear
    if (!activo) {
        alert("Debes ser PREMIUM para acceder a este módulo.");
        location.href = "pago.html";
        return false;
    }

    // Si finRaw no existe o no es número → bloquear
    if (!finRaw || isNaN(Number(finRaw))) {
        alert("Error en tu suscripción. Vuelve a activarla.");
        location.href = "pago.html";
        return false;
    }

    const fin = Number(finRaw);

    // Si ya terminó → bloquear
    if (Date.now() > fin) {
        alert("Tu suscripción ha terminado bro, renueva para seguir usando PRIME.");
        localStorage.removeItem(id + "_premiumActivo");
        location.href = "pago.html";
        return false;
    }

    // Si está dentro del mes → permitir
    return true;
}
