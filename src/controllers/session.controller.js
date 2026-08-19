// src/controllers/session.controller.js

import { sessionService } from "../services/session.service.js";
import { response } from "../utils/response.js";

const getCurrentSession = async (
  req,
  res,
  next
) => {
  try {
    const { sessionId } = req.auth;

    const session =
      await sessionService.getSession(
        sessionId
      );

    if (!session) {
      return response.error(res, {
        statusCode: 404,
        message: "Session not found",
        code: "SESSION_NOT_FOUND",
      });
    }

    return response.success(res, {
      statusCode: 200,
      message: "Current session retrieved",
      data: {
        session,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMySessions = async (
  req,
  res,
  next
) => {
  try {
    const { userId } = req.auth;

    const sessions =
      await sessionService.getUserSessions(
        userId,
        true
      );

    return response.success(res, {
      statusCode: 200,
      message: "Sessions retrieved",
      data: {
        sessions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const revokeSession = async (
  req,
  res,
  next
) => {
  try {
    const { sessionId } = req.params;

    await sessionService.revokeSession(
      sessionId,
      "manual_revoke"
    );

    return response.success(res, {
      statusCode: 200,
      message: "Session revoked",
    });
  } catch (error) {
    next(error);
  }
};

const revokeOtherSessions = async (
  req,
  res,
  next
) => {
  try {
    const { userId, sessionId } = req.auth;

    await sessionService.revokeOtherSessions(
      userId,
      sessionId
    );

    return response.success(res, {
      statusCode: 200,
      message: "Other sessions revoked",
    });
  } catch (error) {
    next(error);
  }
};

const revokeAllSessions = async (
  req,
  res,
  next
) => {
  try {
    const { userId } = req.auth;

    await sessionService.revokeAllSessions(
      userId,
      "logout_all_devices"
    );

    return response.success(res, {
      statusCode: 200,
      message: "All sessions revoked",
    });
  } catch (error) {
    next(error);
  }
};

export const sessionController = {
  getCurrentSession,
  getMySessions,
  revokeSession,
  revokeOtherSessions,
  revokeAllSessions,
};