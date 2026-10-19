import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Veterinario = sequelize.define("Veterinario", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  registroProfesional: { type: DataTypes.STRING(40), allowNull: false, unique: true },
  especialidad: { type: DataTypes.STRING(100), allowNull: false },
  telefono: { type: DataTypes.STRING(30), allowNull: false },
  correo: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } }
}, { tableName: "veterinarios", underscored: true });