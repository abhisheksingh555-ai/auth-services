// src/routes/password.routes.js

import { Router } from "express";

import { passwordController } from "../controllers/password.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  passwordResetRateLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
| User must already be authenticated.
*/

router.post(
  "/change",
  authMiddleware,
  passwordController.changePassword
);

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
| Public route.
*/

router.post(
  "/forgot",
  passwordResetRateLimiter,
  passwordController.forgotPassword
);

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
| Public route.
*/

router.post(
  "/reset",
  passwordResetRateLimiter,
  passwordController.resetPassword
);

export default router;