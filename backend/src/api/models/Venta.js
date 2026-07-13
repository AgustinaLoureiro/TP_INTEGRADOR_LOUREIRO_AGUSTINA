import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Venta = sequelize.define("Venta", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_cliente: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    precio_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: "ventas",
    timestamps: true
});

export default Venta;