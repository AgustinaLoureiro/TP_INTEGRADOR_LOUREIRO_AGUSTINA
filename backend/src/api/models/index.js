import sequelize from "../database/db.js";

import Categoria from "./Categoria.js";
import Subcategoria from "./Subcategoria.js";
import Producto from "./Producto.js";
import Usuario from "./Usuario.js";
import Venta from "./Venta.js";
import DetalleVenta from "./DetalleVenta.js";
import Encuesta from "./Encuesta.js";
import LogAcceso from "./LogAcceso.js";

Categoria.hasMany(Subcategoria, { foreignKey: "id_categoria", as: "subcategorias" });
Subcategoria.belongsTo(Categoria, { foreignKey: "id_categoria", as: "categoria" });

Subcategoria.hasMany(Producto, { foreignKey: "id_subcategoria", as: "productos" });
Producto.belongsTo(Subcategoria, { foreignKey: "id_subcategoria", as: "subcategoria" });

Venta.belongsToMany(Producto, {
    through: DetalleVenta,
    foreignKey: "id_venta",
    otherKey: "id_producto",
    as: "productos"
});
Producto.belongsToMany(Venta, {
    through: DetalleVenta,
    foreignKey: "id_producto",
    otherKey: "id_venta",
    as: "ventas"
});

Venta.hasMany(DetalleVenta, { foreignKey: "id_venta", as: "detalles" });
DetalleVenta.belongsTo(Venta, { foreignKey: "id_venta" });
Producto.hasMany(DetalleVenta, { foreignKey: "id_producto" });
DetalleVenta.belongsTo(Producto, { foreignKey: "id_producto" });

Venta.hasOne(Encuesta, { foreignKey: "id_venta", as: "encuesta" });
Encuesta.belongsTo(Venta, { foreignKey: "id_venta" });

Usuario.hasMany(LogAcceso, { foreignKey: "id_usuario", as: "logs" });
LogAcceso.belongsTo(Usuario, { foreignKey: "id_usuario" });

export {
    sequelize,
    Categoria,
    Subcategoria,
    Producto,
    Usuario,
    Venta,
    DetalleVenta,
    Encuesta,
    LogAcceso
};