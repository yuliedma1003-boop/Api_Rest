import { Cliente } from "./cliente.model.js";
import { Mascota } from "./mascota.model.js";
import { Veterinario } from "./veterinario.model.js";
import { Cita } from "./cita.model.js";
import { HistoriaClinica } from "./historia-clinica.model.js";

Cliente.hasMany(Mascota, { foreignKey: "clienteId", as: "mascotas", onDelete: "RESTRICT" });
Mascota.belongsTo(Cliente, { foreignKey: "clienteId", as: "cliente" });

Mascota.hasMany(Cita, { foreignKey: "mascotaId", as: "citas", onDelete: "RESTRICT" });
Cita.belongsTo(Mascota, { foreignKey: "mascotaId", as: "mascota" });
Veterinario.hasMany(Cita, { foreignKey: "veterinarioId", as: "citas", onDelete: "RESTRICT" });
Cita.belongsTo(Veterinario, { foreignKey: "veterinarioId", as: "veterinario" });

Mascota.hasMany(HistoriaClinica, { foreignKey: "mascotaId", as: "historiasClinicas", onDelete: "RESTRICT" });
HistoriaClinica.belongsTo(Mascota, { foreignKey: "mascotaId", as: "mascota" });
Veterinario.hasMany(HistoriaClinica, { foreignKey: "veterinarioId", as: "historiasClinicas", onDelete: "RESTRICT" });
HistoriaClinica.belongsTo(Veterinario, { foreignKey: "veterinarioId", as: "veterinario" });
Cita.hasOne(HistoriaClinica, { foreignKey: "citaId", as: "historiaClinica", onDelete: "SET NULL" });
HistoriaClinica.belongsTo(Cita, { foreignKey: "citaId", as: "cita" });

export { Cliente, Mascota, Veterinario, Cita, HistoriaClinica };