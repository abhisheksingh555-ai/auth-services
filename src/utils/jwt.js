import jwt from "jsonwebtoken";
import config from "../config/env.js";

const signAccessToken = (payload) => {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    issuer: config.JWT_ISSUER,
    audience: config.JWT_AUDIENCE,
  });
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    issuer: config.JWT_ISSUER,
    audience: config.JWT_AUDIENCE,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(
    token,
    config.JWT_ACCESS_SECRET,
    {
      issuer: config.JWT_ISSUER,
      audience: config.JWT_AUDIENCE,
    }
  );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    config.JWT_REFRESH_SECRET,
    {
      issuer: config.JWT_ISSUER,
      audience: config.JWT_AUDIENCE,
    }
  );
};

export const jwtUtils = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};