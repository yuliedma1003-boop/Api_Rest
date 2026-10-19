import { UniqueConstraintError, ForeignKeyConstraintError, ValidationError } from "sequelize";
import { ApiError } from "../utils/api-error.js";
import { responseError } from "../utils/response.js";

export const notFound = (req, res) =>
  responseError(res, `No existe la ruta ${req.method} ${req.originalUrl}`, "ROUTE_NOT_FOUND", 404);

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof ApiError) {
    return responseError(res, error.message, error.code, error.statusCode);
  }

  if (error instanceof UniqueConstraintError) {
    return responseError(res, "Ya existe un registro con esos datos", "DUPLICATE_RESOURCE", 409);
  }

  if (error instanceof ForeignKeyConstraintError) {
    return responseError(res, "La operación entra en conflicto con una relación existente", "RESOURCE_CONFLICT", 409);
  }

  if (error instanceof ValidationError) {
    return responseError(res, "Los datos no cumplen las reglas del modelo", "MODEL_VALIDATION_ERROR", 400);
  }

  if (error instanceof SyntaxError && "body" in error) {
    return responseError(res, "El cuerpo de la solicitud contiene JSON inválido", "INVALID_JSON", 400);
  }

  console.error(error);
  return responseError(res, "Error interno del servidor", "INTERNAL_SERVER_ERROR", 500);
};