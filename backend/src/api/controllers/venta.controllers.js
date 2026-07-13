import { Venta, DetalleVenta, Producto, Subcategoria, Categoria } from "../models/index.js";
import { sequelize } from "../models/index.js";

export const crearVenta = async (req, res) => {

    const t = await sequelize.transaction();

    try {
        const { nombre_cliente, productos } = req.body;

        const idsProductos = productos.map(p => p.id_producto);
        const productosDB = await Producto.findAll({ where: { id: idsProductos } });

        if (productosDB.length !== idsProductos.length) {
            await t.rollback();
            return res.status(400).json({ message: "Alguno de los productos no existe" });
        }

        for (const item of productos) {
            const productoDB = productosDB.find(p => p.id === item.id_producto);
            if (productoDB.stock < item.cantidad) {
                await t.rollback();
                return res.status(400).json({
                    message: `No hay stock suficiente de "${productoDB.nombre}" (disponible: ${productoDB.stock})`
                });
            }
        }

        let total = 0;
        const detalles = productos.map(item => {
            const productoDB = productosDB.find(p => p.id === item.id_producto);
            const subtotal = Number(productoDB.precio) * item.cantidad;
            total += subtotal;
            return {
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: productoDB.precio
            };
        });

        const nuevaVenta = await Venta.create({
            nombre_cliente,
            precio_total: total
        }, { transaction: t });

        await DetalleVenta.bulkCreate(
            detalles.map(d => ({ ...d, id_venta: nuevaVenta.id })),
            { transaction: t }
        );

        for (const item of productos) {
            const productoDB = productosDB.find(p => p.id === item.id_producto);
            await productoDB.decrement("stock", { by: item.cantidad, transaction: t });
        }

        await t.commit();

        const ventaCompleta = await Venta.findByPk(nuevaVenta.id, {
            include: [{ model: Producto, as: "productos", through: { attributes: ["cantidad", "precio_unitario"] } }]
        });

        res.status(201).json({ message: "Venta registrada correctamente", venta: ventaCompleta });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Error al registrar la venta" });
    }
}

export const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [{
                model: Producto,
                as: "productos",
                through: { attributes: ["cantidad", "precio_unitario"] }
            }],
            order: [["fecha", "DESC"]]
        });

        res.json(ventas);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las ventas" });
    }
}