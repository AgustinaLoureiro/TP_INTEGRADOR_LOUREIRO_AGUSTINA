import bcrypt from "bcrypt";
import { Usuario, LogAcceso } from "../models/index.js";

// Vista de login
export const loginView = (req, res) => {
    res.render("login", {
        title: "Login administrador",
        error: null
    });
}

// Procesa el login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.render("login", {
                title: "Login administrador",
                error: "Credenciales incorrectas"
            });
        }

        const match = await bcrypt.compare(password, usuario.password);

        if (!match) {
            return res.render("login", {
                title: "Login administrador",
                error: "Credenciales incorrectas"
            });
        }

        req.session.user = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
        };

        await LogAcceso.create({ id_usuario: usuario.id });

        res.redirect("/admin/dashboard");

    } catch (error) {
        console.error(error);
        res.render("login", {
            title: "Login administrador",
            error: "Ocurrio un error al iniciar sesion"
        });
    }
}

export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin/login");
    });
}

// Alta de un usuario administrador
export const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const existe = await Usuario.findOne({ where: { email } });
        if (existe) {
            return res.status(409).json({ message: "Ya existe un usuario con ese email" });
        }

        const passwordHasheado = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: passwordHasheado
        });

        res.status(201).json({
            message: "Usuario creado correctamente",
            usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el usuario" });
    }
}