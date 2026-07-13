import { Op, fn, col, literal } from "sequelize";
import {
    Producto, Venta, DetalleVenta, LogAcceso, Usuario, Encuesta
} from "../models/index.js";
import ExcelJS from "exceljs";

async function getTop10ProductosVendidos() {
    return DetalleVenta.findAll({
        attributes: [
            "id_producto",
            [fn("SUM", col("cantidad")), "totalVendido"]
        ],
        include: [{ model: Producto, attributes: ["nombre", "precio"] }],
        group: ["id_producto", "Producto.id"],
        order: [[literal("totalVendido"), "DESC"]],
        limit: 10
    });
}

async function getTop10VentasMasCaras() {
    return Venta.findAll({
        order: [["precio_total", "DESC"]],
        limit: 10
    });
}

async function getLogsAcceso() {
    return LogAcceso.findAll({
        include: [{ model: Usuario, attributes: ["nombre", "email"] }],
        order: [["fecha", "DESC"]],
        limit: 30
    });
}

async function getEstadisticasExtra() {
    const totalFacturado = await Venta.sum("precio_total") || 0;
    const cantidadVentas = await Venta.count();

    const promedioPuntaje = await Encuesta.findOne({
        attributes: [[fn("AVG", col("puntaje")), "promedio"]],
        raw: true
    });

    return {
        totalFacturado: Number(totalFacturado).toFixed(2),
        cantidadVentas,
        promedioEncuestas: promedioPuntaje?.promedio ? Number(promedioPuntaje.promedio).toFixed(2) : "Sin datos"
    };
}

// Vista EJS:
export const registrosView = async (req, res) => {
    try {
        const [topProductos, topVentas, logs, estadisticas] = await Promise.all([
            getTop10ProductosVendidos(),
            getTop10VentasMasCaras(),
            getLogsAcceso(),
            getEstadisticasExtra()
        ]);

        res.render("registros", {
            title: "Registros",
            usuario: req.session.user,
            topProductos,
            topVentas,
            logs,
            estadisticas
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar los registros");
    }
}


// Excel:
export const descargarExcelVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [{ model: Producto, as: "productos", through: { attributes: ["cantidad", "precio_unitario"] } }],
            order: [["fecha", "DESC"]]
        });

        const workbook = new ExcelJS.Workbook();
        const hoja = workbook.addWorksheet("Ventas");

        hoja.columns = [
            { header: "ID Venta", key: "id", width: 10 },
            { header: "Cliente", key: "cliente", width: 25 },
            { header: "Fecha", key: "fecha", width: 20 },
            { header: "Producto", key: "producto", width: 30 },
            { header: "Cantidad", key: "cantidad", width: 12 },
            { header: "Precio unitario", key: "precioUnitario", width: 15 },
            { header: "Subtotal", key: "subtotal", width: 15 },
            { header: "Total venta", key: "total", width: 15 }
        ];
        hoja.getRow(1).font = { bold: true };

        ventas.forEach(venta => {
            venta.productos.forEach(producto => {
                const detalle = producto.DetalleVenta;
                hoja.addRow({
                    id: venta.id,
                    cliente: venta.nombre_cliente,
                    fecha: venta.fecha,
                    producto: producto.nombre,
                    cantidad: detalle.cantidad,
                    precioUnitario: Number(detalle.precio_unitario),
                    subtotal: Number(detalle.precio_unitario) * detalle.cantidad,
                    total: Number(venta.precio_total)
                });
            });
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=ventas.xlsx");

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al generar el Excel de ventas");
    }
}

export const descargarExcelEncuestas = async (req, res) => {
    try {
        const encuestas = await Encuesta.findAll({ order: [["fecha", "DESC"]] });

        const workbook = new ExcelJS.Workbook();
        const hoja = workbook.addWorksheet("Encuestas");

        hoja.columns = [
            { header: "ID", key: "id", width: 8 },
            { header: "Email", key: "email", width: 28 },
            { header: "Comentario", key: "comentario", width: 50 },
            { header: "Puntaje", key: "puntaje", width: 10 },
            { header: "Acepta novedades", key: "acepta", width: 16 },
            { header: "Fecha", key: "fecha", width: 20 }
        ];
        hoja.getRow(1).font = { bold: true };

        encuestas.forEach(e => {
            hoja.addRow({
                id: e.id,
                email: e.email,
                comentario: e.comentario,
                puntaje: e.puntaje,
                acepta: e.acepta_novedades ? "Si" : "No",
                fecha: e.fecha
            });
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=encuestas.xlsx");

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al generar el Excel de encuestas");
    }
}