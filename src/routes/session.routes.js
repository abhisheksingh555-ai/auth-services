// src/routes/session.routes.js

import { Router } from "express";
import { sessionController } from "../controllers/session.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

/*
 * All session routes require authentication.
 */

router.use(authMiddleware);

/*
 * Current session
 */

router.get(
  "/current",
  sessionController.getCurrentSession
);

/*
 * All active sessions of current user
 */

router.get(
  "/",
  sessionController.getMySessions
);

/*
 * Revoke a specific session
 */

router.delete(
  "/:sessionId",
  sessionController.revokeSession
);

/*
 * Revoke all sessions except current
 */

router.post(
  "/revoke-others",
  sessionController.revokeOtherSessions
);

/*
 * Revoke all sessions
 */

router.post(
  "/revoke-all",
  sessionController.revokeAllSessions
);

export default router;