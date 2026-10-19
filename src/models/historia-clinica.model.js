import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const HistoriaClinica = sequelize.define("HistoriaClinica", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  diagnostico: { type: DataTypes.TEXT, allowNull: false },
  tratamiento: { type: DataTypes.TEXT, allowNull: false },
  observaciones: { type: DataTypes.TEXT, allowNull: true },
  mascotaId: { type: DataTypes.INTEGER, allowNull: false },
  veterinarioId: { type: DataTypes.INTEGER, allowNull: false },
  citaId: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: "historias_clinicas", underscored: true });