import { Router } from "express";
import { crearEncuesta, getEncuestas } from "../controllers/encuesta.controllers.js";
import { requireLoginApi } from "../middlewares/middlewares.js";
import { validateEncuesta } from "../middlewares/validators.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post("/", upload.single("imagen"), validateEncuesta, crearEncuesta);
router.get("/", requireLoginApi, getEncuestas);

export default router;