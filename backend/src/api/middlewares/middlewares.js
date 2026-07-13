const loggerURL = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
}

const validateId = (req, res, next) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ message: "El ID debe ser un numero entero positivo" });
    }

    req.id = parseInt(id, 10);
    next();
}

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/admin/login");
    }
    next();
}

const requireLoginApi = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "No autorizado. Inicie sesion." });
    }
    next();
}

export {
    loggerURL,
    validateId,
    requireLogin,
    requireLoginApi
}