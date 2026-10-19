import { Router } from "express";
import { Cliente, Mascota, Veterinario, Cita, HistoriaClinica } from "../models/index.js";
import {
  clienteSchema,
  mascotaSchema,
  veterinarioSchema,
  citaSchema,
  historiaClinicaSchema
} from "../schemas/datapet.schema.js";
import { createCrudController } from "../controllers/crud.controller.js";
import { createCrudService } from "../services/crud.service.js";
import { validateBody } from "../middlewares/validate.middleware.js";

const resources = [
  { path: "clientes", label: "Cliente", model: Cliente, schema: clienteSchema },
  { path: "mascotas", label: "Mascota", model: Mascota, schema: mascotaSchema },
  { path: "veterinarios", label: "Veterinario", model: Veterinario, schema: veterinarioSchema },
  { path: "citas", label: "Cita", model: Cita, schema: citaSchema },
  { path: "historias-clinicas", label: "Historia clínica", model: HistoriaClinica, schema: historiaClinicaSchema }
];

const router = Router();

for (const resource of resources) {
  const service = createCrudService(resource.model, resource.label);
  const controller = createCrudController(service, resource.path);
  const resourceRouter = Router();

  resourceRouter.get("/", controller.list);
  resourceRouter.get("/:id", controller.getById);
  resourceRouter.post("/", validateBody(resource.schema), controller.create);
  resourceRouter.put("/:id", validateBody(resource.schema), controller.update);
  resourceRouter.delete("/:id", controller.remove);

  router.use(`/${resource.path}`, resourceRouter);
}

export default router;