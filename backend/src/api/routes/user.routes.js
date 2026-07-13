import { Router } from "express";
import { crearUsuario, validateNuevoUsuario } from "./auth.routes.js";

const router = Router();

router.post("/", validateNuevoUsuario, crearUsuario);

export default router;