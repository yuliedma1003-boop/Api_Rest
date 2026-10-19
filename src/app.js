import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import apiRoutes from "./routes/index.js";
import { openapi } from "./docs/openapi.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { responseSuccess } from "./utils/response.js";
import { sequelize } from "./config/database.js";

const app = express();
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get("/", (req, res) => responseSuccess(res, "DataPet API funcionando correctamente"));
app.get("/health", async (req, res) => {
	await sequelize.authenticate();
	return responseSuccess(res, "API y base de datos disponibles", {
		api: "connected",
		database: "connected"
	});
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.use("/api/v1", apiRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;