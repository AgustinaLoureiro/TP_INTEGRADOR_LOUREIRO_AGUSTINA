import { Encuesta } from "../models/index.js";

export const crearEncuesta = async (req, res) => {
    try {
        const { comentario, email, puntaje, id_venta } = req.body;

        const acepta_novedades = req.body.acepta_novedades === "on" || req.body.acepta_novedades === "true";

        const nuevaEncuesta = await Encuesta.create({
            comentario,
            email,
            puntaje,
            acepta_novedades,
            id_venta: id_venta || null,
            imagen: req.file ? req.file.filename : null
        });

        res.status(201).json({ message: "¡Gracias por tu opinión!", encuesta: nuevaEncuesta });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al guardar la encuesta" });
    }
}

export const getEncuestas = async (req, res) => {
    try {
        const encuestas = await Encuesta.findAll({ order: [["fecha", "DESC"]] });
        res.json(encuestas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las encuestas" });
    }
}