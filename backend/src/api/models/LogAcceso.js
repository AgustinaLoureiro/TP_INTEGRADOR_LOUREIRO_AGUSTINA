import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const LogAcceso = sequelize.define("LogAcceso", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "logs_acceso",
    timestamps: false
});

export default LogAcceso;