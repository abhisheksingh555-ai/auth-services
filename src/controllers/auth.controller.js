// src/controllers/auth.controller.js

import { authService } from "../services/auth.service.js";
import { response } from "../utils/response.js";

const register = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    const user = await authService.register({
      username,
      email,
      password,
    });

    return response.success(res, {
      statusCode: 201,
      message: "Registration successful",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const {
      email,
      password,
      deviceId,
    } = req.body;

    const result = await authService.login({
      email,
      password,
      deviceId,
      userAgent: req.get("user-agent"),
      ipAddress: req.ip,
    });

    return response.success(res, {
      statusCode: 200,
      message: "Login successful",
      data: {
        user: result.user,
        session: result.session,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { sessionId } = req.auth;

    await authService.logout(sessionId);

    return response.success(res, {
      statusCode: 200,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

const logoutAllDevices = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    await authService.logoutAllDevices(
      userId
    );

    return response.success(res, {
      statusCode: 200,
      message: "Logged out from all devices",
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  register,
  login,
  logout,
  logoutAllDevices,
};