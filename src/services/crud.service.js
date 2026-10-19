import { ApiError } from "../utils/api-error.js";

const parseId = (value) => {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new ApiError(400, "El id debe ser un entero positivo", "INVALID_ID");
  }
  return id;
};

export const createCrudService = (Model, resourceName) => ({
  list: () => Model.findAll({ order: [["id", "ASC"]] }),

  getById: async (value) => {
    const record = await Model.findByPk(parseId(value));
    if (!record) {
      throw new ApiError(404, `${resourceName} no encontrado`, "RESOURCE_NOT_FOUND");
    }
    return record;
  },

  create: (data) => Model.create(data),

  update: async (value, data) => {
    const record = await Model.findByPk(parseId(value));
    if (!record) {
      throw new ApiError(404, `${resourceName} no encontrado`, "RESOURCE_NOT_FOUND");
    }
    await record.update(data);
    return record;
  },

  remove: async (value) => {
    const record = await Model.findByPk(parseId(value));
    if (!record) {
      throw new ApiError(404, `${resourceName} no encontrado`, "RESOURCE_NOT_FOUND");
    }
    await record.destroy();
  }
});