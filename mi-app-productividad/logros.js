// ===============================
// 🔥 OBTENER ID DEL USUARIO
// ===============================
const id = localStorage.getItem("usuarioID");

// Si no hay usuario → login
if (!id) {
    alert("Debes iniciar sesión.");
    location.href = "login.html";
}

// ===============================
// 🔥 CARGAR LOGROS DEL USUARIO
// ===============================
let logrosUsuario = [];

try {
    logrosUsuario = JSON.parse(localStorage.getItem(id + "_logros")) || [];
} catch {
    logrosUsuario = [];
}

// ===============================
// 🔥 ELEMENTOS DEL DOM
// ===============================
const lista = document.getElementById("logros-lista");
const nombreInput = document.getElementById("logro-nombre");
const rarezaInput = document.getElementById("logro-rareza");
const objetivoInput = document.getElementById("logro-objetivo");
const crearBtn = document.getElementById("logro-crear");

// ===============================
// 🔥 MOSTRAR LOGROS
// ===============================
function mostrarLogros() {
    lista.innerHTML = "";

    logrosUsuario.forEach((logro, index) => {
        const li = document.createElement("li");
        li.className = "logro-item";

        li.innerHTML = `
            <strong>${logro.nombre}</strong> — ${logro.rareza} — ${logro.progreso}/${logro.objetivo}
            <button onclick="sumarProgreso(${index})">+1</button>
            <button onclick="borrarLogro(${index})">❌</button>
        `;

        lista.appendChild(li);
    });
}

// ===============================
// 🔥 CREAR NUEVO LOGRO
// ===============================
crearBtn.addEventListener("click", () => {
    const nombre = nombreInput.value.trim();
    const rareza = rarezaInput.value;
    const objetivo = parseInt(objetivoInput.value);

    if (!nombre || !objetivo || objetivo <= 0) {
        alert("Pon un nombre y un objetivo válido.");
        return;
    }

    const nuevoLogro = {
        nombre,
        rareza,
        objetivo,
        progreso: 0
    };

    logrosUsuario.push(nuevoLogro);
    guardarLogros();
    mostrarLogros();

    nombreInput.value = "";
    objetivoInput.value = "";
});

// ===============================
// 🔥 SUMAR PROGRESO
// ===============================
function sumarProgreso(index) {
    logrosUsuario[index].progreso++;

    if (logrosUsuario[index].progreso >= logrosUsuario[index].objetivo) {
        alert("¡Logro completado!");
    }

    guardarLogros();
    mostrarLogros();
}

// ===============================
// 🔥 BORRAR LOGRO
// ===============================
function borrarLogro(index) {
    logrosUsuario.splice(index, 1);
    guardarLogros();
    mostrarLogros();
}

// ===============================
// 🔥 GUARDAR LOGROS
// ===============================
function guardarLogros() {
    localStorage.setItem(id + "_logros", JSON.stringify(logrosUsuario));
}

// ===============================
// 🔥 INICIALIZAR
// ===============================
mostrarLogros();
