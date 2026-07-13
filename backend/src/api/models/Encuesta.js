import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Encuesta = sequelize.define("Encuesta", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comentario: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    acepta_novedades: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    puntaje: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "encuestas",
    timestamps: false
});

export default Encuesta;