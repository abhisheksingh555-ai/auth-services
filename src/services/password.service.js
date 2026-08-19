import { argon } from "../utils/argon.js";

const hashPassword = async (password) => {
  if (!password || password.length < 8) {
    const error = new Error(
      "Password must be at least 8 characters"
    );

    error.statusCode = 400;
    error.code = "INVALID_PASSWORD";

    throw error;
  }

  return argon.hash(password);
};

const verifyPassword = async (
  passwordHash,
  password
) => {
  return argon.verify(
    passwordHash,
    password
  );
};

const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
};

export const passwordService = {
  hashPassword,
  verifyPassword,
  changePassword,
};