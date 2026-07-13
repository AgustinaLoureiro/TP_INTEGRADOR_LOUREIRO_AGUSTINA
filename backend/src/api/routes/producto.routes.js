import { Router } from "express";
import {
    getProductos,
    getProductoById,
    crearProducto,
    modificarProducto,
    desactivarProducto,
    activarProducto
} from "../controllers/producto.controllers.js";
import { validateId, requireLoginApi } from "../middlewares/middlewares.js";
import { validateProducto } from "../middlewares/validators.js";
import upload from "../middlewares/upload.js";

const router = Router();

// Publicas
router.get("/", getProductos);
router.get("/:id", validateId, getProductoById);

// Protegidas
router.post("/", requireLoginApi, upload.single("imagen"), validateProducto, crearProducto);
router.put("/:id", requireLoginApi, validateId, upload.single("imagen"), validateProducto, modificarProducto);
router.patch("/:id/baja", requireLoginApi, validateId, desactivarProducto);
router.patch("/:id/alta", requireLoginApi, validateId, activarProducto);

export default router;