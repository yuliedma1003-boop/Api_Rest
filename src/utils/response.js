export const responseSuccess = (res, mensaje, data = null, code = 200) =>
  res.status(code).json({
    status: "success",
    mensaje,
    data,
    error: null,
    code
  });

export const responseError = (res, mensaje, error = null, code = 500) =>
  res.status(code).json({
    status: "error",
    mensaje,
    data: null,
    error,
    code
  });