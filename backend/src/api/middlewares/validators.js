import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Datos invalidos",
            errores: errors.array().map(e => e.msg)
        });
    }
    next();
}

const validateProducto = [
    body("nombre")
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 2, max: 150 }).withMessage("El nombre debe tener entre 2 y 150 caracteres"),
    body("descripcion")
        .optional({ checkFalsy: true })
        .isLength({ max: 2000 }).withMessage("La descripcion es demasiado larga"),
    body("precio")
        .notEmpty().withMessage("El precio es obligatorio")
        .isFloat({ gt: 0 }).withMessage("El precio debe ser un numero mayor a 0"),
    body("stock")
        .notEmpty().withMessage("El stock es obligatorio")
        .isInt({ min: 0 }).withMessage("El stock debe ser un numero entero mayor o igual a 0"),
    body("id_subcategoria")
        .notEmpty().withMessage("Debe seleccionar una subcategoria")
        .isInt().withMessage("Subcategoria invalida"),
    handleValidationErrors
];

const validateLogin = [
    body("email")
        .trim()
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El email no es valido"),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria"),
    handleValidationErrors
];

const validateNuevoUsuario = [
    body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("email").trim().isEmail().withMessage("El email no es valido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    handleValidationErrors
];

const validateVenta = [
    body("nombre_cliente").trim().notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("productos")
        .isArray({ min: 1 }).withMessage("El carrito debe tener al menos un producto"),
    body("productos.*.id_producto").isInt().withMessage("Producto invalido"),
    body("productos.*.cantidad").isInt({ min: 1 }).withMessage("La cantidad debe ser mayor a 0"),
    handleValidationErrors
];

const validateEncuesta = [
    body("comentario").trim().notEmpty().withMessage("El comentario es obligatorio"),
    body("email").trim().isEmail().withMessage("El email no es valido"),
    body("puntaje").isInt({ min: 1, max: 5 }).withMessage("El puntaje debe ser entre 1 y 5"),
    handleValidationErrors
];

export {
    validateProducto,
    validateLogin,
    validateNuevoUsuario,
    validateVenta,
    validateEncuesta
};