import bcrypt from "bcrypt";
import { sequelize, Categoria, Subcategoria, Usuario } from "./src/api/models/index.js";

const seed = async () => {
    try {
        await sequelize.sync({ force: false });

        const [plantas] = await Categoria.findOrCreate({ where: { nombre: "Plantas" } });
        const [insumos] = await Categoria.findOrCreate({ where: { nombre: "Insumos y Accesorios" } });

        const subcategoriasPlantas = ["Interior", "Exterior", "Suculentas"];
        const subcategoriasInsumos = ["Macetas", "Herramientas", "Sustratos"];

        for (const nombre of subcategoriasPlantas) {
            await Subcategoria.findOrCreate({ where: { nombre, id_categoria: plantas.id } });
        }
        for (const nombre of subcategoriasInsumos) {
            await Subcategoria.findOrCreate({ where: { nombre, id_categoria: insumos.id } });
        }

        const existeAdmin = await Usuario.findOne({ where: { email: "admin@brote.com" } });
        if (!existeAdmin) {
            const passwordHasheado = await bcrypt.hash("admin123", 10);
            await Usuario.create({
                nombre: "Admin",
                email: "admin@brote.com",
                password: passwordHasheado
            });
            console.log("Usuario admin creado: admin@brote.com / admin123");
        } else {
            console.log("El usuario admin ya existia, no se creo de nuevo");
        }

        console.log("Seed completado correctamente");
        process.exit(0);

    } catch (error) {
        console.error("Error al ejecutar el seed:", error);
        process.exit(1);
    }
}

seed();