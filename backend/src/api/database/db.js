import { Sequelize } from "sequelize";
import environments from "../config/environments.js";

const { database } = environments;

const sequelize = new Sequelize(
    database.name,
    database.user,
    database.password,
    {
        host: database.host,
        dialect: "mysql",
        logging: false 
    }
);

export default sequelize;