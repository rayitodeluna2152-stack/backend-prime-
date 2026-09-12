// ===============================
// 🔥 SISTEMA DE ACCESO (PRIME)
// ===============================
const id = localStorage.getItem("usuarioID");
const modoCreador = localStorage.getItem("modoCreador") === "true";

if (!id) {
    alert("Debes iniciar sesión.");
    location.href = "login.html";
}

// CREADOR → acceso infinito
if (!modoCreador) {

    const premiumActivo = localStorage.getItem(id + "_premiumActivo") === "true";
    const premiumFin = Number(localStorage.getItem(id + "_premiumFin"));

    const pruebaActiva = localStorage.getItem(id + "_pruebaActiva") === "true";
    const pruebaFin = Number(localStorage.getItem(id + "_pruebaFin"));

    // PREMIUM
    if (premiumActivo) {
        if (Date.now() > premiumFin) {
            localStorage.removeItem(id + "_premiumActivo");
            alert("Tu premium ha caducado.");
            location.href = "premium.html";
        }
    } else {

        // PRUEBA → NO entra
        if (pruebaActiva) {
            if (Date.now() > pruebaFin) {
                localStorage.removeItem(id + "_pruebaActiva");
                alert("Tu prueba ha caducado.");
            } else {
                alert("Este módulo es exclusivo para usuarios PREMIUM.");
            }
            location.href = "premium.html";
            throw new Error("Acceso denegado");
        }

        // FREE → NO entra
        alert("Debes ser PREMIUM para acceder a este módulo.");
        location.href = "premium.html";
        throw new Error("Acceso denegado");
    }
}

// ===============================
// 🔥 LISTA DE LIBROS (tu lista exacta)
// ===============================
const libros = [
  {
    titulo: "Hábitos atómicos",
    autor: "James Clear",
    descripcion: "El libro que me enseñó que los cambios pequeños, repetidos cada día, crean resultados gigantes."
  },
  {
    titulo: "El poder de los hábitos",
    autor: "Charles Duhigg",
    descripcion: "Aprendí cómo funciona un hábito por dentro: señal, rutina, recompensa. Literalmente me reprogramó."
  },
  {
    titulo: "Mindset",
    autor: "Carol Dweck",
    descripcion: "Me enseñó la diferencia entre tener una mentalidad fija y una mentalidad de crecimiento."
  },
  {
    titulo: "Piensa y hágase rico",
    autor: "Napoleon Hill",
    descripcion: "No es sobre dinero. Es sobre mentalidad, enfoque y propósito. Brutal."
  },
  {
    titulo: "El sutil arte de que casi todo te importe una mierda",
    autor: "Mark Manson",
    descripcion: "Me enseñó a dejar de preocuparme por tonterías y enfocarme en lo que importa."
  },
  {
    titulo: "Los 7 hábitos de la gente altamente efectiva",
    autor: "Stephen R. Covey",
    descripcion: "Un manual de vida. Hábitos que te convierten en una persona fuerte, disciplinada y enfocada."
  },
  {
    titulo: "El hombre en busca de sentido",
    autor: "Viktor Frankl",
    descripcion: "Un libro duro, pero increíble. Te enseña que incluso en lo peor, puedes encontrar propósito."
  }
];

// ===============================
// 🔥 RENDER DE LIBROS
// ===============================
const contenedor = document.getElementById("libros");

libros.forEach(libro => {
  const card = document.createElement("div");
  card.className = "libro-card";

  const title = document.createElement("h3");
  title.textContent = libro.titulo;

  const author = document.createElement("p");
  author.textContent = libro.autor;

  const desc = document.createElement("p");
  desc.textContent = libro.descripcion;

  card.appendChild(title);
  card.appendChild(author);
  card.appendChild(desc);

  contenedor.appendChild(card);
});
