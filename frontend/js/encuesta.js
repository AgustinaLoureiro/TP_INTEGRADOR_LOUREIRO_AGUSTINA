const ticketData = JSON.parse(localStorage.getItem("brote_ultimoTicket") || "null");

const form = document.getElementById("formEncuesta");
const puntajeInput = document.getElementById("puntaje");
const puntajeValor = document.getElementById("puntajeValor");

puntajeInput.addEventListener("input", () => {
    puntajeValor.textContent = `${puntajeInput.value} / 5`;
});

function reiniciarSistema() {
    localStorage.removeItem("brote_ultimoTicket");
    limpiarNombreCliente();
    limpiarCarrito();
    window.location.href = "index.html";
}

document.getElementById("btnOmitir").addEventListener("click", (e) => {
    e.preventDefault();
    reiniciarSistema();
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.classList.remove("was-validated");

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const formData = new FormData(form);
    if (ticketData) formData.append("id_venta", ticketData.id);

    const btnSubmit = form.querySelector("button[type=submit]");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Enviando...";

    try {
        const res = await fetch(`${API_URL}/encuestas`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            const mensajes = data.errores ? data.errores.join(" | ") : data.message;
            toastError(mensajes);
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Enviar opinión";
            return;
        }

        await Swal.fire({
            title: "¡Gracias por tu opinión!",
            text: "Nos ayuda un montón a seguir mejorando 🌱",
            icon: "success",
            confirmButtonText: "Volver al inicio",
            confirmButtonColor: "#D4A94A",
            allowOutsideClick: false
        });

        reiniciarSistema();

    } catch (error) {
        console.error(error);
        toastError("Error de conexión al enviar la encuesta");
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Enviar opinión";
    }
});