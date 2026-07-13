import { Categoria, Subcategoria } from "../models/index.js";

export const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            include: [{ model: Subcategoria, as: "subcategorias" }],
            order: [["id", "ASC"]]
        });

        res.json(categorias);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las categorias" });
    }
}