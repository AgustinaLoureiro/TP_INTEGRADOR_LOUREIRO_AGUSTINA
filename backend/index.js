import express from "express";
import cors from "cors";
import session from "express-session";

import environments from "./src/api/config/environments.js";
import { sequelize } from "./src/api/models/index.js";
import { loggerURL } from "./src/api/middlewares/middlewares.js";
import { join, __dirname } from "./src/api/utils/index.js";
import {
    authRoutes,
    userRoutes,
    productoRoutes,
    categoriaRoutes,
    ventaRoutes,
    encuestaRoutes,
    viewRoutes
} from "./src/api/routes/index.js";

const { port, session_key } = environments;
const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "src/views"));

app.use(cors());
app.use(loggerURL);
app.use(express.json());                         // parsea JSON (fetch/axios)
app.use(express.urlencoded({ extended: true }));  // parsea <form> tradicional
app.use(express.static(join(__dirname, "src/public"))); // sirve CSS/JS/imagenes

app.use(session({
    secret: session_key,
    resave: false,
    saveUninitialized: true
}));

app.use("/api/productos", productoRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/encuestas", encuestaRoutes);
app.use("/admin", authRoutes);
app.use("/admin", viewRoutes);

app.get("/", (req, res) => res.redirect("/admin/login"));

sequelize.sync({ alter: true })
    .then(() => {
        console.log("Base de datos sincronizada correctamente");
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar/sincronizar la base de datos:", error);
    });