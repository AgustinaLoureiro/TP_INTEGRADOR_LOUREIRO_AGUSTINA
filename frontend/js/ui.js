const swalToast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
    didOpen: (el) => {
        el.addEventListener("mouseenter", Swal.stopTimer);
        el.addEventListener("mouseleave", Swal.resumeTimer);
    }
});

function toastExito(mensaje) {
    swalToast.fire({ icon: "success", title: mensaje });
}

function toastError(mensaje) {
    swalToast.fire({ icon: "error", title: mensaje });
}

function toastInfo(mensaje) {
    swalToast.fire({ icon: "info", title: mensaje });
}

async function confirmarAccion({ titulo, texto, textoConfirmar = "Sí, confirmar", icono = "question" }) {
    const resultado = await Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        showCancelButton: true,
        confirmButtonText: textoConfirmar,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#D4A94A",
        cancelButtonColor: "#8a8370",
        reverseButtons: true
    });
    return resultado.isConfirmed;
}