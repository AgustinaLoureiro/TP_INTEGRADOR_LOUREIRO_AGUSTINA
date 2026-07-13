import { Router } from "express";
import { dashboardView, nuevoProductoView, editarProductoView } from "../controllers/producto.controllers.js";
import { registrosView, descargarExcelVentas, descargarExcelEncuestas } from "../controllers/registro.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";

const router = Router();

router.get("/dashboard", requireLogin, dashboardView);
router.get("/productos/nuevo", requireLogin, nuevoProductoView);
router.get("/productos/:id/editar", requireLogin, editarProductoView);
router.get("/registros", requireLogin, registrosView);
router.get("/ventas/excel", requireLogin, descargarExcelVentas);
router.get("/encuestas/excel", requireLogin, descargarExcelEncuestas);

export default router;