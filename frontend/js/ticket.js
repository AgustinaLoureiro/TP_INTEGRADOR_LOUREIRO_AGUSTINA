const ticketData = JSON.parse(localStorage.getItem("brote_ultimoTicket") || "null");

if (!ticketData) {
    window.location.href = "index.html";
}

if (ticketData) {
    document.getElementById("ticketNombre").textContent = ticketData.nombre_cliente;
    document.getElementById("ticketFecha").textContent = new Date(ticketData.fecha).toLocaleString("es-AR");
    document.getElementById("ticketTotal").textContent = Number(ticketData.precio_total).toFixed(2);

    const tbody = document.getElementById("ticketItems");
    ticketData.productos.forEach(producto => {
        const detalle = producto.DetalleVenta;
        const subtotal = Number(detalle.precio_unitario) * detalle.cantidad;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${producto.nombre}</td>
            <td class="text-center">${detalle.cantidad}</td>
            <td class="text-end">$${subtotal.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById("btnDescargarPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;
    doc.setFontSize(16);
    doc.text("brote - Ticket de compra", 20, y);

    y += 10;
    doc.setFontSize(11);
    doc.text(`Cliente: ${ticketData.nombre_cliente}`, 20, y);
    y += 7;
    doc.text(`Fecha: ${new Date(ticketData.fecha).toLocaleString("es-AR")}`, 20, y);

    y += 12;
    doc.setFontSize(12);
    doc.text("Producto", 20, y);
    doc.text("Cant.", 130, y);
    doc.text("Subtotal", 160, y);
    y += 4;
    doc.line(20, y, 190, y);
    y += 6;

    doc.setFontSize(10);
    ticketData.productos.forEach(producto => {
        const detalle = producto.DetalleVenta;
        const subtotal = Number(detalle.precio_unitario) * detalle.cantidad;

        doc.text(producto.nombre, 20, y);
        doc.text(String(detalle.cantidad), 135, y);
        doc.text(`$${subtotal.toFixed(2)}`, 160, y);
        y += 7;
    });

    y += 5;
    doc.line(20, y, 190, y);
    y += 8;
    doc.setFontSize(13);
    doc.text(`Total: $${Number(ticketData.precio_total).toFixed(2)}`, 130, y);

    doc.save(`ticket-${ticketData.id}.pdf`);
});

document.getElementById("btnNuevaCompra").addEventListener("click", () => {
    window.location.href = "encuesta.html";
});