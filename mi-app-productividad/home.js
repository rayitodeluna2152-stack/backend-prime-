// ===============================
// 🔥 SCROLL SUAVE
// ===============================
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth" });
}

// ===============================
// 🔥 ACTIVAR PRUEBA DE 7 DÍAS
// ===============================
function activarPrueba() {
    const id = localStorage.getItem("usuarioID");

    // Usuario no logueado
    if (!id) {
        alert("Debes iniciar sesión para activar la prueba.");
        location.href = "login.html";
        return;
    }

    // Si es creador → no necesita prueba
    if (localStorage.getItem("modoCreador") === "true") {
        alert("Bro… eres el creador, tienes acceso infinito 🔥");
        location.href = "dashboard.html";
        return;
    }

    // Si ya es premium → no activar prueba
    const premiumActivo = localStorage.getItem(id + "_premiumActivo");
    const premiumFin = Number(localStorage.getItem(id + "_premiumFin"));
    if (premiumActivo === "true" && Date.now() < premiumFin) {
        alert("Ya eres PREMIUM bro 🔥");
        location.href = "dashboard.html";
        return;
    }

    // Ya usó la prueba antes
    if (localStorage.getItem(id + "_pruebaUsada") === "true") {
        alert("Ya usaste tu prueba gratuita en este dispositivo.");
        return;
    }

    // Activar prueba por 7 días
    const inicio = Date.now();
    const fin = inicio + (7 * 24 * 60 * 60 * 1000);

    // Guardar SIEMPRE como STRING válido
    localStorage.setItem(id + "_pruebaActiva", "true");
    localStorage.setItem(id + "_pruebaInicio", String(inicio));
    localStorage.setItem(id + "_pruebaFin", String(fin));
    localStorage.setItem(id + "_pruebaUsada", "true");

    // Ir a la pantalla de prueba
    location.href = "trial.html";
}
