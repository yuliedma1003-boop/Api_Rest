import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./config/database.js";
import "./models/index.js";

dotenv.config();

const port = Number(process.env.PORT || 3000);

try {
  await sequelize.authenticate();
  if (process.env.DB_SYNC === "true") {
    await sequelize.sync();
  }
  app.listen(port, () => console.log(`DataPet API disponible en http://localhost:${port}`));
} catch (error) {
  console.error("No fue posible iniciar DataPet. Verifica la conexión y las variables de PostgreSQL.", error.message);
  process.exitCode = 1;
}