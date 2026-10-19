import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Mascota = sequelize.define("Mascota", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  especie: { type: DataTypes.STRING(60), allowNull: false },
  raza: { type: DataTypes.STRING(100), allowNull: true },
  fechaNacimiento: { type: DataTypes.DATEONLY, allowNull: true },
  sexo: { type: DataTypes.ENUM("MACHO", "HEMBRA", "NO_ESPECIFICADO"), allowNull: false },
  clienteId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: "mascotas", underscored: true });