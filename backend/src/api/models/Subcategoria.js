import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Subcategoria = sequelize.define("Subcategoria", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: "subcategorias",
    timestamps: true
});

export default Subcategoria;