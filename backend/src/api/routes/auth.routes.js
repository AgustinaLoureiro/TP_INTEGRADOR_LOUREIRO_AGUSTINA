import { Router } from "express";
import { loginView, login, logout, crearUsuario } from "../controllers/auth.controllers.js";
import { validateLogin, validateNuevoUsuario } from "../middlewares/validators.js";

const router = Router();

router.get("/login", loginView);
router.post("/login", validateLogin, login);
router.get("/logout", logout);

export default router;

export { crearUsuario, validateNuevoUsuario };