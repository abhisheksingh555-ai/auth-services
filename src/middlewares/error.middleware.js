import AppError from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }
  console.error(err);
  return res.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    },
  });
};

export default errorMiddleware;