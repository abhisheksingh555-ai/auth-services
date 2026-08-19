// src/controllers/password.controller.js

import { passwordService } from "../services/password.service.js";
import { response } from "../utils/response.js";

const changePassword = async (
  req,
  res,
  next
) => {
  try {
    const { userId } = req.auth;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    await passwordService.changePassword({
      userId,
      currentPassword,
      newPassword,
    });

    return response.success(res, {
      statusCode: 200,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;

    await passwordService.forgotPassword(
      email
    );

    /*
     * Always return a generic response.
     * This prevents user enumeration.
     */

    return response.success(res, {
      statusCode: 200,
      message:
        "If the account exists, password reset instructions have been sent",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    const {
      token,
      newPassword,
    } = req.body;

    await passwordService.resetPassword({
      token,
      newPassword,
    });

    return response.success(res, {
      statusCode: 200,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const passwordController = {
  changePassword,
  forgotPassword,
  resetPassword,
};