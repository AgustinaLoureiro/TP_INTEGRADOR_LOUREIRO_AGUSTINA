const API_URL = "http://localhost:3000/api";

const CARRITO_KEY = "brote_carrito";
const NOMBRE_KEY = "brote_nombreCliente";

function getNombreCliente() {
    return localStorage.getItem(NOMBRE_KEY);
}
function setNombreCliente(nombre) {
    localStorage.setItem(NOMBRE_KEY, nombre);
}
function limpiarNombreCliente() {
    localStorage.removeItem(NOMBRE_KEY);
}

function getCarrito() {
    const data = localStorage.getItem(CARRITO_KEY);
    return data ? JSON.parse(data) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function limpiarCarrito() {
    localStorage.removeItem(CARRITO_KEY);
}

function agregarAlCarrito(producto) {
    const carrito = getCarrito();
    const existente = carrito.find(p => p.id === producto.id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
}

function cambiarCantidad(idProducto, delta) {
    const carrito = getCarrito();
    const item = carrito.find(p => p.id === idProducto);
    if (!item) return;

    item.cantidad += delta;

    const carritoActualizado = item.cantidad <= 0
        ? carrito.filter(p => p.id !== idProducto)
        : carrito;

    guardarCarrito(carritoActualizado);
}

function eliminarDelCarrito(idProducto) {
    const carrito = getCarrito().filter(p => p.id !== idProducto);
    guardarCarrito(carrito);
}

function calcularTotal(carrito) {
    return carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
}

function getCantidadEnCarrito(idProducto) {
    const item = getCarrito().find(p => p.id === idProducto);
    return item ? item.cantidad : 0;
}

function actualizarContadorCarrito() {
    const badge = document.getElementById("contadorCarrito");
    if (!badge) return;
    const totalItems = getCarrito().reduce((acc, p) => acc + p.cantidad, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "inline-block" : "none";
}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);