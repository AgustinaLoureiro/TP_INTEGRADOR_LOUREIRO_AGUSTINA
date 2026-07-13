import { Router } from "express";
import { getCategorias } from "../controllers/categoria.controllers.js";

const router = Router();

router.get("/", getCategorias);

export default router;