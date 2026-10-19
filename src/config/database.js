import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const dialect = process.env.DB_DIALECT || "postgres";

export const sequelize = dialect === "sqlite"
  ? new Sequelize({
      dialect: "sqlite",
      storage: process.env.DB_STORAGE || "./datapet.sqlite",
      logging: false
    })
  : new Sequelize(
      process.env.DB_NAME || "datapet_db",
      process.env.DB_USER || "postgres",
      process.env.DB_PASSWORD || "",
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        dialect,
        logging: false
      }
    );