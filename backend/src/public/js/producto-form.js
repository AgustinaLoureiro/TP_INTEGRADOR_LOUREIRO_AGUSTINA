const form = document.getElementById("formProducto");
const mensajeError = document.getElementById("mensajeError");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensajeError.classList.add("d-none");

    const formData = new FormData(form);

    const esEdicion = typeof producto !== "undefined" && producto !== null;
    const url = esEdicion ? `/api/productos/${producto.id}` : "/api/productos";
    const method = esEdicion ? "PUT" : "POST";

    try {
        const res = await fetch(url, { method, body: formData });
        const data = await res.json();

        if (!res.ok) {
            const mensajes = data.errores ? data.errores.join(" | ") : data.message;
            mensajeError.textContent = mensajes;
            mensajeError.classList.remove("d-none");
            return;
        }

        await Swal.fire({
            title: esEdicion ? "Producto actualizado" : "Producto agregado",
            icon: "success",
            timer: 1200,
            showConfirmButton: false
        });

        window.location.href = "/admin/dashboard";

    } catch (error) {
        console.error(error);
        mensajeError.textContent = "Ocurrió un error de conexión";
        mensajeError.classList.remove("d-none");
    }
});