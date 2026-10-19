import { responseSuccess } from "../utils/response.js";

export const createCrudController = (service, resourceName) => ({
  list: async (req, res) => {
    const records = await service.list();
    return responseSuccess(res, `${resourceName} consultados correctamente`, records);
  },

  getById: async (req, res) => {
    const record = await service.getById(req.params.id);
    return responseSuccess(res, `${resourceName} consultado correctamente`, record);
  },

  create: async (req, res) => {
    const record = await service.create(req.body);
    return responseSuccess(res, `${resourceName} creado correctamente`, record, 201);
  },

  update: async (req, res) => {
    const record = await service.update(req.params.id, req.body);
    return responseSuccess(res, `${resourceName} actualizado correctamente`, record);
  },

  remove: async (req, res) => {
    await service.remove(req.params.id);
    return responseSuccess(res, `${resourceName} eliminado correctamente`);
  }
});