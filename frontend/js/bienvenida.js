const form = document.getElementById("formBienvenida");
const input = document.getElementById("inputNombre");
const error = document.getElementById("errorNombre");

const nombrePrevio = getNombreCliente();
if (nombrePrevio) input.value = nombrePrevio;

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = input.value.trim();

    if (nombre.length < 2) {
        error.classList.remove("d-none");
        return;
    }

    error.classList.add("d-none");
    setNombreCliente(nombre);
    window.location.href = "productos.html";
});