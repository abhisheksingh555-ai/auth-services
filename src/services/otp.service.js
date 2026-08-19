import { otpRepository } from "../repositories/otp.repository.js";
import { cryptoUtils } from "../utils/crypto.js";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

const generateOtp = async ({
  userId,
  purpose,
}) => {
  await otpRepository.invalidateActive(
    userId,
    purpose
  );

  const otp = cryptoUtils.generateOtp(
    AUTH_CONSTANTS.OTP_LENGTH
  );

  const otpHash = cryptoUtils.hash(otp);

  const expiresAt = new Date(
    Date.now() +
      AUTH_CONSTANTS.OTP_EXPIRES_IN_MINUTES *
        60 *
        1000
  );

  const otpRecord =
    await otpRepository.create({
      userId,
      otpHash,
      purpose,
      expiresAt,
      attempts: 0,
    });

  return {
    otpId: otpRecord._id,
    otp,
    expiresAt,
  };
};

const verifyOtp = async ({
  otpId,
  otp,
}) => {
  const otpRecord =
    await otpRepository.findById(
      otpId,
      {
        includeHash: true,
      }
    );

  if (!otpRecord) {
    const error = new Error(
      "OTP not found"
    );

    error.statusCode = 404;
    error.code = "OTP_NOT_FOUND";

    throw error;
  }

  if (otpRecord.consumedAt) {
    const error = new Error(
      "OTP already used"
    );

    error.statusCode = 400;
    error.code = "OTP_ALREADY_USED";

    throw error;
  }

  if (
    otpRecord.expiresAt <= new Date()
  ) {
    const error = new Error(
      "OTP expired"
    );

    error.statusCode = 400;
    error.code = "OTP_EXPIRED";

    throw error;
  }

  if (
    otpRecord.attempts >=
    AUTH_CONSTANTS.MAX_OTP_ATTEMPTS
  ) {
    const error = new Error(
      "Maximum OTP attempts exceeded"
    );

    error.statusCode = 429;
    error.code = "OTP_ATTEMPTS_EXCEEDED";

    throw error;
  }

  const otpHash =
    cryptoUtils.hash(otp);

  if (
    !cryptoUtils.timingSafeEqual(
      otpHash,
      otpRecord.otpHash
    )
  ) {
    await otpRepository.incrementAttempts(
      otpId
    );

    const error = new Error(
      "Invalid OTP"
    );

    error.statusCode = 400;
    error.code = "INVALID_OTP";

    throw error;
  }

  await otpRepository.consume(otpId);

  return true;
};

export const otpService = {
  generateOtp,
  verifyOtp,
};