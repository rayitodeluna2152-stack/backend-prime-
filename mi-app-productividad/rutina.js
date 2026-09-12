// ===============================
// 🔥 ANIMACIÓN SUAVE DE LOS PASOS PRIME
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");

  steps.forEach((step, i) => {
    // Estado inicial
    step.style.opacity = 0;
    step.style.transform = "translateY(20px)";

    // Animación escalonada
    setTimeout(() => {
      step.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      step.style.opacity = 1;
      step.style.transform = "translateY(0)";
    }, i * 120);
  });
});
