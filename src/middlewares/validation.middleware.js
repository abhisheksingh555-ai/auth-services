import AppError from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(
        new AppError(
          "Validation failed",
          400,
          ERROR_CODES.VALIDATION_ERROR,
          result.error.flatten()
        )
      );
    }

    req.validated = result.data;

    next();
  };
};

export default validate;