import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const DetalleVenta = sequelize.define("DetalleVenta", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: "detalle_ventas",
    timestamps: false
});

export default DetalleVenta;