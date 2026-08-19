// src/controllers/otp.controller.js

import { otpService } from "../services/otp.service.js";
import { response } from "../utils/response.js";

const generateOtp = async (
  req,
  res,
  next
) => {
  try {
    const { userId } = req.auth;
    const { purpose } = req.body;

    const result =
      await otpService.generateOtp({
        userId,
        purpose,
      });

    /*
     * IMPORTANT:
     * Production mein actual OTP response
     * mein return mat karna.
     *
     * OTP email/SMS provider ke through
     * send hona chahiye.
     */

    return response.success(res, {
      statusCode: 200,
      message: "OTP sent successfully",
      data: {
        otpId: result.otpId,
        expiresAt: result.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (
  req,
  res,
  next
) => {
  try {
    const {
      otpId,
      otp,
    } = req.body;

    await otpService.verifyOtp({
      otpId,
      otp,
    });

    return response.success(res, {
      statusCode: 200,
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const otpController = {
  generateOtp,
  verifyOtp,
};