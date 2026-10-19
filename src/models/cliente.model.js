import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Cliente = sequelize.define("Cliente", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  identificacion: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  telefono: { type: DataTypes.STRING(30), allowNull: false },
  correo: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
  direccion: { type: DataTypes.STRING(200), allowNull: true }
}, { tableName: "clientes", underscored: true });