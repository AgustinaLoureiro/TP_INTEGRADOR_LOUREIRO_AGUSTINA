import { Router } from "express";
import { crearVenta, getVentas } from "../controllers/venta.controllers.js";
import { requireLoginApi } from "../middlewares/middlewares.js";
import { validateVenta } from "../middlewares/validators.js";

const router = Router();

router.post("/", validateVenta, crearVenta);
router.get("/", requireLoginApi, getVentas);

export default router;