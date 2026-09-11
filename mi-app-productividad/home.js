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

    // Ya usó la prueba antes
    if (localStorage.getItem(id + "_pruebaUsada") === "true") {
        alert("Ya usaste tu prueba gratuita en este dispositivo.");
        return;
    }

    // Activar prueba por 7 días
    const inicio = Date.now();
    const fin = inicio + (7 * 24 * 60 * 60 * 1000);

    // 🔥 CORRECCIÓN IMPORTANTE:
    // Guardar SIEMPRE como STRING válido
    localStorage.setItem(id + "_pruebaActiva", "true");
    localStorage.setItem(id + "_pruebaInicio", String(inicio));
    localStorage.setItem(id + "_pruebaFin", String(fin));
    localStorage.setItem(id + "_pruebaUsada", "true");

    // Ir a la pantalla de prueba
    location.href = "trial.html";
}
