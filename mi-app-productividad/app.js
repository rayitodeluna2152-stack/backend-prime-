// ===============================
// NAVBAR / BOTONES INFERIORES
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".nav-btn");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const destino = btn.dataset.destino;
      if (destino) {
        window.location.href = destino;
      }
    });
  });
});

// ===============================
// BOTÓN 70 TRUCOS (EXCLUSIVO PREMIUM)
// ===============================

const btnTrucos = document.getElementById("btn-trucos");

if (btnTrucos) {
  btnTrucos.addEventListener("click", () => {

    // Usamos tu sistema de acceso premium
    const id = localStorage.getItem("usuarioID");

    if (!id) {
      alert("Debes iniciar sesión.");
      location.href = "login.html";
      return;
    }

    const esCreador = localStorage.getItem("modoCreador") === "true";
    const premiumInfinito = localStorage.getItem("premium") === "true";
    const premiumActivo = localStorage.getItem(id + "_premiumActivo");
    const premiumFin = localStorage.getItem(id + "_premiumFin");

    // CREADOR → entra
    if (esCreador || premiumInfinito) {
      window.location.href = "70-trucos.html";
      return;
    }

    // PREMIUM MENSUAL → entra
    if (premiumActivo === "true") {
      if (Date.now() > premiumFin) {
        localStorage.removeItem(id + "_premiumActivo");
        alert("Tu premium ha caducado.");
        location.href = "premium.html";
        return;
      }

      window.location.href = "70-trucos.html";
      return;
    }

    // PRUEBA → NO entra
    const pruebaActiva = localStorage.getItem(id + "_pruebaActiva");
    const pruebaFin = localStorage.getItem(id + "_pruebaFin");

    if (pruebaActiva === "true") {
      if (Date.now() > pruebaFin) {
        localStorage.removeItem(id + "_pruebaActiva");
        alert("Tu prueba ha caducado.");
      } else {
        alert("Este módulo es exclusivo para usuarios PREMIUM.");
      }

      location.href = "premium.html";
      return;
    }

    // Usuario normal → NO entra
    alert("Debes ser PREMIUM para acceder a este módulo.");
    location.href = "premium.html";
  });
}

// ===============================
// PROFESORES IA
// ===============================

document.querySelectorAll(".btn-profesor")?.forEach(btn => {
  btn.addEventListener("click", () => {
    const materia = btn.parentElement.dataset.materia;
    alert("Profesor de " + materia + " (función premium)");
  });
});

// ===============================
// ANIMACIÓN DE BOTONES
// ===============================

document.querySelectorAll("button").forEach(boton => {
  boton.addEventListener("mousedown", () => {
    boton.style.transform = "scale(0.95)";
  });
  boton.addEventListener("mouseup", () => {
    boton.style.transform = "scale(1)";
  });
});
