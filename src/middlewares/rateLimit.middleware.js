import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import { redisClient } from "../config/redis.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const createRateLimiter = ({
  windowMs,
  limit,
  message = "Too many requests. Please try again later.",
}) => {
  return rateLimit({
    windowMs,
    limit,

    standardHeaders: "draft-7",
    legacyHeaders: false,

    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),

    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: {
          code: ERROR_CODES.TOO_MANY_REQUESTS,
          message,
        },
      });
    },
  });
};

export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many login attempts. Please try again after 15 minutes.",
});

export const otpRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  message: "Too many OTP requests. Please try again later.",
});

export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: "Too many password reset requests. Please try again later.",
});

export const generalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});