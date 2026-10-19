import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Cita = sequelize.define("Cita", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fechaHora: { type: DataTypes.DATE, allowNull: false },
  motivo: { type: DataTypes.STRING(500), allowNull: false },
  estado: {
    type: DataTypes.ENUM("PROGRAMADA", "CONFIRMADA", "ATENDIDA", "CANCELADA"),
    allowNull: false,
    defaultValue: "PROGRAMADA"
  },
  mascotaId: { type: DataTypes.INTEGER, allowNull: false },
  veterinarioId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: "citas", underscored: true });