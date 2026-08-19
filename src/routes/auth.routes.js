// src/routes/auth.routes.js

import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import {
  generalRateLimiter,
  loginRateLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Register
router.post(
  "/register",
  generalRateLimiter,
  authController.register
);

// Login
router.post(
  "/login",
  loginRateLimiter,
  authController.login
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Logout current device/session
router.post(
  "/logout",
  authMiddleware,
  authController.logout
);

// Logout all devices
router.post(
  "/logout-all",
  authMiddleware,
  authController.logoutAllDevices
);

export default router;