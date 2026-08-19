// src/routes/otp.routes.js

import { Router } from "express";

import { otpController } from "../controllers/otp.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  otpRateLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Protected OTP Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/send",
  authMiddleware,
  otpRateLimiter,
  otpController.generateOtp
);

router.post(
  "/verify",
  authMiddleware,
  otpRateLimiter,
  otpController.verifyOtp
);

export default router;