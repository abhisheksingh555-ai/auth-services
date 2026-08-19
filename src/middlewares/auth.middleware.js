import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(
      new AppError(
        "Authentication required",
        401,
        ERROR_CODES.AUTH_REQUIRED
      )
    );
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return next(
      new AppError(
        "Invalid or expired access token",
        401,
        ERROR_CODES.INVALID_ACCESS_TOKEN
      )
    );
  }
};

export default authMiddleware;