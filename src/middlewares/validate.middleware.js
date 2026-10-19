import { responseError } from "../utils/response.js";

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return responseError(
      res,
      "Los datos enviados no son válidos",
      result.error.issues.map(({ path, message }) => ({
        campo: path.join("."),
        mensaje: message
      })),
      400
    );
  }

  req.body = result.data;
  next();
};