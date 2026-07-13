const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");

const contenido = document.getElementById("detalleContenido");
const noEncontrado = document.getElementById("detalleNoEncontrado");
const cargando = document.getElementById("detalleCargando");

async function cargarDetalle() {
    if (!idProducto) {
        mostrarNoEncontrado();
        return;
    }

    try {
        const res = await fetch(`${API_URL}/productos/${idProducto}`);

        if (!res.ok) {
            mostrarNoEncontrado();
            return;
        }

        const producto = await res.json();
        renderizarDetalle(producto);

    } catch (error) {
        console.error(error);
        toastError("No se pudo conectar con el servidor");
        mostrarNoEncontrado();
    } finally {
        cargando.classList.add("d-none");
    }
}

function renderizarDetalle(producto) {
    const imagenSrc = producto.imagen
        ? `http://localhost:3000/uploads/${producto.imagen}`
        : "https://placehold.co/500x400?text=Sin+imagen";

    document.getElementById("detalleImagen").src = imagenSrc;
    document.getElementById("detalleNombre").textContent = producto.nombre;
    document.getElementById("detalleDescripcion").textContent = producto.descripcion || "Sin descripción.";
    document.getElementById("detallePrecio").textContent = `$${Number(producto.precio).toFixed(2)}`;
    document.getElementById("detalleStock").textContent = `Stock disponible: ${producto.stock} unidades`;
    document.getElementById("detalleCategoria").textContent = producto.subcategoria ? producto.subcategoria.nombre : "";

    renderizarZonaAccionDetalle(producto);

    contenido.classList.remove("d-none");
}

function renderizarZonaAccionDetalle(producto) {
    const contenedor = document.getElementById("detalleAccion");
    const sinStock = producto.stock === 0;
    const cantidad = getCantidadEnCarrito(producto.id);

    if (sinStock) {
        contenedor.innerHTML = `<button class="btn btn-primario btn-lg" disabled>Sin stock</button>`;
        return;
    }

    if (cantidad === 0) {
        contenedor.innerHTML = `<button class="btn btn-primario btn-lg" id="btnAgregarDetalle">Agregar al carrito</button>`;
        contenedor.querySelector("#btnAgregarDetalle").addEventListener("click", () => {
            agregarAlCarrito(producto);
            toastExito(`${producto.nombre} agregado al carrito`);
            renderizarZonaAccionDetalle(producto);
        });
        return;
    }

    contenedor.innerHTML = `
        <div class="d-flex align-items-center gap-3">
            <button class="btn btn-outline-secondary btn-restar-detalle">-</button>
            <span class="fs-4 fw-bold">${cantidad}</span>
            <button class="btn btn-outline-secondary btn-sumar-detalle" ${cantidad >= producto.stock ? "disabled" : ""}>+</button>
        </div>
    `;

    contenedor.querySelector(".btn-sumar-detalle").addEventListener("click", () => {
        if (cantidad >= producto.stock) return;
        cambiarCantidad(producto.id, 1);
        renderizarZonaAccionDetalle(producto);
    });

    contenedor.querySelector(".btn-restar-detalle").addEventListener("click", () => {
        cambiarCantidad(producto.id, -1);
        if (getCantidadEnCarrito(producto.id) === 0) toastInfo(`${producto.nombre} eliminado del carrito`);
        renderizarZonaAccionDetalle(producto);
    });
}

function mostrarNoEncontrado() {
    noEncontrado.classList.remove("d-none");
}

cargarDetalle();