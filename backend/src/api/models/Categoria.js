import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Categoria = sequelize.define("Categoria", {
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
    tableName: "categorias",
    timestamps: true
});

export default Categoria;