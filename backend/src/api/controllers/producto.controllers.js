import { Producto, Subcategoria, Categoria } from "../models/index.js";

export const getProductos = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 8;
        const offset = (pagina - 1) * limite;

        const where = req.query.soloActivos === "true" ? { activo: true } : {};

        const { count, rows } = await Producto.findAndCountAll({
            where,
            limit: limite,
            offset,
            include: [{
                model: Subcategoria,
                as: "subcategoria",
                required: !!req.query.id_categoria,
                where: req.query.id_categoria ? { id_categoria: req.query.id_categoria } : undefined,
                include: [{ model: Categoria, as: "categoria" }]
            }],
            order: [["id", "DESC"]]
        });

        res.json({
            productos: rows,
            paginaActual: pagina,
            totalPaginas: Math.ceil(count / limite),
            totalProductos: count
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
}

export const getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.id, {
            include: [{ model: Subcategoria, as: "subcategoria" }]
        });

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(producto);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el producto" });
    }
}

export const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, id_subcategoria } = req.body;

        const nuevoProducto = await Producto.create({
            nombre,
            descripcion,
            precio,
            stock,
            id_subcategoria,
            imagen: req.file ? req.file.filename : null,
            activo: true
        });

        res.status(201).json({ message: "Producto creado correctamente", producto: nuevoProducto });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el producto" });
    }
}

export const modificarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.id);

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const { nombre, descripcion, precio, stock, id_subcategoria } = req.body;

        producto.nombre = nombre ?? producto.nombre;
        producto.descripcion = descripcion ?? producto.descripcion;
        producto.precio = precio ?? producto.precio;
        producto.stock = stock ?? producto.stock;
        producto.id_subcategoria = id_subcategoria ?? producto.id_subcategoria;

        if (req.file) {
            producto.imagen = req.file.filename;
        }

        await producto.save();

        res.json({ message: "Producto modificado correctamente", producto });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al modificar el producto" });
    }
}

export const desactivarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.id);
        if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

        producto.activo = false;
        await producto.save();

        res.json({ message: "Producto desactivado", producto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al desactivar el producto" });
    }
}

export const activarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.id);
        if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

        producto.activo = true;
        await producto.save();

        res.json({ message: "Producto activado", producto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al activar el producto" });
    }
}

// VISTAS EJS
export const dashboardView = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [{
                model: Subcategoria,
                as: "subcategoria",
                include: [{ model: Categoria, as: "categoria" }]
            }],
            order: [["id", "DESC"]]
        });

        res.render("dashboard", {
            title: "Panel de administracion",
            usuario: req.session.user,
            productos
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el dashboard");
    }
}

export const nuevoProductoView = async (req, res) => {
    const categorias = await Categoria.findAll({
        include: [{ model: Subcategoria, as: "subcategorias" }]
    });

    res.render("producto-form", {
        title: "Nuevo producto",
        usuario: req.session.user,
        producto: null,
        categorias
    });
}

export const editarProductoView = async (req, res) => {
    const producto = await Producto.findByPk(req.params.id);
    const categorias = await Categoria.findAll({
        include: [{ model: Subcategoria, as: "subcategorias" }]
    });

    if (!producto) {
        return res.status(404).send("Producto no encontrado");
    }

    res.render("producto-form", {
        title: "Editar producto",
        usuario: req.session.user,
        producto,
        categorias
    });
}