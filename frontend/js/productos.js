const LIMITE_POR_PAGINA = 8;

let paginaActual = 1;
let categoriaActual = "";
let productosActuales = [];

const listaProductos = document.getElementById("listaProductos");
const mensajeVacio = document.getElementById("mensajeVacio");
const tabsCategorias = document.getElementById("tabsCategorias");
const paginacion = document.getElementById("paginacion");
const saludoCliente = document.getElementById("saludoCliente");

const nombre = getNombreCliente();
if (!nombre) {
    window.location.href = "index.html";
} else {
    saludoCliente.textContent = `Hola, ${nombre} 👋 elegí tus productos favoritos`;
}

// Categorias
async function cargarCategorias() {
    try {
        const res = await fetch(`${API_URL}/categorias`);
        const categorias = await res.json();

        categorias.forEach(categoria => {
            const li = document.createElement("li");
            li.className = "nav-item";
            const btn = document.createElement("button");
            btn.className = "nav-link";
            btn.textContent = categoria.nombre;
            btn.dataset.categoria = categoria.id;
            btn.addEventListener("click", () => seleccionarCategoria(categoria.id, btn));
            li.appendChild(btn);
            tabsCategorias.appendChild(li);
        });

        tabsCategorias.querySelector('[data-categoria=""]').addEventListener("click", (e) => {
            seleccionarCategoria("", e.target);
        });

    } catch (error) {
        console.error("Error al cargar categorias:", error);
    }
}

function seleccionarCategoria(id, botonClickeado) {
    categoriaActual = id;
    paginaActual = 1;

    tabsCategorias.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
    botonClickeado.classList.add("active");

    cargarProductos();
}

// Productos
async function cargarProductos() {
    mostrarCargando();
    try {
        let url = `${API_URL}/productos?pagina=${paginaActual}&limite=${LIMITE_POR_PAGINA}&soloActivos=true`;
        if (categoriaActual) url += `&id_categoria=${categoriaActual}`;

        const res = await fetch(url);
        const data = await res.json();

        renderizarProductos(data.productos);
        renderizarPaginacion(data.totalPaginas, data.paginaActual);

    } catch (error) {
        console.error("Error al cargar productos:", error);
        listaProductos.innerHTML = `<p class="text-danger">No se pudo conectar con el servidor.</p>`;
        toastError("No se pudo conectar con el servidor");
    }
}

function mostrarCargando() {
    listaProductos.innerHTML = "";
    mensajeVacio.classList.add("d-none");
    for (let i = 0; i < 4; i++) {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-lg-3";
        col.innerHTML = `
            <div class="card producto-card h-100">
                <div class="producto-img" style="animation: pulso 1.2s ease-in-out infinite;"></div>
                <div class="card-body">
                    <div style="height:14px;width:70%;background:var(--border);border-radius:4px;margin-bottom:8px;"></div>
                    <div style="height:10px;width:40%;background:var(--border);border-radius:4px;"></div>
                </div>
            </div>
        `;
        listaProductos.appendChild(col);
    }
}

function renderizarProductos(productos) {
    productosActuales = productos;
    listaProductos.innerHTML = "";

    if (productos.length === 0) {
        mensajeVacio.classList.remove("d-none");
        return;
    }
    mensajeVacio.classList.add("d-none");

    productos.forEach(producto => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-lg-3";

        const imagenSrc = producto.imagen
            ? `http://localhost:3000/uploads/${producto.imagen}`
            : "https://placehold.co/300x200?text=Sin+imagen";

        const sinStock = producto.stock === 0;
        const cantidadEnCarrito = getCantidadEnCarrito(producto.id);

        col.innerHTML = `
            <div class="card producto-card h-100">
                <a href="detalle.html?id=${producto.id}">
                    <img src="${imagenSrc}" class="producto-img" alt="${producto.nombre}">
                </a>
                <div class="card-body d-flex flex-column">
                    <a href="detalle.html?id=${producto.id}" class="text-decoration-none">
                        <h6 class="card-title text-body">${producto.nombre}</h6>
                    </a>
                    <p class="card-text small text-muted flex-grow-1">${producto.descripcion ?? ""}</p>
                    <p class="fw-bold mb-2">$${Number(producto.precio).toFixed(2)}</p>
                    <div class="zona-accion"></div>
                </div>
            </div>
        `;

        renderizarZonaAccion(col.querySelector(".zona-accion"), producto, sinStock, cantidadEnCarrito);

        listaProductos.appendChild(col);
    });
}

function renderizarZonaAccion(contenedor, producto, sinStock, cantidad) {
    if (sinStock) {
        contenedor.innerHTML = `<button class="btn btn-primario btn-sm" disabled>Sin stock</button>`;
        return;
    }

    if (cantidad === 0) {
        contenedor.innerHTML = `<button class="btn btn-primario btn-sm btn-agregar">Agregar al carrito</button>`;
        contenedor.querySelector(".btn-agregar").addEventListener("click", () => {
            agregarAlCarrito(producto);
            toastExito(`${producto.nombre} agregado al carrito`);
            renderizarZonaAccion(contenedor, producto, sinStock, getCantidadEnCarrito(producto.id));
        });
        return;
    }

    contenedor.innerHTML = `
        <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary btn-restar">-</button>
            <span class="fw-bold">${cantidad}</span>
            <button class="btn btn-sm btn-outline-secondary btn-sumar" ${cantidad >= producto.stock ? "disabled" : ""}>+</button>
        </div>
    `;

    contenedor.querySelector(".btn-sumar").addEventListener("click", () => {
        if (cantidad >= producto.stock) return;
        cambiarCantidad(producto.id, 1);
        renderizarZonaAccion(contenedor, producto, sinStock, getCantidadEnCarrito(producto.id));
    });

    contenedor.querySelector(".btn-restar").addEventListener("click", () => {
        cambiarCantidad(producto.id, -1);
        const nuevaCantidad = getCantidadEnCarrito(producto.id);
        if (nuevaCantidad === 0) toastInfo(`${producto.nombre} eliminado del carrito`);
        renderizarZonaAccion(contenedor, producto, sinStock, nuevaCantidad);
    });
}

function renderizarPaginacion(totalPaginas, actual) {
    paginacion.innerHTML = "";
    if (totalPaginas <= 1) return;

    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === actual ? "active" : ""}`;
        li.innerHTML = `<button class="page-link">${i}</button>`;
        li.querySelector("button").addEventListener("click", () => {
            paginaActual = i;
            cargarProductos();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        paginacion.appendChild(li);
    }
}

if (nombre) {
    cargarCategorias();
    cargarProductos();
}