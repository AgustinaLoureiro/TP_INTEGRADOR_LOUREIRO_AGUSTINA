document.querySelectorAll(".btn-baja").forEach(btn => {
    btn.addEventListener("click", () => confirmarCambioEstado(btn.dataset.id, "baja"));
});

document.querySelectorAll(".btn-alta").forEach(btn => {
    btn.addEventListener("click", () => confirmarCambioEstado(btn.dataset.id, "alta"));
});

async function confirmarCambioEstado(id, tipo) {
    const esBaja = tipo === "baja";

    const resultado = await Swal.fire({
        title: esBaja ? "¿Eliminar producto?" : "¿Activar producto?",
        text: esBaja
            ? "El producto pasará a estado inactivo y no se mostrará en la tienda."
            : "El producto volverá a mostrarse en la tienda.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#D4A94A",
        cancelButtonColor: "#8a8370",
        reverseButtons: true
    });

    if (!resultado.isConfirmed) return;

    try {
        const res = await fetch(`/api/productos/${id}/${tipo}`, { method: "PATCH" });

        if (!res.ok) throw new Error("No se pudo actualizar el producto");

        await Swal.fire({
            title: esBaja ? "Producto desactivado" : "Producto activado",
            icon: "success",
            timer: 1200,
            showConfirmButton: false
        });

        location.reload();

    } catch (error) {
        console.error(error);
        Swal.fire({ title: "Error", text: "Ocurrió un error al actualizar el producto", icon: "error" });
    }
}