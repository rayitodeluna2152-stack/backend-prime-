// Animación suave al cargar los pasos PRIME
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");

  steps.forEach((step, i) => {
    step.style.opacity = 0;

    setTimeout(() => {
      step.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      step.style.opacity = 1;
      step.style.transform = "translateY(0)";
    }, i * 120);
  });
});
