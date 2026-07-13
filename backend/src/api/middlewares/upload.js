import multer from "multer";
import { join, __dirname } from "../utils/index.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, "src/public/uploads"));
    },
    filename: (req, file, cb) => {
        const nombreUnico = `${Date.now()}-${file.originalname}`;
        cb(null, nombreUnico);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten archivos de imagen"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;