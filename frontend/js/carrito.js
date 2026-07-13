const listaCarrito = document.getElementById("listaCarrito");
const carritoVacio = document.getElementById("carritoVacio");
const resumenCarrito = document.getElementById("resumenCarrito");
const totalCarritoEl = document.getElementById("totalCarrito");
const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");

function renderizarCarrito() {
    const carrito = getCarrito();
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        resumenCarrito.classList.add("d-none");
        return;
    }

    carritoVacio.classList.add("d-none");
    resumenCarrito.classList.remove("d-none");

    carrito.forEach(item => {
        const imagenSrc = item.imagen
            ? `http://localhost:3000/uploads/${item.imagen}`
            : "https://placehold.co/80x80?text=🌱";

        const fila = document.createElement("div");
        fila.className = "d-flex align-items-center gap-3 p-3 mb-2 rounded card producto-card";
        fila.innerHTML = `
            <img src="${imagenSrc}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;">
            <div class="flex-grow-1">
                <h6 class="mb-1">${item.nombre}</h6>
                <span class="text-muted">$${item.precio.toFixed(2)} c/u</span>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-secondary btn-restar">-</button>
                <span>${item.cantidad}</span>
                <button class="btn btn-sm btn-outline-secondary btn-sumar">+</button>
            </div>
            <div class="fw-bold" style="width:80px; text-align:right;">$${(item.precio * item.cantidad).toFixed(2)}</div>
            <button class="btn btn-sm btn-outline-danger btn-eliminar">✕</button>
        `;

        fila.querySelector(".btn-sumar").addEventListener("click", () => {
            cambiarCantidad(item.id, 1);
            renderizarCarrito();
        });
        fila.querySelector(".btn-restar").addEventListener("click", () => {
            cambiarCantidad(item.id, -1);
            renderizarCarrito();
        });
        fila.querySelector(".btn-eliminar").addEventListener("click", () => {
            eliminarDelCarrito(item.id);
            toastInfo("Producto eliminado del carrito");
            renderizarCarrito();
        });

        listaCarrito.appendChild(fila);
    });

    const total = calcularTotal(carrito);
    totalCarritoEl.textContent = total.toFixed(2);
}

btnConfirmarCompra.addEventListener("click", async () => {
    const total = calcularTotal(getCarrito());

    const confirmado = await confirmarAccion({
        titulo: "¿Confirmás tu compra?",
        texto: `Total a pagar: $${total.toFixed(2)}`,
        textoConfirmar: "Sí, confirmar",
        icono: "question"
    });

    if (!confirmado) return;

    await registrarVenta();
});

async function registrarVenta() {
    const carrito = getCarrito();
    const nombreCliente = getNombreCliente();

    btnConfirmarCompra.disabled = true;
    btnConfirmarCompra.textContent = "Procesando...";

    try {
        const res = await fetch(`${API_URL}/ventas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre_cliente: nombreCliente,
                productos: carrito.map(item => ({
                    id_producto: item.id,
                    cantidad: item.cantidad
                }))
            })
        });

        const data = await res.json();

        if (!res.ok) {
            toastError(data.message || "No se pudo registrar la compra");
            btnConfirmarCompra.disabled = false;
            btnConfirmarCompra.textContent = "Confirmar compra";
            return;
        }

        localStorage.setItem("brote_ultimoTicket", JSON.stringify(data.venta));
        limpiarCarrito();
        window.location.href = "ticket.html";

    } catch (error) {
        console.error(error);
        toastError("Error de conexión al confirmar la compra");
        btnConfirmarCompra.disabled = false;
        btnConfirmarCompra.textContent = "Confirmar compra";
    }
}

renderizarCarrito();